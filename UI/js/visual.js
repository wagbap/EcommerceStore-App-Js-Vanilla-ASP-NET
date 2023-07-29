/////////////////////////////SWIPER////////////////////////////////////
function swiperJs() {
  var swiper = new Swiper(".mySwiper", {
      slidesPerView: 3,
      spaceBetween: 30,
      centeredSlides: false,
      slidesPerGroupSkip: 3,
     /*  loop: true,
      autoplay: {
          delay: 1900,
          disableOnInteraction: false,
      }, */
      navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
      },
  });
}

////////////////////////////////////////////Switch button  /////////////////////////////////////////////////////////////////////////
// Parte visual do botão - ignorar
function toggleSwitchHandler() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const sliderRound = document.getElementById('sliderRound');
  const sliderSpan = document.getElementById("slider");
  toggleSwitch.addEventListener('change', function () {
      if (toggleSwitch.checked) {
          sliderRound.style.transform = 'translateX(20px)';
          sliderSpan.style.backgroundColor = 'green';
      } else {
          sliderRound.style.transform = 'translateX(0)';
          sliderSpan.style.backgroundColor = 'red';
      }
  });
}

///////////// scoll top //////////////////////////////


function scrollToTop() {
  const scrollToTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollToTop > 0) {
      window.scrollTo({
          top: 0,
          behavior:'smooth',
      });
  }
}

///////////// verificar o estado do card e o tamanho do ecran para ocultar o aside //////////////////////////////
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

/* PAGINAção */

let currentPage = 1;
let cardsPerPage = 9;
let totalCards = getData().length;

// Ir para a primeira página
function goToPage1() {
  currentPage = 1;
  printData();
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
      printData();
      updatePagination(totalCards);
    });
    pagination.appendChild(prevButton);
  }

  // Criação dos botões de paginação
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createPageButton(i, false);
    pageButton.addEventListener("click", function () {
      currentPage = i;
      printData();
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
      printData();
      updatePagination(totalCards);
    });
    pagination.appendChild(nextButton);
  }
}

// Função para atualizar o número de cards por página
function updateCardsPerPage(value) {
  cardsPerPage = parseInt(value);
  currentPage = 1; // Reset the current page to the first page
  printData();
  updatePagination(totalCards);
}

// Example code for changing the cards per page
function changeCardsPerPage() {
  const select = document.getElementById("selectCardsPerPage");
  const selectedValue = select.value;
  cardsPerPage = parseInt(selectedValue);
  currentPage = 1;
  printData();
  updatePagination(totalCards);
}

// Função auxiliar para criar botões de páginação
function createPageButton(text) {
  const pageButton = document.createElement("span");
  pageButton.textContent = text;
  pageButton.classList.add("page-button");
  return pageButton;
}


function handleWindowResize() {
verificarAtivoCardInfo();
}

window.addEventListener("load", handleWindowResize);
window.addEventListener("resize", handleWindowResize);

verificarAtivoCardInfo();









