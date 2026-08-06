const form = document.getElementById("formulario-login");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("senha");
const emailError = document.getElementById("erro-email");
const passwordError = document.getElementById("erro-senha");
const feedback = document.getElementById("retorno-login");

function setFieldError(campo, elementoErro, mensagem) {
  if (mensagem) {
    campo.setAttribute("aria-invalid", "true");
    elementoErro.textContent = mensagem;
  } else {
    campo.removeAttribute("aria-invalid");
    elementoErro.textContent = "";
  }
}

function showFeedback(mensagem, estado) {
  feedback.textContent = mensagem;
  feedback.dataset.state = estado;
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.removeAttribute("data-state");
}

function validate() {
  let valido = true;

  const email = emailInput.value;
  if (!email.trim()) {
    setFieldError(emailInput, emailError, "Informe seu e-mail.");
    valido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    setFieldError(emailInput, emailError, "Informe um e-mail válido.");
    valido = false;
  } else {
    setFieldError(emailInput, emailError, "");
  }

  const password = passwordInput.value;
  if (!password.trim()) {
    setFieldError(passwordInput, passwordError, "Informe sua senha.");
    valido = false;
  } else if (password.trim().length < 6) {
    setFieldError(passwordInput, passwordError, "A senha deve ter ao menos 6 caracteres.");
    valido = false;
  } else {
    setFieldError(passwordInput, passwordError, "");
  }

  return valido;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearFeedback();

  if (!validate()) {
    showFeedback("Corrija os campos destacados antes de continuar.", "erro");
    return;
  }

  const submitButton = document.getElementById("botao-entrar");
  submitButton.disabled = true;
  submitButton.textContent = "Entrando...";

  setTimeout(function () {
    showFeedback("Login realizado com sucesso! Redirecionando...", "sucesso");

    window.localStorage.setItem("bibliosys:session", JSON.stringify({
      email: emailInput.value.trim(),
      loggedInAt: new Date().toISOString(),
    }));

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);
  }, 600);
});

[emailInput, passwordInput].forEach(function (campo) {
  campo.addEventListener("input", function () {
    if (campo.getAttribute("aria-invalid") === "true") {
      const errorElement = campo === emailInput ? emailError : passwordError;
      setFieldError(campo, errorElement, "");
    }
  });
});