import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import './index.scss';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.initializeAuth(); // 🔥 Mantener sesión iniciada

app.mount('#app');
