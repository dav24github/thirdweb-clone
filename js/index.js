// --==================== Menu toggle ====================
const menu = document.querySelector(".menu");
const btn_menu = document.querySelector(".header__menu");
const btn_close = document.querySelector(".menu__toggle");

btn_menu.addEventListener("click", () => {
  menu.classList.remove("close");
  menu.classList.add("active");
  document.getElementsByTagName("body")[0].style.height = "100%";
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
});

btn_close.addEventListener("click", () => {
  menu.classList.add("close");
  menu.classList.remove("active");
  document.getElementsByTagName("body")[0].style.height = "initial";
  document.getElementsByTagName("body")[0].style.overflow = "initial";
});

// --==================== Carousel ====================
class Carousel {
  constructor(myCarousel, config = {}) {
    const carousel = document.querySelector("." + myCarousel);
    const container = carousel.querySelector(".carousel__container");
    const wrapper = carousel.querySelector(".carousel__wrapper");
    const track = carousel.querySelector(".carousel__track");
    const slideElements = track.children;
    const slidesLenth = slideElements.length;

    const pagination = carousel.querySelector(".pagination");

    // Set current
    slideElements[0].classList.add("current");

    // clone the first and last 4 elements
    const startClone = [];
    const endClone = [];
    for (let index = 0; index < 4; index++) {
      const node1 = slideElements[slideElements.length - 1 - index];
      const clone1 = node1.cloneNode(true);
      startClone.push(clone1);

      const node2 = slideElements[index];
      const clone2 = node2.cloneNode(true);
      if (clone2.classList.contains("current")) {
        clone2.classList.remove("current");
      }
      endClone.push(clone2);
    }
    startClone.forEach((clone) => {
      clone.classList.add("clone");
      track.insertAdjacentElement("afterbegin", clone);
    });
    endClone.forEach((clone) => {
      clone.classList.add("clone");
      track.insertAdjacentElement("beforeend", clone);
    });

    const slides = Array.from(slideElements);
    const startIndex = slides.findIndex((slide) =>
      slide.classList.contains("current")
    );
    var slideWith = 0;

    // Set to active
    const setActiveSlides = (targetIndex) => {
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });

      const iIndex = targetIndex - parseInt(config.slidePerView / 2);
      for (let index = iIndex; index < iIndex + config.slidePerView; index++) {
        slideElements[index].classList.add("active");
      }
    };
    setActiveSlides(startIndex);

    // arrange the slide next to one another and set the slide width
    slides.forEach((slide, index) => {
      slide.style.width = `calc(99vw/3 - ${config.spaceBetween}px)`;
      slideWith = slideElements[0].getBoundingClientRect().width;
      slide.style.left = index * (slideWith + config.spaceBetween) + "px";
    });

    // FUNCTIONS

    const moveTo = (position) => {
      const offset = position * (slideWith + config.spaceBetween);
      track.style.transform = `translateX(-${offset}px)`;
    };
    moveTo(startIndex - 1);

    const moveToSlide = (currentSlide, targetSlide) => {
      const targetIndex = slides.findIndex((slide) => slide === targetSlide);
      moveTo(targetIndex - 1);
      targetSlide.classList.add("current");
      currentSlide.classList.remove("current");
      setActiveSlides(targetIndex);
    };

    const updateDots = (targetDot) => {
      Array.from(pagination_dots.children).forEach((slide) => {
        slide.classList.remove("current-slide");
      });

      targetDot.classList.add("current-slide");
    };

    // pagination
    var pagination_dots = document.createElement("div");
    pagination_dots.classList.add("pagination-dots");

    var pagination_arrows = document.createElement("div");
    pagination_arrows.classList.add("pagination-arrows");

    var btn_left = document.createElement("i");
    btn_left.classList.add("btn-left");
    btn_left.classList.add("uil");
    btn_left.classList.add("uil-angle-left-b");

    var btn_right = document.createElement("i");
    btn_right.classList.add("btn-right");
    btn_right.classList.add("uil");
    btn_right.classList.add("uil-angle-right-b");

    pagination.appendChild(pagination_dots);
    pagination.appendChild(pagination_arrows);

    pagination_arrows.appendChild(btn_left);
    pagination_arrows.appendChild(btn_right);

    for (let index = 0; index < slidesLenth; index++) {
      var newnode = document.createElement("button");
      if (index === 0) newnode.classList.add("current-slide");
      pagination_dots.append(newnode);
    }
    const pagination_dotsElement = pagination.querySelector(".pagination-dots");
    const dots = Array.from(
      pagination.querySelector(".pagination-dots").children
    );

    const buttons = {
      prev: carousel.querySelector(".btn-left"),
      next: carousel.querySelector(".btn-right"),
    };

    // when I click left, move slides to the left
    buttons.prev.addEventListener("click", (e) => {
      const currentSlide = track.querySelector(".current");
      const prevSlide = currentSlide.previousElementSibling;
      const currentDot = pagination_dotsElement.querySelector(".current-slide");
      const prevDot = currentDot.previousElementSibling;

      moveToSlide(currentSlide, prevSlide);
      updateDots(prevDot);
    });

    // when I click right, move slides to the right
    buttons.next.addEventListener("click", (e) => {
      const currentSlide = track.querySelector(".current");
      const nextSlide = currentSlide.nextElementSibling;
      const currentDot = pagination_dotsElement.querySelector(".current-slide");
      const nextDot = currentDot.nextElementSibling;

      moveToSlide(currentSlide, nextSlide);
      updateDots(nextDot);
    });

    // when I click the nav indicators, move to that slide
    pagination_dots.addEventListener("click", (e) => {
      const targetDot = e.target.closest("button");

      if (!targetDot) return;

      const currentSlide = track.querySelector(".current");
      const targetIndex = dots.findIndex((dot) => {
        if (dot === targetDot) {
          return dot;
        }
        return;
      });
      const targetSlide = slides[startIndex + targetIndex];

      moveToSlide(currentSlide, targetSlide);
      updateDots(targetDot);
    });

    let clicked = false;
    let xAxis;
    let x;

    // Grap and Drag
    container.addEventListener("mouseup", () => {
      container.style.cursor = "grab";
    });

    container.addEventListener("mousedown", (e) => {
      clicked = true;
      xAxis = e.offsetX - track.offsetLeft;
      // tell us the current position
      container.style.cursor = "grabbing";
    });

    window.addEventListener("mouseup", () => {
      clicked = false;
    });

    container.addEventListener("mousemove", (e) => {
      if (!clicked) return;
      e.preventDefault();

      x = e.offsetX;
      track.style.left = `${x - xAxis}px`;

      // checkSize();
    });

    const checkSize = () => {
      let contaninerOut = container.getBoundingClientRect();
      let sliderIn = track.getBoundingClientRect();

      if (parseInt(track.style.left) > 0) {
        track.style.left = "0px";
      } else if (sliderIn.right < contaninerOut.right) {
        slider.style.left = `-${sliderIn.width - contaninerOut.width}px`;
      }
    };
  }
}

var carousel_others = new Carousel("other__carousel", {
  slidePerView: 3,
  spaceBetween: 15,
});

// --==================== How to ====================
const howtMenu = document.querySelector(".howto__menu");
const options = Array.from(howtMenu.children);
const container = document.querySelector(".howto__container");
const contentList = Array.from(container.children);

howtMenu.addEventListener("click", (e) => {
  const option = e.target;
  const contentIndex = options.findIndex((opt) => opt === option);
  const content = contentList[contentIndex];

  if (!option.classList.contains("howto__option")) return;

  options.forEach((opt, index) => {
    opt.classList.remove("active");
    contentList[index].classList.remove("show");
  });

  setTimeout(() => {
    option.classList.add("active");
    content.classList.add("show");
  }, 250);
});

// --==================== Parallax effect ====================
const aboutus = document.querySelector(".aboutus");
const divider = document.querySelector(".divider");
const projects = document.querySelector(".projects .projects__wrapper");
const photo1 = document.querySelector(".photo1");
const photo2 = document.querySelector(".photo2");
const photo3 = document.querySelector(".photo3");

window.addEventListener("scroll", (e) => {
  var viewportHeight = document.documentElement.clientHeight;
  const offset1 = -150;
  const offset2 = 570;
  const offset3 = 130;
  if (
    aboutus.getBoundingClientRect().top <= viewportHeight &&
    aboutus.getBoundingClientRect().top >= -200
  ) {
    photo1.style.top =
      -(aboutus.getBoundingClientRect().top - viewportHeight) * 0.3 +
      offset1 +
      "px";

    photo2.style.top =
      (aboutus.getBoundingClientRect().top - viewportHeight) * 0.2 +
      offset2 +
      "px";

    photo3.style.top =
      -(aboutus.getBoundingClientRect().top - viewportHeight) * 0.1 +
      offset3 +
      "px";
  }

  if (projects.getBoundingClientRect().top <= 792) {
    projects.style.opacity = 1;
    projects.style.transform = "translateY(0)";
  }

  if (divider.getBoundingClientRect().top <= viewportHeight) {
    divider.style.animation = "divider 5s";
  }
});
