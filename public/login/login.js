document.addEventListener("DOMContentLoaded", function() {
    var buttonEye1 = document.getElementById("button_eye_1");
    var inputPassword = document.getElementById("input_password");

    buttonEye1.addEventListener("click", function() {
        if (inputPassword.type === "password") {
            inputPassword.type = "text";
        } else {
            inputPassword.type = "password";
        }
    });
});