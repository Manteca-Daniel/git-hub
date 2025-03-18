<template>
  <div class="container-total">
    <header class="app-header">
      <div class="logo-container">
        <font-awesome-icon :icon="['fab', 'github']" class="logo" />
        <h1>GitHub Insights</h1>
      </div>
      <nav>
        <router-link to="/">Inicio</router-link>
        <router-link v-if="authStore.user" to="/search">Buscar Repositorios</router-link>
        <router-link v-else to="/token">Obtener Token</router-link>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>&copy; 2025 GitHub Insights. Todos los derechos reservados.</p>
      <div class="social-icons">
        <font-awesome-icon :icon="['fab', 'github']" class="social-icon" />
        <font-awesome-icon :icon="['fab', 'twitter']" class="social-icon" />
        <font-awesome-icon :icon="['fab', 'linkedin']" class="social-icon" />
        <font-awesome-icon :icon="['fab', 'facebook']" class="social-icon" />
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from "./stores/authStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
$app-primary: #1f6feb;
$app-dark: #2c3e50;
$app-light: #f4f4f4;
$app-danger: #d9534f;

.container-total {
  position: relative;
  min-height: 100vh;
}

main {
  padding-bottom: 5rem;
}

.app-header {
  background: $app-dark;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  font-size: 2rem;
  color: white;
}

.logo-container h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

nav {
  display: flex;
  gap: 15px;

  a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 5px;
    transition: background 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.app-footer {
  background: $app-dark;
  color: white;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 15px;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 5rem;  
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.social-icon {
  font-size: 1.5rem;
  color: white;
  transition: color 0.3s;

  &:hover {
    color: $app-primary;
  }
}
</style>