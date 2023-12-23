import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/swiper.css';
import 'swiper/modules/pagination.css';

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#menu') {
    document.body.classList.add('page__body--with-menu');
  } else {
    document.body.classList.remove('page__body--with-menu');
  }
});

function initSwiper() {
  return new Swiper('.swiper', {
    modules: [Pagination],
    pagination: {
      el: '.swiper-pagination',
    },
  });
}

const swiper = document.querySelector('.materials__slider');
const wrapper = document.querySelector('.materials__slider-wrapper');
const box = document.querySelectorAll('.materials__swiper-slide');

const menuContent = document.querySelector('.menu');

function removeSwiperClasses() {
  swiper.classList.remove('swiper');
  swiper.classList.remove('swiper-backface-hidden');
  wrapper.classList.remove('swiper-wrapper');
  wrapper.removeAttribute('id');

  box.forEach(slide => {
    slide.classList.remove('swiper-slide');
    slide.removeAttribute('style');
  });

  document.querySelector('.materials__pagination').remove();
}

function addSwiperClasses() {
  swiper.classList.add('swiper');
  wrapper.classList.add('swiper-wrapper');

  box.forEach(slide => {
    slide.classList.add('swiper-slide');
  });

  const newElement = document.createElement('div');

  newElement.setAttribute('class', 'materials__pagination swiper-pagination');
  swiper.appendChild(newElement);
}

let mySwiper = null;

if (window.innerWidth < 768) {
  addSwiperClasses();
  mySwiper = initSwiper();
}

const children = document.querySelectorAll('.materials__feature');

function styleNormalize() {
  children.forEach(child => {
    child.style.height = 'auto';
  });
}

const tabletMaterials = document.querySelectorAll('.circle');

function handleClick(item) {
  return () => {
    if (item.classList.contains('circle--clicked')) {
      item.classList.remove('circle--clicked');
    } else {
      tabletMaterials.forEach(i => {
        i.classList.remove('circle--clicked');
      });

      item.classList.add('circle--clicked');
    }
  };
}

let handlers = [];

function checkScreenWidth() {
  if (window.innerWidth >= 768) {
    if (mySwiper) {
      mySwiper.destroy();
      mySwiper = null;
      removeSwiperClasses();

      styleNormalize();
    }

    if (window.innerWidth < 1280 && window.innerWidth >= 768) {
      if (!handlers.length) {
        tabletMaterials.forEach((item, i) => {
          handlers[i] = handleClick(item);

          item.addEventListener('click', handlers[i]);
        });
      }
    } else {
      if (handlers.length) {
        tabletMaterials.forEach((item, i) => {
          item.classList.remove('circle--clicked');

          item.removeEventListener('click', handlers[i]);
        });

        handlers = [];
      }
    }
  } else {
    if (!mySwiper) {
      addSwiperClasses();
      mySwiper = initSwiper();
    }

    if (mySwiper) {
      let maxHeight = 0;

      styleNormalize();

      children.forEach(child => {
        maxHeight = Math.max(maxHeight, child.clientHeight);
      });

      maxHeight -= 50;

      children.forEach(child => {
        child.style.height = maxHeight + 'px';
      });
    }

    menuContent.style.height = document.documentElement.clientHeight + 'px';
  }
}

checkScreenWidth();
window.addEventListener('resize', checkScreenWidth);
