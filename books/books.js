const logoutBtn = document.getElementById("botao-sair");
const userName = document.getElementById("nome-usuario");
const userAvatar = document.getElementById("avatar-usuario");
const profileBtn = document.getElementById("botao-perfil");

const langBtn = document.getElementById("botao-idioma");
const langList = document.getElementById("lista-idiomas");
const selectedLang = document.getElementById("idioma-selecionado");

const listView = document.getElementById("visao-lista");
const formView = document.getElementById("visao-formulario");
const tableBody = document.getElementById("corpo-tabela-livros");
const emptyMsg = document.getElementById("tabela-vazia");
const newBookBtn = document.getElementById("botao-novo-livro");

const bookForm = document.getElementById("formulario-livro");
const formTitle = document.getElementById("titulo-formulario-livro");
const feedbackEl = document.getElementById("retorno-livro");
const searchInput = document.getElementById("campo-busca");

const inputs = {
  id: document.getElementById("livro-id"),
  titulo: document.getElementById("livro-titulo"),
  autor: document.getElementById("livro-autor"),
  lancamento: document.getElementById("livro-lancamento"),
  editora: document.getElementById("livro-editora"),
  total: document.getElementById("livro-total"),
  emUso: document.getElementById("livro-em-uso")
};

const errors = {
  titulo: document.getElementById("erro-livro-titulo"),
  autor: document.getElementById("erro-livro-autor"),
  lancamento: document.getElementById("erro-livro-lancamento"),
  editora: document.getElementById("erro-livro-editora"),
  total: document.getElementById("erro-livro-total"),
  emUso: document.getElementById("erro-livro-em-uso")
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

var publishers = [
  { id: 1, nome: "Prentice Hall" },
  { id: 2, nome: "Pearson" },
  { id: 3, nome: "Addison-Wesley" },
  { id: 4, nome: "Wiley" }
];

var nextId = 7;
var books = [
  { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", lancamento: "2008", total: 5, emUso: 2, editoraId: 1 },
  { id: 2, titulo: "Estruturas de Dados", autor: "T. Cormen et al.", lancamento: "2012", total: 3, emUso: 3, editoraId: 2 },
  { id: 3, titulo: "Design Patterns", autor: "Gamma, Helm, Johnson", lancamento: "1994", total: 4, emUso: 2, editoraId: 3 },
  { id: 4, titulo: "Compiladores: Princípios", autor: "Aho, Lam, Sethi", lancamento: "2006", total: 2, emUso: 0, editoraId: 2 },
  { id: 5, titulo: "Introdução a Algoritmos", autor: "T. Cormen", lancamento: "2012", total: 3, emUso: 3, editoraId: 1 },
  { id: 6, titulo: "Sistemas Multiagentes", autor: "Wooldridge", lancamento: "2009", total: 4, emUso: 0, editoraId: 4 }
];

function toggleView(isForm) {
  listView.hidden = isForm;
  formView.hidden = !isForm;
}

function populatePublishers() {
  publishers.forEach(function (pub) {
    var opt = document.createElement("option");
    opt.value = pub.id;
    opt.textContent = pub.nome;
    inputs.editora.appendChild(opt);
  });
}

function getPublisherName(id) {
  var pub = publishers.find(function (p) { return p.id === id; });
  return pub ? pub.nome : "—";
}

function renderTable() {
  tableBody.innerHTML = "";
  var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  var filteredBooks = books.filter(function (book) {
    var matchesTitle = book.titulo.toLowerCase().includes(query);
    var matchesAuthor = book.autor.toLowerCase().includes(query);
    return matchesTitle || matchesAuthor;
  });

  emptyMsg.hidden = filteredBooks.length > 0;

  filteredBooks.forEach(function (book) {
    var tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${book.titulo}</td>
      <td>${book.autor}</td>
      <td>${book.lancamento}</td>
      <td>${book.total}</td>
      <td>${book.emUso}</td>
      <td>${getPublisherName(book.editoraId)}</td>
      <td>
        <div class="tabela__acoes">
          <button type="button" class="botao-tabela botao-tabela--editar" data-id="${book.id}">Editar</button>
          <button type="button" class="botao-tabela botao-tabela--excluir" data-id="${book.id}">Excluir</button>
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

function isValidYear(val) {
  if (!/^\d{4}$/.test(val)) return false;
  var year = Number(val);
  return year >= 1450 && year <= new Date().getFullYear();
}

function validateForm() {
  var isValid = true;
  Object.values(errors).forEach(function (err) {
    err.textContent = "";
  });

  if (!inputs.titulo.value.trim()) {
    errors.titulo.textContent = "Informe o título do livro.";
    isValid = false;
  }

  if (!inputs.autor.value.trim()) {
    errors.autor.textContent = "Informe o autor.";
    isValid = false;
  }

  if (!inputs.lancamento.value.trim()) {
    errors.lancamento.textContent = "Informe o ano de lançamento.";
    isValid = false;
  } else if (!isValidYear(inputs.lancamento.value.trim())) {
    errors.lancamento.textContent = "Informe um ano válido.";
    isValid = false;
  }

  if (!inputs.editora.value) {
    errors.editora.textContent = "Selecione uma editora.";
    isValid = false;
  }

  var total = Number(inputs.total.value);
  if (inputs.total.value === "" || isNaN(total) || total < 0) {
    errors.total.textContent = "Informe a quantidade total.";
    isValid = false;
  }

  var emUso = Number(inputs.emUso.value);
  if (inputs.emUso.value === "" || isNaN(emUso) || emUso < 0) {
    errors.emUso.textContent = "Informe a quantidade em uso.";
    isValid = false;
  } else if (!isNaN(total) && emUso > total) {
    errors.emUso.textContent = "Não pode ser maior que o total.";
    isValid = false;
  }

  return isValid;
}

newBookBtn.addEventListener("click", function () {
  bookForm.reset();
  inputs.id.value = "";
  formTitle.textContent = "Cadastrar Livro";
  feedbackEl.textContent = "";
  Object.values(errors).forEach(function (err) {
    err.textContent = "";
  });
  toggleView(true);
  inputs.titulo.focus();
});

tableBody.addEventListener("click", function (e) {
  var btn = e.target.closest("button");
  if (!btn) return;

  var id = Number(btn.dataset.id);

  if (btn.classList.contains("botao-tabela--editar")) {
    var book = books.find(function (b) { return b.id === id; });
    if (!book) return;

    inputs.id.value = book.id;
    inputs.titulo.value = book.titulo;
    inputs.autor.value = book.autor;
    inputs.lancamento.value = book.lancamento;
    inputs.editora.value = String(book.editoraId);
    inputs.total.value = book.total;
    inputs.emUso.value = book.emUso;

    formTitle.textContent = "Editar Livro";
    feedbackEl.textContent = "";
    toggleView(true);
    inputs.titulo.focus();

  } else if (btn.classList.contains("botao-tabela--excluir")) {
    var book = books.find(function (b) { return b.id === id; });
    if (book && confirm('Tem certeza que deseja excluir o livro "' + book.titulo + '"?')) {
      books = books.filter(function (b) { return b.id !== id; });
      renderTable();
    }
  }
});

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();
  feedbackEl.textContent = "";

  if (!validateForm()) {
    feedbackEl.textContent = "Corrija os campos destacados antes de continuar.";
    return;
  }

  var data = {
    titulo: inputs.titulo.value.trim(),
    autor: inputs.autor.value.trim(),
    lancamento: inputs.lancamento.value.trim(),
    editoraId: Number(inputs.editora.value),
    total: Number(inputs.total.value),
    emUso: Number(inputs.emUso.value)
  };

  var id = inputs.id.value ? Number(inputs.id.value) : null;

  if (id) {
    var index = books.findIndex(function (b) { return b.id === id; });
    if (index !== -1) {
      books[index] = Object.assign({ id: id }, data);
    }
  } else {
    books.push(Object.assign({ id: nextId++ }, data));
  }

  renderTable();
  toggleView(false);
});

document.getElementById("botao-cancelar-livro").addEventListener("click", function () {
  toggleView(false);
});

populatePublishers();
renderTable();