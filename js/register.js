const form = document.getElementById("formulario-cadastro");
const feedback = document.getElementById("retorno-cadastro");

const nameInput = document.getElementById("nome");
const emailInput = document.getElementById("email");
const cpfInput = document.getElementById("cpf");
const birthdateInput = document.getElementById("data-nascimento");
const phoneInput = document.getElementById("telefone");
const passwordInput = document.getElementById("senha");
const confirmPasswordInput = document.getElementById("confirmar-senha");

const fields = [
  { campo: nameInput, erro: document.getElementById("erro-nome") },
  { campo: emailInput, erro: document.getElementById("erro-email") },
  { campo: cpfInput, erro: document.getElementById("erro-cpf") },
  { campo: birthdateInput, erro: document.getElementById("erro-data-nascimento") },
  { campo: phoneInput, erro: document.getElementById("erro-telefone") },
  { campo: passwordInput, erro: document.getElementById("erro-senha") },
  { campo: confirmPasswordInput, erro: document.getElementById("erro-confirmar-senha") },
];

function maskCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

cpfInput.addEventListener("input", function () {
  cpfInput.value = maskCPF(cpfInput.value);
});

phoneInput.addEventListener("input", function () {
  phoneInput.value = maskPhone(phoneInput.value);
});


function isValidEmail(valor) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(valor.trim());
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

function isValidPhone(valor) {
  const digits = valor.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

function isAdult(valorData) {
  if (!valorData) return false;
  const birthDate = new Date(valorData);
  if (Number.isNaN(birthDate.getTime()) || birthDate > new Date()) return false;

  const today = new Date();
  let idade = today.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) idade -= 1;

  return idade >= 16;
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

function validate() {
  let valido = true;

  if (!nameInput.value.trim()) {
    setFieldError(nameInput, document.getElementById("erro-nome"), "Informe seu nome completo.");
    valido = false;
  } else if (nameInput.value.trim().split(/\s+/).length < 2) {
    setFieldError(nameInput, document.getElementById("erro-nome"), "Informe nome e sobrenome.");
    valido = false;
  } else {
    setFieldError(nameInput, document.getElementById("erro-nome"), "");
  }

  if (!emailInput.value.trim()) {
    setFieldError(emailInput, document.getElementById("erro-email"), "Informe seu e-mail.");
    valido = false;
  } else if (!isValidEmail(emailInput.value)) {
    setFieldError(emailInput, document.getElementById("erro-email"), "Informe um e-mail válido.");
    valido = false;
  } else {
    setFieldError(emailInput, document.getElementById("erro-email"), "");
  }

  if (!cpfInput.value.trim()) {
    setFieldError(cpfInput, document.getElementById("erro-cpf"), "Informe seu CPF.");
    valido = false;
  } else if (!isValidCPF(cpfInput.value)) {
    setFieldError(cpfInput, document.getElementById("erro-cpf"), "CPF inválido.");
    valido = false;
  } else {
    setFieldError(cpfInput, document.getElementById("erro-cpf"), "");
  }

  if (!birthdateInput.value) {
    setFieldError(birthdateInput, document.getElementById("erro-data-nascimento"), "Informe sua data de nascimento.");
    valido = false;
  } else if (!isAdult(birthdateInput.value)) {
    setFieldError(birthdateInput, document.getElementById("erro-data-nascimento"), "Data inválida ou idade mínima não atingida.");
    valido = false;
  } else {
    setFieldError(birthdateInput, document.getElementById("erro-data-nascimento"), "");
  }

  if (!phoneInput.value.trim()) {
    setFieldError(phoneInput, document.getElementById("erro-telefone"), "Informe seu telefone.");
    valido = false;
  } else if (!isValidPhone(phoneInput.value)) {
    setFieldError(phoneInput, document.getElementById("erro-telefone"), "Telefone inválido.");
    valido = false;
  } else {
    setFieldError(phoneInput, document.getElementById("erro-telefone"), "");
  }

  if (!passwordInput.value) {
    setFieldError(passwordInput, document.getElementById("erro-senha"), "Informe uma senha.");
    valido = false;
  } else if (passwordInput.value.length < 6) {
    setFieldError(passwordInput, document.getElementById("erro-senha"), "A senha deve ter ao menos 6 caracteres.");
    valido = false;
  } else {
    setFieldError(passwordInput, document.getElementById("erro-senha"), "");
  }

  if (!confirmPasswordInput.value) {
    setFieldError(confirmPasswordInput, document.getElementById("erro-confirmar-senha"), "Confirme sua senha.");
    valido = false;
  } else if (confirmPasswordInput.value !== passwordInput.value) {
    setFieldError(confirmPasswordInput, document.getElementById("erro-confirmar-senha"), "As senhas não coincidem.");
    valido = false;
  } else {
    setFieldError(confirmPasswordInput, document.getElementById("erro-confirmar-senha"), "");
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

  const submitButton = document.getElementById("botao-cadastrar");
  submitButton.disabled = true;
  submitButton.textContent = "Cadastrando...";

  setTimeout(function () {
    showFeedback("Cadastro realizado com sucesso! Redirecionando para o login...", "sucesso");

    window.localStorage.setItem(
      "bibliosys:lastRegisteredUser",
      JSON.stringify({
        nome: nameInput.value.trim(),
        email: emailInput.value.trim(),
        cpf: cpfInput.value,
        dataNascimento: birthdateInput.value,
        telefone: phoneInput.value,
        cadastradoEm: new Date().toISOString(),
      })
    );

    setTimeout(function () {
      window.location.href = "index.html";
    }, 900);
  }, 600);
});

document.getElementById("botao-cancelar-cadastro").addEventListener("click", function () {
  window.location.href = "index.html";
});

fields.forEach(function (item) {
  item.campo.addEventListener("input", function () {
    if (item.campo.getAttribute("aria-invalid") === "true") {
      setFieldError(item.campo, item.erro, "");
    }
  });
});