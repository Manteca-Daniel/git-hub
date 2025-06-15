<template>
    <div class="home-container">
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

<style scoped>
.home-image {
    width: 100%;
    max-width: 600px;
    height: auto;
    display: block;
    margin: 0 auto;
}
</style>