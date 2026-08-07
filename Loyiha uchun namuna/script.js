document.addEventListener("DOMContentLoaded", () => {
  const stage = document.getElementById("carouselStage");
  const ring = document.getElementById("carouselRing");
  const cards = document.querySelectorAll(".card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("dots");

  const totalCards = cards.length;
  const angleStep = 360 / totalCards; // 8 ta kartaga 45°, 360ni 8 ga bo'lganda 45° bo'ladi

  // Kichraytirilgan cardlar uchun optimal radius
  function getRadius() {
    return window.innerWidth < 480 ? 300 : 380;
  }

  let radius = getRadius();
  let currentIndex = 2; // Boshlang'ich markaziy card
  let rotationAngle = -currentIndex * angleStep;

  // Drag variables
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;

  // 1. Cardlarni doira bo'ylab 3D xavfsiz masofada joylashtirish
  function positionCards() {
    radius = getRadius();
    cards.forEach((card, index) => {
      const cardAngle = index * angleStep;
      card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
    });
  }

  // 2. Dots
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => goToIndex(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  // 3. FAQAT oxirgi <-> birinchi o'tishida 360 Spin ishlatuvchi funksiya
  function triggerBoundary360Spin() {
    cards.forEach((card) => {
      card.classList.add("spin-360");
      setTimeout(() => {
        card.classList.remove("spin-360");
      }, 850);
    });
  }

  // 4. Karuselni yangilash
  function updateCarousel(isBoundaryJump = false) {
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
        card.style.opacity = Math.max(0.2, 1 - diff * 0.3);
        card.style.filter = `blur(${diff * 1.8}px)`;
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === normalizedCurrent);
    });

    if (isBoundaryJump) {
      triggerBoundary360Spin();
    }
  }

  function nextSlide() {
    const oldNormalized =
      ((currentIndex % totalCards) + totalCards) % totalCards;
    currentIndex++;
    const newNormalized =
      ((currentIndex % totalCards) + totalCards) % totalCards;

    const isBoundary = oldNormalized === totalCards - 1 && newNormalized === 0;

    rotationAngle -= angleStep;
    updateCarousel(isBoundary);
  }

  function prevSlide() {
    const oldNormalized =
      ((currentIndex % totalCards) + totalCards) % totalCards;
    currentIndex--;
    const newNormalized =
      ((currentIndex % totalCards) + totalCards) % totalCards;

    const isBoundary = oldNormalized === 0 && newNormalized === totalCards - 1;

    rotationAngle += angleStep;
    updateCarousel(isBoundary);
  }

  function goToIndex(targetIndex) {
    const oldNormalized =
      ((currentIndex % totalCards) + totalCards) % totalCards;

    const isBoundary =
      (oldNormalized === totalCards - 1 && targetIndex === 0) ||
      (oldNormalized === 0 && targetIndex === totalCards - 1);

    let diff = targetIndex - oldNormalized;
    if (diff > totalCards / 2) diff -= totalCards;
    if (diff < -totalCards / 2) diff += totalCards;

    currentIndex += diff;
    rotationAngle = -currentIndex * angleStep;
    updateCarousel(isBoundary);
  }

  // TOUCH & DRAG
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
    dragOffset = (deltaX / 260) * angleStep;
    ring.style.transform = `rotateY(${rotationAngle + dragOffset}deg)`;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    ring.classList.remove("dragging");

    if (dragOffset < -8) {
      nextSlide();
    } else if (dragOffset > 8) {
      prevSlide();
    } else {
      updateCarousel(false);
    }
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
      goToIndex(index);
    });
  });

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // Resize
  window.addEventListener("resize", () => {
    positionCards();
    updateCarousel(false);
  });

  // Init
  positionCards();
  updateCarousel(false);
});
