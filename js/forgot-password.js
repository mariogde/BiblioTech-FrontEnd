const feedback = document.getElementById("retorno-recuperacao");
const identifyStep = document.getElementById("etapa-identificacao");
const identifyForm = document.getElementById("formulario-identificacao");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("erro-email");
const cpfInput = document.getElementById("cpf");
const cpfError = document.getElementById("erro-cpf");
const identifyConfirmButton = document.getElementById("botao-confirmar-identificacao");
const newPasswordStep = document.getElementById("etapa-nova-senha");
const newPasswordSubtitle = document.getElementById("subtitulo-nova-senha");
const newPasswordForm = document.getElementById("formulario-nova-senha");
const newPasswordInput = document.getElementById("nova-senha");
const newPasswordError = document.getElementById("erro-nova-senha");
const confirmNewPasswordInput = document.getElementById("confirmar-nova-senha");
const confirmNewPasswordError = document.getElementById("erro-confirmar-nova-senha");
const newPasswordConfirmButton = document.getElementById("botao-confirmar-nova-senha");


function isValidEmail(valor) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(valor.trim());
}

function maskCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function isValidCPF(valorBruto) {
  const digits = valorBruto.replace(/\D/g, "");

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(digits[i]) * (10 - i);
  }
  let digitoVerificador1 = (soma * 10) % 11;
  if (digitoVerificador1 === 10) digitoVerificador1 = 0;
  if (digitoVerificador1 !== Number(digits[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(digits[i]) * (11 - i);
  }
  let digitoVerificador2 = (soma * 10) % 11;
  if (digitoVerificador2 === 10) digitoVerificador2 = 0;
  return digitoVerificador2 === Number(digits[10]);
}

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

function goToStep(etapaParaExibir) {
  [identifyStep, newPasswordStep].forEach(function (etapa) {
    etapa.hidden = etapa !== etapaParaExibir;
  });
  clearFeedback();
}

cpfInput.addEventListener("input", function () {
  cpfInput.value = maskCPF(cpfInput.value);
});

function validateIdentifyStep() {
  let valido = true;

  const email = emailInput.value.trim();
  if (!email) {
    setFieldError(emailInput, emailError, "Informe seu e-mail.");
    valido = false;
  } else if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, "Informe um e-mail válido.");
    valido = false;
  } else {
    setFieldError(emailInput, emailError, "");
  }

  if (!cpfInput.value.trim()) {
    setFieldError(cpfInput, cpfError, "Informe seu CPF.");
    valido = false;
  } else if (!isValidCPF(cpfInput.value)) {
    setFieldError(cpfInput, cpfError, "CPF inválido.");
    valido = false;
  } else {
    setFieldError(cpfInput, cpfError, "");
  }

  return valido;
}

identifyForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearFeedback();

  if (!validateIdentifyStep()) {
    showFeedback("Corrija os campos destacados antes de continuar.", "erro");
    return;
  }

  identifyConfirmButton.disabled = true;
  identifyConfirmButton.textContent = "Verificando...";

  // Simulação de verificação assíncrona do usuário no backend.
  setTimeout(function () {
    identifyConfirmButton.disabled = false;
    identifyConfirmButton.textContent = "Confirmar";

    newPasswordSubtitle.textContent = "Recuperar Senha de " + emailInput.value.trim();
    goToStep(newPasswordStep);
    newPasswordInput.focus();
  }, 600);
});

document.getElementById("botao-cancelar-identificacao").addEventListener("click", function () {
  window.location.href = "index.html";
});

[emailInput, cpfInput].forEach(function (campo) {
  campo.addEventListener("input", function () {
    if (campo.getAttribute("aria-invalid") === "true") {
      const errorElement = campo === emailInput ? emailError : cpfError;
      setFieldError(campo, errorElement, "");
    }
  });
});


function validateNewPasswordStep() {
  let valido = true;

  if (!newPasswordInput.value) {
    setFieldError(newPasswordInput, newPasswordError, "Informe a nova senha.");
    valido = false;
  } else if (newPasswordInput.value.length < 6) {
    setFieldError(newPasswordInput, newPasswordError, "A senha deve ter ao menos 6 caracteres.");
    valido = false;
  } else {
    setFieldError(newPasswordInput, newPasswordError, "");
  }

  if (!confirmNewPasswordInput.value) {
    setFieldError(confirmNewPasswordInput, confirmNewPasswordError, "Confirme a nova senha.");
    valido = false;
  } else if (confirmNewPasswordInput.value !== newPasswordInput.value) {
    setFieldError(confirmNewPasswordInput, confirmNewPasswordError, "As senhas não coincidem.");
    valido = false;
  } else {
    setFieldError(confirmNewPasswordInput, confirmNewPasswordError, "");
  }

  return valido;
}

newPasswordForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearFeedback();

  if (!validateNewPasswordStep()) {
    showFeedback("Corrija os campos destacados antes de continuar.", "erro");
    return;
  }

  newPasswordConfirmButton.disabled = true;
  newPasswordConfirmButton.textContent = "Salvando...";

  setTimeout(function () {
    showFeedback("Senha redefinida com sucesso! Redirecionando para o login...", "sucesso");

    setTimeout(function () {
      window.location.href = "index.html";
    }, 900);
  }, 600);
});

document.getElementById("botao-cancelar-nova-senha").addEventListener("click", function () {
  window.location.href = "index.html";
});

[newPasswordInput, confirmNewPasswordInput].forEach(function (campo) {
  campo.addEventListener("input", function () {
    if (campo.getAttribute("aria-invalid") === "true") {
      const errorElement = campo === newPasswordInput ? newPasswordError : confirmNewPasswordError;
      setFieldError(campo, errorElement, "");
    }
  });
});