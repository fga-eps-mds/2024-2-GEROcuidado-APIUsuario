import nodemailer from 'nodemailer';

export async function sendResetEmail(email: string, codigo: string) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'gabrielsampaio.fae@gmail.com', //inserir email da gerocuidado
      pass: '', //definir a senha com base na senha do app definida pelo google
    },
  });

  const info = await transporter.sendMail({
    from: '"Sistema" <gabrielsampaio.fae@gmail.com>', //inserir email da gerocuidado
    to: email,
    subject: 'Redefinição de Senha',
    text: `Seu código de redefinição é: ${codigo}`,
  });

  console.log('E-mail enviado:', info.messageId);
}
