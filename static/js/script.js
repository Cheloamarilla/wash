

document.addEventListener('DOMContentLoaded', function() {
// Mobile Menu Toggle
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

        // cuando se toca un link se cierra el menu movil
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenu.classList.add('hidden');
            });
        });
    } else {
        console.error('Mobile menu elements not found');
    }
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
