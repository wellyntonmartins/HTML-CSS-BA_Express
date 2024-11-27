
// Script do projeto
document.addEventListener("DOMContentLoaded", function() {

// *** DECLARAÇÃO DE VARIÁVEIS GLOBAIS ***

    // Resgatando os inputs para os botões
    var buttonEye1 = document.getElementById("button_eye_1"); 
    var inputPassword = document.getElementById("input_password");
    
    var buttonEye2 = document.getElementById("button_eye_2");
    var inputConfirmPassword = document.getElementById("input_confirm_password");
    

    //Funcionalidade para os botões esconderem e mostrarem o conteúdo dos inputs
    buttonEye1.addEventListener("click", function() {
        if (inputPassword.type === "password") {
            inputPassword.type = "text";
           
        } else {
            inputPassword.type = "password";
        }
    });

    buttonEye2.addEventListener("click", function() {
        if (inputConfirmPassword.type === "password") {
            inputConfirmPassword.type = "text";
        } else {
            inputConfirmPassword.type = "password";
        }
    });
});