# Rodando o GeroCuidado no Windows

Este documento explica como configurar e executar o projeto GeroCuidado no Windows, abordando um problema comum relacionado ao formato dos finais de linha dos arquivos (problema comum entre os alunos que trabalharam no projeto).

## Configuração Inicial

Este documento serve para quaisquer repositório do backend, contudo, o repositório que utilizaremos de exemplo é APIUSUARIO;

Comando inicial: Para rodar o Docker, utilize:

```bash
docker-compose up
```
Caso o comando gere um erro relacionado ao script *entrypoint.sh*, durante o funcionamento da API, siga as instruções abaixo.

## Sobre o erro

Este erro ocorre porque o arquivo *entrypoint.sh* está usando finais de linha no formato LF (Linux/MacOS), enquanto o Docker no Windows pode esperar o formato CRLF, causando conflitos.

## Solução Usando WSL (Windows Subsystem for Linux)

1. Verifique o WSL -- dentro do seu terminal (não necessariamente aberto no repositório), digite:

```bash
wsl --list --all
```

* Se o Ubuntu estiver listado: prossiga para o próximo passo.

* Se o Ubuntu não estiver listado: instale-o com:

```bash
wsl install
```
Após a instalação, configure-o como padrão:

```bash
wsl --set-default Ubuntu
```

2. Acessar o projeto no WSL: Navegue até o diretório do projeto e abra o WSL com:

```bash
wsl
```

Em seguida, abra o VS code no WSL com:

```bash
code .
```

## Corrigindo o Problema de Finais de Linha

1. Verificar o formato de finais de linha: Use o comando abaixo para verificar o arquivo

```bash
cat -v ./.docker/entrypoint.sh
```
* Se o final de cada linha exibir ^M: O arquivo está com finais de linha no formato CRLF, que deve ser corrigido.

2. Instalar a ferramenta *dos2unix*: No terminal do Ubuntu, execute:

```bash
sudo apt install dos2unix
```

* Caso de algum erro nessa etapa, verifique se seu sudo está atualizado com "sudo apt update";

3. Corrigir o formato do arquivo: Use o comando abaixo para corrigir os finais de linha do arquivo:

```bash
dos2unix ./.docker/entrypoint.sh
```

* Para outros arquivos com o mesmo problema: Substitua o caminho no comando acima pelo caminho do arquivo que deseja corrigir.

4. Testar os finais de linha: Verifique novamente o arquivo para garantir que o formato foi corrigido:

```bash
cat -v ./.docker/entrypoint.sh
```

* Se o ^M não aparecer no final de cada linha, parabéns, seu código está no padrão LF e pronto para uso!

## Finalizando

Após corrigir os finais de linha, rode novamento o docker:

```bash
docker-compose up
```

E seja feliz trabalhando com o GERO!







