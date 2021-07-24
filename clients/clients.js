const KEY_BD = "@userstest";

var registerList = {
  lastIdGenerated: 0,
  users: [],
};

// Armazenar dados no localstorage
function storeDB() {
  localStorage.setItem(KEY_BD, JSON.stringify(registerList));
}

// Ler os dados do localstorage
function readDB() {
  const data = localStorage.getItem(KEY_BD);
  if (data) {
    registerList = JSON.parse(data);
  }
  renderTable();
}

//Desenhar a tabela com os novos clientes
function renderTable() {
  const tbody = document.getElementById("bodyList");
  if (tbody) {
    tbody.innerHTML = registerList.users
      .sort((a, b) => {
        return a.name < b.name ? -1 : 1;
      })
      .map((user) => {
        return `<tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td>${user.email}</td>
            <td>${user.city}</td>
            <td>
            <button onclick='showPage("register", false, ${user.id})'>
            Editar
            </button>
            <button id="red" onclick="askIfDelete(${user.id})">Deletar</button>
            </td>

            </tr>`;
      })
      .join("");
  }
}

//Inserir novo client
function insertUser(name, phone, email, city) {
  const id = registerList.lastIdGenerated + 1;
  registerList.lastIdGenerated = id;
  registerList.users.push({
    id,
    name,
    phone,
    email,
    city,
  });
  storeDB();
  renderTable();
  showPage("list");
}

//Editar um cliente
function editUser(id, name, phone, email, city) {
  var user = registerList.users.find((user) => user.id == id);
  user.name = name;
  user.phone = phone;
  user.email = email;
  user.city = city;
  storeDB();
  renderTable();
  showPage("list");
}

//Deletar um cliente
function deleteUser(id) {
  registerList.users = registerList.users.filter((user) => {
    return user.id != id;
  });
  storeDB();
  renderTable();
}

function askIfDelete(id) {
  if (confirm("Quer deletar o registro de id " + id)) {
    deleteUser(id);
    renderTable();
  }
}

//Limpar os dados quando for registrar novo cliente
function clearRegister() {
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("city").value = "";
}

//Mudar de página quando for registrar
function showPage(pagina, newRegister = false, id = null) {
  document.body.setAttribute("page", pagina);
  if (pagina === "register") {
    if (newRegister) clearRegister();
    if (id) {
      const user = registerList.users.find((user) => user.id == id);
      if (user) {
        document.getElementById("id").value = user.id;
        document.getElementById("name").value = user.name;
        document.getElementById("phone").value = user.phone;
        document.getElementById("email").value = user.email;
        document.getElementById("city").value = user.city;
      }
    }
    document.getElementById("name").focus();
  }
}

//Submeter formulário com data
function submitForm(e) {
  e.preventDefault();
  const data = {
    id: document.getElementById("id").value,
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    city: document.getElementById("city").value,
  };
  if (data.id) {
    editUser(...data);
  } else {
    insertUser(data.name, data.phone, data.email, data.city);
  }

  console.log(data);
}

//Carregamento da página
window.addEventListener("load", () => {
  readDB();
  document
    .getElementById("registerArea")
    .addEventListener("submit", submitForm);
});
