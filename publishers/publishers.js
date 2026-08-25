const logoutBtn = document.getElementById("botao-sair");
const userName = document.getElementById("nome-usuario");
const userAvatar = document.getElementById("avatar-usuario");

const langBtn = document.getElementById("botao-idioma");
const langList = document.getElementById("lista-idiomas");
const selectedLang = document.getElementById("idioma-selecionado");

const listView = document.getElementById("visao-lista");
const formView = document.getElementById("visao-formulario");
const tableBody = document.getElementById("corpo-tabela-editoras");
const emptyMsg = document.getElementById("tabela-vazia");
const newPublisherBtn = document.getElementById("botao-nova-editora");

const publisherForm = document.getElementById("formulario-editora");
const formTitle = document.getElementById("titulo-formulario-editora");
const feedbackEl = document.getElementById("retorno-editora");
const searchInput = document.getElementById("campo-busca");

const inputs = {
  id: document.getElementById("editora-id"),
  nome: document.getElementById("editora-nome"),
  email: document.getElementById("editora-email"),
  telefone: document.getElementById("editora-telefone"),
  site: document.getElementById("editora-site")
};

const errors = {
  nome: document.getElementById("erro-editora-nome"),
  email: document.getElementById("erro-editora-email"),
  telefone: document.getElementById("erro-editora-telefone")
};

var rawSession = localStorage.getItem("bibliosys:session");
var session = rawSession ? JSON.parse(rawSession) : null;

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

var nextId = 5;
var publishers = [
  { id: 1, nome: "Prentice Hall", email: "contato@prenticehall.com", telefone: "(11) 4000-1000", site: "prenticehall.com" },
  { id: 2, nome: "Pearson", email: "contato@pearson.com", telefone: "(11) 4000-2000", site: "pearson.com" },
  { id: 3, nome: "Addison-Wesley", email: "contato@aw.com", telefone: "(11) 4000-3000", site: "awpub.com" },
  { id: 4, nome: "Wiley", email: "contato@wiley.com", telefone: "(11) 4000-4000", site: "wiley.com" },
];

function toggleView(isForm) {
  listView.hidden = isForm;
  formView.hidden = !isForm;
}

function renderTable() {
  tableBody.innerHTML = "";
  var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  var filteredPublishers = publishers.filter(function (pub) {
    return pub.nome.toLowerCase().includes(query);
  });

  emptyMsg.hidden = filteredPublishers.length > 0;

  filteredPublishers.forEach(function (pub) {
    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${pub.nome}</td>
      <td>${pub.email}</td>
      <td>${pub.telefone}</td>
      <td>${pub.site}</td>
      <td>
        <div class="tabela__acoes">
          <button type="button" class="botao-tabela botao-tabela--editar" data-id="${pub.id}">Editar</button>
          <button type="button" class="botao-tabela botao-tabela--excluir" data-id="${pub.id}">Excluir</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    renderTable();
  });
}

inputs.telefone.addEventListener("input", function (e) {
  var val = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (val.length > 10) {
    e.target.value = val.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (val.length > 2) {
    e.target.value = val.replace(/^(\d{2})(\d{0,4})(\d{0,4})/, "($1) $2-$3");
  }
});

function validateForm() {
  var isValid = true;
  Object.values(errors).forEach(function (err) {
    err.textContent = "";
  });

  if (!inputs.nome.value.trim()) {
    errors.nome.textContent = "Informe o nome da editora.";
    isValid = false;
  }

  var emailVal = inputs.email.value.trim();
  if (!emailVal) {
    errors.email.textContent = "Informe o e-mail.";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(emailVal)) {
    errors.email.textContent = "Informe um e-mail válido.";
    isValid = false;
  }

  if (!inputs.telefone.value.trim()) {
    errors.telefone.textContent = "Informe o telefone.";
    isValid = false;
  }

  return isValid;
}

newPublisherBtn.addEventListener("click", function () {
  publisherForm.reset();
  inputs.id.value = "";
  formTitle.textContent = "Cadastrar Editora";
  feedbackEl.textContent = "";
  Object.values(errors).forEach(function (err) {
    err.textContent = "";
  });
  toggleView(true);
  inputs.nome.focus();
});

tableBody.addEventListener("click", function (e) {
  var btn = e.target.closest("button");
  if (!btn) return;

  var id = Number(btn.dataset.id);

  if (btn.classList.contains("botao-tabela--editar")) {
    var pub = publishers.find(function (p) {
      return p.id === id;
    });
    if (!pub) return;

    inputs.id.value = pub.id;
    inputs.nome.value = pub.nome;
    inputs.email.value = pub.email;
    inputs.telefone.value = pub.telefone;
    inputs.site.value = pub.site;

    formTitle.textContent = "Editar Editora";
    feedbackEl.textContent = "";
    toggleView(true);
    inputs.nome.focus();

  } else if (btn.classList.contains("botao-tabela--excluir")) {
    var pub = publishers.find(function (p) {
      return p.id === id;
    });
    if (pub && confirm('Deseja excluir a editora "' + pub.nome + '"?')) {
      publishers = publishers.filter(function (p) {
        return p.id !== id;
      });
      renderTable();
    }
  }
});

publisherForm.addEventListener("submit", function (e) {
  e.preventDefault();
  feedbackEl.textContent = "";

  if (!validateForm()) {
    feedbackEl.textContent = "Corrija os campos destacados.";
    return;
  }

  var data = {
    nome: inputs.nome.value.trim(),
    email: inputs.email.value.trim(),
    telefone: inputs.telefone.value.trim(),
    site: inputs.site.value.trim()
  };

  var id = inputs.id.value ? Number(inputs.id.value) : null;

  if (id) {
    var index = publishers.findIndex(function (p) {
      return p.id === id;
    });
    if (index !== -1) {
      publishers[index] = Object.assign({ id: id }, data);
    }
  } else {
    publishers.push(Object.assign({ id: nextId++ }, data));
  }

  renderTable();
  toggleView(false);
});

document.getElementById("botao-cancelar-editora").addEventListener("click", function () {
  toggleView(false);
});

renderTable();