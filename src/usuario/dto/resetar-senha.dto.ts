import { IsNotEmpty, IsString, validate } from 'class-validator';
import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';

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

// Função para validar o código (simulada aqui)
async function validateCode(codigo: string) {
  // Aqui você pode validar o código no banco de dados
  // Exemplo de código válido
  if (codigo === '123456') {
    return { success: true };
  } else {
    return { success: false };
  }
}

// Função para redefinir a senha
async function resetPassword(dto: ResetarSenhaDto) {
  const { email, codigo, novaSenha } = dto;

  // Verifique se o código é válido
  const codeValid = await validateCode(codigo);
  if (!codeValid.success) {
    throw new Error('Código de redefinição inválido.');
  }

  // Atualize a senha no banco de dados aqui (exemplo simples)
  console.log(`Senha redefinida para o usuário ${email}`);

  // Aqui você deve implementar a lógica de atualização no banco de dados
  return { success: true };
}

// Função para enviar o e-mail de redefinição (utilizando nodemailer)
async function sendResetEmail(email: string, codigo: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'seu-email@gmail.com', // Substitua pelo seu email
      pass: 'sua-senha-do-app', // Substitua pela senha do app do Gmail
    },
  });

  const info = await transporter.sendMail({
    from: '"Sistema" <seu-email@gmail.com>', // Substitua pelo seu email
    to: email,
    subject: 'Redefinição de Senha',
    text: `Seu código de redefinição é: ${codigo}`,
  });

  console.log('E-mail enviado:', info.messageId);
}

// Controlador de redefinição de senha
const resetPasswordController = async (req: Request, res: Response) => {
  const { email, codigo, novaSenha } = req.body;

  // Criação do DTO com os dados recebidos na requisição
  const dto = new ResetarSenhaDto();
  dto.email = email;
  dto.codigo = codigo;
  dto.novaSenha = novaSenha;

  // Validação dos dados recebidos
  const errors = await validate(dto);
  if (errors.length > 0) {
    return res.status(400).send({ success: false, message: 'Dados inválidos', errors });
  }

