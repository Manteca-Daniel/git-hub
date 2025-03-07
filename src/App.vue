<template>
  <header class="app-header">
    <h1>GitHub Insights</h1>
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
  </footer>
</template>

<script setup>
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
$app-primary: #1f6feb;
$app-dark: #2c3e50;
$app-light: #f4f4f4;
$app-danger: #d9534f;

.app-header {
  background: $app-dark;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: -10px;
  margin-bottom: 10px;

  h1 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: bold;
  }

  nav {
    a {
      color: white;
      text-decoration: none;
      margin-left: 20px;
      font-weight: bold;
      padding: 8px 12px;
      border-radius: 5px;
      transition: background 0.3s;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}

.app-footer {
  background: $app-dark;
  color: white;
  text-align: center;
  padding: 15px;
  margin-top: 30px;
  margin: -10px;
}

// Estilos adicionales
.login-container {
  padding: 20px;
  max-width: 400px;
  margin: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 1rem;
}

.button {
  background-color: $app-primary;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background-color: #1657c1;
  }
}

.button.logout {
  background-color: $app-danger;

  &:hover {
    background-color: #b52b27;
  }
}

.profile-container {
  padding: 20px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-top: 10px;
  border: 3px solid $app-primary;
}

.repo-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.repo-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  background: $app-light;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
}

.repo-item a {
  color: $app-primary;
  text-decoration: none;
  font-weight: bold;
}

.home-container {
  text-align: center;
  padding: 20px;
}

.button.delete {
  background-color: $app-danger;
  margin-left: 10px;

  &:hover {
    background-color: #b52b27;
  }
}
</style>