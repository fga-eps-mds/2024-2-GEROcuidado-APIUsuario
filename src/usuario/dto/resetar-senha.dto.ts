import { IsNotEmpty, IsString } from 'class-validator';

export class ResetarSenhaDto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  novaSenha!: string;
}


// define as DTO (data transfer objects) novos, com os dados necessários pra resenhar a senha;
//aqui adicionei toda a parte para conferir se a validação do codigo foi ok e se sim o user pode redefinir a senha
