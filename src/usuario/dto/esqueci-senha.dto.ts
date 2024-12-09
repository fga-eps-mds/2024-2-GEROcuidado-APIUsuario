import {IsEmail, IsNotEmpty} from 'class-validator';

export class EsqueciSenhaDto {
  @IsEmail({}, {message:'O campo email deve conter um endereço de email válido'})
  @IsNotEmpty({message: 'O campo está vazio' })
  email!: string;
}

  // define a DTO (data transfer objects) necessária para receber o email do usuário;
