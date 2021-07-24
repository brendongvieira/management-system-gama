const KEY_BD = "@producttest";

var registerList = {
  lastIdGenerated: 0,
  products: [],
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

//Desenhar a tabela com os novos produtos
function renderTable() {
  const tbody = document.getElementById("bodyList");
  if (tbody) {
    tbody.innerHTML = registerList.products
      .sort((a, b) => {
        return a.name < b.name ? -1 : 1;
      })
      .map((product) => {
        return `<tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.price}</td>
            <td>
            <button onclick='showPage("register", false, ${product.id})'>
            Editar
            </button>
            <button id="red" onclick="askIfDelete(${product.id})">Deletar</button>
            </td>

            </tr>`;
      })
      .join("");
  }
}

//Inserir novo client
function insertProduct(name, quantity, price) {
  const id = registerList.lastIdGenerated + 1;
  registerList.lastIdGenerated = id;
  registerList.products.push({
    id,
    name,
    quantity,
    price,
  });
  storeDB();
  renderTable();
  showPage("list");
}

//Editar um cliente
function editProduct(id, name, quantity, price) {}

//Deletar um cliente
function deleteProduct(id) {
  registerList.products = registerList.products.filter((product) => {
    return product.id != id;
  });
  storeDB();
  renderTable();
}

function askIfDelete(id) {
  if (confirm("Quer deletar o registro de id " + id)) {
    deleteProduct(id);
    renderTable();
  }
}

//Limpar os dados quando for registrar novo cliente
function clearRegister() {
  document.getElementById("name").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("price").value = "";
}

//Mudar de página quando for registrar
function showPage(pagina, newRegister = false, id = null) {
  document.body.setAttribute("page", pagina);
  if (pagina === "register") {
    if (newRegister) clearRegister();
    if (id) {
      const product = registerList.products.find((product) => product.id == id);
      if (product) {
        document.getElementById("id").value = product.id;
        document.getElementById("name").value = product.name;
        document.getElementById("quantity").value = product.quantity;
        document.getElementById("price").value = product.price;
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
    quantity: document.getElementById("quantity").value,
    price: document.getElementById("price").value,
  };
  if (data.id) {
    editProduct(...data);
  } else {
    insertProduct(data.name, data.quantity, data.price);
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
