const logoutButton = document.getElementById("botao-sair");
const userName = document.getElementById("nome-usuario");
const userAvatar = document.getElementById("avatar-usuario");
const profileButton = document.getElementById("botao-perfil");
const languageButton = document.getElementById("botao-idioma");
const languageList = document.getElementById("lista-idiomas");
const selectedLanguage = document.getElementById("idioma-selecionado");

function getSession() {
  try {
    const raw = window.localStorage.getItem("bibliosys:session");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Não foi possível ler a sessão salva:", error);
    return null;
  }
}

function initialsFromEmail(email) {
  const localPart = email.split("@")[0];
  return localPart.slice(0, 2).toUpperCase();
}

const session = getSession();

if (!session) {
  window.location.href = "../index.html";
} else {
  userName.textContent = session.email;
  userAvatar.textContent = initialsFromEmail(session.email);
}

logoutButton.addEventListener("click", function () {
  window.localStorage.removeItem("bibliosys:session");
  window.location.href = "../index.html";
});

profileButton.addEventListener("click", function () {
  console.log("Tela de perfil do usuário ainda não implementada.");
});


function openLanguageList() {
  languageList.hidden = false;
  languageButton.setAttribute("aria-expanded", "true");
}

function closeLanguageList() {
  languageList.hidden = true;
  languageButton.setAttribute("aria-expanded", "false");
}

languageButton.addEventListener("click", function (event) {
  event.stopPropagation();
  if (languageList.hidden) {
    openLanguageList();
  } else {
    closeLanguageList();
  }
});

document.querySelectorAll(".barra-superior__idioma-opcao").forEach(function (option) {
  option.addEventListener("click", function () {
    const language = option.dataset.idioma;
    selectedLanguage.textContent = language;

    document.querySelectorAll(".barra-superior__idioma-opcao").forEach(function (item) {
      item.classList.toggle("barra-superior__idioma-opcao--selecionado", item === option);
    });

    closeLanguageList();
  });
});

document.addEventListener("click", function (event) {
  if (!languageList.hidden && !languageButton.contains(event.target) && !languageList.contains(event.target)) {
    closeLanguageList();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !languageList.hidden) {
    closeLanguageList();
    languageButton.focus();
  }
});