// Script do projeto
document.addEventListener("DOMContentLoaded", function() {
    // Resgatando os inputs e checkboxes
    var buttonEye1 = document.getElementById("button_eye_1"); 
    var inputPassword = document.getElementById("input_password");
    
    var buttonEye2 = document.getElementById("button_eye_2");
    var inputConfirmPassword = document.getElementById("input_confirm_password");

    var checkboxCaracteres = document.getElementById("checkbox_caracteres");
    var checkboxMaiuscula = document.getElementById("checkbox_maiuscula");
    var checkboxMinuscula = document.getElementById("checkbox_minuscula");
    var checkboxCaractereEspecial = document.getElementById("checkbox_caractere_especial");
    var checkboxNumero = document.getElementById("checkbox_numero");
    var checkboxSenhaCorrespondente = document.getElementById("checkbox_senha_correspondente");

    // Função para validar a senha
    function validatePassword() {
        var password = inputPassword.value;
        var confirmPassword = inputConfirmPassword.value;

        // Validação dos requisitos
        checkboxCaracteres.checked = password.length >= 8;
        checkboxMaiuscula.checked = /[A-Z]/.test(password);
        checkboxMinuscula.checked = /[a-z]/.test(password);
        checkboxCaractereEspecial.checked = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        checkboxNumero.checked = /[0-9]/.test(password);
        checkboxSenhaCorrespondente.checked = password.length > 0 && password === confirmPassword;
    }

    // Adiciona eventos para validar a senha ao digitar
    inputPassword.addEventListener("input", validatePassword);
    inputConfirmPassword.addEventListener("input", validatePassword);

    //Funcionalidade para os botões esconderem e mostrarem o conteúdo dos inputs
    buttonEye1.addEventListener("click", function() {
        if (inputPassword.type === "password") {
            inputPassword.type = "text";
        } else {
            inputPassword.type = "password";
        }
        validatePassword(); // Revalida após mudar o tipo
    });

    buttonEye2.addEventListener("click", function() {
        if (inputConfirmPassword.type === "password") {
            inputConfirmPassword.type = "text";
        } else {
            inputConfirmPassword.type = "password";
        }
        validatePassword(); // Revalida após mudar o tipo
    });
});