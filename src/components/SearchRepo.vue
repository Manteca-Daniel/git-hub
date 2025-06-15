<template>
  <div class="container-search-repo">
    <div class="search-card">
      <h2 class="search-title">{{ $t("nav.search") }}</h2>
      <form class="search-box" @submit.prevent="search">
        <input
          v-model="searchQuery"
          :placeholder="$t('buscar_nombre_repo')"
          class="search-input"
        />
        <button type="submit" class="search-button" :disabled="loading">
          {{ $t("buscar") }}
        </button>
      </form>

      <transition name="fade">
        <p v-if="loading" class="loading">{{ $t("buscando_repos") }}</p>
      </transition>
      <transition name="fade">
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </transition>

      <ul v-if="searchResults.length > 0" class="repo-grid">
        <li v-for="repo in searchResults" :key="repo.id" class="repo-card">
          <div class="repo-header">
            <a :href="repo.html_url" target="_blank" class="repo-title">
              {{ repo.full_name }}
            </a>
            <p v-if="repo.description" class="repo-description">
              {{ repo.description }}
            </p>
          </div>
          <div class="repo-meta">
            <span class="meta-tag">⭐ {{ repo.stargazers_count }}</span>
            <span class="meta-tag">🛠 {{ repo.language || 'N/A' }}</span>
          </div>
          <div class="repo-buttons">
            <button @click="starRepo(repo)" class="repo-btn" :title="$t('stars')">⭐ {{ $t('stars') }}</button>
            <button @click="openIssueForm(repo)" class="repo-btn" :title="$t('issues')">📝 {{ $t('issues') }}</button>
            <router-link
              :to="`/repo/${repo.owner.login}/${repo.name}`"
              class="repo-btn"
              :title="$t('ver_detalles')"
            >🔍 {{ $t('ver_detalles') }}</router-link>
          </div>
        </li>
      </ul>

      <div class="pagination" v-if="searchResults.length > 0">
        <button @click="prevPage" :disabled="page <= 1">{{ $t("anterior") }}</button>
        <span>{{ $t("pagina") }} {{ page }}</span>
        <button @click="nextPage">{{ $t("siguiente") }}</button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="selectedRepo" class="issue-form-card">
        <h3 class="issue-title">
          {{ $t("crear_issue_en") }} <span class="repo-highlight">{{ selectedRepo.full_name }}</span>
        </h3>
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
    </transition>
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
.container-search-repo {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 0;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.search-card {
  width: 100%;
  max-width: 90vw;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(36, 41, 46, 0.08);
  padding: 32px 28px 24px 28px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.search-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #24292e;
  margin-bottom: 18px;
  text-align: center;
  letter-spacing: -1px;
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  justify-content: center;
}

.search-input {
  flex: 1;
  padding: 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.2s;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
}
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 20px;
  margin-top: 24px;
  padding: 0;
}

.repo-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }
}

.repo-header {
  margin-bottom: 12px;
}

.repo-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #3498db;
  }
}

.repo-description {
  margin-top: 6px;
  font-size: 0.95rem;
  color: #586069;
  line-height: 1.4;
}

.repo-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 10px 0;
}

.meta-tag {
  background-color: #f1f3f5;
  color: #333;
  padding: 4px 8px;
  font-size: 0.85rem;
  border-radius: 6px;
}

.repo-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.repo-btn {
  background-color: #f4f6fa;
  color: #2c3e50;
  padding: 8px 10px;
  font-size: 0.88rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;

  &:hover {
    background-color: #e0e7ff;
    transform: scale(1.05);
  }
}
.search-button {
  background: #3498db;
  color: white;
  padding: 12px 22px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;

  &:hover:enabled {
    background: #217dbb;
    transform: translateY(-2px) scale(1.03);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.loading,
.error {
  margin: 10px 0;
  font-size: 1.08rem;
  font-weight: 500;
  text-align: center;
}

.loading {
  color: #3498db;
}

.error {
  color: #e74c3c;
}

.repo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.repo-item {
  background: #f9f9f9;
  margin: 14px 0;
  padding: 18px 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(36,41,46,0.06);
  transition: box-shadow 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0 6px 18px rgba(36,41,46,0.13);
  }
}

.repo-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
}

.repo-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.repo-link {
  font-weight: 700;
  font-size: 1.08rem;
  text-decoration: none;
  color: #2c3e50;
  margin-bottom: 4px;
  transition: color 0.2s;

  &:hover {
    color: #3498db;
  }
}

.repo-desc {
  color: #586069;
  font-size: 0.98rem;
  margin-top: 2px;
  max-width: 340px;
  word-break: break-word;
}

.repo-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.star-button,
.issue-button,
.details-button {
  background: #f4f6fa;
  color: #24292e;
  padding: 8px 12px;
  border: none;
  border-radius: 7px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.1s;
  outline: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-button {
  background: #fffbe6;
  color: #f1c40f;

  &:hover {
    background: #fff3b0;
    color: #e1b800;
  }
}

.issue-button {
  background: #fbeee6;
  color: #e67e22;

  &:hover {
    background: #f8e0c6;
    color: #d35400;
  }
}

.details-button {
  background: #e8e6fb;
  color: #8e44ad;
  text-decoration: none;

  &:hover {
    background: #d6d1f7;
    color: #6c3483;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
}

.pagination button {
  background: #f4f6fa;
  color: #24292e;
  border: none;
  border-radius: 7px;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:enabled {
    background: #e2e8f0;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.issue-form-card {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(36, 41, 46, 0.08);
  padding: 28px 24px 20px 24px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.issue-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #24292e;
  margin-bottom: 16px;
  text-align: center;
}

.repo-highlight {
  color: #3498db;
}

.input,
.textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0 0 0;
  border: 1.5px solid #d1d5db;
  border-radius: 7px;
  font-size: 1rem;
  transition: border 0.2s;
  outline: none;

  &:focus {
    border-color: #3498db;
  }
}

.textarea {
  min-height: 80px;
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}

.submit-button {
  background: #2ecc71;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 7px;
  padding: 10px 18px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #27ae60;
  }
}

.cancel-button {
  background: #e74c3c;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 7px;
  padding: 10px 18px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c0392b;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 700px) {
  .search-card, .issue-form-card {
    max-width: 98vw;
    padding: 18px 6px 14px 6px;
  }
  .repo-desc {
    max-width: 90vw;
  }
}
</style>
