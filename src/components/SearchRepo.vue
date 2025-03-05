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
        <a :href="repo.html_url">{{ repo.full_name }}</a>
        <button @click="addToFavorites(repo)" class="fav-button">
          Añadir a Favoritos
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const searchQuery = ref("");
const searchResults = ref([]);

const search = async () => {
  searchResults.value = await authStore.searchRepo(searchQuery.value);
};

const addToFavorites = (repo) => {
  authStore.addToFavorites(repo);
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
.fav-button {
  background: #3498db;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  margin: 5px;
  &:hover {
    background: #2980b9;
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
</style>
