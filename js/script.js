const formulario = document.getElementById("formulario-login");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const erroEmail = document.getElementById("erro-email");
const erroSenha = document.getElementById("erro-senha");
const retorno = document.getElementById("retorno-login");

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

  const email = campoEmail.value;
  if (!email.trim()) {
    setFieldError(campoEmail, erroEmail, "Informe seu e-mail.");
    valido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    setFieldError(campoEmail, erroEmail, "Informe um e-mail válido.");
    valido = false;
  } else {
    setFieldError(campoEmail, erroEmail, "");
  }

  const senha = campoSenha.value;
  if (!senha.trim()) {
    setFieldError(campoSenha, erroSenha, "Informe sua senha.");
    valido = false;
  } else if (senha.trim().length < 6) {
    setFieldError(campoSenha, erroSenha, "A senha deve ter ao menos 6 caracteres.");
    valido = false;
  } else {
    setFieldError(campoSenha, erroSenha, "");
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

  const botaoEnviar = document.getElementById("botao-entrar");
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = "Entrando...";

  setTimeout(function () {
    showFeedback("Login realizado com sucesso! Redirecionando...", "sucesso");

    // TODO: substituir por integração real com o backend quando disponível.
    window.localStorage.setItem("bibliosys:session", JSON.stringify({
      email: campoEmail.value.trim(),
      loggedInAt: new Date().toISOString(),
    }));

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);
  }, 600);
});

[campoEmail, campoSenha].forEach(function (campo) {
  campo.addEventListener("input", function () {
    if (campo.getAttribute("aria-invalid") === "true") {
      const elementoErro = campo === campoEmail ? erroEmail : erroSenha;
      setFieldError(campo, elementoErro, "");
    }
  });
});