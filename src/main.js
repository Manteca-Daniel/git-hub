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
import al from './locales/al.json';
import jp from './locales/jp.json';
import fr from './locales/fr.json';
import it from './locales/it.json';

import ch from './locales/ch.json';
import ct from './locales/ct.json';
import gr from './locales/gr.json';
import pt from './locales/pt.json';
import bl from './locales/bl.json';

const defaultLocale = localStorage.getItem('locale') || 'es';

const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages: { en, es, jp, fr, al, it, ch, ct, gr, pt, bl }
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