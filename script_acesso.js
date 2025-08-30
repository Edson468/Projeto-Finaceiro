// Script de Acesso - Controle Financeiro
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('authToken', data.token); // Salva o token
                    localStorage.setItem('loggedInUser', data.username);
                    showSuccessMessage(data.username);
                    setTimeout(() => { window.location.href = 'financas.html'; }, 2000);
                } else {
                    // Pega a mensagem de erro específica do backend
                    const errorData = await response.json();
                    showErrorMessage(errorData.message || 'Ocorreu um erro inesperado.');
                }
            } catch (error) {
                console.error('Erro de rede:', error);
                showErrorMessage('Erro de conexão com o servidor.');
            }
        });
    }

    // Verificar se já está autenticado
    checkAuthentication();
});

function showSuccessMessage(username) {
    const loginFormContainer = document.querySelector('.login-form-container');
    if (!loginFormContainer) return;

    // Ocultar o formulário e outros elementos
    const form = document.getElementById('loginForm');
    const registerLink = document.querySelector('.register-link');
    const logoContainer = document.querySelector('.logo-container');
    if (form) form.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoContainer) logoContainer.style.display = 'none';

    // Criar mensagem de sucesso
    const successDiv = document.createElement('div');
    successDiv.className = 'login-success-container';
    successDiv.innerHTML = `
        <div class="success-icon">🎉</div>
        <h2>Bem-vindo(a), ${username}!</h2>
        <p>Você será redirecionado para o painel em instantes.</p>
        <div class="loading-spinner"></div>
    `;
    loginFormContainer.appendChild(successDiv);
}

function showErrorMessage(message = 'Usuário ou senha inválidos. Tente novamente.') {
    const errorMessage = document.getElementById('loginError');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        // Adicionar efeito de shake
        errorMessage.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            errorMessage.style.animation = '';
        }, 500);
    }
}

function checkAuthentication() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Se já estiver autenticado, redirecionar para a aplicação principal
        window.location.href = 'financas.html';
    }
}