<template>
  <div class="search-container">
    <h2>Buscar Repositorio</h2>
    <input
      v-model="searchQuery"
      placeholder="Nombre del repositorio"
      class="search-input"
    />
    <button @click="search" class="search-button">Buscar</button>
    <ul class="repo-list">
      <li v-for="repo in searchResults" :key="repo.id" class="repo-item">
        <a :href="repo.html_url" target="_blank">{{ repo.full_name }}</a>
        <div>
          <button @click="addToFavorites(repo)" class="fav-button">
            Añadir a Favoritos
          </button>
          <button @click="starRepo(repo)" class="star-button">
            ⭐ Star
          </button>
          <button @click="openIssueForm(repo)" class="issue-button">
            📝 Crear Issue
          </button>
        </div>
      </li>
    </ul>

    <!-- Formulario para crear un issue -->
    <div v-if="selectedRepo" class="issue-form">
      <h3>Crear un Issue en {{ selectedRepo.full_name }}</h3>
      <input v-model="issueTitle" placeholder="Título del issue" class="input" />
      <textarea v-model="issueBody" placeholder="Descripción" class="textarea"></textarea>
      <button @click="submitIssue" class="submit-button">Enviar Issue</button>
      <button @click="selectedRepo = null" class="cancel-button">Cancelar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const searchQuery = ref("");
const searchResults = ref([]);
const selectedRepo = ref(null);
const issueTitle = ref("");
const issueBody = ref("");

const search = async () => {
  searchResults.value = await authStore.searchRepo(searchQuery.value);
};

const addToFavorites = (repo) => {
  authStore.addToFavorites(repo);
};

const starRepo = async (repo) => {
  await authStore.starRepo(repo.owner.login, repo.name);
};

const openIssueForm = (repo) => {
  selectedRepo.value = repo;
  issueTitle.value = "";
  issueBody.value = "";
};

const submitIssue = async () => {
  if (!issueTitle.value.trim() || !issueBody.value.trim()) {
    alert("Por favor, completa ambos campos.");
    return;
  }

  await authStore.createIssue(
    selectedRepo.value.owner.login,
    selectedRepo.value.name,
    issueTitle.value,
    issueBody.value
  );
  selectedRepo.value = null;
};
</script>

<style lang="scss" scoped>
.search-container {
  text-align: center;
  margin: 20px auto;
}
.search-input {
  padding: 10px;
  width: 60%;
  margin: 10px 0;
}
.search-button,
.fav-button,
.star-button,
.issue-button,
.submit-button,
.cancel-button {
  background: #3498db;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  margin: 5px;
  border-radius: 5px;
  &:hover {
    background: #2980b9;
  }
}
.issue-button {
  background: #e67e22;
  &:hover {
    background: #d35400;
  }
}
.submit-button {
  background: #2ecc71;
  &:hover {
    background: #27ae60;
  }
}
.cancel-button {
  background: #e74c3c;
  &:hover {
    background: #c0392b;
  }
}
.repo-list {
  list-style: none;
  padding: 0;
}
.repo-item {
  background: #ecf0f1;
  margin: 10px auto;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.issue-form {
  background: #f5f5f5;
  padding: 20px;
  margin: 20px auto;
  width: 50%;
  border-radius: 5px;
}
.input, .textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
}
.textarea {
  height: 80px;
}
</style>
