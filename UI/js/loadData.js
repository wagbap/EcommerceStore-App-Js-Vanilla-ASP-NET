/* iniDATA */
onload = iniData;

async function iniData() {
    getUserId()
    await getCart();
    await listCategory();
    await printData();
    await printCart();
    await drawTop5();
    showUser();
    toggleSwitchHandler();
    swiperJs();
    verificarAtivoCardInfo();
}



/* ---------------------------- */

/* APIs */

async function getAPI(url, data = null) {
    let apiUrl = "http://localhost:44332/" + url;
    
    if (data !== null) {
        apiUrl += data;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            mode: 'cors'
        });

        const result = await response.json();
        if (result === null) return [];
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // Retorna uma resposta vazia em caso de erro
    }
}



async function postAPI(url, objData) {
    const response = await fetch("http://localhost:44332/" + url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objData), // Verifique esta linha
    });

    const data = await response.json();
    return data;
}

/* ---------------------------- */


/* Get Cursos */
async function getData() {
    let allData = await getAPI("Cursos");
    return allData;
}
/* ---------------------------------- */

async function printData() {
    const cartItems = await getCart();
    const cartItemCount = cartItems.reduce(
        (total, item) => total + parseInt(item.Quantidade),
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
  let favorites = await getFav();
  // Desenhar cartões filtrados
  cardsToDisplay.forEach((course, columns) => {
    if (columns % 3 === 0) {
      // Criar uma Row nova cada 3 cartões
      currentRow = document.createElement("div");
      currentRow.className = "row";
      container.appendChild(currentRow);
    }

    // Verificar se o item está nos favoritos
     
    const isFavorite = favorites.some((obj) => obj.ISBN === course.ISBN);

    currentRow.innerHTML += `
       <div class="four columns">
           <div class="card" id="${course.ISBN}">
           <img src="img/${course.FotoCapa}" class="imagen-curso u-full-width">
               <div class="info-card">
               <div class="button-container">
               <h4>${course.Curso}</h4>
               <i class="heartIcon ${
                isFavorite ? "fas red-heart" : "far"
              } fa-heart" onclick="updateFavorites(${
     course.ISBN
   }); printData();"></i>
               </div>   
               <p>${course.Autor}</p>
                   <img src="img/estrelas.png">
                   <p class="preco">${course.Preço.toString()}€ <span class="u-pull-right ">${course.Percentagem.toString()}€</span></p>
          
                   <div class="button-container">  
                   <a onclick="addToCart(${course.ISBN}, 'new')" class="u-full-width button-primary button input adicionar-carrinho">Carrinho</a>
                 
                   <a onclick="trocarDiv('cardInfo'), listarPorId(${
                     course.ISBN
                   })" href="#" class="button-danger button">Ver <i class="fa-sharp fa-solid fa-plus"></i> </a>
                 </div>
               </div>
           </div> <!--.card-->
       </div>
       `;
  });

}

/* FILTRO  */
// Implement search functionality
async function searchResults() {
    try {
      const searchText = document.getElementById("buscador").value.toLowerCase();
      const searchSelect = document.getElementById("filtroCategoria").value;
      const toggleSwt = document.getElementById("toggleSwitch").checked;
      let favorites = await getFav();
      let allData = await getData();
      const filteredCourses = allData.filter((course) => {
        return (
          (searchText == "" || course.titulo.toLowerCase().includes(searchText)) &&
          (searchSelect == "" || searchSelect == course.categoria) &&
          (toggleSwt == false || favorites.some((obj) => obj.ISBN === course.ISBN))
        );
      });
  
      return filteredCourses;
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; // Retorna um array vazio para evitar mais erros em caso de falha
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let buscador = document.getElementById("buscador");
  
    if (buscador) {
      buscador.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          printData(); // Chama a para executar a pesquisa
        }
      });
    } else {
      console.error("Elemento buscador não encontrado.");
    }
});

/* ------------------------------ */

async function listCategory() {
    const catgSelect = document.getElementById("filtroCategoria");
    const allData = await getData();    
    catgSelect.innerHTML = "";
  
    // Adicionar a opção padrão
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecionar";
    catgSelect.appendChild(defaultOption);
  
    // Obter todos as categorias únicos da base de dados
    const filtrarUnico = [
      ...new Set(allData.map((course) => course.categoria)),
    ];
  
    // Criar uma opção para cada categoria e adicioná-las ao campo de seleção
    filtrarUnico.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = categoria;
      catgSelect.appendChild(option);
    });
  }

/* ---------------------------- */

/*lista carinho com API */
async function getCart() {
    let gUser = getUserId();
    if (gUser === null) return alert("Não está logado");
    let userID = "?Cliente_id=" + gUser.toString();
    let cart = await getAPI("GetCarinho", userID);
    if (cart === null) cart = [];
    return cart;
}

async function printCart() {

    const cartItems = await getCart();
    const cartItemCount = cartItems.reduce(
        (total, item) => total + parseInt(item.Quantidade),
        0
    );
    const cartItemCountElement = document.getElementById("cartItemCount");
    cartItemCountElement.textContent = cartItemCount;

    let carDiv = document.getElementById("listCart");
    carDiv.innerHTML = "";
    let cartData = await getCart();
    let allData = await getData();
    console.log(cartData);

    let cartItem = "";

    for (let i = 0; i < cartData.length; i++) {
        let cart = cartData[i];
        let matchingData = allData.find(data => data.ISBN === cart.ISBN);

        if (matchingData) {
            // Use the 'matchingData' object to display the cart item
            cartItem += `
            <tr id="${matchingData.ISBN}">
                <td><img width="80px" src=${matchingData.FotoCapa} alt="Product Image" class="product-image"></td>
                <td>${matchingData.titulo}</td>
                <td>${matchingData.preco.toString()}€</td>
                <td >
                    <a class="remove-product" onclick="addToCart(${matchingData.ISBN}, 'decrementar')">- </a>
                    <span class="quantity">${cart.Quantidade}</span>
                    <a class="remove-product" onclick="addToCart(${matchingData.ISBN}, 'incrementar')"> +</a>
                </td>
                <td><a onclick="removellFromCart(${matchingData.ISBN})" class="remove-product">Remove</a></td>
            </tr>
            `;
        }
    }
    carDiv.innerHTML += cartItem;
}

async function addToCart(isbn, tipo = null) {
    let cart = await getCart();
    let matchingCartIndex = cart.findIndex((cartItem) => cartItem.ISBN === isbn);
    let gUser = getUserId();
    if (gUser === null) return alert("Não está logado");

    let cartItem = {
        UserID: gUser.toString(),
        ISBN: isbn.toString(),
        Quantidade: 1, // Define o valor padrão da quantidade como 1
        Total: 0
    };

    if (matchingCartIndex !== -1) {
        if (tipo === "incrementar") {
            cartItem.Quantidade = cart[matchingCartIndex].Quantidade + 1;
        } else if (tipo === "decrementar") {
            cartItem.Quantidade = cart[matchingCartIndex].Quantidade - 1;
        }else if (tipo === "new") {
            cartItem.Quantidade = cart[matchingCartIndex].Quantidade + 1;
        }else if (tipo === "incrementar" && cart[matchingCartIndex].Quantidade === 0 || tipo === "decrementar" && cart[matchingCartIndex].Quantidade === 0) {
            removellFromCart(isbn);
        }
    } else {
        // O item não existe no carrinho, adicione-o com quantidade 1
        cart.push(cartItem);
    }

    await postAPI("SetCarinho", cartItem);

    // Atualize a exibição do carrinho
    printCart();
}


async function removellFromCart(isbn) {
    let cart = await getCart();
    let matchingCartIndex = cart.findIndex((cartItem) => cartItem.ISBN === isbn);
    let gUser = getUserId();
    if (gUser === null) return alert("Não está logado");

    let cartItem = {
        UserID: gUser.toString(),
        ISBN: isbn.toString(),
        Quantidade: 0, // Define o valor padrão da quantidade como 1
        Total: 1450
    };
    if (matchingCartIndex !== -1) {
        // O item já existe no carrinho
        cart.splice(matchingCartIndex, 1); // Remove o item do carrinho
    }
    await postAPI("SetCarinho", cartItem);
    // Atualize a exibição do carrinho
    printCart();
    loadCartData();
}

async function clearCart(){
    let gUser = getUserId();
    if (gUser === null) return alert("Não está logado");
    let UserID = "?user=" + gUser.toString();
    await getAPI("ClearCart", UserID);
    // Atualize a exibição do carrinho
    printCart();
    loadCartData();
}



async function finalizar() {
    let gUser = getUserId();
    if (gUser === null) return alert("Não está logado");
    let userID = "?userID=" + gUser.toString();
    let result = await getAPI("Finalizar", userID);
    if (result == 1){
        printCart();
        printData();
        drawTop5();
        alert("Compra finalizada com sucesso!");
    }else{
        alert("Erro ao finalizar a compra!");
    }
}

/* ---------------------------- */

/* Favoritos */
async function getFav() {
    let gUser = getUserId();
    if (gUser === null) return alert("Não está logado");
    let userID = "?Cliente_id=" + gUser.toString();
    let fav = await getAPI("GetFavoritos", userID);
    if (fav === null) fav = [];
    return fav;
}

async function updateFavorites(isbn) {
    let fav = await getFav();
    let matchingFavIndex = fav.findIndex((favItem) => favItem.ISBN === isbn);
    let gUser = getUserId();
    if (gUser === null) return alert("Não está logado");

    let favItem = {
        UserID: gUser.toString(),
        ISBN: isbn.toString()
    };

    if (matchingFavIndex !== -1) {
        // O item já existe nos favoritos
        fav.splice(matchingFavIndex, 1); // Remove o item dos favoritos
    } else {
        // O item não existe nos favoritos, adicione-o
        fav.push(favItem);
    }

    await postAPI("SetFavoritos", favItem);

    // Atualize a exibição dos favoritos
    printData();
}

/* TOP 5 */

//Função para desenhar cursos mais vendidos

async function getSold() {
    let sold = await getAPI("GetSolds");
    if (sold === null) sold = [];
    return sold;
}

async function drawTop5() {
    let sold5 = await getSold();
    let allData = await getData();
    const container = document.getElementById("rightSideFixed");
    container.innerHTML = "";
  
    //verificar top 5 mais vendido
    sold5.sort((a, b) => b.quantity - a.quantity);
  
    const topFiveSoldCourses = sold5.slice(0, 5);
  
    html = `<h2>Top 5 Cursos Mais Vendidos</h2>
    <ul class="book-list">`;
  
    topFiveSoldCourses.forEach((sold) => {
      // Find the course with matching ISBN
      const course = allData.find((c) => c.ISBN === sold.ISBN);
  
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

/* PAGINAção */

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
function updatePagination(totalCards) {
  const totalPages = Math.ceil(totalCards / cardsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

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

// Função auxiliar para criar botões de páginação
function createPageButton(text) {
  const pageButton = document.createElement("span");
  pageButton.textContent = text;
  pageButton.classList.add("page-button");
  return pageButton;
}



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
  const allData = await getData();
  const filteredCourses = allData.filter((course) => {
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

            <button onclick="event.preventDefault(); addToCart(${course.ISBN}, 'new'); printCart();" class=" button-primary button input adicionar-carrinho">
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
  const allData = await getData();
  const selectedCourse = await allData.find((course) => course.ISBN == idTst);
  
  if (selectedCourse) {
  const filteredCourses = allData.filter(
  (course) => course.categoria == selectedCourse.categoria
  );

  const slideProd = document.getElementById("product-slide");
slideProd.innerHTML = "";

if (filteredCourses.length > 0) { // Obter a contagem de cursos vendidos
  const swiperSlides = filteredCourses.map((course) => {
    // Verificar se o ID do curso é igual ao ID selecionado
    if (course.ISBN == idTst) {
      return ""; // Pular o curso, não incluir no slide
    }

    // Obter a quantidade vendida do curso
    /* const soldCount = soldCourses[course.ISBN];
    const soldText = soldCount ? `${soldCount.quantity} Vendidos` : ""; */

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

  function verificarAtivoCardInfo() {
    let cardInfoElement = document.getElementById("cardInfo");
    let asideElement = document.getElementById("rightSideFixed");
  
    if (cardInfoElement) {
      var cardInfoStyles = window.getComputedStyle(cardInfoElement);
      var isCardInfoVisible = cardInfoStyles.display === "block";
  
      if (window.innerWidth >= 1800 && !isCardInfoVisible) {
        asideElement.style.display = "block";
      } else {
        asideElement.style.display = "none";
      }
    }
  }
  
  function handleWindowResize() {
    verificarAtivoCardInfo();
  }
  
  window.addEventListener("load", handleWindowResize);
  window.addEventListener("resize", handleWindowResize);