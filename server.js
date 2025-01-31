
// IMPORTAÇÕES EXTERNAS
import express from "express"
import path from "path"
import { fileURLToPath } from "url"

// DECLARAÇÕES DE VARIÁVEIS PARA MÓDULOS EXPRESS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// DECLARÇÃO DO APP = EXPRESS E PORT DA API
const app = express()
const port = 3001

// DECLARAÇÃO DE TODO O PROJETO, PARA PODER SEREM VINCULADOS AOS HMTL SEUS ARQUIVOS ESTÁTICOS CORRESPONDENTES
app.use(express.static(__dirname + '/public'));
// DECLARAÇÃO PARA REQUISIÇÃO DE DADOS DO FORMULÁRIO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import session from 'express-session';
import { isPromise } from "util/types"

// Configuração do middleware de sessão
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Use true se estiver usando HTTPS
}));

app.set('trust proxy', true);

// ROTA DE MÉTODO GET PARA A PÁGINA login
app.get('/auth/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login', 'login.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA login
app.post('/auth/login', (req, res) => {
  const { email_do_usuario, password_do_usuario } = req.body;

   // Captura o IP do cliente (versão corrigida)
   const clientIP = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Inicializa a sessão corretamente
  req.session.loginAttempts = req.session.loginAttempts || 0;

  // VALIDAÇÃO DE TENTATIVAS DE ERRO
  if (email_do_usuario === 'teste@231' && password_do_usuario === '123') {
    req.session.loginAttempts = 0;

    // Resposta para AJAX (JSON com redirect)
    if (req.xhr) { // Verifica se é uma requisição AJAX
      // Registrar email e IP no terminal
      console.log('Dados de login:', {
        "email": email_do_usuario,
        "ip": clientIP
      });
      res.json({ redirect: '/daily' });
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
        return res.redirect('/acess-blocked-login');
      }

      res.status(401).json({ 
        error: true, 
        message: message 
      });
    });
  }
});

// ROTA DE MÉTODO GET PARA A PÁGINA reset-password
app.get('/auth/reset-password', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'reset-password', 'reset_password.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA reset-password
app.post('/auth/reset-password', (req, res) => {
  var email = req.body.email_do_usuario
  var password = req.body.password
  // var err_email = req.body.err_email
  console.log(`Dados do formulário:${email}`)
  console.log(`Dados do formulário:${password}`)
  
  var dadosFormulario = {
    "email": email,
    "password": password
  }

  // $.ajax({
  //   url: '/reset-password',
  //   type: 'POST',
  //   contentType: 'application/json',
  //   data: JSON.stringify(dadosFormulario),
  //   success: function(response) {
  //       console.log('Resposta do servidor:', response);
  //       res.redirect('/check-your-email')
  // } 
  // });

  // REDIRECIONAMENTO PARA A PÁGINA check-yout-email NO PORT
  res.redirect('/auth/check-your-email')

  

  // BASE PARA A VALIDAÇÃO DO EMAIL DIGITADO
    // if (validateEmail(email)) {
    //   res.redirect('/check-your-email')
    // } else {
    //   err_email.classList.remove("d-none");
    // }

    // async function validateEmail(email) {
    //  AQUI VAI A LÓGICA PARA VER SE A SENHA É VÁLIDA
    // }

    // if (usuarioBloqueado) {
    //   res.redirect('/usuario-bloqueado')
    // }
});

// ROTA DE MÉTODO GET PARA A PÁGINA usuario-bloqueado
app.get('/auth/usuario-bloqueado', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'usuario-bloqueado', 'usuario_bloqueado.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA usuario-bloqueado
app.post('/auth/usuario-bloqueado', (req, res) => {

  // BASE PARA O ENVIO DO SUPORT
    // res.redirect('https://url.do.suporte.com')
});

// ROTA DE MÉTODO GET PARA A PÁGINA acess-blocked-login
app.get('/auth/acess-blocked-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'acess-blocked-login', 'acess-blocked-login.html'));
})

// ROTA DE MÉTODO POST PARA A PÁGINA acess-blocked-login
app.post('/auth/acess-blocked-login', (req, res) => {
  // res.redirect('http://url.com')
})

// ROTA DE MÉTODO GET PARA A PÁGINA check-your-email
app.get('/auth/check-your-email', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'check-your-email', 'check_email.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA check-your-email
app.post('/auth/check-your-email', (req, res) => {
  // REDIRECIONAMENTO PARA A PÁGINA create-new-password
  res.redirect('/auth/create-new-password')
});

// ROTA DE MÉTODO GET PARA A PÁGINA create-new-password
app.get('/create-new-password', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'create-new-password', 'create_password.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA create-new-password
app.post('/create-new-password', (req, res) => {
  // AQUI A LÓGICA PARA CADASTRAR NO BANCO DE DADOS A SENHA NOVA DO USUÁRIO

  // FIM

  console.log(`Nova senha do usuário: ${req.body.password}`)
  // REDIRECIONAMENTO PARA A PÁGINA successfully-changed-password
  res.redirect('/auth/successfully-changed-password')
})

// ROTA DE MÉTODO GET PARA A PÁGINA successfully-changed-password
app.get('/successfully-changed-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'successfully-changed-password', 'changed_password.html'));

  // LÓGICA PARA REDIRECIONAMENTO PARA A TELA DE LOGIN

  // FIM
});

// ROTA DE MÉTODO GET PARA A PÁGINA daily
app.get('/daily', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'daily', 'daily.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA invoices
app.get('/invoices', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'invoices', 'invoices.html'));
});

// LISTEN DO EXPRESS PARA RODAR A APLICAÇÃO NO PORT
app.listen(port, () => {
  console.log(`Aplicação: listening on port ${port}`)
})