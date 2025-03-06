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
                <p v-if="!repo.editing">{{ repo.description || 'Sin descripción' }}</p>
                <input v-else v-model="repo.newDescription" placeholder="Nueva descripción" class="input" />
                <a :href="repo.html_url" target="_blank">Ver en GitHub</a>
                <button @click="deleteRepo(repo.name)" class="button delete">Eliminar</button>
                <router-link :to="`/repo/${repo.name}`" class="button details" style="color: white;">Ver detalles</router-link>
                <button v-if="!repo.editing" @click="editDescription(repo)" class="button edit">Editar Descripción</button>
                <button v-else @click="saveDescription(repo)" class="button save">Guardar</button>
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
const createRepo = async () => {
    if (newRepoName.value.trim()) {
        await authStore.createRepo(newRepoName.value.trim());
        newRepoName.value = '';
    }
};
const deleteRepo = async (repoName) => {
    await authStore.deleteRepo(repoName);
};

const editDescription = (repo) => {
    repo.editing = true;
    repo.newDescription = repo.description;
};

const saveDescription = async (repo) => {
    try {
        await authStore.updateRepoDescription(repo.name, repo.newDescription);
        repo.description = repo.newDescription;
        repo.editing = false;
    } catch (error) {
        console.error("Error actualizando la descripción:", error);
    }
};
</script>
