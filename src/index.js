
// IMPORTAÇÕES EXTERNAS
import express, { response } from "express"
import path from "path"
import { fileURLToPath } from "url"

// DECLARAÇÕES DE VARIÁVEIS PARA MÓDULOS EXPRESS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// DECLARÇÃO DO APP = EXPRESS E PORT DA API
const app = express()
const port = 3000

// DECLARAÇÃO DE TODO O PROJETO, PARA PODER SEREM VINCULADOS AOS HMTL SEUS ARQUIVOS ESTÁTICOS CORRESPONDENTES
app.use(express.static(path.join(__dirname, '../public')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/image', express.static(path.join(__dirname, 'image')));
// DECLARAÇÃO PARA REQUISIÇÃO DE DADOS DO FORMULÁRIO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import session from 'express-session';

// Configuração do middleware de sessão
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use true se estiver usando HTTPS
}));

// ROTA DE MÉTODO GET PARA A PÁGINA login
app.get('/auth/login', (req, res) => {
  // RENDERIZAÇÃO DA PÁGINA
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA login
app.post('/auth/login', (req, res) => {
  // Pega os dados do formulário
  const { email_do_usuario, password_do_usuario } = req.body;

  // Inicializa a sessão corretamente
  req.session.loginAttempts = req.session.loginAttempts || 0;

  // VALIDAÇÃO DE TENTATIVAS DE ERRO
  if (email_do_usuario === 'teste.mvp@gmail.com' && password_do_usuario === 'ABc12@001') {
    req.session.loginAttempts = 0;

    fetch('http://142.93.64.83:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email_do_usuario,
        password: password_do_usuario,
        ipAddress: '177.34.139.254',
        deviceInfo: 'teste'
      })
     })
     .then(response => {
      if (response.ok) {
        return response.json();
      }
     })
     .then(data => {
        console.log('Success:', data);
     })
     .catch(error => {
        console.error('Error:', error);
     });

    if (req.xhr) { // Verifica se é uma requisição AJAX
      res.status(200).json({
        success: true,
        redirect: '/auth/send-password-reset-token',
        externalData: response.data
      });
    } else {
      res.redirect('/daily');
    }

  } else {
    req.session.loginAttempts++;
    req.session.save((err) => { // Força salvar a sessão antes de enviar a resposta
      if (err) console.error(err);
      
      let message;
      if (req.session.loginAttempts === 1) {
        message = 'Please try again.';
      } else if (req.session.loginAttempts === 2) {
        message = 'Last attempt';
      } else if (req.session.loginAttempts >= 3) {
        return res.redirect('/auth/acess-blocked-login');
      }

      res.status(401).json({ 
        error: true, 
        message: message 
      });
    });
  }
});

// ROTA DE MÉTODO GET PARA A PÁGINA send-password-reset-token
app.get('/auth/send-password-reset-token', (req, res) => {
  
  res.sendFile(path.join(__dirname, '../public', 'send-password-reset-token.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA send-password-reset-token
app.post('/auth/send-password-reset-token', (req, res) => {
  var email_do_usuario = req.body.email_do_usuario;
  
  if (email_do_usuario !== 'teste.mvp@gmail.com') {
    // Volta para a página com erro
    return res.status(401).send('E-mail inválido');
  } else {
    // Envia o email do usuário para a API
    fetch('http://142.93.64.83:3001/auth/send-password-reset-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email_do_usuario })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          return res.redirect('/auth/usuario-bloqueado'); // Redireciona via servidor
        } else {
          throw new Error(`Erro: ${response.status}`);
        }
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // Armazena o token na sessão
      req.session.resetData = {
        token: data.token,
        email: email_do_usuario // Guarda o email e token na sessão
      }; 
      req.session.save(() => {
        res.redirect('/auth/check-your-email'); // Redireciona via servidor
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
});

// ROTA DE MÉTODO GET PARA A PÁGINA check-your-email
app.get('/auth/check-your-email', (req, res) => {
  // Verifica se o token está disponível ainda na sessão
  if (!req.session.resetData.token) {
    return res.redirect('/auth/send-password-reset-token').status(401);
  }

  // RENDERIZAÇÃO DA PÁGINA 
  res.sendFile(path.join(__dirname, '../public', 'check_email.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA check-your-email
app.post('/auth/check-your-email', (req, res) => {
  const storedToken = req.session.resetData.token;

  // Verifica se o token está disponível ainda na sessão
  if (!storedToken) {
    return res.status(401).send('Token inválido ou expirado');
  }
    res.redirect('/auth/reset-password');
});

// ROTA DE MÉTODO GET PARA A PÁGINA reset-password
app.get('/auth/reset-password', (req, res) => {

  // Verifica se o token está disponível ainda na sessão
  if (!req.session.resetData.token) { 
    return res.redirect('/auth/send-password-reset-token').send('Token inválido ou expirado'); 
  }

  res.sendFile(path.join(__dirname, '../public', 'reset-password.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA reset-password
app.post('/auth/reset-password', (req, res) => {

  // Reccebe o token armazenado na sessão e o email do formulário
  const confirm_password = req.body.confirm_password;
  const resetData = req.session.resetData; 

  // Verifica se o token está disponível ainda na sessão
  if (!storedToken) {
    return res.status(401).send('Sessão expirada');
  }

  // Envia o token, email e a nova senha para a API
  fetch('http://142.93.64.83:3001/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: resetData.email,
      token: resetData.token,
      newPassword: confirm_password
    })
  })
  .then(response => {
    if (!response.ok) throw new Error('Falha ao alterar senha');
    // Remove o token APÓS o sucesso
    req.session.resetToken = null;
    req.session.save(() => {
      res.redirect('/auth/successfully-changed-password');
    });
  })
  .catch(error => {
    console.error('Error:', error);
    res.status(500).send('Erro ao alterar senha');
  });
});

// ROTA DE MÉTODO GET PARA A PÁGINA successfully-changed-password
app.get('/auth/successfully-changed-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'changed_password.html'));
});

app.post('/auth/successfully-changed-password', (req, res) => {
  if (req.session.resetToken = null) {
    res.redirect('/auth/login');
  }
});

// ROTA DE MÉTODO GET PARA A PÁGINA usuario-bloqueado
app.get('/auth/usuario-bloqueado', (req, res) => {
  
  res.sendFile(path.join(__dirname, '../public', 'usuario_bloqueado.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA usuario-bloqueado
app.post('/auth/usuario-bloqueado', (req, res) => {

  // BASE PARA O ENVIO DO SUPORT
    // res.redirect('https://url.do.suporte.com')
});

// ROTA DE MÉTODO GET PARA A PÁGINA acess-blocked-login
app.get('/auth/acess-blocked-login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'acess-blocked-login.html'));
})

// ROTA DE MÉTODO POST PARA A PÁGINA acess-blocked-login
app.post('/auth/acess-blocked-login', (req, res) => {
  // res.redirect('http://url.com')
})

// ROTA DE MÉTODO GET PARA A PÁGINA daily
app.get('/daily', (req, res) => {
  
  res.sendFile(path.join(__dirname, '../public', 'daily.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA invoices
app.get('/invoices', (req, res) => {
  
  res.sendFile(path.join(__dirname, '../public', 'invoices.html'));
});

// LISTEN DO EXPRESS PARA RODAR A APLICAÇÃO NO PORT
app.listen(port, () => {
  console.log(`Aplicação: listening on port ${port}`)
})