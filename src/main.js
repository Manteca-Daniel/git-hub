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
import { faGithub, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";

library.add(faGithub, faTwitter, faLinkedin);

const app = createApp(App);
const pinia = createPinia();
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);

app.use(Toast, {
    position: 'top-right', // Posición de las notificaciones
    timeout: 3000, // Duración en milisegundos
    closeOnClick: true, // Cerrar al hacer clic
    pauseOnHover: true, // Pausar al pasar el cursor
});

const authStore = useAuthStore();
authStore.initializeAuth(); // 🔥 Mantener sesión iniciada

app.mount('#app');
