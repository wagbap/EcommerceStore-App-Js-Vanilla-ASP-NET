/* iniDATA */
onload = iniData;

async function iniData() {
    getUserId();
    await getCart();
    await listCategory();
    await printData();  
    await updateCart();
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
    let apiUrl = "https://localhost:44332/" + url;
    
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
    const response = await fetch("https://localhost:44332/" + url, {
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

  const soldCourses = await countSoldCourses();
  
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

    // Obter a quantidade vendida do curso
		const soldCount = soldCourses[course.ISBN];
		const soldText = soldCount ? `${soldCount.quantity} Vendidos` : "";


    currentRow.innerHTML += `
       <div class="four columns">
           <div class="card" id="${course.ISBN}">
           <img src="img/${course.FotoCapa}" class="imagen-curso u-full-width">
               <div class="info-card">
               <div class="button-container">
               <h4>${course.Curso}</h4>
               <i class="heartIcon ${isFavorite?"fas red-heart":"far"} fa-heart" onclick="updateFavorites(${course.ISBN}); printData(); "></i>
               </div>   
               <p>${course.Autor}</p>
                   <img src="img/estrelas.png">
                   <p class="preco"> <p>${soldText}</p><br>
                   <p class="preco">${course.Preço.toString()}€ <span class="u-pull-right ">${course.Percentagem.toString()}€</span></p>
          
                   <div class="button-container">  
                   <a onclick="addToCart(${course.ISBN}, 'new')" class="u-full-width button-primary button input adicionar-carrinho">Carrinho</a>
                 
                   <a onclick="trocarDiv('cardInfo'), listarPorId(${course.ISBN})" href="#" class="button-danger button">Ver<i class="fa-sharp fa-solid fa-plus"></i> </a>
                 </div>
               </div>
           </div> <!--.card-->
       </div>
       `;
  });

  
	// Atualizar a exibição da paginação
	updatePagination(filteredCourses.length);

}
/* Favoritos */
async function getFav() {
  let gUser = getUserId();
  let userID = "?Cliente_id=" + gUser.toString();
  let fav = await getAPI("GetFavoritos", userID);
  if (fav === null) fav = [];
  return fav;
}

async function updateFavorites(isbn) {
  let fav = await getFav();
  let matchingFavIndex = fav.findIndex((favItem) => favItem.ISBN === isbn);
  let gUser = getUserId(); 
  if (gUser === -1) return alert("Não está logado");
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
          (searchText == "" || course.Curso.toLowerCase().includes(searchText)) &&
          (searchSelect == "" || searchSelect == course.Categoria) &&
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


/////////////////////////// Filtrar por categorias ///////////////////////////
// listar as categorias do curso
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
      ...new Set(allData.map((course) => course.Categoria)),
    ];
  
    // Criar uma opção para cada categoria e adicioná-las ao campo de seleção
    filtrarUnico.forEach((Categoria) => {
      const option = document.createElement("option");
      option.value = Categoria;
      option.textContent = Categoria;
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
      cartItem += `
      <tr id="${matchingData.ISBN}">
          <td><img width="80px" src="img/${matchingData.FotoCapa}" alt="Product Image" class="product-image"></td>
          <td>${matchingData.Curso}</td>
          <td>${matchingData.Preço.toString()}€</td>
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
  if (gUser === -1) {  alert("Não está logado"); return;}
  //Código a seguir só será executado se o usuário estiver logado

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
  if (gUser === -1) {  alert("Não está logado"); return;}
  //Código a seguir só será executado se o usuário estiver logado
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

/* Contar os vendidos */
async function getSoldItems() { 
	const response = await fetch('https://localhost:44332/GetSolds', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}});
	
	const data = await response.json();

	if (data == null) {
		data = [];
	}

	return data;
}

// count sold courses
async function countSoldCourses() {
	const soldCourses = await getSoldItems();
	const allData = await getData();
	const soldCount = {};

	soldCourses.forEach((item) => {
		const course = allData.find((c) => c.ISBN === item.ISBN);
		if (course) {
			if (!soldCount[course.ISBN]) {
				soldCount[course.ISBN] = {
					course: course,
					quantity: 0,
				};
			}
			soldCount[course.ISBN].quantity += item.Quantidade;  // Ajuste aqui para item.Quantidade
		}
	});

	return soldCount;
}




/* TOP 5 */
//Função para desenhar cursos mais vendidos
async function drawTop5() {
    let sold5 = await getSoldItems();
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
                  <img src="img/${course.FotoCapa}">
                  <div class="book-details">
                    <p class="book-title">${course.Curso}</p>
                    <img src="img/estrelas.png" style="width: 80px; margin-top: 12px">
                    <p class="book-author">${course.Autor}</p>
                    <div class="buttonSidebySide">  
                      <a onclick="event.preventDefault(); addToCart(${course.ISBN}); printData();"class="addTocart" data-id="1"><i class="fa-solid fa-cart-plus"></i></a>
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
            <img src="img/${course.FotoCapa}" alt="Product Image">
        </div>
        
        <div class="product-details">
            <h4>${course.Curso}</h4>
            <p class="price">${course.Preço.toString()}€</p>
            <p class="description">Neste curso, você aprenderá os fundamentos da culinária vegetariana,
                desde a seleção e preparação dos ingredientes até a criação de pratos equilibrados e 
                cheios de sabor. Nossos especialistas em culinária vegetariana compartilharão dicas e
                  truques valiosos, além de receitas exclusivas que irão inspirá-lo a explorar uma 
                  variedade de ingredientes frescos e nutritivos.</p>
            <div class="quantity">
                <label for="quantity">Author: ${course.Autor}</label>
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

