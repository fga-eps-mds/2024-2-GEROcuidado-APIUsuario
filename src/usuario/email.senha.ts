import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, codigo: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'seu-email@gmail.com',
      pass: 'sua-senha',
    },
  });

  const info = await transporter.sendMail({
    from: '"Sistema" <seu-email@gmail.com>',
    to: email,
    subject: 'Redefinição de Senha',
    text: `Seu código de redefinição é: ${codigo}`,
  });

  console.log('E-mail enviado:', info.messageId);
}
