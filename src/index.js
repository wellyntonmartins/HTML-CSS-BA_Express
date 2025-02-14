
// IMPORTAÇÕES EXTERNAS
import express, { response } from "express"
import path from "path"
import fs from 'fs';
import { fileURLToPath } from "url"

// DECLARAÇÕES DE VARIÁVEIS PARA MÓDULOS EXPRESS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// DECLARÇÃO DO APP = EXPRESS E PORT DA API
const app = express()
const port = 3002

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
  cookie: { secure: false }
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

  // Inicializa a sessão
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
        ipAddress: '131.221.89.81',
        deviceInfo: 'teste'
      })
     })
     .then(response => {
        if (!response.ok) throw new Error('Falha na API externa');
        
        // Extrai o token do corpo da resposta (data.token)
        return response.json().then(data => {
          req.session.token = data.token; // Captura o token aqui
          console.log('Token armazenado:', req.session.token);
          
          // Salva a sessão
          return new Promise((resolve, reject) => {
            req.session.save(err => {
              if (err) reject(err);
              else resolve(data); // Passa data para o próximo .then()
            });
          });
        });
      })
      .then(data => {
        res.status(200).json({ 
          success: true, 
          redirect: '/bff/day-overview'
        });
      })
      .catch(error => {
        console.error('Error:', error);
        res.status(500).json({ error: true, message: 'Erro interno' });
      });

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

// ROTA DE MÉTODO GET PARA A PÁGINA daily
app.get('/bff/day-overview', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'daily.html'));
});

app.get('/api/bff/day-overview', async (req, res) => {
  try {
    const response = await fetch('http://142.93.64.83:3001/bff/day-overview', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.session.token
      }
    });

    // Verifica se a resposta é válida
    if (!response.ok) {
      const errorText = await response.text(); // Captura o HTML/texto de erro
      console.error("Resposta da API externa:", errorText);
      throw new Error(`API externa retornou status ${response.status}`);
    }
    
    const data = await response.json(); 
    res.json(data);

  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).json({ error: "Falha ao processar dados", details: error.message });
  }
});

// ROTA DE MÉTODO GET PARA A PÁGINA send-password-reset-token
app.get('/auth/send-password-reset-token', (req, res) => {

  if (req.session.token) {
    res.sendFile(path.join(__dirname, '../public', 'send-password-reset-token.html'));
  } else {
    res.redirect('/auth/login');
  }
});

// ROTA DE MÉTODO POST PARA A PÁGINA send-password-reset-token
app.post('/auth/send-password-reset-token', (req, res) => {
  const email_do_usuario = req.body.email_do_usuario;

  // Salva o email na sessão
  req.session.email = email_do_usuario;

  if (email_do_usuario !== 'teste.mvp@gmail.com') {
    return res.status(401)
  } else {
    fetch('http://142.93.64.83:3001/auth/send-password-reset-token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email_do_usuario 
      })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          return res.redirect('/auth/usuario-bloqueado');
        }
        console.log(response.status);
      }
      return response.json();
    })
    .then(data => {
      // Força salvar a sessão antes do redirecionamento
      req.session.save(() => {
        res.redirect('/auth/check-your-email');
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
  if (!req.session.token) {
    return res.redirect('/auth/send-password-reset-token').status(401);
  }

  // RENDERIZAÇÃO DA PÁGINA 
  res.sendFile(path.join(__dirname, '../public', 'check_email.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA check-your-email
app.post('/auth/check-your-email', (req, res) => {
  

  // Verifica se o token está disponível ainda na sessão
  if (!req.session.token) {
    return res.status(401)
  }
    res.redirect('/auth/reset-password');
});

// ROTA DE MÉTODO GET PARA A PÁGINA reset-password
app.get('/auth/reset-password', (req, res) => {

  // Verifica se o token está disponível ainda na sessão
  if (!req.session.token) { 
    return res.redirect('/auth/send-password-reset-token').status(401);
  }

  res.sendFile(path.join(__dirname, '../public', 'reset-password.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA reset-password
app.post('/auth/reset-password', (req, res) => {
  const confirm_password = req.body;
  const emailArmazenado = req.session.email;

  // Verifica se o token está disponível ainda na sessão
  if (!req.session.token) {
    return res.status(401)
  }

  fetch('http://142.93.64.83:3001/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: emailArmazenado,
      token: req.session.token,
      newPassword: confirm_password
    })
  })
  .then(response => {
    if (!response.ok) return response;
    // Remove o token APÓS o sucesso
    req.session.token = null;
    req.session.save(() => {
      res.redirect('/auth/successfully-changed-password');
    });
  })
  .catch(error => {
    console.error('Error:', error);
    res.status(500)
  });
});

// ROTA DE MÉTODO GET PARA A PÁGINA successfully-changed-password
app.get('/auth/successfully-changed-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'changed_password.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA successfully-changed-password
app.post('/auth/successfully-changed-password', (req, res) => {
  if (req.session.token = null) {
    res.redirect('/auth/login');
  } else {
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

// ROTA DE MÉTODO POST PARA A PÁGINA invoices
app.get('/auth/invoices', (req, res) => {
  
  res.sendFile(path.join(__dirname, '../public', 'invoices.html'));
});

// LISTEN DO EXPRESS PARA RODAR A APLICAÇÃO NO PORT
app.listen(port, () => {
  console.log(`Aplicação: listening on port ${port}`)
})