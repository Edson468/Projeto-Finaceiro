# 💰 Controle Financeiro - Aplicação Dinâmica

Uma aplicação web **full-stack** moderna e interativa para controle financeiro pessoal, desenvolvida com **HTML5, CSS3, JavaScript, Node.js e MySQL**.

## ✨ **Funcionalidades Principais**

### 🎨 **Interface e UX**
- **Tema Claro/Escuro**: Toggle automático com persistência no localStorage
- **Variáveis CSS**: Sistema de cores dinâmico e consistente
- **Transições Suaves**: Animações fluidas entre temas

### 📊 **Dashboard Interativo**
- **Cards de Resumo**: Saldo atual, receitas, despesas e metas
- **Variações Percentuais**: Comparação com mês anterior
- **Indicadores Visuais**: Cores dinâmicas baseadas no desempenho
- **Animações de Entrada**: Efeitos visuais escalonados

### 📈 **Gráficos Interativos**
- **Fluxo de Caixa**: Gráfico de linha para análise temporal
- **Distribuição por Categoria**: Gráfico de rosca para despesas
- **Chart.js**: Biblioteca moderna para visualizações
- **Responsivo**: Adapta-se a diferentes tamanhos de tela

### 🎯 **Sistema de Metas Financeiras**
- **Meta de Economia**: Acompanhamento em tempo real
- **Barra de Progresso**: Visualização do progresso
- **Percentual de Atingimento**: Cálculo automático
- **Gestão de Metas**: Adicionar novas metas personalizadas

### 🔍 **Busca Inteligente**
- **Sugestões em Tempo Real**: Busca por transações, categorias e bancos
- **Filtros Automáticos**: Aplicação automática de filtros
- **Histórico de Busca**: Sugestões baseadas em dados existentes
- **Interface Intuitiva**: Dropdown com resultados relevantes

### ⚡ **Filtros Avançados**
- **Sistema de Abas**: Organização por período, categoria, banco e valor
- **Filtros de Valor**: Mínimo e máximo para transações
- **Persistência**: Lembra configurações de filtro
- **Aplicação Inteligente**: Filtros em tempo real

### 🔔 **Sistema de Notificações**
- **Notificações Toast**: Mensagens não intrusivas
- **Tipos de Alerta**: Sucesso, erro, aviso e informação
- **Animações Suaves**: Entrada e saída com transições
- **Auto-dismiss**: Desaparecem automaticamente após 3 segundos

### 📤 **Exportação de Dados**
- **Exportação CSV**: Download de transações filtradas
- **Formatação Brasileira**: Valores em Real (R$)
- **Nomeação Inteligente**: Arquivos com data automática

### 🔐 **Backend e Segurança**
- **API RESTful com Node.js e Express**: Servidor robusto para gerenciar os dados.
- **Banco de Dados MySQL**: Persistência de dados segura e escalável.
- **Autenticação com JWT**: Login seguro com JSON Web Tokens.
- **Criptografia de Senhas**: Senhas armazenadas com hash usando `bcryptjs`.
- **Validação de Formulários**: Verificação completa no front-end e preparada para o back-end.

## 🚀 **Como Usar**

### **Pré-requisitos**
- **Node.js**: Baixe e instale
- **MySQL**: Um servidor MySQL rodando (você pode usar XAMPP, WAMP, Docker, etc.)

### **Configuração do Ambiente**

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <NOME_DA_PASTA>
    ```

2.  **Instale as dependências do backend:**
    ```bash
    npm install
    ```

3.  **Configure o banco de dados:**
    - Crie um banco de dados no seu MySQL com o nome `financeiro_db`.
    - Execute o script do arquivo `database.sql` para criar as tabelas.

4.  **Configure as variáveis de ambiente:**
    - Renomeie o arquivo `.env.example` (se houver) para `.env`.
    - Abra o arquivo `.env` e preencha com as credenciais do seu banco de dados MySQL.

5.  **Inicie o servidor backend:**
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3000`.

6.  **Abra a aplicação no navegador:**
    - Abra o arquivo `index.html` diretamente no seu navegador.

## 🛠️ **Tecnologias Utilizadas**

- **HTML5**: Estrutura semântica e moderna
- **CSS3**: Variáveis CSS, Grid, Flexbox, Animações
- **JavaScript ES6+**: Módulos, Arrow Functions, Template Literals
- **Node.js**: Ambiente de execução do backend
- **Express.js**: Framework para a API
- **MySQL**: Banco de dados relacional
- **JWT (JSON Web Token)**: Para autenticação segura
- **bcryptjs**: Para criptografia de senhas
- **Chart.js**: Biblioteca para gráficos interativos

## 📁 **Estrutura do Projeto**

```
Projeto-Finaceiro/
├── financas.html          # Página principal da aplicação
├── login.html             # Tela de autenticação
├── cadastro.html          # Página de cadastro (opcional)
├── style.css              # Estilos e animações
├── script.js              # Lógica principal da aplicação
├── script_acesso.js       # Autenticação e login
├── script-retorno.js      # Scripts auxiliares
├── img/                   # Imagens e ícones
│   ├── financas-2.jpg     # Imagem de fundo
│   └── success.png        # Ícone de sucesso
└── README.md              # Documentação
```

## 🎯 **Recursos Futuros**

- [ ] **Sincronização em Nuvem**: Backup automático dos dados
- [ ] **Múltiplas Contas**: Suporte a diferentes perfis
- [ ] **Relatórios Avançados**: Análises mais detalhadas
- [ ] **Notificações Push**: Alertas de metas e vencimentos
- [ ] **Integração Bancária**: Importação automática de extratos
- [ ] **Modo Offline**: Funcionamento sem internet

## 🔒 **Segurança**

- **Autenticação Local**: Sistema de login básico
- **Validação de Dados**: Verificação de entrada do usuário
- **Sanitização**: Prevenção contra XSS
- **Persistência Segura**: Dados armazenados localmente

## 📱 **Compatibilidade**

- **Navegadores Modernos**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Desktop, Tablet, Mobile
- **Resoluções**: 320px até 4K
- **Touch**: Suporte completo para dispositivos touch

## 🤝 **Contribuição**

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 **Suporte**

Para dúvidas ou sugestões:
- Abra uma issue no repositório
- Entre em contato via email
- Consulte a documentação

---

**Desenvolvido com ❤️ para facilitar o controle financeiro pessoal**
