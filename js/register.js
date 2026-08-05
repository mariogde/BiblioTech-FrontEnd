const formulario = document.getElementById("formulario-cadastro");
const retorno = document.getElementById("retorno-cadastro");

const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoCpf = document.getElementById("cpf");
const campoDataNascimento = document.getElementById("data-nascimento");
const campoTelefone = document.getElementById("telefone");
const campoSenha = document.getElementById("senha");
const campoConfirmarSenha = document.getElementById("confirmar-senha");

const campos = [
  { campo: campoNome, erro: document.getElementById("erro-nome") },
  { campo: campoEmail, erro: document.getElementById("erro-email") },
  { campo: campoCpf, erro: document.getElementById("erro-cpf") },
  { campo: campoDataNascimento, erro: document.getElementById("erro-data-nascimento") },
  { campo: campoTelefone, erro: document.getElementById("erro-telefone") },
  { campo: campoSenha, erro: document.getElementById("erro-senha") },
  { campo: campoConfirmarSenha, erro: document.getElementById("erro-confirmar-senha") },
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

campoCpf.addEventListener("input", function () {
  campoCpf.value = maskCPF(campoCpf.value);
});

campoTelefone.addEventListener("input", function () {
  campoTelefone.value = maskPhone(campoTelefone.value);
});

function isValidEmail(valor) {
  const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return padrao.test(valor.trim());
}

function isValidCPF(valorBruto) {
  const cpf = valorBruto.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }
  let digitoVerificador1 = (soma * 10) % 11;
  if (digitoVerificador1 === 10) digitoVerificador1 = 0;
  if (digitoVerificador1 !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }
  let digitoVerificador2 = (soma * 10) % 11;
  if (digitoVerificador2 === 10) digitoVerificador2 = 0;
  return digitoVerificador2 === Number(cpf[10]);
}

function isValidPhone(valor) {
  const digitos = valor.replace(/\D/g, "");
  return digitos.length === 10 || digitos.length === 11;
}

function isAdult(valorData) {
  if (!valorData) return false;
  const dataNascimento = new Date(valorData);
  if (Number.isNaN(dataNascimento.getTime()) || dataNascimento > new Date()) return false;

  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const jaFezAniversarioEsteAno =
    hoje.getMonth() > dataNascimento.getMonth() ||
    (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() >= dataNascimento.getDate());
  if (!jaFezAniversarioEsteAno) idade -= 1;

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
  retorno.textContent = mensagem;
  retorno.dataset.state = estado;
}

function clearFeedback() {
  retorno.textContent = "";
  retorno.removeAttribute("data-state");
}

function validate() {
  let valido = true;

  if (!campoNome.value.trim()) {
    setFieldError(campoNome, document.getElementById("erro-nome"), "Informe seu nome completo.");
    valido = false;
  } else if (campoNome.value.trim().split(/\s+/).length < 2) {
    setFieldError(campoNome, document.getElementById("erro-nome"), "Informe nome e sobrenome.");
    valido = false;
  } else {
    setFieldError(campoNome, document.getElementById("erro-nome"), "");
  }

  if (!campoEmail.value.trim()) {
    setFieldError(campoEmail, document.getElementById("erro-email"), "Informe seu e-mail.");
    valido = false;
  } else if (!isValidEmail(campoEmail.value)) {
    setFieldError(campoEmail, document.getElementById("erro-email"), "Informe um e-mail válido.");
    valido = false;
  } else {
    setFieldError(campoEmail, document.getElementById("erro-email"), "");
  }

  if (!campoCpf.value.trim()) {
    setFieldError(campoCpf, document.getElementById("erro-cpf"), "Informe seu CPF.");
    valido = false;
  } else if (!isValidCPF(campoCpf.value)) {
    setFieldError(campoCpf, document.getElementById("erro-cpf"), "CPF inválido.");
    valido = false;
  } else {
    setFieldError(campoCpf, document.getElementById("erro-cpf"), "");
  }

  if (!campoDataNascimento.value) {
    setFieldError(campoDataNascimento, document.getElementById("erro-data-nascimento"), "Informe sua data de nascimento.");
    valido = false;
  } else if (!isAdult(campoDataNascimento.value)) {
    setFieldError(campoDataNascimento, document.getElementById("erro-data-nascimento"), "Data inválida ou idade mínima não atingida.");
    valido = false;
  } else {
    setFieldError(campoDataNascimento, document.getElementById("erro-data-nascimento"), "");
  }

  if (!campoTelefone.value.trim()) {
    setFieldError(campoTelefone, document.getElementById("erro-telefone"), "Informe seu telefone.");
    valido = false;
  } else if (!isValidPhone(campoTelefone.value)) {
    setFieldError(campoTelefone, document.getElementById("erro-telefone"), "Telefone inválido.");
    valido = false;
  } else {
    setFieldError(campoTelefone, document.getElementById("erro-telefone"), "");
  }

  if (!campoSenha.value) {
    setFieldError(campoSenha, document.getElementById("erro-senha"), "Informe uma senha.");
    valido = false;
  } else if (campoSenha.value.length < 6) {
    setFieldError(campoSenha, document.getElementById("erro-senha"), "A senha deve ter ao menos 6 caracteres.");
    valido = false;
  } else {
    setFieldError(campoSenha, document.getElementById("erro-senha"), "");
  }

  if (!campoConfirmarSenha.value) {
    setFieldError(campoConfirmarSenha, document.getElementById("erro-confirmar-senha"), "Confirme sua senha.");
    valido = false;
  } else if (campoConfirmarSenha.value !== campoSenha.value) {
    setFieldError(campoConfirmarSenha, document.getElementById("erro-confirmar-senha"), "As senhas não coincidem.");
    valido = false;
  } else {
    setFieldError(campoConfirmarSenha, document.getElementById("erro-confirmar-senha"), "");
  }

  return valido;
}

formulario.addEventListener("submit", function (event) {
  event.preventDefault();
  clearFeedback();

  if (!validate()) {
    showFeedback("Corrija os campos destacados antes de continuar.", "erro");
    return;
  }

  const botaoEnviar = document.getElementById("botao-cadastrar");
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = "Cadastrando...";

  setTimeout(function () {
    showFeedback("Cadastro realizado com sucesso! Redirecionando para o login...", "sucesso");

    window.localStorage.setItem(
      "bibliosys:lastRegisteredUser",
      JSON.stringify({
        nome: campoNome.value.trim(),
        email: campoEmail.value.trim(),
        cpf: campoCpf.value,
        dataNascimento: campoDataNascimento.value,
        telefone: campoTelefone.value,
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

campos.forEach(function (item) {
  item.campo.addEventListener("input", function () {
    if (item.campo.getAttribute("aria-invalid") === "true") {
      setFieldError(item.campo, item.erro, "");
    }
  });
});