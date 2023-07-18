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

function handleWindowResize() {
  verificarAtivoCardInfo();
}

window.addEventListener("load", handleWindowResize);
window.addEventListener("resize", handleWindowResize);

verificarAtivoCardInfo();

  
  
  


  