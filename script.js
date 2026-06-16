const revealElements = document.querySelectorAll(".reveal");
const zoomableCards = document.querySelectorAll(".mosaic-card");

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

if (zoomableCards.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Zavřít náhled">×</button>
    <button class="lightbox-arrow lightbox-prev" type="button" aria-label="Předchozí fotografie">‹</button>
    <img alt="Zvětšený náhled">
    <button class="lightbox-arrow lightbox-next" type="button" aria-label="Další fotografie">›</button>
  `;
  document.body.appendChild(lightbox);

  const galleryItems = Array.from(zoomableCards)
    .map((card) => ({
      card,
      image: card.querySelector("img"),
    }))
    .filter((item) => item.image);
  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  let activeImageIndex = 0;

  const showImage = (index) => {
    activeImageIndex = (index + galleryItems.length) % galleryItems.length;
    const image = galleryItems[activeImageIndex].image;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightboxImage.removeAttribute("src");
  };

  galleryItems.forEach((item, index) => {
    item.card.addEventListener("click", (event) => {
      event.preventDefault();
      showImage(index);
      lightbox.classList.add("is-open");
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => showImage(activeImageIndex - 1));
  nextButton.addEventListener("click", () => showImage(activeImageIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showImage(activeImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showImage(activeImageIndex + 1);
    }
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
