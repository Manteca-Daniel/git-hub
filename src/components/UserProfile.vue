<template>
  <div v-if="user" class="profile-container">
    <div class="profile-header-modern">
      <div class="header-left">
        <img :src="user.avatar_url" class="avatar-modern" />
      </div>
      <div class="header-right">
        <h2 class="welcome">{{ $t('bienvenido') }}, {{ user.login }}</h2>
        <p class="bio">{{ user.bio || $t('sin_biografia') }}</p>
        <div class="user-stats-modern">
          <p><strong>{{ $t('repos_publicos') }}:</strong> {{ user.public_repos }}</p>
          <p><strong>{{ $t('seguidores') }}:</strong> {{ user.followers }}</p>
          <p><strong>{{ $t('seguidos') }}:</strong> {{ user.following }}</p>
        </div>
        <button @click="logout" class="button-modern logout">{{ $t('logout') }}</button>
      </div>
      <div class="header-right">
        <h3>{{ $t('repositorios') }}</h3>
        <input v-model="newRepoName" :placeholder="$t('nombre_nuevo_repo')" class="input" />
        <button @click="createRepo" class="button" style="margin-left: 2vw;">{{ $t('crear_repositorio') }}</button>
      </div>
    </div>
    <div class="search-container">
      <input
        v-model="searchQuery"
        @input="filterRepos"
        :placeholder="$t('buscar_nombre_repo')"
        class="search-input"
      />
    </div>
    <ul class="repo-list">
      <li v-for="repo in filteredRepos" :key="repo.id" class="repo-item">
        <div class="repo-card">
          <div class="repo-header">
            <h4 class="repo-title">{{ repo.name }}</h4>
            <span class="repo-privacy" v-if="repo.private">🔒 Private</span>
          </div>

          <div class="repo-description">
            <p v-if="!repo.editing" class="description-text">{{ repo.description || $t('sin_descripcion') }}</p>
            <input
              v-else
              v-model="repo.newDescription"
              :placeholder="$t('nueva_descripcion')"
              class="input description-input"
              :disabled="repo.owner.login !== user.login"
            />
          </div>

          <div class="repo-meta">
            <div class="meta-item">
              <span class="meta-icon">⭐</span>
              <span class="meta-text">{{ repo.stargazers_count }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">🍴</span>
              <span class="meta-text">{{ repo.forks_count }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">🕒</span>
              <span class="meta-text">{{ new Date(repo.updated_at).toLocaleDateString() }}</span>
            </div>
          </div>

          <div class="repo-actions">
            <a :href="repo.html_url" target="_blank" class="button ghost">{{ $t('ver_en_github') }}</a>
            <router-link
              :to="`/repo/${repo.owner.login}/${repo.name}`"
              class="button details"
            >
              {{ $t('ver_detalles') }}
            </router-link>
            <button
              @click="deleteRepo(repo.name)"
              class="button delete"
              :disabled="repo.owner.login !== user.login"
            >
              🗑 {{ $t('eliminar') }}
            </button>
            <button
              v-if="!repo.editing"
              @click="editDescription(repo)"
              class="button edit"
              :disabled="repo.owner.login !== user.login"
            >
              ✏️ {{ $t('editar_descripcion') }}
            </button>
            <button
              v-else
              @click="saveDescription(repo)"
              class="button save"
              :disabled="repo.owner.login !== user.login"
            >
              💾 {{ $t('guardar') }}
            </button>
          </div>
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
const searchQuery = ref('');

const filteredRepos = computed(() => {
  return repos.value.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const createRepo = async () => {
  if (!newRepoName.value.trim()) return;

  const repoName = newRepoName.value.trim();
  await authStore.createRepo(repoName);

  // Asegúrate de que user y login están definidos
  const username = user.value?.login;
  const repoUrl = username ? `https://github.com/${username}/${repoName}.git` : null;

  if (repoName && repoUrl) {
    const confirmed = confirm("¿Deseas descargar el script para subir tu proyecto?");
    if (confirmed) {
      const scriptContent = generateGitScript(repoUrl, repoName);
      downloadScript(scriptContent, `${repoName}-subir-proyecto.txt`);
    }
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
  const blob = new Blob([content], { type: 'text/plain' }); // txt MIME type
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


const deleteRepo = async (repoName) => {
  await authStore.deleteRepo(repoName);
  await authStore.fetchRepos();
};

const editDescription = async (repo) => {
  repo.editing = true;
  repo.newDescription = repo.description;
};

const saveDescription = async (repo) => {
  try {
    await authStore.updateRepoDescription(repo.name, repo.newDescription);
    repo.description = repo.newDescription;
    repo.editing = false;
    await authStore.fetchRepos();
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

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
}

.repo-item {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  .repo-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 16px rgba(0, 0, 0, 0.12);
  }
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .repo-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #1f6feb;
  }

  .repo-privacy {
    font-size: 0.9rem;
    color: #999;
  }
}

.repo-description {
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 10px;

  input.input {
    margin-top: 8px;
  }
}

.repo-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 15px;
}

.repo-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;

  .button {
    font-size: 0.9rem;
    padding: 8px 12px;
    border-radius: 6px;

    &.ghost {
      background: transparent;
      border: 1px solid #ccc;
      color: #333;

      &:hover {
        background: #f0f0f0;
      }
    }
  }
}


  @media (min-width: 768px) {
    margin: 0;
  }
}

.profile-header-modern {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #1f6feb, #2c3e50);
  padding: 20px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.header-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-right {
  flex: 2;
  text-align: left;
}

.avatar-modern {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
}

.welcome {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.bio {
  font-size: 1rem;
  margin-bottom: 15px;
}

.user-stats-modern {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.button-modern {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  background: #d9534f;
  color: white;
}

.button-modern:hover {
  transform: scale(1.05);
}

.search-container {
  margin: 20px 0;
  text-align: center;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
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