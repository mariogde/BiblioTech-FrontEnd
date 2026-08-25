const logoutBtn = document.getElementById("botao-sair");
const userName = document.getElementById("nome-usuario");
const userAvatar = document.getElementById("avatar-usuario");
const profileBtn = document.getElementById("botao-perfil");

const langBtn = document.getElementById("botao-idioma");
const langList = document.getElementById("lista-idiomas");
const selectedLang = document.getElementById("idioma-selecionado");

const listView = document.getElementById("visao-lista");
const formView = document.getElementById("visao-formulario");
const tableBody = document.getElementById("corpo-tabela-alugueis");
const emptyMsg = document.getElementById("tabela-vazia");
const newRentalBtn = document.getElementById("botao-novo-aluguel");

const rentalForm = document.getElementById("formulario-aluguel");
const feedbackEl = document.getElementById("retorno-aluguel");
const searchInput = document.getElementById("campo-busca");

const inputs = {
  locatario: document.getElementById("aluguel-locatario"),
  livro: document.getElementById("aluguel-livro"),
  dataAluguel: document.getElementById("aluguel-data"),
  dataDevolucao: document.getElementById("aluguel-devolucao"),
  status: document.getElementById("aluguel-status")
};

const errors = {
  locatario: document.getElementById("erro-aluguel-locatario"),
  livro: document.getElementById("erro-aluguel-livro"),
  dataAluguel: document.getElementById("erro-aluguel-data"),
  dataDevolucao: document.getElementById("erro-aluguel-devolucao"),
  status: document.getElementById("erro-aluguel-status")
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

var renters = [
  { id: 1, nome: "Mário Gomes" },
  { id: 2, nome: "Ana Beatriz Lima" },
  { id: 3, nome: "Yasmin Lima Costa" }
];

var books = [
  { id: 1, titulo: "Clean Code" },
  { id: 2, titulo: "Estruturas de Dados" },
  { id: 3, titulo: "Design Patterns" },
  { id: 4, titulo: "Compiladores: Princípios" },
  { id: 5, titulo: "Introdução a Algoritmos" },
  { id: 6, titulo: "Sistemas Multiagentes" }
];

var nextId = 4;
var rentals = [
  { id: 1, locatarioId: 1, livroId: 1, dataAluguel: "2026-07-14", devolucaoPrevista: "2026-07-28", status: "Alugado" },
  { id: 2, locatarioId: 2, livroId: 2, dataAluguel: "2026-06-28", devolucaoPrevista: "2026-07-12", status: "Atrasado" },
  { id: 3, locatarioId: 3, livroId: 4, dataAluguel: "2026-06-02", devolucaoPrevista: "2026-06-16", status: "Entregue no prazo" }
];

function populateSelects() {
  renters.forEach(function (r) {
    var opt = document.createElement("option");
    opt.value = r.id;
    opt.textContent = r.nome;
    inputs.locatario.appendChild(opt);
  });

  books.forEach(function (b) {
    var opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = b.titulo;
    inputs.livro.appendChild(opt);
  });
}

function getRenterName(id) {
  var r = renters.find(function (item) { return item.id === id; });
  return r ? r.nome : "—";
}

function getBookTitle(id) {
  var b = books.find(function (item) { return item.id === id; });
  return b ? b.titulo : "—";
}

function formatDate(isoDate) {
  if (!isoDate) return "—";
  var parts = isoDate.split("-");
  return parts[2] + "/" + parts[1];
}

function getBadgeClass(status) {
  if (status === "Atrasado") return "rotulo-status--atrasado";
  if (status === "Entregue no prazo") return "rotulo-status--entregue";
  return "rotulo-status--alugado";
}

function toggleView(isForm) {
  listView.hidden = isForm;
  formView.hidden = !isForm;
}

function renderTable() {
  tableBody.innerHTML = "";
  var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  var filteredRentals = rentals.filter(function (rental) {
    var renterName = getRenterName(rental.locatarioId).toLowerCase();
    var bookTitle = getBookTitle(rental.livroId).toLowerCase();
    return renterName.includes(query) || bookTitle.includes(query);
  });

  emptyMsg.hidden = filteredRentals.length > 0;

  filteredRentals.forEach(function (rental) {
    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${getRenterName(rental.locatarioId)}</td>
      <td>${getBookTitle(rental.livroId)}</td>
      <td>${formatDate(rental.dataAluguel)}</td>
      <td>${formatDate(rental.devolucaoPrevista)}</td>
      <td><span class="rotulo-status ${getBadgeClass(rental.status)}">${rental.status}</span></td>
    `;
    tableBody.appendChild(tr);
  });
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    renderTable();
  });
}

function validateForm() {
  var isValid = true;
  Object.values(errors).forEach(function (err) {
    err.textContent = "";
  });

  if (!inputs.locatario.value) {
    errors.locatario.textContent = "Selecione um locatário.";
    isValid = false;
  }

  if (!inputs.livro.value) {
    errors.livro.textContent = "Selecione um livro.";
    isValid = false;
  }

  if (!inputs.dataAluguel.value) {
    errors.dataAluguel.textContent = "Informe a data do aluguel.";
    isValid = false;
  }

  if (!inputs.dataDevolucao.value) {
    errors.dataDevolucao.textContent = "Informe a devolução prevista.";
    isValid = false;
  } else if (inputs.dataAluguel.value && inputs.dataDevolucao.value < inputs.dataAluguel.value) {
    errors.dataDevolucao.textContent = "Não pode ser antes da data do aluguel.";
    isValid = false;
  }

  if (!inputs.status.value) {
    errors.status.textContent = "Selecione um status.";
    isValid = false;
  }

  return isValid;
}

newRentalBtn.addEventListener("click", function () {
  rentalForm.reset();
  feedbackEl.textContent = "";
  Object.values(errors).forEach(function (err) {
    err.textContent = "";
  });
  toggleView(true);
  inputs.locatario.focus();
});

rentalForm.addEventListener("submit", function (e) {
  e.preventDefault();
  feedbackEl.textContent = "";

  if (!validateForm()) {
    feedbackEl.textContent = "Corrija os campos destacados antes de continuar.";
    return;
  }

  rentals.push({
    id: nextId++,
    locatarioId: Number(inputs.locatario.value),
    livroId: Number(inputs.livro.value),
    dataAluguel: inputs.dataAluguel.value,
    devolucaoPrevista: inputs.dataDevolucao.value,
    status: inputs.status.value
  });

  renderTable();
  toggleView(false);
});

document.getElementById("botao-cancelar-aluguel").addEventListener("click", function () {
  toggleView(false);
});

populateSelects();
renderTable();