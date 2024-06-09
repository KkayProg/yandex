document.addEventListener("DOMContentLoaded", function () {
    const marqueeContent = document.getElementById('marquee-content');
    const marqueeContentFooter = document.getElementById('marquee-content-footer');
    const containerWidth = marqueeContent.parentElement.offsetWidth;
    const contentWidth = marqueeContent.offsetWidth;


    const duration = (contentWidth + containerWidth) / 100;
    marqueeContent.style.animationDuration = `${duration}s`;
    marqueeContentFooter.style.animationDuration = `${duration}s`;



    // slider

    const wrapper = document.querySelector('.participants__wrapper');
    const carousel = document.querySelector('.participants__carousel');
    const arrowBtns = document.querySelectorAll('.participants__navigation button');
    const firstCardWidth = carousel.querySelector('.participants__card').offsetWidth;
    const carouselChildrens = [...carousel.children]

    let isDragging = false,
        startX, startScrollLeft, timeoutId;

    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth)

    carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
        carousel.insertAdjacentHTML('afterbegin', card.outerHTML);
    });

    carouselChildrens.slice(0, cardPerView).forEach(card => {
        carousel.insertAdjacentHTML('beforeend', card.outerHTML);
    });

    arrowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            carousel.scrollLeft += btn.id === 'left' ? -firstCardWidth : firstCardWidth;
        });
    });

    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add('dragging');
        // записывает начальное положение курсора и прокрутки карусели
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
    }

    const dragging = (e) => {
        if (!isDragging) return;
        // обновляет положение прокрутки карусели в зависимости от перемещения курсора
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    }

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove('dragging');
    }

    const autoPlay = () => {
        timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 4000);
    }
    autoPlay();

    const infiniteScroll = () => {
        if (carousel.scrollLeft === 0) {
            carousel.classList.add('no-transition');
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
            carousel.classList.remove('no-transition');
        } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add('no-transition');
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove('no-transition');
        }

        clearTimeout(timeoutId);
        if(!wrapper.matches(':hover')) autoPlay();
    }

    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragStop);
    carousel.addEventListener('scroll', infiniteScroll);
    wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
    wrapper.addEventListener('mouseleave', autoPlay);
});





























// // slider
// const slideList = document.querySelector('.participants__list');
// const slides = Array.from(document.querySelectorAll('.participants__item'));
// const slideWidth = 100 / 3; // Ширина одного слайда (3 элемента видны)
// const totalSlides = slides.length;



// // Устанавливаем начальную позицию
// let currentIndex = 0;
// slideList.style.transition = 'none';
// slideList.style.transform = `translateX(${-currentIndex * slideWidth}%)`;

// function nextSlide() {
//     currentIndex += 1;
//     slideList.style.transition = 'transform 0.5s ease';
//     slideList.style.transform = `translateX(${-currentIndex * slideWidth}%)`;

//     // Проверяем, достигли ли конца слайдера
//     if (currentIndex === 3 ) {
//         setTimeout(() => {
//             slideList.style.transition = 'transform 0.5s ease';
//             currentIndex = 0;
//             slideList.style.transform = `translateX(${-currentIndex * slideWidth}%)`;
//         }, 500);
//     }
// }

// function prevSlide() {
//     currentIndex -= 1;
//     slideList.style.transition = 'transform 0.5s ease';
//     slideList.style.transform = `translateX(${-currentIndex * slideWidth}%)`;

//     // Проверяем, достигли ли начала слайдера
//     if (currentIndex === -1 || currentIndex === totalSlides - 1) {
//         setTimeout(() => {
//             slideList.style.transition = 'none';
//             currentIndex = totalSlides * 2 - 1;
//             slideList.style.transform = `translateX(${-currentIndex * slideWidth}%)`;
//         }, 500);
//     }
// }

// const prevBtn = document.querySelector('.participants__btn.prev');
// const nextBtn = document.querySelector('.participants__btn.next');

// nextBtn.addEventListener('click', nextSlide);
// prevBtn.addEventListener('click', prevSlide);

// setInterval(nextSlide, 4000); // Менять слайд каждые 4 секунды