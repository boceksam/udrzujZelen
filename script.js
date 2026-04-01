const revealElements = document.querySelectorAll(".reveal");
const parallaxLayers = document.querySelectorAll(".parallax-layer");
const interactiveCards = document.querySelectorAll(
  ".service-card, .price-card, .gallery-card, .mosaic-card, .hero-photo-card, .feature-list article"
);
const zoomableCards = document.querySelectorAll(".gallery-card, .mosaic-card");
const canUseTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const updateParallax = () => {
  const scrollOffset = window.scrollY * 0.08;
  parallaxLayers.forEach((layer) => {
    layer.style.transform = `translateY(${scrollOffset}px)`;
  });
};

window.addEventListener("scroll", updateParallax, { passive: true });
updateParallax();

if (zoomableCards.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = '<button type="button" aria-label="Zavřít náhled">×</button><img alt="Zvětšený náhled">';
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector("button");

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightboxImage.removeAttribute("src");
  };

  zoomableCards.forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      if (!image) {
        return;
      }

      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

if (canUseTilt) {
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

const testimonialCards = Array.from(document.querySelectorAll(".testimonial-card"));
const prevReview = document.getElementById("prevReview");
const nextReview = document.getElementById("nextReview");
const reviewDots = document.getElementById("reviewDots");

if (testimonialCards.length && reviewDots) {
  let activeIndex = 0;
  let autoplay;

  const renderDots = () => {
    reviewDots.innerHTML = "";
    testimonialCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Přejít na recenzi ${index + 1}`);
      dot.classList.toggle("active", index === activeIndex);
      dot.addEventListener("click", () => {
        activeIndex = index;
        updateCarousel();
        restartAutoplay();
      });
      reviewDots.appendChild(dot);
    });
  };

  const updateCarousel = () => {
    testimonialCards.forEach((card, index) => {
      card.classList.toggle("active", index === activeIndex);
    });

    Array.from(reviewDots.children).forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  };

  const goToNext = () => {
    activeIndex = (activeIndex + 1) % testimonialCards.length;
    updateCarousel();
  };

  const goToPrev = () => {
    activeIndex = (activeIndex - 1 + testimonialCards.length) % testimonialCards.length;
    updateCarousel();
  };

  const restartAutoplay = () => {
    window.clearInterval(autoplay);
    autoplay = window.setInterval(goToNext, 4800);
  };

  prevReview?.addEventListener("click", () => {
    goToPrev();
    restartAutoplay();
  });

  nextReview?.addEventListener("click", () => {
    goToNext();
    restartAutoplay();
  });

  renderDots();
  updateCarousel();
  restartAutoplay();
}
