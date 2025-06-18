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
        <option value="fr">Français</option>
        <option value="al">Deutsch</option>
        <option value="jp">日本語(Japanese)</option>

        <option value="it">Italiano</option>
        <option value="ch">中國人(Chinese)</option>
        <option value="ct">Català</option>
        <option value="gr">ελληνικά(Greek)</option>
        <option value="pt">Português</option>
        <option value="bl">беларускі(Belarusian)</option>
        

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
$app-gradient: linear-gradient(135deg, #1f6feb, #27496d);

.container-total {
  position: relative;
  min-height: 100vh;
}

main {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 10rem;
  padding-top: 2rem;
}
* {
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.app-header {
  background: $app-gradient;
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  border-bottom: 3px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;

  h1 {
    margin: 0;
    font-size: 2.2rem;
    font-weight: 700;
    font-family: "Segoe UI", sans-serif;
    letter-spacing: 1px;
  }
}

.logo {
  font-size: 2.5rem;
  color: white;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
}

nav {
  display: flex;
  gap: 18px;

  a {
    color: white;
    text-decoration: none;
    font-weight: 600;
    padding: 10px 16px;
    border-radius: 6px;
    transition: background 0.3s, transform 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
  }
}

.lang-select {
  appearance: none;
  background: white;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20fill%3D'%232c3e50'%20height%3D'24'%20viewBox%3D'0%200%2024%2024'%20width%3D'24'%20xmlns%3D'http%3A//www.w3.org/2000/svg'%3E%3Cpath%20d%3D'M7%2010l5%205%205-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px 16px;
  border: none;
  border-radius: 6px;
  padding: 10px 40px 10px 12px;
  font-weight: 600;
  font-size: 1rem;
  color: #2c3e50;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}


.app-footer {
  background: $app-gradient;
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
    cursor: pointer;
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
