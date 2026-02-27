// 🔗 CONFIGURACIÓN - Detecta ambiente (local o Netlify)
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_ENDPOINT = isLocalhost ? '/items' : '/.netlify/functions/items';

console.log(`🌐 Ambiente: ${isLocalhost ? 'LOCALHOST' : 'NETLIFY'}`);
console.log(`📡 Endpoint: ${API_ENDPOINT}`);

// Carga datos desde la API
async function loadServices() {
    try {
        console.log(`🔄 Cargando desde: ${API_ENDPOINT}`);
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Datos cargados:', data);
        return data;
    } catch (error) {
        console.error('❌ Error cargando servicios:', error);
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
    let detalle = item['Detalle de lavado'] || '';
    
    // Normalizar saltos de línea (manejar \r\n, \r, \n)
    detalle = detalle.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Dividir por saltos de línea y crear lista HTML
    const detallesArray = detalle
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    console.log(`🎨 Tarjeta "${nombre}": ${detallesArray.length} detalles encontrados`);
    if (detallesArray.length > 0) {
        console.log(`   Primeros detalles:`, detallesArray.slice(0, 2));
    }
    
    // Determinar colores según si es premium o estándar
    const detailTextColor = isPremium ? 'text-white/95' : 'text-blue-700';
    const detailCheckColor = isPremium ? 'text-white' : 'text-blue-600';
    
    const detallesList = detallesArray
        .map(line => `<div class="flex items-start gap-2">
                        <div class="flex-shrink-0">
                            <span class="${detailCheckColor} font-bold text-base">✓</span>
                        </div>
                        <div class="${detailTextColor} font-sans">${line}</div>
                    </div>`)
        .join('') || '<div class="text-center py-4 text-white/90">Sin detalles disponibles</div>';

    console.log(`🔧 HTML para "${nombre}":`, detallesList.substring(0, 150));

    if (isMax) {
        // Estilo Premium (Dorado/Naranja)
        return `
            <div class="service-card flex-shrink-0 w-80 h-[24rem] bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-3xl overflow-hidden cursor-pointer font-sans">
                <div class="service-card-inner w-full h-full relative transition-transform duration-500">
                    <!-- Front -->
                    <div class="service-card-front w-full h-full flex flex-col justify-between p-6">
                        <div class="flex-1 flex flex-col">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="bg-white/20 backdrop-blur-sm w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                    </svg>
                                </div>
                                <h4 class="text-xl font-bold mb-0 uppercase">${nombre}</h4>
                            </div>
                            <p class="text-base leading-relaxed mb-6 flex-1" style="text-align: justify;">${descripcion}</p>
                            <div class="border-t border-white/30 pt-4 pb-2">
                                <div class="flex justify-between items-center mb-3">
                                    <span class="text-white/90 text-sm font-medium">Precio:</span>
                                    <span class="text-2xl font-bold">${item['Precio']} Gs</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-white/90 text-sm font-medium">Duración:</span>
                                    <span class="text-white/90 text-sm font-medium">${tiempo}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-3 pt-2">
                            <a href="https://wa.me/595972614469?text=Hola!%20Me%20interesaría%20agendar%20el%20${encodeURIComponent(nombre)}" target="_blank" class="flex-1 block w-full bg-white text-orange-500 text-center py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-base">
                                Agendar 
                            </a>
                            <button class="flip-btn flex-1 bg-white text-orange-500 text-center py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-base">
                                Ver más
                            </button>
                        </div>
                    </div>
                    <!-- Back -->
                    <div class="service-card-back w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-3xl font-sans">
                        <div class="flex-1 overflow-y-auto">
                            <h4 class="text-xl font-bold mb-5 text-center font-sans">Detalle de lavado</h4>
                            <div class="detail-list text-white/90 text-sm leading-relaxed space-y-1 pl-4 border-l-3 border-white/30">
                                ${detallesList}
                            </div>
                        </div>
                        <button class="flip-btn w-full bg-white text-orange-500 text-center py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-base mt-3">
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
            <div class="service-card flex-shrink-0 w-80 h-[24rem] ${bgColor} ${isPremium ? '' : 'border-2 border-blue-200'} rounded-3xl overflow-hidden cursor-pointer font-sans">
                <div class="service-card-inner w-full h-full relative transition-transform duration-500">
                    <!-- Front -->
                    <div class="service-card-front w-full h-full flex flex-col justify-between p-6">
                        <div class="flex-1 flex flex-col">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="${isPremium ? 'bg-white/20' : 'bg-blue-50'} w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 ${isPremium ? 'text-white' : 'text-blue-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h4 class="text-xl font-bold ${textColor} m-0 uppercase">${nombre}</h4>
                            </div>
                            <p class="text-base leading-relaxed mb-6 flex-1 ${isPremium ? 'text-white/90' : 'text-blue-800'}" style="text-align: justify;">${descripcion}</p>
                            <div class="border-t ${isPremium ? 'border-blue-600' : 'border-gray-200'} pt-4 pb-2">
                                <div class="flex justify-between items-center mb-3">
                                    <span class="${isPremium ? 'text-white' : 'text-blue-700'} text-sm font-medium">Precio:</span>
                                    <span class="text-2xl font-bold ${textColor}">${item['Precio']} Gs</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="${isPremium ? 'text-white/90' : 'text-blue-500'} text-sm font-medium">Duración:</span>
                                    <span class="${isPremium ? 'text-white/90' : 'text-blue-500'} text-sm font-medium">${tiempo}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-3 pt-2">
                            <a href="https://wa.me/595972614469?text=Hola!%20Me%20interesaría%20agendar%20el%20${encodeURIComponent(nombre)}" target="_blank" class="flex-1 block w-full ${isPremium ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'} text-center py-3 rounded-full font-bold hover:opacity-80 transition text-base">
                                Agendar
                            </a>
                            <button class="flip-btn flex-1 ${isPremium ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'} text-center py-3 rounded-full font-bold hover:opacity-80 transition text-base">
                                Ver más
                            </button>
                        </div>
                    </div>
                    <!-- Back -->
                    <div class="service-card-back w-full h-full flex flex-col justify-between p-6 ${isPremium ? 'bg-blue-700' : 'bg-blue-50'} ${darkText} rounded-3xl font-sans">
                        <div class="flex-1 overflow-y-auto">
                            <h4 class="text-xl font-bold mb-5 text-center font-sans">Detalle de lavado</h4>
                            <div class="detail-list ${isPremium ? 'text-white/90' : 'text-blue-700'} text-sm leading-relaxed space-y-1 pl-4 border-l-3 ${isPremium ? 'border-blue-600' : 'border-blue-200'}">
                                ${detallesList}
                            </div>
                        </div>
                        <button class="flip-btn w-full ${isPremium ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'} text-center py-3 rounded-full font-bold hover:opacity-80 transition text-base mt-3">
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
    console.log('🚀 Renderizando servicios...');
    const data = await loadServices();
    console.log('📊 Datos recibidos:', data);
    
    // Log de items con detalles para debugging
    if (data.items && data.items.length > 0) {
        console.log('📝 Primer item completo:', data.items[0]);
        console.log('📝 Detalles de todos los items:', data.items.map((item, idx) => ({
            idx,
            nombre: item['Nombre de lavado'],
            detalle_length: item['Detalle de lavado']?.length || 0,
            detalle_preview: item['Detalle de lavado']?.substring(0, 80) || 'SIN DETALLES'
        })));
    }
    
    const standardTrack = document.getElementById('standard-track');
    const premiumTrack = document.getElementById('premium-track');
    
    console.log('🔍 Elementos encontrados:', { standardTrack, premiumTrack });
    
    if (!standardTrack || !premiumTrack) {
        console.error('❌ Tracks no encontrados');
        return;
    }

    const standardItems = data.grouped?.['Estandar'] || [];
    const premiumItems = data.grouped?.['Premium'] || [];
    const maxPrice = data.max_price || 0;

    console.log('📋 Items encontrados:', { standardItems: standardItems.length, premiumItems: premiumItems.length, maxPrice });

    // Renderizar estándar
    standardTrack.innerHTML = standardItems
        .map(item => createServiceCard(item, maxPrice, false))
        .join('');

    // Renderizar premium
    premiumTrack.innerHTML = premiumItems
        .map(item => createServiceCard(item, maxPrice, true))
        .join('');

    console.log('✅ Servicios renderizados');

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
            const card = btn.closest('.service-card');
            const inner = card?.querySelector('.service-card-inner');
            if (inner) {
                inner.classList.toggle('flipped');
                console.log('✅ Card flipped');
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
