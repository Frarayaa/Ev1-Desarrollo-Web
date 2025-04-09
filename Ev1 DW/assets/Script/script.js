// Array de medios
const mediaFiles = [
  { video: "multimedia/video1.mp4", audio: "multimedia/audio1.mp3" },
  { video: "multimedia/video2.mp4", audio: "multimedia/audio2.mp3" },
  /* { video: "multimedia/video3.mp4", audio: "multimedia/audio3.mp3" } */
];

// Elementos del DOM
const videoElement = document.getElementById("bg-video");
const audioElement = document.getElementById("bg-audio");
const overlay = document.getElementById("overlay");
const mainContent = document.querySelector("main");
const confiaBtn = document.getElementById("confia-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume-slider");
const volumeIcon = document.querySelector(".volume-icon");

let currentMediaIndex = 0;
let isChangingMedia = false;

// Configuración inicial de medios
videoElement.loop = true;
audioElement.loop = true;

// Controlador de volumen
volumeSlider.addEventListener("input", (e) => {
  const volume = e.target.value;
  audioElement.volume = volume;
  volumeIcon.textContent = volume == 0 ? "🔇" : "🔊"; // Cambia ícono si está muteado
});

// Función para cargar medios
function loadMedia(index) {
  return new Promise((resolve) => {
    videoElement.src = mediaFiles[index].video;
    audioElement.src = mediaFiles[index].audio;
    
    const onLoaded = () => {
      videoElement.removeEventListener('loadeddata', onLoaded);
      resolve();
    };
    
    videoElement.addEventListener('loadeddata', onLoaded);
    videoElement.load();
    audioElement.load();
  });
}

// Función para reproducir medios
function playCurrentMedia() {
  videoElement.play().catch(e => console.error("Error video:", e));
  audioElement.play().catch(e => console.error("Error audio:", e));
}

// Botón CONFÍA
confiaBtn.addEventListener("click", async function() {
  this.classList.add("click-animation");
  setTimeout(() => this.classList.remove("click-animation"), 150);

  overlay.classList.add("fade-out");

  setTimeout(() => {
    overlay.style.display = "none";
    mainContent.style.display = "flex";
    void mainContent.offsetWidth;
    mainContent.classList.add("zoom-in");
    playCurrentMedia();
  }, 500);
});

// Función para cambiar de medio
async function changeMedia(direction) {
  if (isChangingMedia) return;
  isChangingMedia = true;
  
  const container = document.querySelector(".video-container");
  prevBtn.disabled = nextBtn.disabled = true;

  container.classList.add(direction === "next" ? "slide-out-left" : "slide-out-right");
  await new Promise(resolve => setTimeout(resolve, 600));

  currentMediaIndex = direction === "next" 
    ? (currentMediaIndex + 1) % mediaFiles.length 
    : (currentMediaIndex - 1 + mediaFiles.length) % mediaFiles.length;

  await loadMedia(currentMediaIndex);

  container.classList.remove("slide-out-left", "slide-out-right");
  container.classList.add(direction === "next" ? "slide-in-right" : "slide-in-left");
  await new Promise(resolve => setTimeout(resolve, 600));

  container.classList.remove("slide-in-left", "slide-in-right");
  prevBtn.disabled = nextBtn.disabled = false;
  playCurrentMedia();
  isChangingMedia = false;
}

// Eventos de navegación
nextBtn.addEventListener("click", () => changeMedia("next"));
prevBtn.addEventListener("click", () => changeMedia("prev"));

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  await loadMedia(0);
  videoElement.currentTime = 0.1;
});