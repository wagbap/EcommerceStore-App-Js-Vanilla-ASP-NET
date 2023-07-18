// carregar tudo no load da página
addEventListener("load", updateInterface);

// Atualizar a interface ao carregar
async function updateInterface() {
  setInitialData();
  await drawCards();
  drawCart();
  listaCategoria();
  toggleSwitchHandler();
  createFavoritesLs();
  swiperJs();
  verificarAtivoCardInfo();
  drawTop5();
  updateInterface();
  totalCourseSold();
  countSoldCourses();
  // getData(); // Remover essa linha
}

// Função para criar array dos favoritos
function createFavoritesLs() {
  let favorites = JSON.parse(localStorage.getItem("favoritesKey") || "[]");
  // Apenas aqui para não haver bug visual
  localStorage.setItem("favoritesKey", JSON.stringify(favorites));
  return favorites;
}

// Função para criar array para armazenar os cursos vendidos
function createSoldLs() {
  let sold = JSON.parse(localStorage.getItem("soldKey") || "[]");
  return sold;
}

// Função para criar array do carrinho de compras
function createCartLs() {
  let cart = JSON.parse(localStorage.getItem("cartKey") || "[]");
  return cart;
}



// Desenhar os cartões filtrados
async function drawCards() {
  
  const cartItems = createCartLs();
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartItemCountElement = document.getElementById("cartItemCount");
  cartItemCountElement.textContent = cartItemCount;

  let filteredCourses = await searchResults();

  // Limpar todos os cartões
  const container = document.getElementById("container");
  container.innerHTML = "";

  // Determinar o índice inicial e final da página atual
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  // Obter os cartões a serem exibidos na página atual
  const cardsToDisplay = filteredCourses.slice(startIndex, endIndex);

  let currentRow;

  // Desenhar cartões filtrados
  cardsToDisplay.forEach((course, columns) => {
    if (columns % 3 === 0) {
      // Criar uma Row nova cada 3 cartões
      currentRow = document.createElement("div");
      currentRow.className = "row";
      container.appendChild(currentRow);
    }

    // Verificar se o item está nos favoritos
    const favorites = createFavoritesLs();
    const isFavorite = favorites.some((obj) => obj.id === course.ISBN);

    // Obter a quantidade vendida do curso
    const soldCount = countSoldCourses()[course.ISBN];
    const soldText = soldCount ? `${soldCount.quantity} Vendidos` : "";

    currentRow.innerHTML += `
       <div class="four columns">
           <div class="card" id="${course.ISBN}">
               <img src=${course.imagem} class="imagen-curso u-full-width">
               <div class="info-card">
               <div class="button-container">
               <h4>${course.titulo}</h4>
               <i class="heartIcon ${
                 isFavorite ? "fas red-heart" : "far"
               } fa-heart" onclick="updateFavorites(${
      course.ISBN
    }); drawCards();"></i>
               </div>   
               <p>${course.autor}</p>
                   <img src="img/estrelas.png">
                   <p class="preco"> <p>${soldText}</p></p><br>
                   <p class="preco">${course.preco.toString()}€ <span class="u-pull-right ">${course.promocao.toString()}€</span></p>
          
                   <div class="button-container">  
                   <a onclick="event.preventDefault(); addToCart(${
                     course.ISBN
                   }); drawCart();" href="#" class="u-full-width button-primary button input adicionar-carrinho" data-id="1">Carrinho</a>
                 
                   <a onclick="trocarDiv('cardInfo'), listarPorId(${
                     course.ISBN
                   })" href="#" class="button-danger button">Ver <i class="fa-sharp fa-solid fa-plus"></i> </a>
                 </div>
               </div>
           </div> <!--.card-->
       </div>
       `;
  });

  // Atualizar a exibição da paginação
  updatePagination(filteredCourses.length);
}


// Obter resultados de pesquisa
async function searchResults() {
  const searchText = document.getElementById("buscador").value.toLowerCase();
  const searchSelect = document.getElementById("filtroCategoria").value;
  const toggleSwt = document.getElementById("toggleSwitch").checked;
  let favorites = JSON.parse(localStorage.getItem("favoritesKey"));

  const filteredCourses = getData().filter((course) => {
    return (
      (searchText == "" || course.titulo.toLowerCase().includes(searchText)) &&
      (searchSelect == "" || searchSelect == course.categoria) &&
      (toggleSwt == false || favorites.some((obj) => obj.id === course.ISBN))
    );
  });

  return filteredCourses;
}

/////////////////////////// Pesquisar por enter com preventDefault ///////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  let buscador = document.getElementById("buscador");

  if (buscador) {
    buscador.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        drawCards(); // Chama a para executar a pesquisa
      }
    });
  } else {
    console.error("Elemento buscador não encontrado.");
  }
});

////////////////////////////FAVORITOS/////////////////////////////////////////
function updateFavorites(ISBN) {
  let favorites = createFavoritesLs();

  const index = favorites.findIndex((obj) => obj.id === ISBN);

  if (index != -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push({ id: ISBN });
  }

  // Store the updated array in local storage
  localStorage.setItem("favoritesKey", JSON.stringify(favorites));
}

//////////////////////////CARRINHO DE COMPRAS////////////////////////////////////////////////////
//Função para adicionar itens da lista de compras
function addToCart(ISBN) {
  let cart = createCartLs();
  const indexID = cart.findIndex((obj) => obj.id === ISBN);

  if (indexID != -1) {
    cart[indexID].quantity++;
  } else {
    cart.push({ id: ISBN, quantity: 1 });
  }

  // Enviar itens para a lista de compras
  localStorage.setItem("cartKey", JSON.stringify(cart));
  drawCart();
  updateCart();
}

//Função para remover itens da lista de compras
function removeFromCart(ISBN) {
  let cart = createCartLs();
  const indexID = cart.findIndex((obj) => obj.id === ISBN);

  if (indexID != -1) {
    cart.splice(indexID, 1);

    // Enviar itens para a lista de compras
    localStorage.setItem("cartKey", JSON.stringify(cart));
    7;
    drawCart();
  }

  // Obtendo o elemento pelo ID
  let elemento = document.getElementById("finalizar-compraDiv");

  // Obtendo o estilo computado do elemento
  var elemValue = window.getComputedStyle(elemento);

  // Verificando se a classe está ativa
  if (elemValue.display === "none") {
    trocarDiv("landPage");
    console.log("Valor do display none :", elemValue.display);
  } else {
    showCheckout();
  }
  updateCart();
}



// Evento para capturar a adição de um curso ao carrinho
document.addEventListener("addToCartEvent", function (event) {
  const courseId = event.detail.courseId;
  addToCart(courseId);
});

// Evento para capturar a remoção de um curso do carrinho
document.addEventListener("removeFromCartEvent", function (event) {
  const courseId = event.detail.courseId;
  removeFromCart(courseId);
});

//Função para limpar a lista de compras
function clearCart() {
  let cart = [];

  // Enviar itens para a lista de compras
  localStorage.setItem("cartKey", JSON.stringify(cart));

  // Obtendo o elemento pelo ID
  let elemento = document.getElementById("finalizar-compraDiv");

  // Obtendo o estilo computado do elemento
  var elemValue = window.getComputedStyle(elemento);

  // Verificando se a classe está ativa
  if (elemValue.display === "none") {
    trocarDiv("landPage");
    console.log("Valor do display none :", elemValue.display);
  } else {
    showCheckout();
  }
}
// Função para atualizar o carrinho de compras em tempo real
async function updateCart() {
  const cartItems = createCartLs();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartItemCountElement = document.getElementById("cartItemCount");
  cartItemCountElement.textContent = cartItemCount;

  let dbData = JSON.parse(localStorage.getItem("dbKey") || "[]");
  try {
    const response = await fetch('https://localhost:44332/curso', {
      method: 'POST',
      mode: 'cors',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify()
    });

    const apiData = await response.json();
    localStorage.setItem("dbKey", JSON.stringify(apiData));
    dbData = apiData;

    const container = document.getElementById("cartContainer");
    container.innerHTML = "";

    cartItems.forEach((item) => {
      const course = dbData.find((c) => c.ISBN === item.id);
      if (course) {
        container.innerHTML += `
        <tr>
          <td><img id="imgCart" src="img/${course.FotoCapa}" ></td>
          <td>${course.Curso}</td>
          <td>${course.Preço}</td>
          <td><input type="number" value="${item.quantity}" onchange="updateQuantity(this.value, ${course.ISBN}); drawCart();"></td>
          <td><button onclick="removeFromCart(${course.ISBN}); drawCart();">Remove</button></td>
        </tr>
      `;
      }
    });
  } catch (error) {
    console.log('Error fetching data:', error);
    // Handle errors (e.g., show an error message)
  }
}

// Chama a função updateCart para atualizar o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', async function() {
  updateCart();
});


//Função para desenhar a lista de compras
async function drawCart() {
  const cart = createCartLs();

  let cartItems = JSON.parse(localStorage.getItem("cartKey") || "[]");
  try {
    const response = await fetch('https://localhost:44332/curso', {
      method: 'POST',
      mode: 'cors',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify()
    });

    const apiData = await response.json();
    localStorage.setItem("cartKey", JSON.stringify(apiData));
    cartItems = apiData;

    const container = document.getElementById("cartContainer");
    container.innerHTML = "";

    cart.forEach((item) => {
      // Find the course with matching ISBN
      const course = cartItems.find((c) => c.ISBN === item.id);

      if (course) {
        container.innerHTML += `
          <tr>
          <td><img id="imgCart" src="img/${course.FotoCapa}" ></td>
          <td >${course.Curso}</td>
          <td>${course.Preço}€</td>
            <td><input  type="number" value="${item.quantity}" onchange="updateQuantity(this.value, ${course.ISBN}); drawCart();"></td>
            <td><button onclick="removeFromCart(${course.ISBN}); drawCart();">Remove</button></td>
          </tr>
        `;
      }
    });
  } catch (error) {
    console.log('Error fetching data:', error);
    // Handle errors (e.g., show an error message)
  }
}

// Chama a função drawCart para desenhar o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', async function() {
  drawCart();
});

// Função para atualizar a quantidade do item no carrinho
function updateQuantity(input, ISBN) {
  const newQuantity = parseInt(input);
  let cart = createCartLs();

  const indexID = cart.findIndex((obj) => obj.id === ISBN);

  if (indexID != -1) {
    cart[indexID].quantity = newQuantity;
    localStorage.setItem("cartKey", JSON.stringify(cart));

    if (newQuantity <= 0) {
      removeFromCart(ISBN);
    }
    updateCart();
  }

  // Obtendo o elemento pelo ID
  let elemento = document.getElementById("finalizar-compraDiv");

  // Obtendo o estilo computado do elemento
  var elemValue = window.getComputedStyle(elemento);

  // Verificando se a classe está ativa
  if (elemValue.display === "none") {
    trocarDiv("landPage");
    console.log("Valor do display none :", elemValue.display);
  } else {
    showCheckout();
  }
}

/////////////////////////////// Analizar o codigo do carrinho ///////////////////////////////
function showCheckout() {
  const cart = createCartLs();
  const container = document.getElementById("finalizar-compraDiv");

  var totalPrice = 0;

  let html = `
    <br />
    <br />
    <h1>Finalizar Compra</h1>
    <br />
    <div class="container">
      <div class="product-container">
        <table id="lista-carrinho" class="u-full-width">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="cartContainer">`;

  if (cart.length === 0) {
    html = `
    <br />
    <br />
    <h1>Finalizar Compra</h1>
    <br />
      <h1>Não existem itens no seu carrinho</h1>
      <center>
        <a href="index.html"><button class="button-danger">Voltar</button></a>
      </center>
    `;
  } else {
    let ids = [];
    cart.forEach((item) => {
      const course = getData().find((c) => c.ISBN === item.id);

      if (course) {
        html += `
          <tr>
            <td><img src="${course.imagem}" style="width: 45%;"></td>
            <td>${course.titulo}</td>
            <td>${course.promocao}€</td>
            <td><input type="number" value="${item.quantity}" onchange="updateQuantity(this.value, ${course.ISBN}); drawCart(); showCheckout();"></td>
            <td><button onclick="removeFromCart(${course.ISBN}); showCheckout();">Remover</button></td>
          </tr>`;

        if (item.quantity <= 0) {
          removeFromCart(course.ISBN);
        }
        const subtotal = course.promocao * item.quantity;
        totalPrice += subtotal;

        ids[ids.length] = course.ISBN;
      }
    });
    console.log(ids);
    html += `
      </tbody>
      </table>
      
      <h3>Total: ${totalPrice}€</h3>
      <a href="index.html"><button class="button-danger">Voltar</button></a>
      <a href="index.html"><button class=" button-primary " onclick="finishCheckout(${JSON.stringify(
      ids
    )});">Finalizar Compra</button></a>
    `;
  }

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Exibir o div "finalizar-compraDiv" e ocultar os demais elementos
  document.getElementById("finalizar-compraDiv").style.display = "block";
  document.getElementById("homepage").style.display = "none";
  document.getElementById("cardInfo").style.display = "none";
  document.getElementById("product-slide").style.display = "none";
  document.getElementById("rightSideFixed").style.display = "none";
}

// Função para finalizar a compra
function finishCheckout(v) {
  let sold = createSoldLs();
  let cart = createCartLs();

  v.forEach((id) => {
    let indexID = cart.findIndex((obj) => obj.id === id);
    let indexSD = sold.findIndex((obj) => obj.id === id);

    if (indexID !== -1) {
      if (indexSD === -1) {
        sold.push({ id: id, quantity: 0, totalPrice: 0 });
        indexSD = sold.length - 1; // Update indexSD to the newly added object
      }
      sold[indexSD].quantity += cart[indexID].quantity;

      const course = getData().find((c) => c.ISBN === id);
      if (course) {
        const subtotal = course.promocao * cart[indexID].quantity;
        sold[indexSD].totalPrice += subtotal; // Update totalPrice in sold object
      }
    }
  });

  localStorage.setItem("soldKey", JSON.stringify(sold));

  clearCart();
}

/////////////////////////// Filtrar por categorias ///////////////////////////
// listar as categorias do curso
function listaCategoria() {
  const catgSelect = document.getElementById("filtroCategoria");

  catgSelect.innerHTML = "";

  // Adicionar a opção padrão
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Selecionar";
  catgSelect.appendChild(defaultOption);

  // Obter todos as categorias únicos da base de dados
  const filtrarUnico = [
    ...new Set(getData().map((course) => course.categoria)),
  ];

  // Criar uma opção para cada categoria e adicioná-las ao campo de seleção
  filtrarUnico.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    catgSelect.appendChild(option);
  });
}

//////////////////////////////////////////PAGINAÇÃO//////////////////////////////////////////////
// Variáveis globais para controle da paginação
let currentPage = 1;
let cardsPerPage = 9;
let totalCards = getData().length; // Default value

// Ir para a primeira página
function goToPage1() {
  currentPage = 1;
  drawCards();
  updatePagination(totalCards);
}

// Função para atualizar a exibição da paginação
// Função para criar botões de página com seta
function createPageButton(pageNumber, isArrow) {
  const pageButton = document.createElement("button");

  if (isArrow) {
    const arrowElement = document.createElement("i");
    arrowElement.classList.add("fa-solid", "fa-arrow-right");

    if (pageNumber === "Previous") {
      arrowElement.classList.add("prev");
    } else if (pageNumber === "Next") {
      arrowElement.classList.add("next");
    }

    pageButton.appendChild(arrowElement);
  } else {
    pageButton.textContent = pageNumber;
  }

  pageButton.classList.add("page-button");

  if (pageNumber === currentPage) {
    pageButton.classList.add("active");
  }

  return pageButton;
}

// Função para atualizar a exibição da paginação
function updatePagination(totalCards) {
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Botão "Previous"
  if (currentPage > 1) {
    const prevButton = createPageButton("", true);
    prevButton.innerHTML = "<i class='fa-solid fa-arrow-left'></i>";
    prevButton.addEventListener("click", function () {
      currentPage--;
      drawCards();
      updatePagination(totalCards);
    });
    pagination.appendChild(prevButton);
  }

  // Criação dos botões de paginação
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createPageButton(i, false);
    pageButton.addEventListener("click", function () {
      currentPage = i;
      drawCards();
      updatePagination(totalCards);
    });
    pagination.appendChild(pageButton);
  }

  // Botão "Next"
  if (currentPage < totalPages) {
    const nextButton = createPageButton("", true);
    nextButton.innerHTML = "<i class='fa-solid fa-arrow-right'></i>";
    nextButton.addEventListener("click", function () {
      currentPage++;
      drawCards();
      updatePagination(totalCards);
    });
    pagination.appendChild(nextButton);
  }
}

// Função para atualizar o número de cards por página
function updateCardsPerPage(value) {
  cardsPerPage = parseInt(value);
  currentPage = 1; // Reset the current page to the first page
  drawCards();
  updatePagination(totalCards);
}

// Example code for changing the cards per page
function changeCardsPerPage() {
  const select = document.getElementById("selectCardsPerPage");
  const selectedValue = select.value;
  cardsPerPage = parseInt(selectedValue);
  currentPage = 1;
  drawCards();
  updatePagination(totalCards);
}


//////////////////////////////////////////////Listar por Id/////////////////////////////////////////

//trocar os divs
function trocarDiv(show) {
  document.querySelectorAll(".hide").forEach((y) => (y.style.display = "none"));

  document.getElementById(show).style.display = "block";

  if (show == "cardInfo") {
    document.getElementById("product-slide").style.display = "block";
  }
}

// listar por Id
async function listarPorId(idTst) {
  const filteredCourses = getData().filter((course) => {
    return idTst == "" || course.ISBN == idTst;
  });

  verificarAtivoCardInfo();
  const container = document.getElementById("cardInfo");
  container.innerHTML = "";

  filteredCourses.forEach((course) => {
    container.innerHTML += `
    <br />
    <br />
    <div class="container">
    <h1>Detalhes do Curso</h1>
      <div class="product-container">
        <div class="product-image">
            <img src=${course.imagem} alt="Product Image">
        </div>
        
        <div class="product-details">
            <h4>${course.titulo}</h4>
            <p class="price">${course.preco.toString()}€</p>
            <p class="description">Neste curso, você aprenderá os fundamentos da culinária vegetariana,
                desde a seleção e preparação dos ingredientes até a criação de pratos equilibrados e 
                cheios de sabor. Nossos especialistas em culinária vegetariana compartilharão dicas e
                  truques valiosos, além de receitas exclusivas que irão inspirá-lo a explorar uma 
                  variedade de ingredientes frescos e nutritivos.</p>
            <div class="quantity">
                <label for="quantity">Author: ${course.autor}</label>
            </div>
            <br />
            <a href="#"><button onclick="trocarDiv('landPage'); verificarAtivoCardInfo();" class="button-danger">Voltar</button></a>

            <button onclick="event.preventDefault(); addToCart(${course.ISBN
      }); drawCart();" class=" button-primary button input adicionar-carrinho">
              Adicionar ao Carrinho
            </button>
        </div>
         <h3>Produtos Relacionados</h3>
      </div>                                      
    </div>
  `;
  });

  listarSlide(idTst);

  // Inicializar o Swiper
  swiperJs();
}
//////////////////////////////////////////////Swiper slider por Categoria/////////////////////////////////////////
// desenhar slide
async function listarSlide(idTst) {
  const selectedCourse = await getData().find((course) => course.ISBN == idTst);

  if (selectedCourse) {
    const filteredCourses = getData().filter(
      (course) => course.categoria == selectedCourse.categoria
    );

    const slideProd = document.getElementById("product-slide");
    slideProd.innerHTML = "";

    if (filteredCourses.length > 0) {
      const soldCourses = countSoldCourses(); // Obter a contagem de cursos vendidos
      const swiperSlides = filteredCourses.map((course) => {
        // Verificar se o ID do curso é igual ao ID selecionado
        if (course.ISBN == idTst) {
          return ""; // Pular o curso, não incluir no slide
        }

        // Obter a quantidade vendida do curso
        const soldCount = soldCourses[course.ISBN];
        const soldText = soldCount ? `${soldCount.quantity} Vendidos` : "";

        return `
      <div class="swiper-slide">
        <div class="card" id="${course.ISBN}">
          <img src=${course.imagem} class="imagen-curso u-full-width">
          <div class="info-card">
            <div class="button-container">
              <h4>${course.titulo}</h4>
            </div>   
       
            <p>${course.autor}</p>
            <img src="img/estrelas.png" style="width: 80px;">
             <p class="preco"> <p>${soldText}</p></p><br>
            <p class="preco"> <span class="u-pull-right">${course.promocao}€</span></p>
            <div class="button-container">  
              <a onclick="event.preventDefault(); addToCart(${course.ISBN}); drawCart();" href="#" class="u-full-width button-primary button input adicionar-carrinho" data-id="1"><i class="fa-solid fa-cart-plus"></i></a>
              <a onclick="trocarDiv('cardInfo', 'swiperSlide'), listarPorId(${course.ISBN})"  class="button-danger button"><i class="fa-sharp fa-solid fa-plus"></i> </a>
            </div>
          </div>
        </div>
      </div>
    `;
      });
      slideProd.innerHTML += `
    <br />
    <div class="container">
      <div class="product-container">
        <div class="swiper mySwiper">
          <div class="swiper-wrapper">
            ${swiperSlides.join("")}
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
  `;
    } else {
      slideProd.innerHTML = "Nenhum curso encontrado com a mesma categoria.";
    }
    // Inicializar o Swiper
    swiperJs();
  } else {
    slideProd.innerHTML = "Nenhum curso encontrado com a mesma categoria.";
  }
}

//////////////////////// finalizar o pagamento ///////////////////////////////

// Função para obter os cursos vendidos do LocalStorage
function getCursosVendidos() {
  const sold = JSON.parse(localStorage.getItem("soldKey") || "[]");
  return sold;
}

//////////////////////////5 CURSOS MAIS VENDIDOS//////////////////////////////

//Função para desenhar cursos mais vendidos
function drawTop5() {
  let sold5 = createSoldLs();
  const container = document.getElementById("rightSideFixed");
  container.innerHTML = "";

  //verificar top 5 mais vendido
  sold5.sort((a, b) => b.quantity - a.quantity);

  const topFiveSoldCourses = sold5.slice(0, 5);

  html = `<h2>Top 5 Cursos Mais Vendidos</h2>
  <ul class="book-list">`;

  topFiveSoldCourses.forEach((sold) => {
    // Find the course with matching ISBN
    const course = getData().find((c) => c.ISBN === sold.id);

    if (course) {
      html += `
      <li class="book-item">
                <img src="${course.imagem}">
                <div class="book-details">
                  <p class="book-title">${course.titulo}</p>
                  <img src="img/estrelas.png" style="width: 80px; margin-top: 12px">
                  <p class="book-author">${course.autor}</p>
                  <div class="buttonSidebySide">  
                    <a onclick="event.preventDefault(); addToCart(${course.ISBN}); drawCart();"class="addTocart" data-id="1"><i class="fa-solid fa-cart-plus"></i></a>
                    <a onclick="trocarDiv('cardInfo'), listarPorId(${course.ISBN})"class="verMais"><i class="fa-sharp fa-solid fa-plus"></i> </a>
                  </div>
                </div>
              </li>
      `;
    }
  });

  html += `
  </ul>
      
  `;

  container.innerHTML = html;
}

function countSoldCourses() {
  const soldCourses = JSON.parse(localStorage.getItem("soldKey")) || [];
  const soldCount = {};

  soldCourses.forEach((item) => {
    const course = getData().find((c) => c.ISBN === item.id);
    if (course) {
      if (!soldCount[course.ISBN]) {
        soldCount[course.ISBN] = {
          course: course,
          quantity: 0,
        };
      }
      soldCount[course.ISBN].quantity += item.quantity;
    }
  });

  return soldCount;
}

//Cria o popup para fazer login
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
