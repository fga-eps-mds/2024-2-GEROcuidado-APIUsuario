import { IsEmail, IsNotEmpty, IsString, validate } from 'class-validator';
import express, { Request, Response } from 'express';

export class EsqueciSenhaDto {
  @IsEmail({}, { message: 'O campo email deve conter um endereço de email válido' })
  @IsNotEmpty({ message: 'O campo está vazio' })
  email!: string;
}

// define a DTO (data transfer objects) necessária para receber o email do usuário;
// aqui mudei praticamente tudo para conseguir rodar o express, deixei esse arquivo como a parte so de validação

// Definindo a DTO para validar o código de redefinição de senha
class ValidarCodigoDto {
  @IsString()
  @IsNotEmpty()
  codigo!: string;
}

// Função para simular a verificação do código (pode ser substituída por lógica real de banco de dados)
async function validateCode(codigo: string) {
  // Aqui você verifica no banco de dados se o código é válido
  // Exemplo de verificação (imagine que você tem um banco de dados ou cache para verificar):
  if (codigo === 'codigo-validado') {
    return { success: true };
  }
  return { success: false, message: 'Código inválido.' };
}

// Controlador para validar o código de redefinição de senha
const validateCodeController = async (req: Request, res: Response) => {
  const { codigo } = req.body;

  // Criando o DTO para validar o código recebido na requisição
  const dto = new ValidarCodigoDto();
  dto.codigo = codigo;

  // Validando o DTO
  const errors = await validate(dto);
  if (errors.length > 0) {
    return res.status(400).send({ success: false, message: 'Código inválido', errors });
  }

  // Validando o código
  const validation = await validateCode(codigo);
  if (validation.success) {
    res.status(200).send({ success: true });
  } else {
    res.status(400).send({ success: false, message: validation.message });
  }
};

// Inicializando o servidor Express
const app = express();
app.use(express.json()); // Permite o Express entender JSON

// Endpoint para validar o código de redefinição de senha
app.post('/api/validate-code', validateCodeController);

// Inicializando o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});