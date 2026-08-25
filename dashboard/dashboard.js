const logoutBtn = document.getElementById("botao-sair");
const userName = document.getElementById("nome-usuario");
const userAvatar = document.getElementById("avatar-usuario");
const profileBtn = document.getElementById("botao-perfil");

const langBtn = document.getElementById("botao-idioma");
const langList = document.getElementById("lista-idiomas");
const selectedLang = document.getElementById("idioma-selecionado");

const rawSession = localStorage.getItem("bibliosys:session");
const session = rawSession ? JSON.parse(rawSession) : null;

if (!session) {
  window.location.href = "../index.html";
} else {
  userName.textContent = session.email;
  userAvatar.textContent = session.email.slice(0, 2).toUpperCase();
}

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("bibliosys:session");
  window.location.href = "../index.html";
});

profileBtn.addEventListener("click", function () {
  console.log("Tela de perfil ainda não implementada.");
});


langBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  langList.hidden = !langList.hidden;
});

document.querySelectorAll(".barra-superior__idioma-opcao").forEach(function (opt) {
  opt.addEventListener("click", function () {
    selectedLang.textContent = opt.dataset.idioma;
    langList.hidden = true;
  });
});

document.addEventListener("click", function (e) {
  if (!langList.contains(e.target) && e.target !== langBtn) {
    langList.hidden = true;
  }
});