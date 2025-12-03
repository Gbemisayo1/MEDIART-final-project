const faders = document.querySelectorAll('.fade-in');

const appear = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

faders.forEach(f => appear.observe(f));

const title = document.querySelector('[data-parallax]');
window.addEventListener('scroll', () => {
    let offset = window.scrollY * 0.2;
    title.style.transform = `translateY(${offset}px)`;
    title.style.opacity = 0.2 + window.scrollY * -0.0005;
});

document.addEventListener("mousemove", (e) => {
    if (
        e.target.closest("header") ||
        e.target.closest(".skill-grid") 
    ) return;

    createFirework(e.clientX, e.clientY);
});

function createFirework(x, y) {
    const colors = [
        "#A0522D", 
        "#B76E3C", 
        "#C68642", 
        "#D4A373", 
        "#E0B97B", 
        "#F0C27B", 
        "#FFD27F"  
    ];

    const particles = 6; 
    for (let i = 0; i < particles; i++) {
        const spark = document.createElement("div");
        spark.className = "spark";

        spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;

        const angle = i * (Math.PI * 2 / particles);
        const distance = 40 + Math.random() * 40; 

        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        spark.style.setProperty("--dx", `${dx}px`);
        spark.style.setProperty("--dy", `${dy}px`);

        document.body.appendChild(spark);

        setTimeout(() => spark.remove(), 600);
    }
}

document.querySelector(".dropbtn").addEventListener("click", () => {
  document.querySelector(".dropdown-content").classList.toggle("show");
});

// Close menu if clicked outside
window.addEventListener("click", (e) => {
  if (!e.target.matches('.dropbtn')) {
    document.querySelector(".dropdown-content").classList.remove("show");
  }
});