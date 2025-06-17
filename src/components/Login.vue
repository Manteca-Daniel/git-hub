<template>
    <div class="login-bg">
        <div class="login-content">
        
        <div class="login-card">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" class="github-logo" />
            <h1 class="login-title">{{ $t('espacio_trabajo_git') }}</h1>
            <p class="login-highlight">
            {{ $t('gestion_repos_tickets') }}
            </p>
            <p class="login-subtitle">
            {{ $t('git_organizar_proyectos') }}
            </p>
            <button @click="loginWithGitHub" class="github-btn">
            <svg class="github-icon" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
                -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
                -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65
                7.65 0 0 1 8 4.77c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
                2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
                1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            {{ $t('iniciar_sesión_con_gitHub') }}
            </button>
        </div>
        </div>
        <div class="carousel-container">
            <div class="carousel">
            <img
                :src="carouselImages[currentImage]"
                alt="Vista previa de la aplicación"
                class="carousel-image"
            />
            <div class="carousel-text">
              {{ carouselTexts[currentImage] }}
            </div>
            <div class="carousel-controls">
                <button @click="prevImage" class="carousel-btn">‹</button>
                <button @click="nextImage" class="carousel-btn">›</button>
            </div>
            <div class="carousel-dots">
                <span
                v-for="(img, idx) in carouselImages"
                :key="idx"
                :class="['dot', { active: idx === currentImage }]"
                @click="goToImage(idx)"
                ></span>
            </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

const loginWithGitHub = () => {
  const redirectUri = encodeURIComponent('http://localhost:5173/callback');
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user,delete_repo&prompt=consent`;
  window.location.href = githubAuthUrl;
};

const carouselImages = [
  '/Repos.png',
  '/buscar_repos.png',
  '/detalles_repo.png',
  '/nuevos_ticket.png'
];

const carouselTexts = [
  "Visualiza y gestiona todos tus repositorios de GitHub desde un solo lugar.",
  "Busca cualquier repositorio público de GitHub de forma rápida y sencilla.",
  "Consulta estadísticas y detalles completos de cada repositorio.",
  "Crea y administra tickets vinculados a tus repositorios fácilmente."
];

const currentImage = ref(0);
let intervalId = null;

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % carouselImages.length;
};
const prevImage = () => {
  currentImage.value = (currentImage.value - 1 + carouselImages.length) % carouselImages.length;
};
const goToImage = (idx) => {
  currentImage.value = idx;
};

onMounted(() => {
  intervalId = setInterval(nextImage, 3500);
});
onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.login-bg {
  min-height: 65vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  width: 30%;
}

.carousel-container {
  width: 900px;
  max-width: 95vw;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 18px rgba(36,41,46,0.10);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 18px;
  margin: 0;
  padding: 0;
  box-shadow: none;
}

.carousel-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(0deg, rgba(36,41,46,0.85) 80%, rgba(36,41,46,0.05) 100%);
  color: #fff;
  font-size: 1.08rem;
  font-weight: 500;
  padding: 18px 22px 14px 22px;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  box-sizing: border-box;
  text-align: left;
  letter-spacing: 0.2px;
  z-index: 2;
  text-shadow: 0 2px 8px rgba(36,41,46,0.18);
  pointer-events: none;
  user-select: none;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;
}

.carousel-btn {
  background: rgba(36, 41, 46, 0.18);
  border: none;
  color: #24292e;
  font-size: 2rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-btn:hover {
  background: #f57224;
  color: #fff;
}

.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
}
.dot {
  width: 10px;
  height: 10px;
  background: #d1d5db;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  transition: background 0.2s;
}
.dot.active {
  background: #f57224;
}

.login-card {
  background: #fff;
  padding: 2.5rem 2.2rem 2.2rem 2.2rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
  gap: 1.1rem;
  position: relative;
  z-index: 2;
}

.github-logo {
  width: 75px;
  height: 75px;
  margin-bottom: 0.5rem;
}

.login-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #24292e;
  margin-bottom: 0.1rem;
  letter-spacing: -1px;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
  text-align: center;
}

.login-highlight {
  color: #f57224;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
  text-align: center;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.login-subtitle {
  color: #586069;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1.1rem;
  line-height: 1.5;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #24292e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.85rem 1.7rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(36,41,46,0.07);
  transition: background 0.2s, transform 0.1s;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.github-btn:hover {
  background: #444d56;
  transform: translateY(-2px) scale(1.03);
}

.github-icon {
  vertical-align: middle;
}

@media (max-width: 600px) {
  .carousel-container,
  .carousel {
    width: 98vw;
    min-width: 0;
    max-width: 100vw;
    height: 160px;
  }
  .login-card {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
  .login-title {
    font-size: 1.3rem;
  }
  .carousel-text {
    font-size: 0.97rem;
    padding: 10px 10px 8px 10px;
  }
}
</style>