<template>
  <div class="container-total">
    <header class="app-header">
      <div class="logo-container">
        <font-awesome-icon :icon="['fab', 'github']" class="logo" />
        <h1>GitHub Insights</h1>
      </div>
      <nav>
        <router-link to="/">{{ $t("nav.home") }}</router-link>
        <router-link v-if="authStore.user" to="/tickets">{{ $t("nav.tickets") }}</router-link>
        <router-link v-if="authStore.user" to="/search">{{ $t("nav.search") }}</router-link>
        <router-link v-else to="/token">{{ $t("nav.token") }}</router-link>
      </nav>

      <!-- Selector de idioma -->
      <select v-model="locale" class="lang-select">
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>&copy; 2025 GitHub Insights. {{ $t("footer.rights") }}</p>
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
import { useI18n } from "vue-i18n";
import { watch } from "vue";

const authStore = useAuthStore();
const { locale } = useI18n();

// Guardar idioma en localStorage
watch(locale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});
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
  padding-bottom: 10rem;
  padding-top: 2rem;
}

.app-header {
  background: $app-dark;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
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

.lang-select {
  background: white;
  color: $app-dark;
  border-radius: 5px;
  padding: 5px 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
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

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: center;
    height: auto;
    padding: 20px 0;
  }

  nav {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 10px;
  }

  nav a {
    width: 100%;
    text-align: center;
    padding: 10px 0;
  }
}
</style>
