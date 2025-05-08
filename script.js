 // Inicialização
 document.getElementById('currentYear').textContent = new Date().getFullYear();
 let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

 // Event Listeners
 document.getElementById('transacaoForm').addEventListener('submit', handleSubmit);
 document.getElementById('btnFiltros').addEventListener('click', toggleFiltros);
 document.getElementById('btnGerarFiltro').addEventListener('click', aplicarFiltro);
 document.getElementById('btnLimparFiltro').addEventListener('click', limparFiltro);

 // Funções
 function handleSubmit(e) {
     e.preventDefault();
     const formData = new FormData(e.target);
     
     const transaction = {
         id: Date.now().toString(),
         description: formData.get('descricao'),
         amount: parseFloat(formData.get('valor')),
         date: formData.get('data'),
         bank: formData.get('banco'),
         category: formData.get('categoria'),
         type: formData.get('tipo'),
         created_at: new Date().toISOString()
     };

     transactions.push(transaction);
     localStorage.setItem('transactions', JSON.stringify(transactions));
     
     e.target.reset();
     atualizarTabela();
 }

 function toggleFiltros() {
     const filtrosContainer = document.getElementById('filtros');
     filtrosContainer.style.display = filtrosContainer.style.display === 'none' ? 'block' : 'none';
 }

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

 function filtrarTransacoes() {
     let filtered = [...transactions];
     const dataInicial = document.getElementById('filtroDataInicial').value;
     const dataFinal = document.getElementById('filtroDataFinal').value;
     const banco = document.getElementById('filtroBanco').value;
     const categoria = document.getElementById('filtroCategoria').value;
     const tipo = document.getElementById('filtroTipo').value;
     const busca = document.getElementById('filtroBusca').value.toLowerCase();

     // Filtro padrão: mês atual
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
     if (busca) {
         filtered = filtered.filter(t => 
             t.description.toLowerCase().includes(busca) ||
             t.bank.toLowerCase().includes(busca) ||
             t.category.toLowerCase().includes(busca)
         );
     }

     return filtered;
 }

 function atualizarTabela() {
     const tbody = document.querySelector('#tabelaTransacoes tbody');
     const transacoesFiltradas = filtrarTransacoes();
     
     tbody.innerHTML = '';
     
     transacoesFiltradas.sort((a, b) => new Date(b.date) - new Date(a.date))
         .forEach(transaction => {
             const tr = document.createElement('tr');
             tr.innerHTML = `
                 <td>${transaction.description}</td>
                 <td>${formatarMoeda(transaction.amount)}</td>
                 <td>${formatarData(transaction.date)}</td>
                 <td>${transaction.bank}</td>
                 <td>${transaction.category}</td>
                 <td><span class="status-${transaction.type}">${
                     transaction.type === 'entrada' ? 'Entrada' : 'Saída'
                 }</span></td>
             `;
             tbody.appendChild(tr);
         });

     // Atualiza o extrato ao filtrar a tabela
     gerarExtrato();
 }

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

     // Atualiza o extrato na tela
     const extratoTotalElement = document.getElementById('extratoTotal');
     extratoTotalElement.textContent = formatarMoeda(total);

     // Aplica a classe correta com base no valor do saldo
     if (total >= 0) {
         extratoTotalElement.classList.remove('extrato-total-negativo');
         extratoTotalElement.classList.add('extrato-total-positivo');
     } else {
         extratoTotalElement.classList.remove('extrato-total-positivo');
         extratoTotalElement.classList.add('extrato-total-negativo');
     }

     document.getElementById('extratoEntradas').textContent = formatarMoeda(entradas);
     document.getElementById('extratoSaidas').textContent = formatarMoeda(saidas);
 }

 function aplicarFiltro() {
     atualizarTabela();
 }

 function limparFiltro() {
     document.getElementById('filtroDataInicial').value = '';
     document.getElementById('filtroDataFinal').value = '';
     document.getElementById('filtroBanco').value = '';
     document.getElementById('filtroCategoria').value = '';
     document.getElementById('filtroTipo').value = '';
     document.getElementById('filtroBusca').value = '';
     atualizarTabela();
 }

 // Inicializar tabela
 atualizarTabela();