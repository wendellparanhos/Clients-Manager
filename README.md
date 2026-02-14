# Clients-Manager 🚀

Um gerenciador de clientes moderno e intuitivo construído com **Angular 17** e **Firebase**. Esta aplicação permite o controle completo de uma base de clientes, com uma interface focada na experiência do usuário e alta performance.

## ✨ Funcionalidades

- 🔐 **Autenticação Segura**: Fluxos de login e cadastro integrados com Firebase Authentication.
- 📊 **Dashboard Estratégico**: Visualização rápida do total de clientes e métricas importantes.
- 👥 **Gestão de Clientes (CRUD)**:
  - Listagem com busca e filtros.
  - Cadastro de novos clientes.
  - Edição de informações existentes.
  - Exclusão segura.
- 🔔 **Feedback Interativo**: Sistema de notificações (toasts) criativo para todas as ações do usuário.
- 📱 **Design Responsivo**: Interface que se adapta perfeitamente a dispositivos móveis e desktops.
- 🎨 **Estética Premium**: Uso de gradientes, micro-animações e um sistema de design moderno.

## 🛠️ Tecnologias Utilizadas

- **Core**: [Angular 17](https://angular.io/) (Standalone Components, Signals).
- **Backend/Service**: [Firebase](https://firebase.google.com/) (Firestore, Auth).
- **Estilo**: Vanilla CSS com variáveis para um design escalável e customizável.
- **Ícones**: Lucide Icons / Font Awesome.

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) (v18+) e o [Angular CLI](https://angular.io/cli) instalados em sua máquina.

### Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/clients-manager.git
   ```

2. Entre no diretório do projeto:

   ```bash
   cd clients-manager
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

### Execução

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200/`.

## 📁 Estrutura do Projeto

```text
src/
├── app/
│   ├── core/      # Componentes globais, guards e serviços base
│   ├── features/  # Módulos de funcionalidades (Dashboard, Clientes, Auth)
│   ├── shared/    # Componentes e pipes reutilizáveis
│   └── app.routes.ts # Definição centralizada de rotas
├── assets/        # Imagens e arquivos estáticos
└── index.html     # Ponto de entrada HTML
```

---
