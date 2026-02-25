// 🔗 CONFIGURACIÓN - Detecta ambiente (local o Netlify)
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : '/.netlify/functions';

// Carga datos desde la API
async function loadServices() {
    try {
        const endpoint = window.location.hostname === 'localhost'
            ? `${API_URL}/items`
            : `${API_URL}/items`;
        
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Error en la API');
        return await response.json();
    } catch (error) {
        console.error('Error cargando servicios:', error);
        return {
            items: [],
            grouped: {},
            max_price: 0
        };
    }
}

// Renderiza las tarjetas de servicios
function createServiceCard(item, maxPrice, isPremium = false) {
    const price = parseFloat(item['Precio']?.toString().replace(/\./g, '').replace(/,/g, '.') || '0');
    const isMax = price === maxPrice;
    const nombre = item['Nombre de lavado'] || 'Servicio';
    const descripcion = item['Descripcion'] || '';
    const tiempo = item['Demora'] || 'N/A';
    const detalle = item['Detalle de lavado'] || '';
    
    const detallesList = detalle
        .split('\n')
        .filter(line => line.trim())
        .map(line => `<div class="flex items-start">
                        <span class="text-white mr-3 flex-shrink-0">✓</span>
                        <span>${line.trim().toLowerCase().charAt(0).toUpperCase() + line.trim().toLowerCase().slice(1)}</span>
                    </div>`)
        .join('');

    if (isMax) {
        // Estilo Premium (Dorado/Naranja)
        return `
            <div class="service-card flex-shrink-0 w-80 h-auto min-h-[18rem] bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-3xl p-4 relative overflow-hidden cursor-pointer" style="perspective: 1000px;">
                <div class="service-card-inner w-full h-full relative transition-transform duration-500" style="transform-style: preserve-3d;">
                    <!-- Front -->
                    <div class="service-card-front w-full h-full absolute inset-0 p-4 flex flex-col" style="backface-visibility: hidden;">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="bg-white/20 backdrop-blur-sm w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                            </div>
                            <h4 class="text-lg font-bold mb-0 whitespace-nowrap uppercase">${nombre}</h4>
                        </div>
                        <p class="text-sm leading-snug mb-2" style="text-align: justify;">${descripcion}</p>
                        <div class="border-t border-white/30 pt-2 pb-1 mb-2">
                            <div class="flex justify-between items-center">
                                <span class="text-white/90 text-xs">Precio:</span>
                                <span class="text-lg font-bold">${item['Precio']} Gs</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-white/90 text-xs">Duración:</span>
                                <span class="text-white/90 text-xs">${tiempo}</span>
                            </div>
                        </div>
                        <div class="flex gap-2 mt-2">
                            <a href="https://wa.me/595972614469?text=Hola!%20Me%20interesaría%20agendar%20el%20${encodeURIComponent(nombre)}" target="_blank" class="flex-1 block w-full bg-white text-orange-500 text-center py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-sm">
                                Agendar 
                            </a>
                            <button class="flip-btn flex-1 bg-white text-orange-500 text-center py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-sm">
                                Ver más
                            </button>
                        </div>
                    </div>
                    <!-- Back -->
                    <div class="service-card-back w-full h-full absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-3xl" style="backface-visibility: hidden; transform: rotateY(180deg);">
                        <div>
                            <h4 class="text-lg font-bold mb-6 text-center">Detalle de lavado</h4>
                            <div class="detail-container flex-grow flex flex-col">
                                <blockquote class="detail-list text-white/90 text-xs leading-tight space-y-2 mb-2 pl-3 border-l-2 border-white/30 italic">
                                    ${detallesList}
                                </blockquote>
                            </div>
                        </div>
                        <button class="flip-btn w-full bg-white text-orange-500 text-center py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-sm">
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Estilo Estándar
        let bgColor = 'bg-white';
        let textColor = 'text-blue-700';
        let darkBg = 'bg-blue-50';
        let darkText = 'text-blue-800';
        
        if (isPremium) {
            bgColor = 'bg-blue-600 text-white border-2 border-blue-700';
            textColor = 'text-white';
            darkBg = 'bg-blue-700';
            darkText = 'text-white';
        }
        
        return `
            <div class="service-card flex-shrink-0 w-80 h-auto min-h-[18rem] ${bgColor} ${isPremium ? '' : 'border-2 border-blue-200'} rounded-3xl p-4 relative overflow-hidden cursor-pointer" style="perspective: 1000px;">
                <div class="service-card-inner w-full h-full relative transition-transform duration-500" style="transform-style: preserve-3d;">
                    <!-- Front -->
                    <div class="service-card-front w-full h-full absolute inset-0 p-4 flex flex-col" style="backface-visibility: hidden;">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="${isPremium ? 'bg-white/20' : 'bg-blue-50'} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 ${isPremium ? 'text-white' : 'text-blue-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h4 class="text-lg font-bold ${textColor} m-0 uppercase">${nombre}</h4>
                        </div>
                        <p class="text-sm leading-snug mb-2 ${isPremium ? 'text-white/90' : 'text-blue-800'}">${descripcion}</p>
                        <div class="border-t ${isPremium ? 'border-blue-600' : 'border-gray-200'} pt-2 pb-1 mb-2">
                            <div class="flex justify-between items-center">
                                <span class="${isPremium ? 'text-white' : 'text-blue-700'} text-xs">Precio:</span>
                                <span class="text-lg font-bold ${textColor}">${item['Precio']} Gs</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="${isPremium ? 'text-white/90' : 'text-blue-500'} text-xs">Duración:</span>
                                <span class="${isPremium ? 'text-white/90' : 'text-blue-500'} text-xs">${tiempo}</span>
                            </div>
                        </div>
                        <div class="flex gap-2 mt-2">
                            <a href="https://wa.me/595972614469?text=Hola!%20Me%20interesaría%20agendar%20el%20${encodeURIComponent(nombre)}" target="_blank" class="flex-1 block w-full ${isPremium ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} text-center py-2 rounded-full font-bold hover:opacity-80 transition text-sm">
                                Agendar
                            </a>
                            <button class="flip-btn flex-1 ${isPremium ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'} text-center py-2 rounded-full font-bold hover:opacity-80 transition text-sm">
                                Ver más
                            </button>
                        </div>
                    </div>
                    <!-- Back -->
                    <div class="service-card-back w-full h-full absolute inset-0 p-4 flex flex-col justify-between ${isPremium ? 'bg-blue-700' : 'bg-blue-50'} ${darkText} rounded-3xl" style="backface-visibility: hidden; transform: rotateY(180deg);">
                        <div>
                            <h4 class="text-lg font-bold mb-6 text-center ${isPremium ? 'text-white' : ''}">Detalle de lavado</h4>
                            <div class="detail-container flex flex-col">
                                <blockquote class="detail-list ${isPremium ? 'text-white' : 'text-blue-700'} text-sm leading-tight space-y-2 mb-2 pl-3 border-l-2 ${isPremium ? 'border-white/30' : 'border-blue-200'} italic">
                                    ${detallesList}
                                </blockquote>
                            </div>
                        </div>
                        <button class="flip-btn w-full ${isPremium ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} text-center py-2 rounded-full font-bold hover:opacity-80 transition text-sm">
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Renderiza todas las tarjetas
async function renderServices() {
    const data = await loadServices();
    
    const standardTrack = document.getElementById('standard-track');
    const premiumTrack = document.getElementById('premium-track');
    
    if (!standardTrack || !premiumTrack) {
        console.error('Tracks no encontrados');
        return;
    }

    const standardItems = data.grouped?.['Estandar'] || [];
    const premiumItems = data.grouped?.['Premium'] || [];
    const maxPrice = data.max_price || 0;

    // Renderizar estándar
    standardTrack.innerHTML = standardItems
        .map(item => createServiceCard(item, maxPrice, false))
        .join('');

    // Renderizar premium
    premiumTrack.innerHTML = premiumItems
        .map(item => createServiceCard(item, maxPrice, true))
        .join('');

    // Re-inicializar funcionalidad después de renderizar
    initializeAfterRender();
}

// Inicializa funcionalidad después de renderizar
function initializeAfterRender() {
    // Service Card Flip
    const flipButtons = document.querySelectorAll('.flip-btn');
    flipButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const inner = btn.closest('.service-card-inner');
            if (inner) {
                const isFlipped = inner.style.transform === 'rotateY(180deg)';
                inner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
            }
        });
    });

    // Reinicializar sliders
    initSlider('standard-track', 'standard-prev', 'standard-next');
    initSlider('premium-track', 'premium-prev', 'premium-next');
}

// Función helper para sliders
function initSlider(trackId, prevId, nextId) {
    const track = document.getElementById(trackId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    
    if (!track || !prev || !next) {
        console.warn(`Slider ${trackId} missing elements`);
        return;
    }

    const cards = Array.from(track.children);
    if (!cards.length) {
        console.warn(`Slider ${trackId} has no cards`);
        return;
    }

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

    window.addEventListener('resize', update);
    update();
}

document.addEventListener('DOMContentLoaded', function() {
    // ========== Hide header on scroll down ==========
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

    // ========== Smooth scroll ==========
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

    // ========== Header shadow on scroll ==========
    window.addEventListener('scroll', () => {
        if (header && window.scrollY > 50) {
            header.classList.add('shadow-xl');
        } else if (header) {
            header.classList.remove('shadow-xl');
        }
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

    // Auto-rotate
    if (totalSlides > 1) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }, 1500);
    }

    // ========== Cargar servicios dinámicamente ==========
    renderServices();
});
