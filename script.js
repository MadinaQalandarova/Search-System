// ==========================================
// RASMLAR MA'LUMOTI
// ==========================================
const places = [
  {
    title: "Zaamin Mountains",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Charvak Lake",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Chimgan Ridges",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Aydarkul Lake",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Nuratau Mountains",
    image:
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
  },
];

const galleryContainer = document.getElementById("gallery");

function renderCards() {
  galleryContainer.innerHTML = "";

  places.forEach((place, index) => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Boshlanishida birinchi karta ochiq turadi
    if (index === 0) {
      card.classList.add("active");
    }

    card.style.backgroundImage = `url('${place.image}')`;

    card.innerHTML = `
      <div class="card-content">
        <div class="indicator-line"></div>
        <h3 class="card-title">${place.title}</h3>
      </div>
    `;

    // Sichqoncha rasm ustiga kelganda (hover qilinganda) ishlaydi
    card.addEventListener("mouseenter", () => setActiveCard(card));

    galleryContainer.appendChild(card);
  });
}

function setActiveCard(selectedCard) {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => card.classList.remove("active"));
  selectedCard.classList.add("active");
}

renderCards();
