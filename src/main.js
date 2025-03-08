import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import './index.scss';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
const pinia = createPinia();
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
