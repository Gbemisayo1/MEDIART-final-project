document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const images = Array.from(track.querySelectorAll("img"));
    const prevBtn = carousel.querySelector(".arrow-left");
    const nextBtn = carousel.querySelector(".arrow-right");
    const total = images.length;
    let index = 0;

    function updateCarousel() {
      const width = images[0].offsetWidth + 10;
      track.style.transform = `translateX(${-index * width}px)`;
    }

    nextBtn.addEventListener("click", () => {
      index = (index + 1) % total;
      updateCarousel();
    });

    prevBtn.addEventListener("click", () => {
      index = (index - 1 + total) % total;
      updateCarousel();
    });
  });
});

document.querySelector(".dropbtn").addEventListener("click", () => {
  document.querySelector(".dropdown-content").classList.toggle("show");
});

// Close menu if clicked outside
window.addEventListener("click", (e) => {
  if (!e.target.matches('.dropbtn')) {
    document.querySelector(".dropdown-content").classList.remove("show");
  }
});
