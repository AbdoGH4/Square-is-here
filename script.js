// ==================== Stars ====================
const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
const numStars = 150;

function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            alpha: Math.random(),
            delta: Math.random() * 0.02
        });
    }
}
function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) star.delta = -star.delta;
        ctx.fillStyle = `rgba(255,255,0,${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
    });
    requestAnimationFrame(animateStars);
}
window.addEventListener("resize", initStars);
initStars();
animateStars();

// ==================== Mouse Parallax ====================
document.addEventListener("mousemove", e => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    const heroTitle = document.querySelector("header h1");
    const heroSubtitle = document.querySelector("header p");
    heroTitle.style.transform = `translate(${mouseX * 20}px, ${mouseY * 10}px)`;
    heroSubtitle.style.transform = `translate(${mouseX * 15}px, ${mouseY * 8}px)`;

    stars.forEach(star => {
        star.x += mouseX * 0.3;
        star.y += mouseY * 0.3;
    });
});

// ==================== Gallery Lightbox ====================
const gallery = document.querySelectorAll(".gallery img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentIndex = 0;

gallery.forEach((img, index) => {
    img.addEventListener("click", () => {
        currentIndex = index;
        showImage();
        lightbox.style.display = "flex";
    });
});

function showImage() {
    lightboxImg.style.opacity = 0;
    lightboxImg.style.transform = "scale(0.95)";
    setTimeout(() => {
        lightboxImg.src = gallery[currentIndex].src;
        lightboxImg.onload = () => {
            lightboxImg.style.transition = "opacity 0.7s ease, transform 0.7s ease";
            lightboxImg.style.opacity = 1;
            lightboxImg.style.transform = "scale(1)";
        }
    }, 100);
}

closeBtn.addEventListener("click", () => {
    lightbox.style.transition = "opacity 0.5s ease";
    lightbox.style.opacity = 0;
    setTimeout(() => {
        lightbox.style.display = "none";
        lightbox.style.opacity = 1;
    }, 300);
});
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    showImage();
});
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % gallery.length;
    showImage();
});

// ==================== Scroll to top ====================
const scrollTopBtn = document.getElementById("scrollTopBtn");
window.onscroll = () => {
    scrollTopBtn.style.display = (window.scrollY > 300) ? "block" : "none";
};
scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==================== 3D Tilt for Gallery ====================
gallery.forEach(img => {
    img.addEventListener("mousemove", e => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        img.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        img.style.boxShadow = `${-rotateY}px ${rotateX}px 20px rgba(0,0,0,0.5)`;
    });
    img.addEventListener("mouseleave", () => {
        img.style.transform = "rotateX(0) rotateY(0) scale(1)";
        img.style.boxShadow = "0 5px 15px rgba(0,0,0,0.4)";
    });
});

// ==================== Scroll animations ====================
const fadeElements = document.querySelectorAll("section h2, section p, header h1, header p");
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
        } else {
            entry.target.style.opacity = 0;
            entry.target.style.transform = "translateY(50px)";
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
    observer.observe(el);
});
