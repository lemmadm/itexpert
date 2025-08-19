// Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                // Close mobile menu if open
                mobileMenu.classList.add('hidden');
            });
        });

        // Client slider functionality
        let currentSlide = 0;
        const slider = document.getElementById('client-slider');
        const totalSlides = 6; // Total number of client cards
        const slidesToShow = window.innerWidth >= 768 ? 3 : 1; // Show 3 on desktop, 1 on mobile
        const maxSlide = totalSlides - slidesToShow;

        function updateSlider() {
            const translateX = -(currentSlide * (100 / slidesToShow));
            slider.style.transform = `translateX(${translateX}%)`;
        }

        function nextSlide() {
            currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = currentSlide <= 0 ? maxSlide : currentSlide - 1;
            updateSlider();
        }

        // Event listeners for navigation buttons
        document.getElementById('next-btn').addEventListener('click', nextSlide);
        document.getElementById('prev-btn').addEventListener('click', prevSlide);

        // Auto-slide every 5 seconds
        setInterval(nextSlide, 5000);

        // Update slider on window resize
        window.addEventListener('resize', () => {
            const newSlidesToShow = window.innerWidth >= 768 ? 3 : 1;
            if (newSlidesToShow !== slidesToShow) {
                location.reload(); // Simple solution for responsive changes
            }
        });