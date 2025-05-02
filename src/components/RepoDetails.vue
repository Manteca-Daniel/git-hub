<template>
    <div class="repo-details" v-if="repoDetails">
        <h2 class="repo-title">{{ repoDetails.name }}</h2>
        <p class="repo-description">{{ repoDetails.description || $t('sin_descripcion') }}</p>

        <section class="repo-section">
            <h3>{{ $t('estadisticas') }}</h3>
            <p>⭐ {{ $t('stars') }}: {{ repoDetails.stargazers_count }}</p>
            <p>🍴 {{ $t('forks') }}: {{ repoDetails.forks_count }}</p>
        </section>

        <section class="repo-section">
            <h3>{{ $t('resumen_repositorio') }}</h3>
            <RepoChart :issues="issues" :pullRequests="pullRequests" :commits="commits" />
        </section>

        <section class="repo-section">
            <h3>{{ $t('issues') }}</h3>
            <ul class="repo-list">
                <li v-for="issue in issues" :key="issue.id" class="repo-item">
                    <span>{{ issue.title }}</span>
                </li>
            </ul>
        </section>

        <section class="repo-section">
            <h3>{{ $t('pull_requests') }}</h3>
            <ul class="repo-list">
                <li v-for="pr in pullRequests" :key="pr.id" class="repo-item">
                    <span>{{ pr.title }}</span>
                </li>
            </ul>
        </section>

        <section class="repo-section">
            <h3>{{ $t('commits') }}</h3>
            <ul class="repo-list">
                <li v-for="commit in commits" :key="commit.sha" class="repo-item">
                    <span>{{ $t('commit') }}: {{ commit.commit.message }}</span>
                </li>
            </ul>
        </section>

        <div class="branch-creator">
            <input v-model="newBranch" :placeholder="$t('nombre_nueva_rama')" class="input" />
            <button @click="createBranch" class="button">{{ $t('crear_rama') }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import RepoChart from './RepoChart.vue';

const authStore = useAuthStore();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();

const repoDetails = computed(() => authStore.repoDetails);
const issues = computed(() => authStore.issues);
const pullRequests = computed(() => authStore.pullRequests);
const commits = computed(() => authStore.commits);
const newBranch = ref('');

onMounted(async () => {
    try {
        await authStore.fetchRepoDetails(route.params.owner, route.params.repoName);
        toast.success(`📦 ${t('repositorio_cargado')}`);
    } catch (error) {
        toast.error(`❌ ${t('error_cargar_repositorio')}`);
    }
});

const createBranch = () => {
    const owner = route.params.owner;
    const repoName = route.params.repoName;

    if (newBranch.value.trim()) {
        authStore.createBranch(owner, repoName, newBranch.value.trim());
        toast.success(`✅ ${t('rama_creada_exito', { nombre: newBranch.value })}`);
        newBranch.value = '';
    } else {
        toast.error(`⚠️ ${t('nombre_rama_vacio')}`);
    }
};
</script>

<style lang="scss" scoped>
.repo-details {
    padding: 30px;
    background: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 900px;
    margin: 30px auto;
    text-align: center;
    transition: all 0.3s ease-in-out;

    &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
}

.repo-title {
    color: #2c3e50;
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
    font-size: 2rem;
    font-weight: bold;
}

.repo-description {
    color: #555;
    font-size: 1.3rem;
    margin-bottom: 20px;
    font-style: italic;
}

.repo-section {
    margin-top: 30px;
    text-align: left;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.repo-section h3 {
    color: #333;
    border-left: 5px solid #3498db;
    padding-left: 10px;
    font-size: 1.5rem;
}

.repo-list {
    list-style: none;
    padding: 0;
    margin-top: 10px;
}

.repo-item {
    background: #e3f2fd;
    margin: 8px 0;
    padding: 12px;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;

    &:hover {
        background: #bbdefb;
        transform: scale(1.02);
    }
}

.branch-creator {
    display: flex;
    gap: 12px;
    margin-top: 25px;
    justify-content: center;
    align-items: center;
}

.input {
    padding: 12px;
    border: 2px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease-in-out;

    &:focus {
        border-color: #3498db;
        outline: none;
    }
}

.button {
    padding: 12px 18px;
    border: none;
    border-radius: 6px;
    background: #1f6feb;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;

    &:hover {
        background: #155ab6;
        transform: scale(1.05);
    }
}

@media (max-width: 768px) {
    .repo-details {
        padding: 15px;
    }

    .stats-grid {
        flex-direction: column;
        text-align: center;
    }

    .repo-section {
        padding: 10px;
    }

    .branch-creator {
        flex-direction: column;
    }

    .input {
        width: 100%;
    }
}
</style>
