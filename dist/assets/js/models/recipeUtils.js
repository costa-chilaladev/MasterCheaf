export function createCarroussel(recipeElement, images, recipeName) {
    if (!images || images.length === 0) {
        const noImageDiv = document.createElement('div');
        noImageDiv.className = 'no-image-placeholder';
        noImageDiv.textContent = 'No images available';
        recipeElement.appendChild(noImageDiv);
        return;
    }

    // Create carousel container
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';

    // Create slides
    images.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        if (index === 0) slide.classList.add('active');

        const img = document.createElement('img');
        img.src = `/MasterCheaf/uploads/recipes/${image}`;
        img.alt = `${recipeName} - Image ${index + 1}`;
        img.loading = 'lazy';

        slide.appendChild(img);
        carouselContainer.appendChild(slide);
    });

    // Create navigation buttons if more than one image
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

        // Create indicators
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

    // Initialize carousel functionality
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

    // For recipe cards, just show the first image
    const img = document.createElement('img');
    img.src = `/MasterCheaf/uploads/recipes/${images[0]}`;
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
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Show current slide
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

    // Event listeners
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

    // Mouse events for auto-play
    container.addEventListener('mouseenter', stopCarousel);
    container.addEventListener('mouseleave', startCarousel);

    // Start auto-play
    startCarousel();
}

export function renderCategoriesForm(categories, container) {
    const containers = {};
    const singleChoiceTypes = ["meal", "type"];

    categories.forEach(category => {
        if (!containers[category.type]) {
            const div = document.createElement("div");
            div.className = "filter-group";
            div.id = category.type;

            const title = document.createElement("h3");
            title.textContent = category.type.charAt(0).toUpperCase() + category.type.slice(1);

            div.appendChild(title);
            container.appendChild(div);

            containers[category.type] = div;
        }

        const label = document.createElement("label");
        label.className = "filter-option";

        const input = document.createElement("input");
        input.type = (singleChoiceTypes.includes(category.type)) ? "radio" : "checkbox";
        input.name = (singleChoiceTypes.includes(category.type)) ? category.type : "categories[]";
        input.value = category.id;
        input.id = `filter-${category.type}-${category.id}`;

        const span = document.createElement("span");
        span.textContent = category.name;

        label.appendChild(input);
        label.appendChild(span);
        containers[category.type].appendChild(label);
    });

    // Add filter control buttons
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