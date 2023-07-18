

addEventListener("load", updateInterface);

// Atualizar interface ao iniciar
async function updateInterface() {
  await setInitialData();
  printData();
  totalCourse();
  countSold();
  countSoldCash();
  drawCart(); // Chame a função drawCart aqui
}


let editingProductId = null;

/// Copy all data from the API to local storage
async function setInitialData() {
  const apiData = await asyncPostCall();
  if (apiData) {
    setData(apiData);
  }
}

// Function to fetch data from API and set in localStorage
async function fetchDataAndSetData() {
  const apiData = await asyncPostCall();
  if (apiData) {
    setData(apiData);
  }
}

// Call the fetchDataAndSetData function to fetch data from API and set in localStorage
fetchDataAndSetData();


// Function to get data from both sources
async function getData() {
  const localStorageData = loadFromLocalStorage();
  const apiData = await asyncPostCall();

  // Combine the data from both sources as needed
  // For example, you can merge arrays, perform transformations, etc.

  // Return the combined data
  return { localStorageData, apiData };
}

// Usage
async function processData() {
  const data = await getData();
  console.log(data.localStorageData); // Data from localStorage
  console.log(data.apiData); // Data from API
}

// Load data from local storage
function getData() {
  let dbData = JSON.parse(localStorage.getItem("dbKey") || "[]");
  return dbData;
}
// Set data in localStorage
function setData(data) {
  localStorage.setItem("dbKey", JSON.stringify(data));
}

// Function to fetch data from API and set in localStorage
async function fetchDataAndSetData() {
  const apiData = await asyncPostCall();
  if (apiData) {
    setData(apiData);
  }
}

// Call the fetchDataAndSetData function to fetch data from API and set in localStorage
fetchDataAndSetData();



// Load data from API with backend in C# and database SQL Server
const asyncPostCall = async () => {
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

    const container = document.getElementById('dataContainer');


    const ratingStars = document.querySelectorAll('.star');
    const ratingValue = document.getElementById('ratingValue');

    let rating = 0;

    ratingStars.forEach(star => {
      star.addEventListener('click', () => {
        rating = parseInt(star.dataset.rating);
        updateRating();
      });
    });

    function updateRating() {
      ratingValue.innerHTML = `Avaliação: `;
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          ratingValue.innerHTML += `<span class="star" data-rating="${i}">&#9733;</span>`;
        } else {
          ratingValue.innerHTML += `<span class="star" data-rating="${i}">&#9734;</span>`;
        }
      }
      // Aqui você pode enviar o valor da avaliação para a base de dados ou realizar outras ações com o valor.
    }
    
    // Limpar o conteúdo existente no contêiner
    container.innerHTML = '';

    dbData.forEach(course => {
      const courseElement = document.createElement('div');
      courseElement.className = "four columns";
      courseElement.innerHTML = `
      <div class="card" id="${course.ISBN}">
        <img src="img/${course.FotoCapa}" class="imagen-curso u-full-width">
        <div class="info-card">
          <div class="button-container">
            <h4>${course.Curso}</h4>
            <i class= "fas red-heart far fa-heart" onclick=""></i>
          </div>   
          <p>${course.Autor}</p>
       
          <div id="ratingStars">
          ${getRatingStars(course.Avaliação)}
        </div>
        


          <p class="preco"></p><br>
          <p class="promocao">${course.Promoção.toString()} <span style="color:orange;font-size:16px">-${course.Percentagem}%</span> 
          <span class="u-pull-right">${course.Preço.toString()}€</span></p>
          <div class="button-container">  
            <a onclick="event.preventDefault(); addToCart(${course.ISBN}); drawCart();" href="#" class="u-full-width button-primary button input adicionar-carrinho" data-id="1">Carrinho</a>
            <a onclick="trocarDiv('cardInfo'), listarPorId(${course.ISBN})" href="#" class="button-danger button">Ver <i class="fa-sharp fa-solid fa-plus"></i></a>
          </div>
        </div>
      </div>
    `
      container.appendChild(courseElement);
    });

    function getRatingStars(rating) {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          stars += `<span class="star" data-rating="${i}"> <img src="img/estrelas_um.png"></span>`;
        } else {
          stars += `<span class="star" data-rating="${i}"> <img src="img/estrelas_vazio.png"> </span>`;
        }
      }
      return stars;
    }

  } catch (error) {
    // Lógica para tratar erros (exemplo: exibir um alerta de erro)
    alert(error);
  }
};



// Function to get data from both sources
async function getData() {
  const localStorageData = loadFromLocalStorage();
  const apiData = await asyncPostCall();

  // Combine the data from both sources as needed
  // For example, you can merge arrays, perform transformations, etc.

  // Return the combined data
  return { localStorageData, apiData };
}


processData();



// save data to local storage
function saveData(data) {
  localStorage.setItem("dbKey", JSON.stringify(data));
}

// Função para adicionar um novo produto
function addData(titulo, autor, categoria, preco, promocao, rating, imagem) {
  const data = getData();
  let dataLength = data.length + 1;
  const newCourse = {
    ISBN: dataLength,
    titulo,
    autor,
    categoria,
    preco,
    promocao,
    rating,
    imagem,
  };
  data.push(newCourse);
  saveData(data);
}
// Função para adicionar um novo produto
function editData(ISBN, titulo, autor, categoria, preco, promocao,
  rating,
  imagem
) {
  const dbData = getData();
  const findCourse = dbData.findIndex((dataCourse) => dataCourse.ISBN === ISBN);
  if (findCourse !== -1) {
    dbData[findCourse].titulo = titulo;
    dbData[findCourse].autor = autor;
    dbData[findCourse].categoria = categoria;
    dbData[findCourse].preco = preco;
    dbData[findCourse].promocao = promocao;
    dbData[findCourse].rating = rating;
    dbData[findCourse].imagem = imagem;
    saveData(dbData);
  }
}

// Função para salvar a imagem no localStorage e retornar a URL
function saveImage(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target.result;
      resolve(imageUrl);
    };
    reader.onerror = function (event) {
      reject(event.target.error);
    };
    reader.readAsDataURL(imageFile);
  });
}

// Event listener para o formulário de adição/editar de produtos
const courseForm = document.getElementById("courseForm");
courseForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  let tituloInputt = document.getElementById("titulo");
  let autorInputt = document.getElementById("autor");
  let categoriaInputt = document.getElementById("categoria");
  let precoInputt = document.getElementById("preco");
  let promocaoInputt = document.getElementById("promocao");
  let ratingInputt = document.getElementById("rating");
  let imageInputt = document.getElementById("imageInput");

  const titulo = tituloInputt.value;
  const autor = autorInputt.value;
  const categoria = categoriaInputt.value;
  const preco = parseFloat(precoInputt.value);
  const promocao = parseFloat(promocaoInputt.value);
  const rating = parseInt(ratingInputt.value);
  const imageFile = imageInputt.files[0];

  if (editingProductId) {
    editData(editingProductId, titulo, autor, categoria, preco, promocao, rating, imageFile ? await saveImage(imageFile) : "");
    clearForm();
    printData();
  } else {
    addData(titulo, autor, categoria, preco, promocao, rating, imageFile ? await saveImage(imageFile) : "");
    clearForm();
    printData();
    totalCourse();
  }

  tituloInputt.value = "";
  autorInputt.value = "";
  categoriaInputt.value = "";
  precoInputt.value = "";
  promocaoInputt.value = "";
  ratingInputt.value = "";
  imageInputt.value = "";
});

// Função para preencher o formulário com os dados de um produto para edição
function fillFormForEdit(id) {
  const dbData = getData();
  const findCourse = dbData.find((dataCourse) => dataCourse.ISBN === id);
  if (findCourse) {
    let tituloInputt = document.getElementById("titulo");
    let autorInputt = document.getElementById("autor");
    let categoriaInputt = document.getElementById("categoria");
    let precoInputt = document.getElementById("preco");
    let promocaoInputt = document.getElementById("promocao");
    let ratingInputt = document.getElementById("rating");
    let imageInputt = document.getElementById("imageInput");
    const submitButton = document.getElementById("submitButton");
    const cancelButton = document.getElementById("cancelButton");

    tituloInputt.value = findCourse.titulo;
    autorInputt.value = findCourse.autor;
    categoriaInputt.value = findCourse.categoria;
    precoInputt.value = findCourse.preco;
    promocaoInputt.value = findCourse.promocao;
    ratingInputt.value = findCourse.rating;
    imageInputt.value = "";
    submitButton.textContent = "Salvar";
    cancelButton.style.display = "inline-block";

    editingProductId = id;
  }
}

//função para remover um produto da base de dados ao clickar no botão limpar
function removeProduct(id) {
  const dbData = getData();
  const findCourse = dbData.find((dataCourse) => dataCourse.ISBN === id);
  if (findCourse) {
    dbData.splice(dbData.indexOf(findCourse), 1);
    saveData(dbData);
    printData();
    totalCourse();
  }
}

// Função para limpar o formulário e redefinir para adição de novos produtos
function clearForm() {
  let tituloInputt = document.getElementById("titulo");
  let autorInputt = document.getElementById("autor");
  let categoriaInputt = document.getElementById("categoria");
  let precoInputt = document.getElementById("preco");
  let promocaoInputt = document.getElementById("promocao");
  let ratingInputt = document.getElementById("rating");
  let imageInputt = document.getElementById("imageInput");
  const submitButton = document.getElementById("submitButton");
  const cancelButton = document.getElementById("cancelButton");

  tituloInputt.value = '';
  autorInputt.value = '';
  categoriaInputt.value = '';
  precoInputt.value = '';
  promocaoInputt.value = '';
  ratingInputt.value = '';
  imageInputt.value = '';
  submitButton.textContent = 'Adicionar';
  cancelButton.style.display = 'none';

  editingProductId = null;
}

// Função para contar o total de cursos registrados
function totalCourse() {
  let contarCurso = document.getElementById("total");
  const dbData = getData();
  let total = 0;
  for (let i = 0; i < dbData.length; i++) {
    total++;
  }
  contarCurso.textContent = total;
  printData();
  return total;
}
// contar o total de produtos vendidos
function countSold() {
  let data = JSON.parse(localStorage.getItem("soldKey") || "[]");;
  let contador = 0;
  for (let i = 0; i < data.length; i++) {
    contador += data[i].quantity;
  }
  document.getElementById("sold").textContent = contador;
  printData();
  return contador;
}
// contar o total do valor vendido
function countSoldCash() {
  let data = JSON.parse(localStorage.getItem("soldKey") || "[]");;
  let contador = 0;
  for (let i = 0; i < data.length; i++) {
    contador += data[i].totalPrice;
  }
  document.getElementById("totalPrice").textContent = contador;
  printData();
  return contador;
}


