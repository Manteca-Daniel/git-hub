<template>
  <div v-if="user" class="profile-container">
    <h2>{{ $t('bienvenido') }}, {{ user.login }}</h2>
    <img :src="user.avatar_url" class="avatar" />
    <p>{{ user.bio || $t('sin_biografia') }}</p>

    <div class="user-stats">
      <p><strong>{{ $t('repos_publicos') }}:</strong> {{ user.public_repos }}</p>
      <p><strong>{{ $t('seguidores') }}:</strong> {{ user.followers }}</p>
      <p><strong>{{ $t('seguidos') }}:</strong> {{ user.following }}</p>
    </div>

    <button @click="logout" class="button logout">{{ $t('logout') }}</button>

    <h3>{{ $t('repositorios') }}</h3>
    <input v-model="newRepoName" :placeholder="$t('nombre_nuevo_repo')" class="input" />
    <button @click="createRepo" class="button">{{ $t('crear_repositorio') }}</button>

    <ul class="repo-list">
      <li v-for="repo in repos" :key="repo.id" class="repo-item">
        <h4>{{ repo.name }}</h4>
        <p v-if="!repo.editing">{{ repo.description || $t('sin_descripcion') }}</p>
        <input
          v-else
          v-model="repo.newDescription"
          :placeholder="$t('nueva_descripcion')"
          class="input"
          :disabled="repo.owner.login !== user.login"
        />

        <div class="links">
          <a :href="repo.html_url" target="_blank">{{ $t('ver_en_github') }}</a>
          <router-link
            :to="`/repo/${repo.owner.login}/${repo.name}`"
            class="button details"
            style="color: white;"
          >
            {{ $t('ver_detalles') }}
          </router-link>

          <button
            @click="deleteRepo(repo.name)"
            class="button delete"
            :disabled="repo.owner.login !== user.login"
          >
            {{ $t('eliminar') }}
          </button>

          <button
            v-if="!repo.editing"
            @click="editDescription(repo)"
            class="button edit"
            :disabled="repo.owner.login !== user.login"
          >
            {{ $t('editar_descripcion') }}
          </button>

          <button
            v-else
            @click="saveDescription(repo)"
            class="button save"
            :disabled="repo.owner.login !== user.login"
          >
            {{ $t('guardar') }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const repos = computed(() => authStore.repos);
const logout = () => authStore.logout();

const newRepoName = ref('');

const createRepo = async () => {
  if (!newRepoName.value.trim()) return;

  const repoName = newRepoName.value.trim();
  await authStore.createRepo(repoName);

  const confirmed = confirm($t('proyecto_existente'));
  if (confirmed) {
    const repoUrl = `https://github.com/${user.login}/${repoName}.git`;
    const scriptContent = generateGitScript(repoUrl, repoName);
    downloadScript(scriptContent, 'subir-proyecto.sh');
  }

  newRepoName.value = '';
};

function generateGitScript(repoUrl, repoName) {
  return `#!/bin/bash

# Cambia esto por la ruta de tu carpeta local
cd /ruta/a/tu/proyecto

echo "# ${repoName}" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin ${repoUrl}
git push -u origin main

git add .
git commit -m "first commit"
git push origin main
`;
}

function downloadScript(content, filename) {
  const blob = new Blob([content], { type: 'text/x-sh' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

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

onMounted(async () => {
  await authStore.fetchUser();
});
</script>

<style lang="scss" scoped>
$primary-color: #1f6feb;
$dark-color: #2c3e50;
$light-color: #f4f4f4;
$danger-color: #d9534f;
$border-radius: 8px;

.links {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.user-stats {
  margin: 15px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: left;
}

.profile-container {
  padding: 20px;
  text-align: center;
  background: white;
  border-radius: $border-radius;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 3px solid $primary-color;
}

.button {
  padding: 10px 15px;
  border: none;
  border-radius: $border-radius;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &.logout {
    background: $danger-color;
    color: white;
  }

  &.delete {
    background: $danger-color;
    color: white;
  }

  &.edit {
    background: #f39c12;
    color: white;
  }

  &.save {
    background: #27ae60;
    color: white;
  }

  &.details {
    background: $primary-color;
    color: white;
    text-decoration: none;
    display: inline-block;
    padding: 8px 12px;
  }
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: $border-radius;
}

.repo-list {
  list-style: none;
  padding: 0;
}

.repo-item {
  background: $light-color;
  padding: 15px;
  margin: 10px 0;
  border-radius: $border-radius;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  .repo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .repo-link {
    color: $primary-color;
    text-decoration: none;
    font-weight: bold;
  }

  .repo-description {
    color: #555;
    margin: 10px 0;
  }

  .repo-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .profile-container {
    max-width: 100%;
    padding: 15px;
  }

  .links {
    flex-direction: column;
    align-items: center;
  }
}
</style>