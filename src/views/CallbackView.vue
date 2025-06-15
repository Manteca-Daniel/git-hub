<template>
    <div class="callback-container">
        <div v-if="loading" class="spinner-wrapper">
            <div class="spinner"></div>
            <span class="loader-text">{{ $t('autenticando_con_gtihub') }}</span>
        </div>
        <p v-else-if="error" class="error-text">{{ error }}</p>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
        error.value = 'No se encontró el código de autorización.';
        loading.value = false;
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/auth/github', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.token) {
            await authStore.loginWithToken(data.token);
            router.push('/'); // redirige al home u otra ruta segura
        } else {
            error.value = 'No se pudo obtener el token.';
        }
    } catch (err) {
        console.error(err);
        error.value = 'Hubo un error al autenticar con GitHub.';
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.callback-container {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.spinner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 5px solid #e2e8f0;
    border-top: 5px solid #f57224;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loader-text {
    color: #24292e;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.5px;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.error-text {
    color: #e53e3e;
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 24px;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}
</style>