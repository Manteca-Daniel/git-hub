<template>
  <div class="search-container">
    <h2>Buscar Repositorio</h2>
    <div class="search-box">
      <input
        v-model="searchQuery"
        placeholder="Nombre del repositorio"
        class="search-input"
      />
      <button @click="search" class="search-button">Buscar</button>
    </div>
    <ul class="repo-list">
      <li v-for="repo in searchResults" :key="repo.id" class="repo-item">
        <div class="repo-info">
          <a :href="repo.html_url" target="_blank" class="repo-link">
            {{ repo.full_name }}
          </a>
        </div>
        <div class="repo-actions">
          <button @click="addToFavorites(repo)" class="fav-button">❤ Favorito</button>
          <button @click="starRepo(repo)" class="star-button">⭐ Star</button>
          <button @click="openIssueForm(repo)" class="issue-button">📝 Issue</button>
        </div>
      </li>
    </ul>

    <div v-if="selectedRepo" class="issue-form">
      <h3>Crear un Issue en {{ selectedRepo.full_name }}</h3>
      <input v-model="issueTitle" placeholder="Título del issue" class="input" />
      <textarea v-model="issueBody" placeholder="Descripción" class="textarea"></textarea>
      <div class="button-group">
        <button @click="submitIssue" class="submit-button">Enviar</button>
        <button @click="selectedRepo = null" class="cancel-button">Cancelar</button>
      </div>
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
  max-width: 600px;
  margin: 30px auto;
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.search-box {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}
.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.search-button {
  background: #3498db;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #2980b9;
  }
}
.repo-list {
  list-style: none;
  padding: 0;
}
.repo-item {
  background: #f9f9f9;
  margin: 10px 0;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.repo-link {
  font-weight: bold;
  text-decoration: none;
  color: #2c3e50;
  &:hover {
    color: #2980b9;
  }
}
.repo-actions {
  display: flex;
  gap: 10px;
}
.fav-button,
.star-button,
.issue-button,
.submit-button,
.cancel-button {
  background: #3498db;
  color: white;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
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
.issue-form {
  background: #f5f5f5;
  padding: 20px;
  margin: 20px auto;
  width: 100%;
  border-radius: 5px;
}
.input, .textarea {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.textarea {
  height: 80px;
}
.button-group {
  display: flex;
  justify-content: space-between;
}
</style>
