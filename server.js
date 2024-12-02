
// IMPORTAÇÕES EXTERNAS
import express from "express"
import path from "path"
import { fileURLToPath } from "url"

// DECLARAÇÕES DE VARIÁVEIS PARA MÓDULOS EXPRESS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// DECLARÇÃO DO APP = EXPRESS E PORT DA API
const app = express()
const port = 3000

// DECLARAÇÃO DE TODO O PROJETO, PARA PODER SEREM VINCULADOS AOS HMTL SEUS ARQUIVOS ESTÁTICOS CORRESPONDENTES
app.use(express.static(__dirname + '/public'));
// DECLARAÇÃO PARA REQUISIÇÃO DE DADOS DO FORMULÁRIO
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROTA DE MÉTODO GET PARA A PÁGINA reset-password
app.get('/reset-password', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'reset-password', 'reset_password.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA reset-password
app.post('/reset-password', (req, res) => {
  var email = req.body.email_do_usuario
  // var err_email = req.body.err_email
  
  console.log(`Dados do formulário:${email}`)
  // REDIRECIONAMENTO PARA A PÁGINA check-yout-email NO PORT
  res.redirect('/check-your-email')

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
app.get('/usuario-bloqueado', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'usuario-bloqueado', 'usuario_bloqueado.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA usuario-bloqueado
app.post('/usuario-bloqueado', (req, res) => {

  // BASE PARA O ENVIO DO SUPORT
    // res.redirect('https://url.do.suporte.com')
});

// ROTA DE MÉTODO GET PARA A PÁGINA check-your-email
app.get('/check-your-email', (req, res) => {
  // RENDERIZAÇÃO NO PORT DA PÁGINA 
  res.sendFile(path.join(__dirname, 'public', 'check-your-email', 'check_email.html'));
});

// ROTA DE MÉTODO POST PARA A PÁGINA check-your-email
app.post('/check-your-email', (req, res) => {
  // REDIRECIONAMENTO PARA A PÁGINA create-new-password
  res.redirect('/create-new-password')
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

  // REDIRECIONAMENTO PARA A PÁGINA successfully-changed-password
  res.redirect('/successfully-changed-password')
});

// ROTA DE MÉTODO GET PARA A PÁGINA successfully-changed-password
app.get('/successfully-changed-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'successfully-changed-password', 'changed_password.html'));

  // LÓGICA PARA REDIRECIONAMENTO PARA A TELA DE LOGIN

  // FIM
});

// LISTEN DO EXPRESS PARA RODAR A APLICAÇÃO NO PORT
app.listen(port, () => {
  console.log(`Aplicação: listening on port ${port}`)
})