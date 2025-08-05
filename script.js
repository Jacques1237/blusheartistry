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

// Contact form submission (demo only)
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you for reaching out! We will get back to you soon.');
  e.target.reset();
});


