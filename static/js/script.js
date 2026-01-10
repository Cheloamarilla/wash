document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded successfully');
    
    // ========== Hide header on scroll down, show on scroll up ==========
    const header = document.querySelector('header');
    if (header) {
        let lastY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            const goingDown = currentY > lastY + 5;
            const goingUp = currentY < lastY - 5;
            if (goingDown && currentY > 80) {
                header.classList.add('hide-header');
            } else if (goingUp || currentY <= 80) {
                header.classList.remove('hide-header');
            }
            lastY = currentY;
        });
    }

    // ========== Scroll suave al tocar links con # anclas ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Agrega sombra al header al hacer scroll ==========
    window.addEventListener('scroll', () => {
        if (header && window.scrollY > 50) {
            header.classList.add('shadow-xl');
        } else if (header) {
            header.classList.remove('shadow-xl');
        }
    });

    // ========== Service Card Flip Functionality ==========
    const flipButtons = document.querySelectorAll('.flip-btn');
    console.log('Flip buttons found:', flipButtons.length);
    
    flipButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('Flip button clicked');
            e.preventDefault();
            e.stopPropagation();
            const inner = btn.closest('.service-card-inner');
            if (inner) {
                const isFlipped = inner.style.transform === 'rotateY(180deg)';
                inner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
                console.log('Card flipped:', !isFlipped);
            }
        });
    });

    // ========== Carousel Functionality ==========
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const totalSlides = slides.length;

    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.style.opacity = index === currentSlide ? '1' : '0';
        });
        dots.forEach((dot, index) => {
            dot.style.backgroundColor = index === currentSlide ? 'white' : 'rgba(255,255,255,0.6)';
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentSlide = parseInt(e.target.dataset.slide);
            updateCarousel();
        });
    });

    updateCarousel();

    // Auto-rotate every 1.5 seconds
    if (totalSlides > 1) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }, 1500);
    }

    // ========== Service Sliders (Standard & Premium) ==========
    const initSlider = (trackId, prevId, nextId) => {
        const track = document.getElementById(trackId);
        const prev = document.getElementById(prevId);
        const next = document.getElementById(nextId);
        
        console.log(`Initializing slider: ${trackId}`, { track, prev, next });
        
        if (!track || !prev || !next) {
            console.warn(`Slider ${trackId} missing elements`);
            return;
        }

        const cards = Array.from(track.children);
        if (!cards.length) {
            console.warn(`Slider ${trackId} has no cards`);
            return;
        }
        
        console.log(`Slider ${trackId} initialized with ${cards.length} cards`);

        let index = 0;

        const getStep = () => {
            const first = cards[0];
            const rect = first.getBoundingClientRect();
            const cs = getComputedStyle(track);
            const gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;
            return rect.width + gap;
        };

        const getMaxIndex = () => {
            const container = track.parentElement;
            const containerWidth = container.clientWidth;
            const totalCardsWidth = cards.reduce((sum, card) => {
                const rect = card.getBoundingClientRect();
                return sum + rect.width;
            }, 0);
            const gaps = (cards.length - 1) * (parseFloat(getComputedStyle(track).gap || '24') || 0);
            
            if (totalCardsWidth + gaps <= containerWidth) {
                return 0;
            }
            
            const step = getStep();
            const maxScroll = totalCardsWidth + gaps - containerWidth;
            return Math.ceil(maxScroll / step);
        };

        const update = () => {
            const step = getStep();
            const maxIdx = getMaxIndex();

            if (index > maxIdx) {
                index = maxIdx;
            }

            const hideArrows = maxIdx === 0;
            prev.style.display = hideArrows ? 'none' : '';
            next.style.display = hideArrows ? 'none' : '';

            track.style.justifyContent = hideArrows ? 'center' : 'flex-start';
            track.style.transform = `translateX(-${index * step}px)`;
        };

        prev.addEventListener('click', () => {
            console.log(`${trackId} prev clicked, current index:`, index);
            if (index > 0) {
                index--;
                update();
            }
        });

        next.addEventListener('click', () => {
            const maxIdx = getMaxIndex();
            console.log(`${trackId} next clicked, current index:`, index, 'max:', maxIdx);
            if (index < maxIdx) {
                index++;
                update();
            }
        });

        window.addEventListener('resize', update);
        update();
    };

    initSlider('standard-track', 'standard-prev', 'standard-next');
    initSlider('premium-track', 'premium-prev', 'premium-next');

});