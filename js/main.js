document.addEventListener("DOMContentLoaded", function () {
    // Анимация бегущей строки
    const marqueeContent = document.getElementById('marquee-content');
    const marqueeContentFooter = document.getElementById('marquee-content-footer');
    const containerWidth = marqueeContent.parentElement.offsetWidth;
    const contentWidth = marqueeContent.offsetWidth;

    // Рассчитываем длительность анимации на основе ширины контента и контейнера
    const duration = (contentWidth + containerWidth) / 100;
    marqueeContent.style.animationDuration = `${duration}s`;
    marqueeContentFooter.style.animationDuration = `${duration}s`;

    // Настройка карусели участников
    const wrapper = document.querySelector('.participants__wrapper');
    const carousel = document.querySelector('.participants__carousel');
    const arrowBtns = document.querySelectorAll('.participants__navigation button');
    const firstCardWidth = carousel.querySelector('.participants__card').offsetWidth;
    const carouselChildrens = [...carousel.children];
    let counerSpan = document.querySelector('.participants__navigation__span-start');
    let couner = 1;

    let isDragging = false,
        startX, startScrollLeft, timeoutId;

    let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

    // Реализация бесконечной прокрутки
    carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
        carousel.insertAdjacentHTML('afterbegin', card.outerHTML);
    });

    carouselChildrens.slice(0, cardPerView).forEach(card => {
        carousel.insertAdjacentHTML('beforeend', card.outerHTML);
    });

    // Обновляем отображение счётчика
    const updateCounter = () => {
        const scrollLeft = carousel.scrollLeft;
        const slideWidth = firstCardWidth;

        const currentIndex = Math.round(scrollLeft / slideWidth);
        couner = ((currentIndex + cardPerView) % 6) + 1;

        counerSpan.textContent = couner;
    };

    // Начальная позиция прокрутки
    carousel.scrollLeft = firstCardWidth * cardPerView;
    updateCounter();

    // Обработчики событий для кнопок стрелок
    arrowBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            carousel.scrollLeft += btn.id === 'left' ? -firstCardWidth : firstCardWidth;
            setTimeout(updateCounter, 300);
        });
    });

    // Начало перетаскивания
    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add('dragging');
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
    };

    // Перетаскивание
    const dragging = (e) => {
        if (!isDragging) return;
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
    };

    // Остановка перетаскивания
    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove('dragging');
        updateCounter();
    };

    // Автоматическая прокрутка
    const autoPlay = () => {
        timeoutId = setTimeout(() => {
            carousel.scrollLeft += firstCardWidth;
            updateCounter();
        }, 4000);
    };
    autoPlay();

    // Бесконечная прокрутка
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
        if (!wrapper.matches(':hover')) autoPlay();
        updateCounter();
    };

    // События для перетаскивания и бесконечной прокрутки
    carousel.addEventListener('mousedown', dragStart);
    carousel.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragStop);
    carousel.addEventListener('scroll', infiniteScroll);
    wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
    wrapper.addEventListener('mouseleave', autoPlay);

    // Настройка секции "этапы"
    const stagesWrapper = document.querySelector('.stages');
    const stagesContainer = stagesWrapper.querySelector('.stages__list');
    const stagesItems = Array.from(stagesWrapper.querySelectorAll('.stages__item'));
    const arrowsLeft = stagesWrapper.querySelector('.stages-arrows-left');
    const arrowsRight = stagesWrapper.querySelector('.stages-arrows-right');
    const dotsContainer = stagesWrapper.querySelector('.stages-dots');

    let currentSlide = 0;
    const slideWidth = 335;
    const gap = 20;

    // Проверка на мобильное устройство
    const isMobile = () => window.innerWidth <= 938;

    // Получение общего количества слайдов
    const getTotalSlides = () => {
        if (isMobile()) {
            return Math.ceil((stagesItems.length - 2) / 2) + 2; // Корректируем количество слайдов для мобильной версии
        }
        return stagesItems.length;
    };

    // Обновление позиции слайда
    const updateSlidePosition = () => {
        if (isMobile()) {
            const combinedWidth = slideWidth + gap;
            const offset = currentSlide * combinedWidth;

            stagesContainer.style.transform = `translateX(-${offset}px)`;

            stagesItems.forEach(item => {
                item.style.width = `${slideWidth}px`;
                item.style.marginRight = `${gap}px`;
            });

            stagesContainer.style.width = `${getTotalSlides() * combinedWidth - gap}px`;
        } else {
            stagesContainer.style.transform = 'none';
            stagesItems.forEach(item => {
                item.style.width = '';
                item.style.marginRight = '';
            });
            stagesContainer.style.width = '';
        }
        updateDots();
        updateArrows();
    };

    // Обновление точек (индикаторов) слайдера
    const updateDots = () => {
        dotsContainer.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    // Обновление стрелок слайдера
    const updateArrows = () => {
        const totalSlides = getTotalSlides();
        arrowsLeft.disabled = currentSlide === 0;
        arrowsRight.disabled = currentSlide === totalSlides - 1;

        if (arrowsLeft.disabled) {
            arrowsLeft.style.cursor = 'default';
            arrowsLeft.style.backgroundColor = 'rgb(214, 214, 214)';
        } else {
            arrowsLeft.style.cursor = 'pointer';
            arrowsLeft.style.backgroundColor = '';
        }

        if (arrowsRight.disabled) {
            arrowsRight.style.cursor = 'default';
            arrowsRight.style.backgroundColor = 'rgb(214, 214, 214)';
        } else {
            arrowsRight.style.cursor = 'pointer';
            arrowsRight.style.backgroundColor = '';
        }
    };

    // Переход к определённому слайду
    const goToSlide = (index) => {
        const totalSlides = getTotalSlides();
        if (index < 0) {
            currentSlide = 0;
        } else if (index >= totalSlides) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }
        updateSlidePosition();
    };

    // Инициализация точек
    const initializeDots = () => {
        dotsContainer.innerHTML = '';
        const totalSlides = getTotalSlides();
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    };

    // Обработчики событий для стрелок
    arrowsLeft.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlidePosition();
        }
    });

    arrowsRight.addEventListener('click', () => {
        if (currentSlide < getTotalSlides() - 1) {
            currentSlide++;
            updateSlidePosition();
        }
    });

    // Обновление при изменении размера окна
    window.addEventListener('resize', () => {
        initializeDots();
        updateSlidePosition();
    });

    // Начальная настройка
    initializeDots();
    updateSlidePosition();
});
