# Sistema de Cadastro de Pessoas

Sistema responsivo para cadastro e gerenciamento de pessoas, com validação de CPF e interface moderna.

## Funcionalidades

- ✅ Cadastro de pessoas com modal
- ✅ Lista de pessoas cadastradas
- ✅ Validação de CPF
- ✅ Edição e exclusão de cadastros
- ✅ Interface responsiva
- ✅ Campos obrigatórios com indicação visual

### Campos do Cadastro

- Nome (obrigatório)
- CPF (obrigatório)
- Site
- Data de Nascimento
- Estado Civil (Solteiro, Casado, Divorciado, Viúvo, Separado)
- Sexo
- Tipo de Pessoa (Física/Jurídica)
- Nacionalidade
- Telefone

## Tecnologias Utilizadas

- React + Vite
- TypeScript
- Express
- TanStack Query
- Tailwind CSS
- Shadcn/ui
- Zod (validação)
- Drizzle ORM

## Como Iniciar o Projeto

### Pré-requisitos

- Node.js versão 20 ou superior
- npm (gerenciador de pacotes do Node.js)

### Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd [nome-do-projeto]
```

2. Instale as dependências:
```bash
npm install
```

### Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5000`

## Estrutura do Projeto

```
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── lib/         # Utilitários e configurações
│   │   └── pages/       # Páginas da aplicação
├── server/              # Backend Express
│   ├── routes.ts        # Rotas da API
│   └── storage.ts       # Lógica de armazenamento
└── shared/              # Código compartilhado
    └── schema.ts        # Schemas e tipos
```

## Desenvolvimento

O projeto utiliza:
- ESLint para linting
- Prettier para formatação de código
- TypeScript para tipagem estática
- Tailwind CSS para estilização
- Shadcn/ui para componentes de interface

## Licença

MIT
