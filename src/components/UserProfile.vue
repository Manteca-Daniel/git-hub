<template>
    <div v-if="user" class="profile-container">
        <h2>Bienvenido, {{ user.login }}</h2>
        <img :src="user.avatar_url" class="avatar" />
        <p>{{ user.bio || 'Sin biografía' }}</p>
        <button @click="logout" class="button logout">Logout</button>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const logout = () => authStore.logout();
</script>