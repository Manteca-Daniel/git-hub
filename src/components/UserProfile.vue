<template>
  <div v-if="user" class="profile-container">
    <h2>Bienvenido, {{ user.login }}</h2>
    <img :src="user.avatar_url" class="avatar" />
    <p>{{ user.bio || 'Sin biografía' }}</p>

    <div class="user-stats">
      <p><strong>Repositorios públicos:</strong> {{ user.public_repos }}</p>
      <p><strong>Seguidores:</strong> {{ user.followers }}</p>
      <p><strong>Seguidos:</strong> {{ user.following }}</p>
    </div>

    <button @click="logout" class="button logout">Logout</button>

    <h3>Repositorios</h3>
    <input v-model="newRepoName" placeholder="Nombre del nuevo repo" class="input" />
    <button @click="createRepo" class="button">Crear Repositorio</button>

    <ul class="repo-list">
      <li v-for="repo in repos" :key="repo.id" class="repo-item">
        <h4>{{ repo.name }}</h4>
        <p v-if="!repo.editing">{{ repo.description || 'Sin descripción' }}</p>
        <input v-else v-model="repo.newDescription" placeholder="Nueva descripción" class="input"
          :disabled="repo.owner.login !== user.login" />

        <div class="links">
          <a :href="repo.html_url" target="_blank">Ver en GitHub</a>
          <router-link :to="`/repo/${repo.owner.login}/${repo.name}`" class="button details" style="color: white;">
            Ver detalles
          </router-link>


          <button @click="deleteRepo(repo.name)" class="button delete" :disabled="repo.owner.login !== user.login">
            Eliminar
          </button>

          <button v-if="!repo.editing" @click="editDescription(repo)" class="button edit"
            :disabled="repo.owner.login !== user.login">
            Editar Descripción
          </button>

          <button v-else @click="saveDescription(repo)" class="button save" :disabled="repo.owner.login !== user.login">
            Guardar
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