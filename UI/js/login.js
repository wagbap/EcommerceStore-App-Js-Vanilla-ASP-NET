const response = await fetch("https://localhost:44332/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
});


  .then((response.json()=> json))
  .then((data) => {
  if (data.error) {
    console.error(data.message);
    document.querySelector(/* Seletor do elemento HTML */).style.display = "none";
    document.querySelector(".error-message-all").innerText = "Invalid username or password.";
  } else {
    localStorage.setItem("user", JSON.stringify(loginData)); // Armazenar o nome de usuário no armazenamento local
    showLoginStatus(`Logged in as: ${username}`);
    updateLogoutButton(true);
    hideLoginForm();
    scrollToTop(); // Scroll to top after login

  }
})
  .catch((error) => {
    console.error(error.message);
  });
