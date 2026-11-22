# Cadastro de Funcionários

Sistema CRUD desenvolvido com Node.js, Express e MySQL, seguindo o material da aula de 26 de maio de 2026.

## Requisitos
- Node.js instalado
- MySQL instalado e em execução

## 1. Criar o banco
Abra o MySQL Workbench ou phpMyAdmin, execute o conteúdo de `database.sql`.

## 2. Configurar a conexão
Por padrão, o servidor usa:
- host: `localhost`
- usuário: `root`
- senha: vazia
- banco: `crud_funcionarios`

Se sua instalação tiver outra senha, configure a variável `DB_PASSWORD` antes de iniciar o servidor. Também é possível configurar `DB_HOST`, `DB_USER` e `DB_NAME`.

## 3. Instalar dependências
No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

## 4. Iniciar
Execute:

```bash
npm start
```

Abra no navegador: http://localhost:3000

## Funcionalidades
- GET `/api/funcionarios`: listar
- POST `/api/funcionarios`: cadastrar
- PUT `/api/funcionarios/:id`: atualizar
- DELETE `/api/funcionarios/:id`: excluir

O frontend fica na pasta `public`. O backend utiliza consultas parametrizadas (`?`) para enviar os dados ao MySQL.
