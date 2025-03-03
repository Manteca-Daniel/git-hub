import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('github_token') || '',
        user: null,
    }),
    actions: {
        async loginWithToken(token) {
            this.token = token;
            localStorage.setItem('github_token', token);
            await this.fetchUser();
        },
        async fetchUser() {
            if (!this.token) return;
            try {
                const response = await fetch('https://api.github.com/user', {
                    headers: { Authorization: `token ${this.token}` },
                });
                if (!response.ok) {
                    throw new Error('Token inválido');
                }
                this.user = await response.json();
            } catch (error) {
                console.error('Error al obtener usuario:', error);
                this.logout();
            }
        },
        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem('github_token');
        },
    },
});