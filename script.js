
const slides = Array.from(document.querySelectorAll(".slide"));
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const slideCounter = document.getElementById("slideCounter");
const slideLabel = document.getElementById("slideLabel");
const presentation = document.getElementById("presentation");

let currentSlide = 0;

function showSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
    slide.setAttribute("aria-hidden", i !== currentSlide ? "false" : "true");
  });

  const number = String(currentSlide + 1).padStart(2, "0");
  const total = String(slides.length).padStart(2, "0");

  slideCounter.textContent = `${number} / ${total}`;
  slideLabel.textContent = `${number} — ${total}`;

  prevButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;

  prevButton.style.opacity = prevButton.disabled ? "0.35" : "1";
  nextButton.style.opacity = nextButton.disabled ? "0.35" : "1";
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    showSlide(currentSlide + 1);
  }
}

function previousSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1);
  }
}

prevButton.addEventListener("click", previousSlide);
nextButton.addEventListener("click", nextSlide);

// Teclado: setas, espaço, Home e End.
document.addEventListener("keydown", (event) => {
  if (
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement ||
    event.target instanceof HTMLSelectElement
  ) {
    return;
  }

  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    nextSlide();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    previousSlide();
  } else if (event.key === "Home") {
    showSlide(0);
  } else if (event.key === "End") {
    showSlide(slides.length - 1);
  }
});

// Clicar nas laterais do slide para navegar.
presentation.addEventListener("click", (event) => {
  if (
    event.target.closest("button") ||
    event.target.closest("a") ||
    event.target.closest(".music-player") ||
    event.target.closest(".controls")
  ) {
    return;
  }

  if (event.clientX > window.innerWidth / 2) {
    nextSlide();
  } else {
    previousSlide();
  }
});

// Arrastar com mouse ou dedo para trocar de slide.
let dragStartX = 0;
let dragStartY = 0;
let isDragging = false;

presentation.addEventListener("pointerdown", (event) => {
  if (
    event.target.closest("button") ||
    event.target.closest("a") ||
    event.target.closest(".music-player") ||
    event.target.closest(".controls")
  ) {
    return;
  }

  dragStartX = event.clientX;
  dragStartY = event.clientY;
  isDragging = true;
});

presentation.addEventListener("pointerup", (event) => {
  if (!isDragging) return;
  isDragging = false;

  const deltaX = event.clientX - dragStartX;
  const deltaY = event.clientY - dragStartY;

  // Ignora movimentos pequenos e arrastos predominantemente verticais.
  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
    return;
  }

  if (deltaX < 0) {
    nextSlide();
  } else {
    previousSlide();
  }
});

presentation.addEventListener("pointercancel", () => {
  isDragging = false;
});

// Neve animada.
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let snowflakes = [];

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const count = Math.min(150, Math.max(45, Math.floor(width / 9)));

  snowflakes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 0.5,
    speed: Math.random() * 1.1 + 0.35,
    drift: Math.random() * 0.6 - 0.3,
    opacity: Math.random() * 0.6 + 0.2
  }));
}

function drawSnow() {
  ctx.clearRect(0, 0, width, height);

  for (const flake of snowflakes) {
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
    ctx.fill();

    flake.y += flake.speed;
    flake.x += flake.drift;

    if (flake.y > height + 5) {
      flake.y = -5;
      flake.x = Math.random() * width;
    }

    if (flake.x > width + 5) {
      flake.x = -5;
    } else if (flake.x < -5) {
      flake.x = width + 5;
    }
  }

  requestAnimationFrame(drawSnow);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawSnow();
showSlide(0);