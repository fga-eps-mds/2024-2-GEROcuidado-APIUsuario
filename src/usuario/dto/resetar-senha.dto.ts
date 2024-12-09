import { IsString, IsNotEmpty } from 'class-validator';

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
  