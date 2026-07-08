(function () {
  "use strict";

  // Initialize EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init({ publicKey: "3cKwWQY4Y7DysxCXs" });
  }

  // ===== Smooth Scroll + Mobile Menu Close =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // Close mobile menu on link click
      const navLinks = document.querySelector(".nav-links");
      const mobileBtn = document.querySelector(".mobile-menu");
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ===== Merged Scroll Listener =====
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  function handleScroll() {
    // Navbar background effect
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active nav link (scrollspy)
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // ===== Intersection Observer for Section Animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    sectionObserver.observe(section);
  });

  // ===== Skill Bars Animation =====
  const skillBars = document.querySelectorAll(".skill-progress");
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.dataset.width;
        if (targetWidth) {
          bar.style.width = targetWidth;
        }
        skillObserver.unobserve(bar);
      }
    });
  }, observerOptions);

  skillBars.forEach((bar) => skillObserver.observe(bar));

  // ===== Contact Form =====
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  const submitBtn = contactForm.querySelector(".submit-btn");

  function showFormFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.className = "form-feedback show " + type;
  }

  function clearFormFeedback() {
    formFeedback.textContent = "";
    formFeedback.className = "form-feedback";
  }

  function clearFieldErrors() {
    document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".form-group input, .form-group textarea").forEach((el) => {
      el.classList.remove("error");
    });
  }

  function validateField(id) {
    const input = document.getElementById(id);
    const error = input.parentElement.querySelector(".field-error");
    input.classList.remove("error");
    error.textContent = "";

    if (!input.value.trim()) {
      input.classList.add("error");
      error.textContent = "This field is required";
      return false;
    }

    if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      input.classList.add("error");
      error.textContent = "Please enter a valid email address";
      return false;
    }

    return true;
  }

  function validateForm() {
    const fields = ["name", "email", "subject", "message"];
    let valid = true;
    fields.forEach((id) => {
      if (!validateField(id)) valid = false;
    });
    return valid;
  }

  // Real-time validation on blur
  ["name", "email", "subject", "message"].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener("blur", function () {
      if (this.value.trim()) {
        this.classList.remove("error");
        const error = this.parentElement.querySelector(".field-error");
        if (error) error.textContent = "";
        if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim())) {
          this.classList.add("error");
          if (error) error.textContent = "Please enter a valid email address";
        }
      }
    });
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFormFeedback();
    clearFieldErrors();

    if (!validateForm()) {
      showFormFeedback("Please fix the errors above.", "error");
      return;
    }

    const params = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: document.getElementById("message").value.trim(),
      time: new Date().toLocaleString(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    emailjs
      .send("service_rf263jd", "template_7gvrrsj", params)
      .then(
        () => {
          showFormFeedback("Email sent successfully! I'll get back to you soon.", "success");
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        },
        (err) => {
          console.error("Email send failed:", err);
          showFormFeedback("Something went wrong. Please try again later.", "error");
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Message";
        }
      );
  });

  // ===== Mobile Menu Toggle =====
  const mobileMenu = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  mobileMenu.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("active");
    this.setAttribute("aria-expanded", isOpen);
  });

  // Keyboard support for mobile menu (Enter/Space handled by default on <button>)

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  function setTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-mode");
      themeIcon.className = "fas fa-sun";
    } else {
      document.body.classList.remove("light-mode");
      themeIcon.className = "fas fa-moon";
    }
    localStorage.setItem("theme", theme);
  }

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    setTheme("light");
  }

  themeToggle.addEventListener("click", function () {
    const isLight = document.body.classList.contains("light-mode");
    setTheme(isLight ? "dark" : "light");
  });

  // ===== Particle System (Bounded) =====
  const MAX_PARTICLES = 12;
  let activeParticles = 0;

  function createParticle() {
    if (activeParticles >= MAX_PARTICLES) return;
    activeParticles++;

    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    const size = Math.random() * 10 + 5;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 4 + 4 + "s";

    particle.addEventListener("animationend", function () {
      particle.remove();
      activeParticles--;
    });

    document.querySelector(".hero").appendChild(particle);
  }

  setInterval(createParticle, 3000);
})();
