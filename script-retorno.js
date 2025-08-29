// ===== SCRIPT DE CADASTRO AVANÇADO =====
const API_URL = 'http://localhost:3000/api';
document.addEventListener('DOMContentLoaded', function() {
    initializeCadastro();
});

// ===== INICIALIZAÇÃO =====
function initializeCadastro() {
    setupEventListeners();
    setupInputMasks();
    setupPasswordStrength();
    setupThemeToggle();
    setCurrentYear();
}

// ===== CONFIGURAÇÃO DE EVENTOS =====
function setupEventListeners() {
    const form = document.getElementById('cadastroForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Toggle de senha
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    if (togglePassword) {
        togglePassword.addEventListener('click', () => togglePasswordVisibility('password'));
    }
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility('confirmPassword'));
    }

    // Validação em tempo real
    setupRealTimeValidation();
}

// ===== MÁSCARAS DE INPUT =====
function setupInputMasks() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }
}

// ===== FORÇA DA SENHA =====
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrengthUI(strength);
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^a-zA-Z0-9]/)) score += 1;
    
    if (score <= 2) return { level: 'weak', text: 'Fraca', color: '#dc3545' };
    if (score <= 3) return { level: 'medium', text: 'Média', color: '#ffc107' };
    if (score <= 4) return { level: 'good', text: 'Boa', color: '#17a2b8' };
    return { level: 'strong', text: 'Forte', color: '#28a745' };
}

function updatePasswordStrengthUI(strength) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (strengthFill && strengthText) {
        strengthFill.style.width = `${(strength.level === 'weak' ? 25 : strength.level === 'medium' ? 50 : strength.level === 'good' ? 75 : 100)}%`;
        strengthFill.style.backgroundColor = strength.color;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    }
}

// ===== TOGGLE DE VISIBILIDADE DA SENHA =====
function togglePasswordVisibility(fieldId) {
    const input = document.getElementById(fieldId);
    const toggle = document.getElementById(fieldId === 'password' ? 'togglePassword' : 'toggleConfirmPassword');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

// ===== VALIDAÇÃO EM TEMPO REAL =====
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('.cadastro-form input, .cadastro-form select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'nomeCompleto':
            if (field.value.trim().length < 3) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 3 caracteres';
            }
            break;
            
        case 'cpf':
            if (!validateCPF(field.value)) {
                isValid = false;
                errorMessage = 'CPF inválido';
            }
            break;
            
        case 'email':
            if (!validateEmail(field.value)) {
                isValid = false;
                errorMessage = 'E-mail inválido';
            }
            break;
            
        case 'username':
            if (field.value.length < 3) {
                isValid = false;
                errorMessage = 'Usuário deve ter pelo menos 3 caracteres';
            }
            break;
            
        case 'password':
            if (field.value.length < 8) {
                isValid = false;
                errorMessage = 'Senha deve ter pelo menos 8 caracteres';
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (field.value !== password) {
                isValid = false;
                errorMessage = 'Senhas não coincidem';
            }
            break;
            
        case 'telefone':
            if (field.value.replace(/\D/g, '').length < 10) {
                isValid = false;
                errorMessage = 'Telefone inválido';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

// ===== VALIDAÇÕES ESPECÍFICAS =====
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder < 2 ? 0 : remainder;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder < 2 ? 0 : remainder;
    
    return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== EXIBIÇÃO DE ERROS =====
function showFieldError(field, message) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.classList.add('error');
    }
}

function clearFieldError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        field.classList.remove('error');
    }
}

// ===== SUBMISSÃO DO FORMULÁRIO =====
async function handleFormSubmit(event) {
            event.preventDefault();

    if (!validateForm()) {
        showNotification('Por favor, corrija os erros no formulário', 'error');
        return;
    }

    // Mostrar loading
    showLoadingState();
    
    // Simular processamento
    await processCadastro();
}

function validateForm() {
    const fields = ['nomeCompleto', 'cpf', 'dataNascimento', 'sexo', 'email', 'endereco', 'username', 'telefone', 'password', 'confirmPassword'];
    let isValid = true;
    
    // Validar campos obrigatórios
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });
    
    // Validar aceite dos termos
    const aceiteTermos = document.getElementById('aceiteTermos');
    if (!aceiteTermos.checked) {
        showFieldError(aceiteTermos, 'Você deve aceitar os termos de uso');
        isValid = false;
    }
    
    return isValid;
}

async function processCadastro() {
    const formData = new FormData(document.getElementById('cadastroForm'));
    
    // Capturar dados do formulário
    const userData = {
        nomeCompleto: formData.get('nomeCompleto'),
        cpf: formData.get('cpf'),
        dataNascimento: formData.get('dataNascimento'),
        sexo: formData.get('sexo'),
        email: formData.get('email'),
        endereco: formData.get('endereco'),
        username: formData.get('username'),
        telefone: formData.get('telefone'),
        password: formData.get('password'),
        dataCadastro: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            showSuccessState();
        } else {
            const errorData = await response.json();
            showNotification(errorData.message || 'Erro ao criar conta.', 'error');
            // Restaurar botão
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('btnText').style.display = 'inline-flex';
            document.getElementById('btnLoading').style.display = 'none';
        }
    } catch (error) {
        showNotification('Erro de conexão com o servidor.', 'error');
    }
}

// ===== ESTADOS DA INTERFACE =====
function showLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    
    if (submitBtn && btnText && btnLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
    }
}

function showSuccessState() {
    const formSection = document.getElementById('formSection');
    const successSection = document.getElementById('successSection');
    
    if (formSection && successSection) {
        formSection.style.display = 'none';
        successSection.style.display = 'block';
        
        // Animar entrada da seção de sucesso
        successSection.style.opacity = '0';
        successSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            successSection.style.transition = 'all 0.6s ease-out';
            successSection.style.opacity = '1';
            successSection.style.transform = 'translateY(0)';
        }, 100);
    }
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'success') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
            }, 3000);
}

// ===== SISTEMA DE TEMAS =====
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        setCurrentTheme();
    }
}

function setCurrentTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'dark') {
        themeToggle.textContent = '☀️';
        themeToggle.title = 'Mudar para Tema Claro';
    } else {
        themeToggle.textContent = '🌙';
        themeToggle.title = 'Mudar para Tema Escuro';
    }
    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ===== FUNÇÕES AUXILIARES =====
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}