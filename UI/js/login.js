//Cria o popup para fazer login
function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

async function updateCart() {
  let gUser = getUserId();
  if (gUser === -1) { return; }

  // Get the current cart from the server
  const cart = await getCart();

  // Update the cart display
  printCart(cart);
  
  // Update the data display
  await printData();
}

// Evento de envio do formulário de login
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    let userLogin = document.getElementById("username").value;
    let pwd = document.getElementById("password").value;
    let user = {
      User: userLogin,
      Password: pwd
    };
  
    // Fazer a chamada à API e obter o resultado
    let result = await postAPI("Login", user);
  
    
    if (result && result.retCode === 1) {
      // Se o login for bem-sucedido, guardar os dados no localStorage
      localStorage.setItem("user", JSON.stringify(result.ds.Table));
      showUser();
      updateCart();
      closeForm();
      scrollToTop();
    } else {
      alert("Login falhado");
    }
  });

  function showUser() {
    let user = localStorage.getItem("user");
    if (user) {
        let userObj = JSON.parse(user);
        document.getElementById("logado").innerHTML = userObj[0].PrimeiroNome;
        document.getElementById("logout").style.display = "block";
        document.getElementById("login").style.display = "none";
    } else {
        document.getElementById("logado").innerHTML = "";
        document.getElementById("logout").style.display = "none";
        document.getElementById("login").style.display = "block";
    }
}

// Função para fazer logout
function logout() {
    localStorage.removeItem("user");
    showUser(); // Atualiza a interface para mostrar o botão de login e ocultar o botão de logout
    printData();
    scrollToTop();
}

// function to getUserId from localStorage
function getUserId() {
    let user = localStorage.getItem("user");
    if (user) {
        let userObj = JSON.parse(user);
        return userObj[0].UtilizadorID;
    }
    return -1;
}