<template>
    <div class="home-container">
        <h1>GitHub Login</h1>
        <UserProfile v-if="authStore.user" />
        <Login v-else />
    </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import Login from '../components/Login.vue';
import UserProfile from '../components/UserProfile.vue';

const authStore = useAuthStore();
</script>