<template>
  <div class="search-container">
    <h2>{{ $t("nav.search") }}</h2>
    <div class="search-box">
      <input
        v-model="searchQuery"
        :placeholder="$t('buscar_nombre_repo')"
        class="search-input"
      />
      <button @click="search" class="search-button" :disabled="loading">
        {{ $t("buscar") }}
      </button>
    </div>

    <p v-if="loading" class="loading">{{ $t("buscando_repos") }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <ul v-if="searchResults.length > 0" class="repo-list">
      <li v-for="repo in searchResults" :key="repo.id" class="repo-item">
        <div class="repo-info">
          <a :href="repo.html_url" target="_blank" class="repo-link">
            {{ repo.full_name }}
          </a>
        </div>
        <div class="repo-actions">
          <button @click="starRepo(repo)" class="star-button">⭐ {{ $t("stars") }}</button>
          <button @click="openIssueForm(repo)" class="issue-button">📝 {{ $t("issues") }}</button>
        </div>
      </li>
    </ul>

    <div class="pagination" v-if="searchResults.length > 0">
      <button @click="prevPage" :disabled="page <= 1">{{ $t("anterior") }}</button>
      <span>{{ $t("pagina") }} {{ page }}</span>
      <button @click="nextPage">{{ $t("siguiente") }}</button>
    </div>

    <div v-if="selectedRepo" class="issue-form">
      <h3>{{ $t("crear_issue_en") }} {{ selectedRepo.full_name }}</h3>
      <input
        v-model="issueTitle"
        :placeholder="$t('titulo_issue')"
        class="input"
      />
      <textarea
        v-model="issueBody"
        :placeholder="$t('descripcion_issue')"
        class="textarea"
      ></textarea>
      <div class="button-group">
        <button @click="submitIssue" class="submit-button">
          {{ $t("enviar") }}
        </button>
        <button @click="selectedRepo = null" class="cancel-button">
          {{ $t("cancelar") }}
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const authStore = useAuthStore();

const searchQuery = ref("");
const searchResults = ref([]);
const selectedRepo = ref(null);
const issueTitle = ref("");
const issueBody = ref("");
const loading = ref(false);
const errorMessage = ref("");
const page = ref(1);
const perPage = 10;

const search = async () => {
  if (!searchQuery.value.trim()) {
    errorMessage.value = t("search.empty_field");
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  searchResults.value = [];

  try {
    const results = await authStore.searchRepo(searchQuery.value, page.value, perPage);
    if (results.length === 0) {
      errorMessage.value = t("search.no_results");
    }
    searchResults.value = results;
  } catch (error) {
    errorMessage.value = t("search.error");
  }

  loading.value = false;
};

const nextPage = () => {
  page.value++;
  search();
};

const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    search();
  }
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
    alert(t("search.fill_fields"));
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

.loading {
  color: #3498db;
  font-weight: bold;
}
.error {
  color: #e74c3c;
  font-weight: bold;
}
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}
.search-container {
  max-width: 600px;
  margin: 30px auto;
  text-align: center;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .repo-item {
    flex-direction: column;
    text-align: center;
  }
  .repo-actions {
    flex-direction: column;
  }
  .button-group {
    flex-direction: column;
  }
}
</style>
