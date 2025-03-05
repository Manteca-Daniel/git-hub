<template>
  <div class="favorites-container">
    <h2>Repositorios Favoritos</h2>
    <ul class="repo-list">
      <li
        v-for="repo in authStore.favoriteRepos"
        :key="repo.id"
        class="repo-item"
      >
        <router-link :to="`/repo/${repo.full_name}`">{{
          repo.full_name
        }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/authStore";
const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
.favorites-container {
  text-align: center;
  margin: 20px auto;
}
</style>
