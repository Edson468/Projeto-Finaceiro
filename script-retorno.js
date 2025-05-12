const cadastroForm = document.getElementById('cadastroForm');
        cadastroForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Captura os dados do formulário
            const nomeCompleto = document.getElementById('nomeCompleto').value;
            const cpf = document.getElementById('cpf').value;
            const sexo = document.getElementById('sexo').value;
            const endereco = document.getElementById('endereco').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Simulação de armazenamento no localStorage
            const userData = { nomeCompleto, cpf, sexo, endereco, username, password };
            localStorage.setItem('user_' + username, JSON.stringify(userData));

            // Exibe a mensagem de sucesso
            document.getElementById('cadastroForm').style.display = 'none';
            const successMessage = document.getElementById('successMessage');
            successMessage.style.display = 'block';

            // Redireciona para a tela de login após 3 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        });