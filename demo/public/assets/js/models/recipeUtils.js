export function createCarroussel(recipeElement, images, recipeName) {
    if (!images || images.length === 0) {
        const noImageDiv = document.createElement('div');
        noImageDiv.className = 'no-image-placeholder';
        noImageDiv.textContent = 'No images available';
        recipeElement.appendChild(noImageDiv);
        return;
    }

    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        if (index === 0) slide.classList.add('active');

        const img = document.createElement('img');
        img.src = `../uploads/recipes/${image}`;
        img.alt = `${recipeName} - Image ${index + 1}`;
        img.loading = 'lazy';

        slide.appendChild(img);
        carouselContainer.appendChild(slide);
    });

    if (images.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-nav prev';
        prevBtn.innerHTML = '‹';
        prevBtn.setAttribute('aria-label', 'Previous image');

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-nav next';
        nextBtn.innerHTML = '›';
        nextBtn.setAttribute('aria-label', 'Next image');

        carouselContainer.appendChild(prevBtn);
        carouselContainer.appendChild(nextBtn);

        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';

        images.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.setAttribute('aria-label', `Go to image ${index + 1}`);
            indicators.appendChild(indicator);
        });

        carouselContainer.appendChild(indicators);
    }

    recipeElement.appendChild(carouselContainer);

    if (images.length > 1) {
        initializeCarousel(carouselContainer, images.length);
    }
}

export function createRecipeCardImage(recipeElement, images, recipeName) {
    if (!images || images.length === 0) {
        const noImageDiv = document.createElement('div');
        noImageDiv.className = 'no-image-placeholder-card';
        noImageDiv.textContent = 'No image';
        recipeElement.appendChild(noImageDiv);
        return;
    }

    const img = document.createElement('img');
    img.src = `../uploads/recipes/${images[0]}`;
    img.alt = recipeName;
    img.loading = 'lazy';
    recipeElement.appendChild(img);
}

function initializeCarousel(container, totalSlides) {
    let currentIndex = 0;
    let intervalId = null;

    const slides = container.querySelectorAll('.carousel-slide');
    const indicators = container.querySelectorAll('.carousel-indicator');
    const prevBtn = container.querySelector('.carousel-nav.prev');
    const nextBtn = container.querySelector('.carousel-nav.next');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        slides[index].classList.add('active');
        indicators[index].classList.add('active');

        currentIndex = index;
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
    }

    function startCarousel() {
        if (intervalId !== null) return;
        intervalId = setInterval(nextSlide, 3000);
    }

    function stopCarousel() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    prevBtn.addEventListener('click', () => {
        stopCarousel();
        prevSlide();
        startCarousel();
    });

    nextBtn.addEventListener('click', () => {
        stopCarousel();
        nextSlide();
        startCarousel();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopCarousel();
            showSlide(index);
            startCarousel();
        });
    });

    container.addEventListener('mouseenter', stopCarousel);
    container.addEventListener('mouseleave', startCarousel);

    startCarousel();
}

export function renderCategoriesForm(categories, container) {
    const containers = {};
    const singleChoiceTypes = ["meal", "type"];

    categories.forEach((category, index) => {
        const categoryData = typeof category === 'string'
            ? { id: index + 1, type: 'category', name: category }
            : { id: category.id ?? index + 1, type: category.type ?? 'category', name: category.name ?? category.label ?? '' };

        if (!containers[categoryData.type]) {
            const div = document.createElement("div");
            div.className = "filter-group";
            div.id = categoryData.type;

            const title = document.createElement("h3");
            title.textContent = categoryData.type.charAt(0).toUpperCase() + categoryData.type.slice(1);

            div.appendChild(title);
            container.appendChild(div);

            containers[categoryData.type] = div;
        }

        const label = document.createElement("label");
        label.className = "filter-option";

        const input = document.createElement("input");
        input.type = (singleChoiceTypes.includes(categoryData.type)) ? "radio" : "checkbox";
        input.name = (singleChoiceTypes.includes(categoryData.type)) ? categoryData.type : "categories[]";
        input.value = categoryData.id;
        input.id = `filter-${categoryData.type}-${categoryData.id}`;

        const span = document.createElement("span");
        span.textContent = categoryData.name;

        label.appendChild(input);
        label.appendChild(span);
        containers[categoryData.type].appendChild(label);
    });

    const controlsDiv = document.createElement("div");
    controlsDiv.className = "filter-controls";

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.id = "clear-filters-btn";
    clearBtn.className = "clear-filters-btn";
    clearBtn.textContent = "Clear Filters";

    controlsDiv.appendChild(clearBtn);
    container.appendChild(controlsDiv);
}