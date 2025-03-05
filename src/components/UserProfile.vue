<template>
    <div v-if="user" class="profile-container">
        <h2>Bienvenido, {{ user.login }}</h2>
        <img :src="user.avatar_url" class="avatar" />
        <p>{{ user.bio || 'Sin biografía' }}</p>
        <button @click="logout" class="button logout">Logout</button>

        <h3>Repositorios</h3>
        <input v-model="newRepoName" placeholder="Nombre del nuevo repo" class="input" />
        <button @click="createRepo" class="button">Crear Repositorio</button>
        <ul class="repo-list">
            <li v-for="repo in repos" :key="repo.id" class="repo-item">
                <h4>{{ repo.name }}</h4>
                <p>{{ repo.description || 'Sin descripción' }}</p>
                <a :href="repo.html_url" target="_blank">Ver en GitHub</a>
                <button @click="deleteRepo(repo.name)" class="button delete">Eliminar</button>
                <router-link :to="`/repo/${repo.name}`" class="button details" style="color: white;">Ver detalles</router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const repos = computed(() => authStore.repos);
const logout = () => authStore.logout();

const newRepoName = ref('');
const createRepo = () => {
    if (newRepoName.value.trim()) {
        authStore.createRepo(newRepoName.value.trim());
        newRepoName.value = '';
    }
};
const deleteRepo = (repoName) => {
    authStore.deleteRepo(repoName);
};
</script>