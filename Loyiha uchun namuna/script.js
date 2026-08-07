document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("dots");

  let currentIndex = Math.floor(cards.length / 2); // Markaziy kartadan boshlash

  // Indikator nuqtalarini hosil qilish
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (index === currentIndex) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  // Coverflow 3D positsiyasini yangilash
  function updateCoverflow() {
    cards.forEach((card, index) => {
      const offset = index - currentIndex;
      const absOffset = Math.abs(offset);

      if (offset === 0) {
        // Markaziy karta
        card.style.transform = `translateX(0px) translateZ(100px) rotateY(0deg)`;
        card.style.opacity = "1";
        card.style.zIndex = "10";
        card.style.filter = "blur(0px)";
        card.classList.add("active");
      } else {
        // Yon tomondagi kartalar
        const direction = offset > 0 ? 1 : -1;
        const translateX = direction * (160 + (absOffset - 1) * 60);
        const translateZ = -100 * absOffset;
        const rotateY = -direction * 45; // 3D burilish burchagi

        card.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
        card.style.opacity = absOffset > 3 ? "0" : `${1 - absOffset * 0.25}`;
        card.style.zIndex = `${10 - absOffset}`;
        card.style.filter = `blur(${absOffset * 1.5}px)`;
        card.classList.remove("active");
      }
    });

    // Indikatorlarni yangilash
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCoverflow();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCoverflow();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCoverflow();
  }

  // Tugmalar hodisalari
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Kartalarni bosganda unga o'tish
  cards.forEach((card, index) => {
    card.addEventListener("click", () => goToSlide(index));
  });

  // Klaviatura strelkalari orqali boshqarish
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  // Boshlang'ich holatni yuklash
  updateCoverflow();
});
