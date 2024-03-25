
### Passos:

1. **Clonar o Repositório:**
   ```
   git clone https://github.com/Julianavdsantos/CRUDContatos.git
   ```

2. **Instalar Dependências:**
   ```
   cd CRUDContatos
   yarn install

   ```

3. **Configurar o Banco de Dados:**
   - Configure seu banco de dados MySQL localmente 
   - Edite o arquivo de configuração do banco de dados (`db.js` ou similar) com as informações corretas de conexão.

4. **Executar Migrações do Banco de Dados:**
   Se estiver usando migrações (como com `sequelize-cli`), execute:
   ```
  yarn sequelize-cli db:migrate

   ```
5-Iniciar o Servidor Backend:
Backend : 
cd C:\pasta que esta o projeto\Contatos\api
yarn start

5. **Iniciar o Servidor Frontend e backend 
   Em outro terminal, vá para o diretório do frontend:
   ```
Frontend: 
cd C:\pasta que esta o projeto\Contatos\frontend

   ```
6. **Acessar o Aplicativo:**
  Acesse `http://localhost:3000/`
