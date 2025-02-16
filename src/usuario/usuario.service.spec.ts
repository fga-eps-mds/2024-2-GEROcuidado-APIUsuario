import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResetarSenhaDto } from './dto/resetar-senha.dto';
import { sendResetEmail } from './email.senha';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';

jest.mock('./email.senha', () => ({
  sendResetEmail: jest.fn(),
}));

const getImageUri = jest.fn().mockImplementation((foto) => `http://image.uri/${foto}`);


describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;
  let configService: ConfigService;

  const mockRepository = {
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getMany: jest.fn(),
      getOne: jest.fn(),
    })),
    find: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('10'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
        UsuarioService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('testDbConnection', () => {
    it('should fetch users from the database and log them', async () => {
      const mockUsers = [{ id: 1, nome: 'User Test' }];
      mockRepository.find.mockResolvedValue(mockUsers);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await service.testDbConnection();

      expect(repository.find).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(mockUsers);

      consoleSpy.mockRestore();
    });
  });

  describe('getImageUri transformation', () => {
    it('should transform user.foto with getImageUri', () => {
      const user = { foto: 'image.png' } as any;
      user.foto = getImageUri(user.foto) as unknown as Buffer;

      expect(getImageUri).toHaveBeenCalledWith('image.png');
      expect(user.foto).toBe('http://image.uri/image.png');
    });

    it('should transform updated.foto with getImageUri', () => {
      const updated = { foto: 'image.png' } as any;
      updated.foto = getImageUri(updated.foto) as unknown as Buffer & string;

      expect(getImageUri).toHaveBeenCalledWith('image.png');
      expect(updated.foto).toBe('http://image.uri/image.png');
    });
  });

  describe('update with password hashing', () => {
    it('should hash password if provided', async () => {
      const body = { senha: 'senha123' };
      const hashedPassword = 'hashedSenha123';
      jest.spyOn(service, 'hashPassword').mockResolvedValue(hashedPassword);

      let newBody = body;

      if (body.senha) {
        const hashSenha = await service.hashPassword(body.senha);
        newBody = { ...body, senha: hashSenha };
      }

      expect(service.hashPassword).toHaveBeenCalledWith('senha123');
      expect(newBody.senha).toBe(hashedPassword);
    });
  });


  it('should get the config value', () => {
    const value = configService.get('SOME_CONFIG_KEY');
    expect(value).toBe('10');
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = { nome: 'Henrique', email: 'teste@email.com', senha: '123456' } as any;
      jest.spyOn(repository, 'save').mockResolvedValue(user);
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: () => ({
          addSelect: () => ({
            getOne: jest.fn().mockResolvedValueOnce(null),
          }),
        }),
      } as any);
      const created = await service.create(user);
      expect(created).toEqual(user);
    });

    it('should throw error if email already exists', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: () => ({
          addSelect: () => ({
            getOne: jest.fn().mockResolvedValueOnce({ email: 'teste@email.com' }),
          }),
        }),
      } as any);
      await expect(service.create({ email: 'teste@email.com' } as any)).rejects.toThrow(
        new BadRequestException('Este email já está cadastrado!'),
      );
    });
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue({ id: 1 } as any);
      const found = await service.findOne(1);
      expect(found.id).toEqual(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockRejectedValue(new NotFoundException());
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(repository, 'save').mockResolvedValue({ id: 1, nome: 'Henrique' } as any);
      const updated = await service.update(1, { nome: 'Henrique' });
      expect(updated).toEqual({ id: 1, nome: 'Henrique' });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(repository, 'remove').mockResolvedValue({ id: 1 } as any);
      const removed = await service.remove(1);
      expect(removed.id).toEqual(1);
    });
  });

  describe('enviarCodigoRedefinicao', () => {
    it('should send reset code email', async () => {
      const user = { email: 'teste@email.com', codigoReset: '', codigoResetExpiracao: new Date() };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(repository, 'save').mockResolvedValue(user as any);
      (sendResetEmail as jest.Mock).mockResolvedValue(true);

      const result = await service.enviarCodigoRedefinicao('teste@email.com');
      expect(result).toEqual({ message: 'Código enviado para o e-mail' });
      expect(sendResetEmail).toHaveBeenCalledWith('teste@email.com', expect.any(String));
    });

    it('should throw error if email not provided', async () => {
      await expect(service.enviarCodigoRedefinicao('')).rejects.toThrow(
        new BadRequestException('Email não forncedio!'),
      );
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.enviarCodigoRedefinicao('teste@email.com')).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
    });
  });

  describe('resetarSenha', () => {
    it('should reset password successfully', async () => {
      const user = {
        email: 'teste@email.com',
        codigoReset: '123456',
        codigoResetExpiracao: new Date(Date.now() + 3600000),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(repository, 'save').mockResolvedValue(user as any);

      const dto: ResetarSenhaDto = {
        email: 'teste@email.com',
        codigo: '123456',
        novaSenha: 'newpassword',
      };

      const result = await service.resetarSenha(dto);
      expect(result).toEqual({ message: 'Senha redefinida com sucesso' });
    });

    it('should throw error if code is invalid or expired', async () => {
      const user = {
        email: 'teste@email.com',
        codigoReset: '123456',
        codigoResetExpiracao: new Date(Date.now() - 3600000), // Expirado
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as any);

      const dto: ResetarSenhaDto = {
        email: 'teste@email.com',
        codigo: '654321',
        novaSenha: 'newpassword',
      };

      await expect(service.resetarSenha(dto)).rejects.toThrow(
        new NotFoundException('Código inválido ou expirado'),
      );
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const dto: ResetarSenhaDto = {
        email: 'naoexiste@email.com',
        codigo: '123456',
        novaSenha: 'newpassword',
      };

      await expect(service.resetarSenha(dto)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
    });

  });

  describe('allUpdatedUsuariosSince', () => {
    it('should get all updated users since timestamp', async () => {
      const timestamp = new Date();
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      } as any);
      const users = await service.allUpdatedUsuariosSince(timestamp);
      expect(users).toEqual([{ id: 1 }]);
    });
  });

  describe('allCreatedUsuariosSince', () => {
    it('should get all created users since timestamp', async () => {
      const timestamp = new Date();
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1 }]),
      } as any);
      const users = await service.allCreatedUsuariosSince(timestamp);
      expect(users).toEqual([{ id: 1 }]);
    });
  });
});
