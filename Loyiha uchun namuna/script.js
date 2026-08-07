document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector(".carousel-stage");
  const ring = document.getElementById("carouselRing");
  const cards = document.querySelectorAll(".card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("dots");

  const totalCards = cards.length;
  const angleStep = 360 / totalCards; // 8 ta kartaga 45 gradusdan
  const radius = 340; // Doira radiusi (ixchamlashtirildi)

  let currentIndex = 2; // Boshlanishdagi karta (Uzbekistan App)
  let rotationAngle = -currentIndex * angleStep;

  // Drag (Surish) o'zgaruvchilari
  let isDragging = false;
  let startX = 0;
  let currentDragAngle = 0;
  let dragOffset = 0;

  // 1. Kartalarni 3D halqaga joylash
  cards.forEach((card, index) => {
    const cardAngle = index * angleStep;
    card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
  });

  // 2. Indikatorlarni yaratish
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => rotateTo(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  // 3. Karuselni yangilash
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
        card.style.opacity = Math.max(0.15, 1 - diff * 0.3);
        card.style.filter = `blur(${diff * 2}px)`;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === normalizedCurrent);
    });
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

  // --- TOUCH & MOUSE DRAG EVENTLARI ---

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

    // Surish masofasini gradusga o'tkazish
    dragOffset = (deltaX / 300) * angleStep;
    ring.style.transform = `rotateY(${rotationAngle + dragOffset}deg)`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    ring.classList.remove("dragging");

    // Surilgan tomonga qarab eng yaqin kartaga moslash
    if (dragOffset < -10) {
      currentIndex++;
    } else if (dragOffset > 10) {
      currentIndex--;
    }

    rotationAngle = -currentIndex * angleStep;
    updateCarousel();
  }

  // Mouse Hodisalari
  stage.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("mouseup", endDrag);

  // Touch (Telefon/Planshet) Hodisalari
  stage.addEventListener("touchstart", startDrag, { passive: true });
  window.addEventListener("touchmove", moveDrag, { passive: true });
  window.addEventListener("touchend", endDrag);

  // Navigatsiya tugmalari
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Kartani bosganda o'sha kartaga burilish
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (Math.abs(dragOffset) > 5) return; // Drag qilganda click ishlashini oldini olish
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

  // Boshlang'ich holat
  updateCarousel();
});
