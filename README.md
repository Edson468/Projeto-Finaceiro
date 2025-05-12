# Sistema de Gestão Financeira Pessoal - Documentação Atualizada

📌 Visão Geral

O Sistema de Gestão Financeira Pessoal é uma aplicação web completa que permite aos usuários controlar suas finanças de forma eficiente. Com um fluxo de autenticação seguro e funcionalidades robustas, os usuários podem registrar e gerenciar todas as suas transações financeiras.

## 🔐 Fluxo de Autenticação

### 🖥️ Tela de Login
- Campos para inserção de **usuário** e **senha**
- Validação de credenciais antes de acessar o sistema
- Botão "Entrar" para acesso à aplicação
- Botão "Cadastrar" para novos usuários

### 📝 Tela de Cadastro
- Formulário simples para cadastro de novos usuários
- Campos obrigatórios: usuário, senha e confirmação de senha
- Validação de dados antes do cadastro
- Feedback visual após cadastro bem-sucedido:
  - Imagem de confirmação
  - Mensagem de sucesso
  - Redirecionamento automático para tela de login

### 🔄 Fluxo Completo
1. Novo usuário acessa a tela de cadastro
2. Preenche os dados e realiza o cadastro
3. Recebe confirmação visual do sucesso
4. É redirecionado para a tela de login
5. Insere as credenciais cadastradas
6. Acessa o sistema de gestão financeira

✨ Funcionalidades Principais

## 💰 Gestão de Transações
### 📥 Registro de Transações
- Adicionar entradas (receitas) e saídas (despesas)
- Selecionar o banco/conta associado
- Classificar por categoria (ex: Alimentação, Transporte, Salário)
- Incluir data e descrição detalhada

### 📊 Extrato e Saldo
- Lista completa de todas as transações
- Cálculo automático do saldo (positivo ou negativo)
- Visualização por período, categoria, banco ou tipo
- Gráficos visuais para melhor compreensão dos dados

### 🔍 Filtros Avançados
- Filtrar por data (período específico ou personalizado)
- Filtrar por categoria (ex: mostrar apenas gastos com "Lazer")
- Filtrar por banco (apenas transações no "Banco X")
- Filtrar por tipo (apenas entradas ou apenas saídas)
- Combinação de múltiplos filtros simultaneamente

### 🔄 Gerenciamento
- Edição completa de transações existentes
- Exclusão segura com confirmação
- Visualização de saldo por banco/conta
- Backup e recuperação de dados

## 🛠️ Tecnologias Utilizadas
- **Frontend**:
  - HTML5 (Estrutura semântica)
  - CSS3 (Design responsivo e moderno)
  - JavaScript (Lógica de aplicação)
  
- **Armazenamento**:
  - LocalStorage (Persistência de dados no navegador)
  - Criptografia básica para dados sensíveis

- **Design**:
  - UI/UX intuitiva e acessível
  - Cores temáticas para melhor experiência
  - Componentes reutilizáveis

## 🚀 Como Usar

### 1. Primeiro Acesso
- Acesse a tela de login
- Clique em "Cadastrar" para criar nova conta
- Preencha o formulário de cadastro
- Confirme o cadastro e faça login

### 2. Adicionar Transação
1. Selecione "Entrada" ou "Saída"
2. Preencha valor, descrição, data, categoria e banco
3. Clique em "Adicionar"
4. Visualize a transação no extrato

### 3. Visualizar Extrato
- Todas as transações aparecem na tabela de extrato
- O saldo total é exibido no topo (verde para positivo, vermelho para negativo)
- Use os controles de paginação para navegar entre muitos itens

### 4. Usar Filtros
1. Selecione um ou mais filtros (data, categoria, banco ou tipo)
2. O extrato é atualizado automaticamente
3. Clique em "Limpar Filtros" para voltar à visualização completa

### 5. Editar/Excluir
- Clique no ícone de editar para modificar uma transação
- Clique no ícone de excluir para remover (com confirmação)
- Todas as alterações são salvas automaticamente

## 📂 Estrutura do Projeto
```
gestao-financeira/  
├── index.html          # Página principal (login)  
├── app.html            # Aplicação principal  
├── cadastro.html       # Página de cadastro  
├── assets/
│   ├── css/            # Estilos 
│   │   ├── style.css   # Estilos principais
│   │   └── auth.css    # Estilos para autenticação
│   ├── js/             # Scripts
│   │   ├── script.js   # Lógica principal
│   │   ├── auth.js     # Lógica de autenticação
│   │   └── storage.js  # Gerenciamento de armazenamento
│   └── img/            # Imagens e ícones
├── README.md           # Documentação  
└── LICENSE             # Licença do projeto
```

## 🎨 Design e Interface
- **Layout moderno** e intuitivo
- **Cores temáticas** consistentes:
  - Verde para entradas/positivo
  - Vermelho para saídas/negativo
  - Azul para ações principais
- **Componentes responsivos** que se adaptam a qualquer dispositivo
- **Feedback visual** imediato para todas as ações:
  - Animações suaves
  - Mensagens de confirmação
  - Indicadores de status

## 🔧 Personalização
Você pode facilmente modificar:
- Categorias padrão (em script.js)
- Bancos/cartões disponíveis
- Estilo das tabelas e botões (em style.css)
- Mensagens do sistema
- Cores temáticas (via variáveis CSS)

## 🔒 Segurança
- Dados sensíveis armazenados com criptografia básica
- Validação de formulários tanto no cliente quanto no servidor
- Proteção contra XSS básica
- Logout automático após período de inatividade

## 📄 Licença
Este projeto é open-source e está disponível sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## 💡 Créditos
Desenvolvido por [Edson Carvalho](https://github.com/Edson468) como projeto prático de JavaScript.

## 🔗 Links Úteis
- [Acesse a aplicação]()
- [Repositório no GitHub]()
- [Documentação técnica]()
- [Relatar problemas]()

## 🌟 Próximas Atualizações
- Recuperação de senha
- Sincronização com nuvem
- Exportação de relatórios (PDF, Excel)
- Dashboard analítico
- Versão mobile nativa

