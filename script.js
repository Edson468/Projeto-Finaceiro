// ===== CONFIGURAÇÃO INICIAL =====
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

let transactions = [];
let goals = [];
let fluxoCaixaChartInstance = null;
let categoriaChartInstance = null;
let currentTheme = localStorage.getItem('theme') || 'light';

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
async function initializeApp() {
    const token = checkAuth(); // Garante que o usuário está autenticado e retorna o token
    if (!token) return;

    // Carregar dados do backend
    await loadInitialData(token);

    setTheme(currentTheme);
    setupEventListeners();
    setupCharts();
    renderGoals();
    atualizarDashboard();
    atualizarTabela();
    setupSmartSearch();
    setupFilterTabs();

    document.getElementById('data').value = new Date().toISOString().split('T')[0];
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// ===== VERIFICAÇÃO DE AUTENTICAÇÃO =====
function checkAuth() {
    const token = localStorage.getItem('authToken');
    // Se não houver token, redireciona para a página de login
    if (!token) {
        alert('Acesso negado. Por favor, faça o login.');
        window.location.href = 'login.html';
        return null; // Interrompe a execução se não houver token
    }
    return token; // Retorna o token para ser usado nas chamadas da API
}

// ===== CARREGAMENTO DE DADOS INICIAIS =====
async function loadInitialData(token) {
    try {
        const response = await fetch(`${API_URL}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Falha ao carregar dados.');
        transactions = await response.json();
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        showNotification('Não foi possível carregar suas transações.', 'error');
    }
}

// ===== SISTEMA DE TEMAS =====
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
    currentTheme = theme;
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ===== CONFIGURAÇÃO DE EVENTOS =====
function setupEventListeners() {
    // Formulário de transação
 document.getElementById('transacaoForm').addEventListener('submit', handleSubmit);
    
    // Botões de filtro
 document.getElementById('btnFiltros').addEventListener('click', toggleFiltros);
 document.getElementById('btnGerarFiltro').addEventListener('click', aplicarFiltro);
 document.getElementById('btnLimparFiltro').addEventListener('click', limparFiltro);

    // Botão de exportar
    document.getElementById('btnExportar').addEventListener('click', exportarDados);
    
    // Toggle de tema
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Botão de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Limpar dados de autenticação
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('authToken');
            showNotification('Logout realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }

    // --- OUVINTES DE EVENTOS PARA METAS ---
    const btnShowAddGoal = document.getElementById('btnShowAddGoal');
    const addGoalContainer = document.getElementById('addGoalContainer');
    const cancelAddGoal = document.getElementById('cancelAddGoal');
    const addGoalForm = document.getElementById('addGoalForm');

    if (btnShowAddGoal) {
        btnShowAddGoal.addEventListener('click', () => {
            addGoalContainer.style.display = 'block';
            btnShowAddGoal.style.display = 'none';
        });
    }

    if (cancelAddGoal) {
        cancelAddGoal.addEventListener('click', () => {
            addGoalContainer.style.display = 'none';
            btnShowAddGoal.style.display = 'block';
            addGoalForm.reset();
        });
    }

    if (addGoalForm) {
        addGoalForm.addEventListener('submit', handleAddGoal);
    }
}

// ===== DASHBOARD INTERATIVO =====
function atualizarDashboard() {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    // Dados do mês atual
    const transacoesMesAtual = transactions.filter(t => {
        const data = new Date(t.date);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    });
    
    // Dados do mês anterior
    const transacoesMesAnterior = transactions.filter(t => {
        const data = new Date(t.date);
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
        return data.getMonth() === mesAnterior && data.getFullYear() === anoAnterior;
    });
    
    // Cálculos
    const entradasMes = transacoesMesAtual.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
    const saidasMes = transacoesMesAtual.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
    const saldoMes = entradasMes - saidasMes;
    
    const entradasMesAnterior = transacoesMesAnterior.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
    const saidasMesAnterior = transacoesMesAnterior.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
    
    // Variações percentuais
    const variacaoEntradas = entradasMesAnterior > 0 ? ((entradasMes - entradasMesAnterior) / entradasMesAnterior * 100) : 0;
    const variacaoSaidas = saidasMesAnterior > 0 ? ((saidasMes - saidasMesAnterior) / saidasMesAnterior * 100) : 0;
    
    // Atualizar cards do dashboard
    document.getElementById('saldoAtual').textContent = formatarMoeda(saldoMes);
    document.getElementById('receitasMes').textContent = formatarMoeda(entradasMes);
    document.getElementById('despesasMes').textContent = formatarMoeda(saidasMes);
    
    // Atualizar variações
    document.getElementById('saldoChange').textContent = `${saldoMes >= 0 ? '+' : ''}${saldoMes.toFixed(0)}% este mês`;
    document.getElementById('receitasChange').textContent = `${variacaoEntradas >= 0 ? '+' : ''}${variacaoEntradas.toFixed(1)}% vs mês anterior`;
    document.getElementById('despesasChange').textContent = `${variacaoSaidas >= 0 ? '+' : ''}${variacaoSaidas.toFixed(1)}% vs mês anterior`;
    
    // Aplicar classes de cor
    document.getElementById('saldoChange').className = `change ${saldoMes >= 0 ? '' : 'negative'}`;
    document.getElementById('receitasChange').className = `change ${variacaoEntradas >= 0 ? '' : 'negative'}`;
    document.getElementById('despesasChange').className = `change ${variacaoSaidas >= 0 ? '' : 'negative'}`;
    
    // Atualizar meta de economia
    atualizarMetaEconomia();
}

// ===== SISTEMA DE METAS =====
function atualizarMetaEconomia() {
    const meta = 1000; // Meta fixa de R$ 1.000,00
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    
    const transacoesMes = transactions.filter(t => {
        const data = new Date(t.date);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    });
    
    const entradasMes = transacoesMes.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
    const saidasMes = transacoesMes.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
    const economiaMes = entradasMes - saidasMes;
    
    const percentual = Math.min((economiaMes / meta) * 100, 100);
    
    document.getElementById('metaEconomia').textContent = formatarMoeda(economiaMes);
    document.getElementById('metaProgresso').textContent = `${percentual.toFixed(1)}% atingido`;
    
    // Aplicar classe de cor
    document.getElementById('metaProgresso').className = `change ${percentual >= 100 ? '' : 'negative'}`;
}

function handleAddGoal(e) {
    e.preventDefault();
    const goalNameInput = document.getElementById('goalName');
    const goalValueInput = document.getElementById('goalValue');

    const nome = goalNameInput.value.trim();
    const valor = parseFloat(goalValueInput.value);

    if (nome && !isNaN(valor) && valor > 0) {
        const novaMeta = {
            id: Date.now().toString(),
            nome: nome,
            valor: valor,
            dataCriacao: new Date().toISOString(),
            progresso: 0 // Progresso inicial é 0
        };
        
        goals.push(novaMeta);
        localStorage.setItem('goals', JSON.stringify(goals));
        
        showNotification('Meta criada com sucesso!', 'success');
        
        renderGoals(); // Re-renderiza a lista de metas

        // Esconde o formulário e mostra o botão de adicionar
        document.getElementById('addGoalContainer').style.display = 'none';
        document.getElementById('btnShowAddGoal').style.display = 'block';
        document.getElementById('addGoalForm').reset();

    } else {
        showNotification('Por favor, preencha o nome e um valor válido para a meta.', 'warning');
    }
}

function renderGoals() {
    const goalsList = document.getElementById('goalsList');
    if (!goalsList) return;

    goalsList.innerHTML = ''; // Limpa a lista

    if (goals.length === 0) {
        goalsList.innerHTML = '<p style="text-align: center; opacity: 0.7;">Nenhuma meta definida ainda. Adicione uma para começar!</p>';
        return;
    }

    goals.forEach(goal => {
        // A lógica de progresso ainda não está implementada, então será 0.
        const progresso = goal.progresso || 0;
        const percentual = Math.min((progresso / goal.valor) * 100, 100);

        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div class="goal-item-info">
                <h4>${goal.nome}</h4>
                <p>Meta: ${formatarMoeda(goal.valor)}</p>
                <div class="goal-progress">
                    <div class="goal-progress-bar" style="width: ${percentual.toFixed(1)}%;"></div>
                </div>
            </div>
            <div class="goal-item-actions">
                <span class="goal-percent">${percentual.toFixed(1)}%</span>
                <button class="btn-icon" onclick="deleteGoal('${goal.id}')" title="Excluir Meta">🗑️</button>
            </div>
        `;
        goalsList.appendChild(goalElement);
    });
}

function deleteGoal(id) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
        goals = goals.filter(g => g.id !== id);
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();
        showNotification('Meta excluída com sucesso!', 'success');
    }
}
// ===== GRÁFICOS =====
function setupCharts() {
    setupFluxoCaixaChart();
    setupCategoriaChart();
}

function setupFluxoCaixaChart() {
    if (fluxoCaixaChartInstance) {
        fluxoCaixaChartInstance.destroy();
    }

    const ctx = document.getElementById('fluxoCaixaChart').getContext('2d');
    
    // Dados dos últimos 6 meses
    const meses = [];
    const entradas = [];
    const saidas = [];
    
    for (let i = 5; i >= 0; i--) {
        const data = new Date();
        data.setMonth(data.getMonth() - i);
        const mes = data.toLocaleDateString('pt-BR', { month: 'short' });
        meses.push(mes);
        
        const transacoesMes = transactions.filter(t => {
            const tData = new Date(t.date);
            return tData.getMonth() === data.getMonth() && tData.getFullYear() === data.getFullYear();
        });
        
        const entradasMes = transacoesMes.filter(t => t.type === 'entrada').reduce((acc, t) => acc + t.amount, 0);
        const saidasMes = transacoesMes.filter(t => t.type === 'saida').reduce((acc, t) => acc + t.amount, 0);
        
        entradas.push(entradasMes);
        saidas.push(saidasMes);
    }
    
    fluxoCaixaChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Entradas',
                data: entradas,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.4
            }, {
                label: 'Saídas',
                data: saidas,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

function setupCategoriaChart() {
    if (categoriaChartInstance) {
        categoriaChartInstance.destroy();
    }

    const ctx = document.getElementById('categoriaChart').getContext('2d');
    
    // Agrupar transações por categoria
    const categorias = {};
    transactions.forEach(t => {
        if (t.type === 'saida') {
            categorias[t.category] = (categorias[t.category] || 0) + t.amount;
        }
    });
    
    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    
    categoriaChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// ===== BUSCA INTELIGENTE =====
function setupSmartSearch() {
    const searchInput = document.getElementById('smartSearch');
    const suggestions = document.getElementById('searchSuggestions');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            suggestions.style.display = 'none';
            return;
        }
        
        const results = [];
        
        // Buscar em transações
        transactions.forEach(t => {
            if (t.description.toLowerCase().includes(query) ||
                t.category.toLowerCase().includes(query) ||
                t.bank.toLowerCase().includes(query)) {
                results.push({
                    type: 'transacao',
                    text: `${t.description} - ${t.category}`,
                    data: t
                });
            }
        });
        
        // Buscar em categorias únicas
        const categoriasUnicas = [...new Set(transactions.map(t => t.category))];
        categoriasUnicas.forEach(cat => {
            if (cat.toLowerCase().includes(query)) {
                results.push({
                    type: 'categoria',
                    text: cat,
                    data: cat
                });
            }
        });
        
        // Mostrar sugestões
        if (results.length > 0) {
            suggestions.innerHTML = results.slice(0, 5).map(r => 
                `<div class="search-suggestion" onclick="selecionarSugestao('${r.type}', '${r.text}')">
                    ${r.text}
                </div>`
            ).join('');
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    });
    
    // Esconder sugestões ao clicar fora
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
        }
    });
}

function selecionarSugestao(tipo, texto) {
    document.getElementById('smartSearch').value = texto;
    document.getElementById('searchSuggestions').style.display = 'none';
    
    // Aplicar filtro automático
    if (tipo === 'categoria') {
        document.getElementById('filtroCategoria').value = texto;
    }
    
    aplicarFiltro();
}

// ===== FILTROS AVANÇADOS =====
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Adicionar classe active na tab clicada
            this.classList.add('active');
        });
    });
 }

 function toggleFiltros() {
     const filtrosContainer = document.getElementById('filtros');
    const isVisible = filtrosContainer.style.display !== 'none';
    
    if (isVisible) {
        filtrosContainer.style.display = 'none';
        document.getElementById('btnFiltros').textContent = 'Filtros';
    } else {
        filtrosContainer.style.display = 'block';
        document.getElementById('btnFiltros').textContent = 'Ocultar Filtros';
    }
 }

 function filtrarTransacoes() {
     let filtered = [...transactions];
    
     const dataInicial = document.getElementById('filtroDataInicial').value;
     const dataFinal = document.getElementById('filtroDataFinal').value;
     const banco = document.getElementById('filtroBanco').value;
     const categoria = document.getElementById('filtroCategoria').value;
     const tipo = document.getElementById('filtroTipo').value;
    const valorMin = parseFloat(document.getElementById('filtroValorMin').value) || 0;
    const valorMax = parseFloat(document.getElementById('filtroValorMax').value) || Infinity;

    // Filtro padrão: mês atual (se nenhum filtro de data estiver ativo)
     if (!dataInicial && !dataFinal) {
         const mesAtual = getMesAtual();
         filtered = filtered.filter(t => t.date.startsWith(mesAtual));
     }

     if (dataInicial) {
         filtered = filtered.filter(t => t.date >= dataInicial);
     }
     if (dataFinal) {
         filtered = filtered.filter(t => t.date <= dataFinal);
     }
     if (banco) {
         filtered = filtered.filter(t => t.bank === banco);
     }
     if (categoria) {
         filtered = filtered.filter(t => t.category === categoria);
     }
     if (tipo) {
         filtered = filtered.filter(t => t.type === tipo);
     }
    if (valorMin > 0) {
        filtered = filtered.filter(t => t.amount >= valorMin);
    }
    if (valorMax < Infinity) {
        filtered = filtered.filter(t => t.amount <= valorMax);
     }

     return filtered;
 }

// ===== FORMULÁRIO DE TRANSAÇÃO =====
async function handleSubmit(e) {
    e.preventDefault();

    const submitButton = e.target.querySelector('button[type="submit"]');
    const submitText = submitButton.querySelector('#submitText');
    const submitLoading = submitButton.querySelector('#submitLoading');
    submitButton.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-block';

    const formData = new FormData(e.target);
    const transactionId = formData.get('transactionId');

    const transactionData = {
        description: formData.get('descricao'),
        amount: parseFloat(formData.get('valor')),
        date: formData.get('data'),
        bank: formData.get('banco'),
        category: formData.get('categoria'),
        type: formData.get('tipo'),
    };

    const isEditing = !!transactionId;
    const url = isEditing ? `${API_URL}/transactions/${transactionId}` : `${API_URL}/transactions`;
    const method = isEditing ? 'PUT' : 'POST';
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(transactionData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || (isEditing ? 'Falha ao atualizar transação.' : 'Falha ao salvar transação.'));
        }

        showNotification(data.message, 'success');

        e.target.reset();
        document.getElementById('data').value = new Date().toISOString().split('T')[0];
        document.getElementById('transactionId').value = '';
        submitText.textContent = '🚀 Adicionar Transação';

        await loadInitialData(token);
        
        atualizarDashboard();
        atualizarTabela();
        setupCharts();

    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        submitButton.disabled = false;
        submitText.style.display = 'inline-block';
        submitLoading.style.display = 'none';
    }
}

// ===== TABELA DE TRANSAÇÕES =====
 function atualizarTabela() {
     const tbody = document.querySelector('#tabelaTransacoes tbody');
     const transacoesFiltradas = filtrarTransacoes();
     
     tbody.innerHTML = '';
     
     transacoesFiltradas.sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((transaction, index) => {
             const tr = document.createElement('tr');
            tr.className = 'table-row';
            tr.style.animationDelay = `${index * 0.1}s`;
            
             tr.innerHTML = `
                 <td>${transaction.description}</td>
                 <td>${formatarMoeda(transaction.amount)}</td>
                 <td>${formatarData(transaction.date)}</td>
                 <td>${transaction.bank}</td>
                 <td>${transaction.category}</td>
                 <td><span class="status-${transaction.type}">${
                     transaction.type === 'entrada' ? 'Entrada' : 'Saída'
                 }</span></td>
                <td>
                    <button onclick="editarTransacao('${transaction.id}')" class="button-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">✏️</button>
                    <button onclick="excluirTransacao('${transaction.id}')" class="button-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">🗑️</button>
                </td>
             `;
             tbody.appendChild(tr);
         });

    // Atualizar extrato
     gerarExtrato();
 }

function editarTransacao(id) {
    const transaction = transactions.find(t => t.id.toString() === id.toString());
    if (transaction) {
        // Preencher formulário com dados da transação
        document.getElementById('transactionId').value = transaction.id;
        document.getElementById('descricao').value = transaction.description;
        document.getElementById('valor').value = transaction.amount;
        document.getElementById('data').value = new Date(transaction.date).toISOString().split('T')[0];
        document.getElementById('banco').value = transaction.bank;
        document.getElementById('categoria').value = transaction.category;
        document.getElementById('tipo').value = transaction.type;
        
        // Mudar texto do botão para indicar edição
        document.getElementById('submitText').textContent = '💾 Salvar Alterações';
        
        showNotification('Transação carregada para edição!', 'info');
        
        // Scroll para o formulário
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }
}

async function excluirTransacao(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao excluir a transação.');
            }

            // Remove do array local e atualiza a UI
            transactions = transactions.filter(t => t.id.toString() !== id);
            atualizarDashboard();
            atualizarTabela();
            setupCharts();
            showNotification('Transação excluída com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao excluir transação:', error);
            showNotification(error.message, 'error');
        }
    }
}

// ===== EXTRATO =====
 function gerarExtrato() {
     const transacoesFiltradas = filtrarTransacoes();
     
     const total = transacoesFiltradas.reduce((acc, curr) => {
         return acc + (curr.type === 'entrada' ? curr.amount : -curr.amount);
     }, 0);

     const entradas = transacoesFiltradas
         .filter(t => t.type === 'entrada')
         .reduce((acc, curr) => acc + curr.amount, 0);

     const saidas = transacoesFiltradas
         .filter(t => t.type === 'saida')
         .reduce((acc, curr) => acc + curr.amount, 0);

    // Atualizar extrato na tela
    document.getElementById('extratoEntradas').textContent = formatarMoeda(entradas);
    document.getElementById('extratoSaidas').textContent = formatarMoeda(saidas);
    document.getElementById('extratoTotal').textContent = formatarMoeda(total);

    // Aplicar a classe correta ao card de saldo
    const extratoSaldoCard = document.getElementById('extratoSaldoCard');
    if (extratoSaldoCard) {
        extratoSaldoCard.classList.remove('positivo', 'negativo');
        if (total >= 0) {
            extratoSaldoCard.classList.add('positivo');
        } else {
            extratoSaldoCard.classList.add('negativo');
        }
     }
 }

// ===== FUNÇÕES AUXILIARES =====
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function getMesAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}`;
}

 function aplicarFiltro() {
     atualizarTabela();
    showNotification('Filtros aplicados com sucesso!', 'success');
 }

 function limparFiltro() {
     document.getElementById('filtroDataInicial').value = '';
     document.getElementById('filtroDataFinal').value = '';
     document.getElementById('filtroBanco').value = '';
     document.getElementById('filtroCategoria').value = '';
     document.getElementById('filtroTipo').value = '';
    document.getElementById('filtroValorMin').value = '';
    document.getElementById('filtroValorMax').value = '';
    
     atualizarTabela();
    showNotification('Filtros limpos!', 'info');
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
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

// ===== EXPORTAÇÃO DE DADOS =====
function exportarDados() {
    const transacoesFiltradas = filtrarTransacoes();
    
    if (transacoesFiltradas.length === 0) {
        showNotification('Nenhuma transação para exportar!', 'warning');
        return;
    }
    
    // Criar CSV
    let csv = 'Descrição,Valor,Data,Banco,Categoria,Tipo\n';
    
    transacoesFiltradas.forEach(t => {
        csv += `"${t.description}",${t.amount},${t.date},"${t.bank}","${t.category}","${t.type}"\n`;
    });
    
    // Download do arquivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Dados exportados com sucesso!', 'success');
}
