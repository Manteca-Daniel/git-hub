import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("github_token") || "",
    user: JSON.parse(localStorage.getItem("github_user")) || null,
    repos: JSON.parse(localStorage.getItem("github_repos")) || [],
    repoDetails: null,
    issues: [],
    pullRequests: [],
    commits: [],
    favoriteRepos: JSON.parse(localStorage.getItem('favorite_repos')) || [],
  }),
  actions: {
    async searchRepo(repoName) {
      try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${repoName}`);
        const data = await response.json();
        return data.items;
      } catch (error) {
        console.error('Error al buscar el repositorio:', error);
        return [];
      }
    },
    addToFavorites(repo) {
      if (!this.favoriteRepos.some(fav => fav.id === repo.id)) {
        this.favoriteRepos.push(repo);
        localStorage.setItem('favorite_repos', JSON.stringify(this.favoriteRepos));
      }
    },
    async createIssue(owner, repo, title, body) {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
          method: 'POST',
          headers: {
            Authorization: `token ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title,
            body: body,
          }),
        });
        return await response.json();
      } catch (error) {
        console.error('Error al crear el issue:', error);
      }
    },
    async loginWithToken(token) {
      this.token = token;
      localStorage.setItem("github_token", token);
      await this.fetchUser();
      await this.fetchRepos();
    },
    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await fetch("https://api.github.com/user", {
          headers: { Authorization: `token ${this.token}` },
        });
        if (!response.ok) {
          throw new Error("Token inválido");
        }
        this.user = await response.json();
        localStorage.setItem("github_user", JSON.stringify(this.user));
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        this.logout();
      }
    },
    async fetchRepos() {
      if (!this.token) return;
      try {
        const response = await fetch("https://api.github.com/user/repos", {
          headers: { Authorization: `token ${this.token}` },
        });
        if (!response.ok) {
          throw new Error("Error al obtener repositorios");
        }
        this.repos = await response.json();
        localStorage.setItem("github_repos", JSON.stringify(this.repos));
      } catch (error) {
        console.error("Error al obtener repositorios:", error);
      }
    },
    async fetchRepoDetails(repoName) {
      if (!this.token) return;
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.user.login}/${repoName}`,
          {
            headers: { Authorization: `token ${this.token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener detalles del repositorio");
        }
        this.repoDetails = await response.json();
        await this.fetchIssues(repoName);
        await this.fetchPullRequests(repoName);
        await this.fetchCommits(repoName);
      } catch (error) {
        console.error("Error al obtener detalles del repositorio:", error);
      }
    },
    async fetchIssues(repoName) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.user.login}/${repoName}/issues`,
          {
            headers: { Authorization: `token ${this.token}` },
          }
        );
        this.issues = await response.json();
      } catch (error) {
        console.error("Error al obtener issues:", error);
      }
    },
    async fetchPullRequests(repoName) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.user.login}/${repoName}/pulls`,
          {
            headers: { Authorization: `token ${this.token}` },
          }
        );
        this.pullRequests = await response.json();
      } catch (error) {
        console.error("Error al obtener pull requests:", error);
      }
    },
    async fetchCommits(repoName) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.user.login}/${repoName}/commits`,
          {
            headers: { Authorization: `token ${this.token}` },
          }
        );
        this.commits = await response.json();
      } catch (error) {
        console.error("Error al obtener commits:", error);
      }
    },
    async createBranch(repoName, branchName) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.user.login}/${repoName}/git/refs/heads/main`,
          {
            headers: { Authorization: `token ${this.token}` },
          }
        );
        const mainBranch = await response.json();

        await fetch(
          `https://api.github.com/repos/${this.user.login}/${repoName}/git/refs`,
          {
            method: "POST",
            headers: {
              Authorization: `token ${this.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ref: `refs/heads/${branchName}`,
              sha: mainBranch.object.sha,
            }),
          }
        );
        console.log(`Rama ${branchName} creada correctamente.`);
      } catch (error) {
        console.error("Error al crear la rama:", error);
      }
    },

    async createRepo(repoName, repoDescription = "") {
      if (!this.token) return;
      try {
        const response = await fetch("https://api.github.com/user/repos", {
          method: "POST",
          headers: {
            Authorization: `token ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: repoName,
            description: repoDescription,
            private: false, // Cambia a true si quieres repos privados
          }),
        });

        if (!response.ok) throw new Error("Error al crear el repositorio");

        const newRepo = await response.json();
        this.repos.push(newRepo);
        localStorage.setItem("github_repos", JSON.stringify(this.repos));
      } catch (error) {
        console.error("Error al crear el repositorio:", error);
      }
    },

    async deleteRepo(repoName) {
      if (!this.token || !this.user) return;
      try {
        const response = await fetch(
          `https://api.github.com/repos/${this.user.login}/${repoName}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `token ${this.token}`,
            },
          }
        );

        if (response.status === 204) {
          // Filtramos el repo eliminado de la lista
          this.repos = this.repos.filter((repo) => repo.name !== repoName);
          localStorage.setItem("github_repos", JSON.stringify(this.repos));
        } else {
          throw new Error("No se pudo eliminar el repositorio");
        }
      } catch (error) {
        console.error("Error al eliminar el repositorio:", error);
      }
    },

    logout() {
      this.token = "";
      this.user = null;
      this.repos = [];
      this.repoDetails = null;
      this.issues = [];
      this.pullRequests = [];
      this.commits = [];
      localStorage.removeItem("github_token");
      localStorage.removeItem("github_user");
      localStorage.removeItem("github_repos");
    },

    initializeAuth() {
      if (this.token) {
        this.fetchUser();
        this.fetchRepos();
      }
    },
  },
});
