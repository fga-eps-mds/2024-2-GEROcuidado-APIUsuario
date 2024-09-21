import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Filtering } from '../shared/decorators/filtrate.decorator';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import {
  Pagination,
  PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { Usuario } from './entities/usuario.entity';
import { IUsuarioFilter } from './interfaces/usuario-filter.interface';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  const userDto = {
    nome: 'Henrique',
    email: 'hacmelo@gmail.com',
    senha: '123',
    foto: '1',
    admin: false,
    created_at: new Date(), // adicione isso
    updated_at: new Date()
  };

  const user = {
    ...userDto,
    id: 1,
    foto: Buffer.from('1'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findAllToPublicacao: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Usuario),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create Usuario', async () => {
    jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(user));

    const response = await controller.create(userDto);
    expect(response.data).toEqual(user);
    expect(response.message).toEqual('Salvo com sucesso!');
  });

  it('should find Usuario', async () => {
    jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(user));

    const response = await controller.findOne({ id: 1 });
    expect(response).toEqual(user);
  });

  it('should remove Usuario', async () => {
    jest.spyOn(service, 'remove').mockReturnValue(Promise.resolve(user));

    const response = await controller.remove({ id: 1 });
    expect(response.data).toEqual(user);
    expect(response.message).toEqual('Excluído com sucesso!');
  });

  it('should update Usuario', async () => {
    jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(user));

    const response = await controller.update({ id: 1 }, { nome: 'Henrique' });
    expect(response.data).toEqual(user);
    expect(response.message).toEqual('Atualizado com sucesso!');
  });

  describe('findAll', () => {
    const filter: IUsuarioFilter = {
      nome: 'Henrique',
      id: 1,
      email: 'email@email.com',
    };
    const filtering = new Filtering<IUsuarioFilter>(JSON.stringify(filter));

    const order: OrderParams = {
      column: 'id',
      dir: 'ASC',
    };
    const ordering: Ordering = new Ordering(JSON.stringify(order));

    const paginate: PaginationParams = {
      limit: 10,
      offset: 0,
    };
    const pagination: Pagination = new Pagination(paginate);

    it('should findAll Usuario', async () => {
      const expected = { data: [user], count: 1, pageSize: 1 };

      jest.spyOn(service, 'findAll').mockReturnValue(Promise.resolve(expected));

      const { data, count, pageSize } = await controller.findAll(
        filtering,
        pagination,
        ordering,
      );

      expect(count).toEqual(1);
      expect(pageSize).toEqual(1);
      expect(data).toEqual([user]);
    });
  });

  it('should find Usuario TCP', async () => {
    jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(user));

    const response = await controller.findOneTCP({ id: 1 });
    expect(response).toEqual(user);
  });

  it('should find all Usuario TCP', async () => {
    jest
      .spyOn(service, 'findAllToPublicacao')
      .mockReturnValue(Promise.resolve([user]));

    const response = await controller.findAllTCP({ ids: [1] });
    expect(response).toEqual([user]);
  });
});
