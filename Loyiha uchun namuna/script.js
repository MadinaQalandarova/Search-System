document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector(".carousel-stage");
  const ring = document.getElementById("carouselRing");
  const cards = document.querySelectorAll(".card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("dots");

  const totalCards = cards.length;
  const angleStep = 360 / totalCards; // 8 ta kartaga 45°

  // Ekran o'lchamiga qarab doira radiusini hisoblash (Responsivlik uchun)
  function getRadius() {
    return window.innerWidth < 480 ? 220 : 320;
  }

  let radius = getRadius();
  let currentIndex = 2; // Uzbekistan App kartasi
  let rotationAngle = -currentIndex * angleStep;

  // Touch va Drag o'zgaruvchilari
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;

  // 1. Kartalarni doira bo'yicha 3D joylashtirish
  function positionCards() {
    radius = getRadius();
    cards.forEach((card, index) => {
      const cardAngle = index * angleStep;
      card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
    });
  }

  // 2. Dots yaratish
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => rotateTo(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  // 3. Kartalarning o'zi 360° aylanadigan animatsiyani tetiklash
  function triggerSelfSpin() {
    cards.forEach((card) => {
      card.classList.add("spin");
      setTimeout(() => {
        card.classList.remove("spin");
      }, 800); // Animatsiya davomiyligi
    });
  }

  // 4. Karusel holatini yangilash
  function updateCarousel() {
    ring.style.transform = `rotateY(${rotationAngle}deg)`;

    const normalizedCurrent =
      ((currentIndex % totalCards) + totalCards) % totalCards;

    cards.forEach((card, index) => {
      let diff = Math.abs(index - normalizedCurrent);
      if (diff > totalCards / 2) {
        diff = totalCards - diff;
      }

      if (index === normalizedCurrent) {
        card.classList.add("active");
        card.style.opacity = "1";
        card.style.filter = "blur(0px)";
      } else {
        card.classList.remove("active");
        card.style.opacity = Math.max(0.15, 1 - diff * 0.35);
        card.style.filter = `blur(${diff * 2}px)`;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === normalizedCurrent);
    });

    // Har bir karta almashganda ularning o'zini 360° ga aylantiramiz
    triggerSelfSpin();
  }

  function rotateTo(targetIndex) {
    currentIndex = targetIndex;
    rotationAngle = -currentIndex * angleStep;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex++;
    rotationAngle -= angleStep;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex--;
    rotationAngle += angleStep;
    updateCarousel();
  }

  // Touch va Mouse Drag
  function startDrag(e) {
    isDragging = true;
    ring.classList.add("dragging");
    startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    dragOffset = 0;
  }

  function moveDrag(e) {
    if (!isDragging) return;
    const currentX = e.type.includes("touch")
      ? e.touches[0].clientX
      : e.clientX;
    const deltaX = currentX - startX;
    dragOffset = (deltaX / 250) * angleStep;
    ring.style.transform = `rotateY(${rotationAngle + dragOffset}deg)`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    ring.classList.remove("dragging");

    if (dragOffset < -8) {
      currentIndex++;
    } else if (dragOffset > 8) {
      currentIndex--;
    }

    rotationAngle = -currentIndex * angleStep;
    updateCarousel();
  }

  // Event Listeners
  stage.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", endDrag);

  stage.addEventListener("touchstart", startDrag, { passive: true });
  window.addEventListener("touchmove", moveDrag, { passive: true });
  window.addEventListener("touchend", endDrag);

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (Math.abs(dragOffset) > 5) return;
      const normalizedCurrent =
        ((currentIndex % totalCards) + totalCards) % totalCards;
      let diff = index - normalizedCurrent;

      if (diff > totalCards / 2) diff -= totalCards;
      if (diff < -totalCards / 2) diff += totalCards;

      currentIndex += diff;
      rotationAngle = -currentIndex * angleStep;
      updateCarousel();
    });
  });

  // Klaviatura
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // Ekran o'lchami o'zgarganda qayta hisoblash
  window.addEventListener("resize", () => {
    positionCards();
    updateCarousel();
  });

  // Boshlang'ich joylashtirish
  positionCards();
  updateCarousel();
});
