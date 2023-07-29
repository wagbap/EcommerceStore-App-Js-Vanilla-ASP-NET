//Cria o popup para fazer login
function openLoginForm() {
  document.getElementById("myForm").style.display = "block";
  document.getElementById("openLoginFormButton").style.display = "none";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("openLoginFormButton").style.display = "block";
}

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const loginData = { User: username, Password: password };

  try {
    const response = await fetch("https://localhost:44332/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (data.retCode === 1 && data.ds && data.ds.Table && data.ds.Table.length > 0) {
      // Store the username and UtilizadorID in local storage
      const utilizadorID = data.ds.Table[0].UtilizadorID; // <-- define the variable here
      localStorage.setItem("user", username);
      localStorage.setItem("userID", utilizadorID); // <-- use it here

      // Display the user information
      showLoginStatus(`Logged in as: ${username}`);
      updateLogoutButton(true);
      closeForm();
      scrollToTop(); // Scroll to top after login


      // Display the user information
      const tipo = data.ds.Table[0].Tipo;
      alert(`Login Sucessful - UtilizadorID: ${utilizadorID}, Tipo: ${tipo}`);

    } else {
      alert(data.retError); // Display login error message returned by the API
    }

  } catch (error) {
    console.log(error);
    alert("Login failed could not access the endpoint"); // Display login failed message
  }
});

// Atualizar o status de login quando a página é carregada
const user = localStorage.getItem("user");
if (user) {
  showLoginStatus(`Logged in as: ${user}`);
  updateLogoutButton(true);
}

function showLoginStatus(message) {
  const statusElement = document.getElementById('loginStatus');
  statusElement.textContent = message;
}

function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('userID'); // Don't forget to remove the userID as well
  showLoginStatus('Logged out.');
  updateLogoutButton(false);

  showUser(); // Atualiza a interface para mostrar o botão de login e ocultar o botão de logout
  printData()
  scrollToTop();
}

function updateLogoutButton(loggedIn) {
  const logoutButton = document.getElementById('logoutButton');
  const loginButton = document.getElementById('openLoginFormButton');

  if (loggedIn) {
    logoutButton.style.display = 'block';
    loginButton.style.display = 'none';
    localStorage.setItem('loggedIn', 'true');
  } else {
    logoutButton.style.display = 'none';
    loginButton.style.display = 'block';
    localStorage.removeItem('loggedIn');
  }
}

// Verificar o estado de login ao carregar a página
const loggedIn = localStorage.getItem('loggedIn');
if (loggedIn) {
  updateLogoutButton(true);
}

// function to getUserId from localStorage
function getUserId() {
    let user = localStorage.getItem("user");
    if (user) {
        let userObj = JSON.parse(user);
        return userObj[0].id;
    }
    return -1;
}


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

