document.addEventListener('DOMContentLoaded', function() {
  const bgVideo = document.getElementById('bgVideo');
  if (bgVideo) {
    bgVideo.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    });
  }

  // Highlight nav links on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul li a');

  function activateNavLink() {
    let scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 70;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', activateNavLink);

  // Animate About Section on scroll
  const aboutSection = document.querySelector('#about');
  function checkAboutInView() {
    const triggerPoint = window.innerHeight * 0.8;
    const aboutTop = aboutSection.getBoundingClientRect().top;
    if (aboutTop < triggerPoint) {
      aboutSection.classList.add('active');
      window.removeEventListener('scroll', checkAboutInView);
    }
  }
  window.addEventListener('scroll', checkAboutInView);

  // Animate testimonials on scroll
  const testimonials = document.querySelectorAll('.testimonial');
  function checkTestimonialsInView() {
    testimonials.forEach(testimonial => {
      const triggerPoint = window.innerHeight * 0.9;
      const top = testimonial.getBoundingClientRect().top;
      if (top < triggerPoint) {
        testimonial.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', checkTestimonialsInView);

  // Burger menu toggle for mobile
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');
  burger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    burger.classList.toggle('open');
  });
  // Optional: Close menu when a link is clicked (mobile)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      burger.classList.remove('open');
    });
  });

  // Lightbox functionality for portfolio images with arrows
  const galleryImages = document.querySelectorAll('#portfolio .gallery img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const leftArrow = lightbox.querySelector('.lightbox-arrow.left');
  const rightArrow = lightbox.querySelector('.lightbox-arrow.right');
  let currentIndex = 0;

  function showImage(index, direction = 0) {
    const total = galleryImages.length;
    const newIndex = (index + total) % total;
    if (direction !== 0) {
      // Slide out current image
      lightboxImg.classList.remove('slide-in-left', 'slide-in-right');
      lightboxImg.classList.add(direction === -1 ? 'slide-out-left' : 'slide-out-right');
      setTimeout(() => {
        lightboxImg.classList.remove('slide-out-left', 'slide-out-right');
        lightboxImg.src = galleryImages[newIndex].src;
        lightboxImg.classList.add(direction === -1 ? 'slide-in-right' : 'slide-in-left');
        setTimeout(() => {
          lightboxImg.classList.remove('slide-in-left', 'slide-in-right');
        }, 10);
      }, 300);
    } else {
      lightboxImg.src = galleryImages[newIndex].src;
    }
    currentIndex = newIndex;
  }

  galleryImages.forEach((img, idx) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(idx);
      lightbox.classList.remove('hidden');
    });
  });

  leftArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1, -1);
  });

  rightArrow.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1, 1);
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  });

  // Hide/show navbar on scroll
  let lastScrollTop = 0;
  const navbar = document.querySelector('nav');

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // Detect mobile
    const isMobile = window.innerWidth <= 600;
    // Move further up on desktop (e.g. -120px), adjust as needed
    const hideY = isMobile ? '-120px' : '-120px';

    if (scrollTop > lastScrollTop && scrollTop > 50) {
      // Scrolling down
      navbar.style.transform = `translateY(${hideY})`;
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

(() => {
  const slides = document.querySelectorAll('.slide');
  const slidesContainer = document.querySelector('.slides');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  let currentIndex = 0;
  let slideInterval;

  function updateSlidePosition() {
    slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlidePosition();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlidePosition();
  }

  next.addEventListener('click', () => { nextSlide(); resetInterval(); });
  prev.addEventListener('click', () => { prevSlide(); resetInterval(); });

  function startInterval() {
    slideInterval = setInterval(nextSlide, 3000);
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  updateSlidePosition();
  startInterval();
})();

});


