// Mobile Menu Toggle (no burger on mobile now, but keep guard for safety)
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isActive = mobileMenu.classList.toggle('active');
            mobileMenu.classList.toggle('hidden', !isActive);
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
            }
        });

        // Close with ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
            }
        });
    }
});

// Hide header on scroll down, show on scroll up
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    if (!header) return;
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
});

// Scroll suave al tocar links con # anclas)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // previene el salto brusco
        const target = document.querySelector(this.getAttribute('href')); // obtiene el elemento objetivo
        if (target) {
            const headerOffset = 80; // ajusta este valor segun la altura del header fijo
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// agrega sombra al header al hacer scroll)
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 50) {
        header.classList.add('shadow-xl');
    } else {
        header.classList.remove('shadow-xl');
    }
});

// Service Card Flip Functionality





// Carousel Functionality 
document.addEventListener('DOMContentLoaded', function () {

    const wrapper = document.getElementById('carousel-wrapper');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');

    if (!wrapper || !next || !prev) return;

    const scrollAmount = 344; // 320px card + gap

    next.addEventListener('click', function () {
        wrapper.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    prev.addEventListener('click', function () {
        wrapper.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

});

    
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        const totalSlides = slides.length;

        function updateCarousel() { // función para actualizar el carrusel  }
            slides.forEach((slide, index) => {
                slide.style.opacity = index === currentSlide ? '1' : '0';
            });
            dots.forEach((dot, index) => {
                dot.style.backgroundColor = index === currentSlide ? 'white' : 'rgba(255,255,255,0.6)';
            });
        }

        const nextBtn = document.getElementById('carouselNext'); // botones de siguiente y anterior (aunque no se usan en este caso  )
        const prevBtn = document.getElementById('carouselPrev'); // botones de siguiente y anterior (aunque no se usan en este caso  )

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateCarousel();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                currentSlide = parseInt(e.target.dataset.slide);
                updateCarousel();
            });
        });

        updateCarousel();

        // Auto-rotate every 1 second
        if (totalSlides > 1) {
            setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateCarousel();
            }, 1500);
        }
        
  
        document.addEventListener('DOMContentLoaded', () => {
            // Flip button handler
            document.querySelectorAll('.flip-btn').forEach(btn => { // Selecciona todos los botones con la clase 'flip-btn'  }
                btn.addEventListener('click', () => {
                    const inner = btn.closest('.service-card-inner');
                    if (!inner) {
                        return; // Seguridad por si no se encuentra el contenedor
                    }
                    const isFlipped = inner.style.transform === 'rotateY(180deg)';
                    inner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
                });
            });

            // Toggle detail expand/collapse handler // Maneja la expansión y contracción de los detalles  }
            document.querySelectorAll('.toggle-detail').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const container = btn.closest('.detail-container');
                    const detailList = container.querySelector('.detail-list');
                    const isExpanded = detailList.style.maxHeight === '12rem';
                    
                    if (isExpanded) {
                        detailList.style.maxHeight = '8rem';
                        btn.textContent = 'Ver más detalles';
                    } else {
                        detailList.style.maxHeight = '12rem';
                        btn.textContent = 'Ver menos';
                    }
                });
            });
        });

        document.addEventListener('DOMContentLoaded', () => {
            const initSlider = (trackId, prevId, nextId) => {
                const track = document.getElementById(trackId);
                const prev = document.getElementById(prevId);
                const next = document.getElementById(nextId);
                if (!track || !prev || !next) return;

                const cards = Array.from(track.children);
                if (!cards.length) return;

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
                    
                    // Si todas las tarjetas caben en la pantalla, max index es 0
                    if (totalCardsWidth + gaps <= containerWidth) {
                        return 0;
                    }
                    
                    // Calcular cuántas posiciones se pueden scrollear
                    const step = getStep();
                    const maxScroll = totalCardsWidth + gaps - containerWidth;
                    return Math.ceil(maxScroll / step);
                };

                const update = () => {
                    const step = getStep();
                    const maxIdx = getMaxIndex();

                    // Ajustar índice si el resize hace que todo quepa
                    if (index > maxIdx) {
                        index = maxIdx;
                    }

                    // Ocultar flechas si no se necesita scroll
                    const hideArrows = maxIdx === 0;
                    prev.style.display = hideArrows ? 'none' : '';
                    next.style.display = hideArrows ? 'none' : '';

                    // Centrar si no hace falta scroll
                    track.style.justifyContent = hideArrows ? 'center' : 'flex-start';

                    track.style.transform = `translateX(-${index * step}px)`;
                };

                prev.addEventListener('click', () => {
                    if (index > 0) {
                        index--;
                        update();
                    }
                });

                next.addEventListener('click', () => {
                    const maxIdx = getMaxIndex();
                    if (index < maxIdx) {
                        index++;
                        update();
                    }
                });

                // Recalculate on resize to keep alignment
                window.addEventListener('resize', update);
                update();
            };

            initSlider('standard-track', 'standard-prev', 'standard-next');
            initSlider('premium-track', 'premium-prev', 'premium-next');
        });
