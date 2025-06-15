<template>
    <div class="callback-container">
        <p v-if="loading">{{ $t('autenticando_con_gtihub') }}</p>
        <p v-else-if="error">{{ error }}</p>
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
    text-align: center;
    margin-top: 100px;
    font-size: 1.2rem;
}
</style>