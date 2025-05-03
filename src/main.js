import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import './index.scss';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faGithub, faTwitter, faLinkedin, faFacebook } from "@fortawesome/free-brands-svg-icons";

// ✅ i18n
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';

const defaultLocale = localStorage.getItem('locale') || 'es';

const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages: { en, es }
});

library.add(faGithub, faTwitter, faLinkedin, faFacebook);

const app = createApp(App);
const pinia = createPinia();

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.use(i18n);

app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
});

const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');