const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Captura os valores de login e senha
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Busca os dados do usuário no localStorage
            const userData = localStorage.getItem('user_' + username);

            if (userData) {
                const user = JSON.parse(userData);

                // Verifica se a senha está correta
                if (user.password === password) {
                    // Redireciona para a página de finanças
                    window.location.href = 'financas.html';
                } else {
                    // Exibe mensagem de erro
                    document.getElementById('loginError').textContent = 'Senha incorreta.';
                    document.getElementById('loginError').style.display = 'block';
                }
            } else {
                // Exibe mensagem de erro
                document.getElementById('loginError').textContent = 'Usuário não encontrado.';
                document.getElementById('loginError').style.display = 'block';
            }
        });