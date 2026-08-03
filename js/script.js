const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const feedback = document.getElementById("login-feedback");

//utilizando regex
function isValidEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim());
}

function setFieldError(input, errorEl, message) {
  if (message) {
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
  } else {
    input.removeAttribute("aria-invalid");
    errorEl.textContent = "";
  }
}

function showFeedback(message, state) {
  feedback.textContent = message;
  feedback.dataset.state = state;
}

function clearFeedback() {
  feedback.textContent = "";
  feedback.removeAttribute("data-state");
}

function validate() {
  let isValid = true;

  const email = emailInput.value.trim();
  if (!email) {
    setFieldError(emailInput, emailError, "Informe seu e-mail.");
    isValid = false;
  } else if (!isValidEmail(email)) {
    setFieldError(emailInput, emailError, "Informe um e-mail válido.");
    isValid = false;
  } else {
    setFieldError(emailInput, emailError, "");
  }

  const password = passwordInput.value.trim();
  if (!password) {
    setFieldError(passwordInput, passwordError, "Informe sua senha.");
    isValid = false;
  } else if (password.length < 8) {
    setFieldError(passwordInput, passwordError, "A senha deve ter ao menos 8 caracteres.");
    isValid = false;
  } else {
    setFieldError(passwordInput, passwordError, "");
  }

  return isValid;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearFeedback();

  if (!validate()) {
    showFeedback("E-mail ou senha incorretos.", "error");
    return;
  }

  const submitButton = form.querySelector(".login-form__submit");
  submitButton.disabled = true;
  submitButton.textContent = "Entrando...";

  setTimeout(function () {
    showFeedback("Login realizado com sucesso! Redirecionando...", "success");

    window.localStorage.setItem(
      "bibliosys:session",
      JSON.stringify({ email: emailInput.value.trim(), loggedInAt: new Date().toISOString() })
    );

    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);
  }, 600);
});

[emailInput, passwordInput].forEach(function (input) {
  input.addEventListener("input", function () {
    if (input.getAttribute("aria-invalid") === "true") {
      const errorEl = input === emailInput ? emailError : passwordError;
      setFieldError(input, errorEl, "");
    }
  });
});
