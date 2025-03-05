<template>
    <div class="repo-details" v-if="repoDetails">
        <h2>{{ repoDetails.name }}</h2>
        <p class="description">{{ repoDetails.description || 'Sin descripción' }}</p>

        <section>
            <h3>Issues</h3>
            <ul>
                <li v-for="issue in issues" :key="issue.id">{{ issue.title }}</li>
            </ul>
        </section>

        <section>
            <h3>Pull Requests</h3>
            <ul>
                <li v-for="pr in pullRequests" :key="pr.id">{{ pr.title }}</li>
            </ul>
        </section>

        <section>
            <h3>Commits</h3>
            <ul>
                <li v-for="commit in commits" :key="commit.sha">Commit: {{ commit.commit.message }}</li>
            </ul>
        </section>

        <div class="branch-creator">
            <input v-model="newBranch" placeholder="Nombre de la nueva rama" />
            <button @click="createBranch">Crear Rama</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const repoDetails = computed(() => authStore.repoDetails);
const issues = computed(() => authStore.issues);
const pullRequests = computed(() => authStore.pullRequests);
const commits = computed(() => authStore.commits);
const newBranch = ref('');

onMounted(() => {
    authStore.fetchRepoDetails(route.params.repoName);
});

const createBranch = () => {
    if (newBranch.value.trim()) {
        authStore.createBranch(route.params.repoName, newBranch.value.trim());
        newBranch.value = '';
    }
};
</script>

<style lang="scss" scoped>
.repo-details {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 20px auto;
}

h2 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 5px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    background: #ecf0f1;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
}

.branch-creator {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}
</style>