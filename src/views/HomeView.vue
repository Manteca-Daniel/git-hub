<template>
    <div class="home-container">
        <img src="https://guias.donweb.com/wp-content/uploads/2023/12/Como-usar-GitHub-con-WordPress.jpg" alt="Github imagen" class="home-image">
        <h1>GitHub Insights</h1>
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