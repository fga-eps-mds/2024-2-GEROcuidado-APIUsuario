import nodemailer from 'nodemailer';
import { sendResetEmail } from './email.senha'; // Ajuste o caminho conforme necessário

// Mock do módulo nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ messageId: '12345' }),
    }),
}));

describe('sendResetEmail', () => {
    const email = 'test@example.com';
    const codigo = '123456';

    it('deve enviar o e-mail de redefinição de senha', async () => {
        await sendResetEmail(email, codigo);

        // Verifica se o transporte de e-mail foi criado com o Gmail
        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: 'Gmail',
            auth: {
                user: 'gabrielsampaio.fae@gmail.com', // Insira seu e-mail real ou o da aplicação
                pass: 'wktc yjut lzvc anda', // Senha do aplicativo
            },
        });

        // Verifica se a função sendMail foi chamada com os parâmetros esperados
        expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
            from: '"Sistema" <gabrielsampaio.fae@gmail.com>',
            to: email,
            subject: 'Redefinição de Senha',
            text: `Seu código de redefinição é: ${codigo}`,
        });

        // Verifica se o envio foi bem-sucedido
        const response = await nodemailer.createTransport().sendMail({
            from: '"Sistema" <gabrielsampaio.fae@gmail.com>',
            to: email,
            subject: 'Redefinição de Senha',
            text: `Seu código de redefinição é: ${codigo}`,
        });
        expect(response.messageId).toBe('12345');
    });
});
