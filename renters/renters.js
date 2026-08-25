const logoutBtn = document.getElementById("botao-sair");
const userName = document.getElementById("nome-usuario");
const userAvatar = document.getElementById("avatar-usuario");
const profileBtn = document.getElementById("botao-perfil");

const langBtn = document.getElementById("botao-idioma");
const langList = document.getElementById("lista-idiomas");
const selectedLang = document.getElementById("idioma-selecionado");

const tableBody = document.getElementById("corpo-tabela-locatarios");
const emptyMsg = document.getElementById("tabela-vazia");

const rawSession = localStorage.getItem("bibliosys:session");
const session = rawSession ? JSON.parse(rawSession) : null;
const searchInput = document.getElementById("campo-busca");

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
  { id: 1, nome: "Mário Gomes de Sousa Filho", email: "mario.gomes@aluno.ufc.br", cpf: "000.000.000-00", ativo: true },
  { id: 2, nome: "Ana Beatriz Lima", email: "ana.lima@aluno.ufc.br", cpf: "111.111.111-11", ativo: true },
  { id: 3, nome: "Yasmin Lima Costa", email: "yasmin.costa@aluno.ufc.br", cpf: "222.222.222-22", ativo: false }
];

function renderTable() {
  tableBody.innerHTML = "";
  var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  var filteredRenters = renters.filter(function (renter) {
    var matchesName = renter.nome.toLowerCase().includes(query);
    var matchesCpf = renter.cpf.includes(query);
    return matchesName || matchesCpf;
  });

  emptyMsg.hidden = filteredRenters.length > 0;

  filteredRenters.forEach(function (renter) {
    var tr = document.createElement("tr");
    var statusLabel = renter.ativo ? "Ativo" : "Inativo";
    var statusClass = renter.ativo ? "rotulo-status--entregue" : "rotulo-status--alugado";
    var isChecked = renter.ativo ? "checked" : "";

    tr.innerHTML = `
      <td>${renter.nome}</td>
      <td>${renter.email}</td>
      <td>${renter.cpf}</td>
      <td>
        <div class="tabela__status-com-interruptor">
          <span class="rotulo-status ${statusClass}">${statusLabel}</span>
          <label class="interruptor">
            <input type="checkbox" data-id="${renter.id}" ${isChecked} aria-label="Ativar ou desativar ${renter.nome}" />
            <span class="interruptor__trilho"></span>
          </label>
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


tableBody.addEventListener("change", function (e) {
  var checkbox = e.target.closest('input[type="checkbox"][data-id]');
  if (!checkbox) return;

  var id = Number(checkbox.dataset.id);
  var renter = renters.find(function (r) {
    return r.id === id;
  });

  if (renter) {
    renter.ativo = !renter.ativo;
    renderTable();
  }
});

renderTable();  