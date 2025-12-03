document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("fileModal");
  const iframe = document.getElementById("fileFrame");
  const closeBtn = document.querySelector(".modal .close");
  const viewBtns = document.querySelectorAll(".view-btn");

 viewBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const buttonFile = e.target.dataset.file;     
    const card = e.target.closest(".doc-card");
    const cardFile = card.dataset.file;            

    const fileToOpen = buttonFile || cardFile;    
    iframe.src = fileToOpen;
    modal.style.display = "flex";
  });
});

  closeBtn.addEventListener("click", () => {
    iframe.src = ""; // clear iframe
    modal.style.display = "none";
  });

  // Close modal if click outside content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      iframe.src = "";
      modal.style.display = "none";
    }
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
