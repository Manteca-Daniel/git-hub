<template>
    <div class="login-container">
        <h2>{{ $t('login_git') }}</h2>
        <input v-model="token" placeholder="Introduce tu token" class="input" />
        <button @click="login" class="button">Login</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const token = ref('');

const login = () => {
    if (token.value) {
        authStore.loginWithToken(token.value);
    }
};
</script>