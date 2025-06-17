<template>
    <div class="login-bg">
        <div class="login-card">
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" class="github-logo" />
            <h1 class="login-title">{{ $t('espacio_trabajo_git') }}</h1>
            <p class="login-highlight">
                {{ $t('gestion_repos_tickets') }}
            </p>
            <p class="login-subtitle">
                {{ $t('git_organizar_proyectos') }}
            </p>
            <button @click="loginWithGitHub" class="github-btn">
                <svg class="github-icon" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                    0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
                    -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
                    -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65
                    7.65 0 0 1 8 4.77c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
                    2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
                    1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                {{ $t('iniciar_sesión_con_gitHub') }}
            </button>
        </div>
    </div>
</template>

<script setup>
const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

const loginWithGitHub = () => {
    const redirectUri = encodeURIComponent('http://localhost:5173/callback');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user,delete_repo&prompt=consent`;
    window.location.href = githubAuthUrl;
};
</script>

<style scoped>
.login-bg {
    min-height: 65vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-card {
    background: #fff;
    padding: 2.2rem 2.2rem 2.2rem 2.2rem;
    border-radius: 20px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    width: 100%;
    gap: 1.1rem;
}

.github-logo {
    width: 75px;
    height: 75px;
}

.login-title {
    font-size: 2.1rem;
    color: #24292e;
    margin-bottom: 0.1rem;
    letter-spacing: -1px;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
    text-align: center;
}

.login-highlight {
    color: #f57224;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
    text-align: center;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.login-subtitle {
    color: #586069;
    font-size: 1rem;
    text-align: center;
    margin-bottom: 1.1rem;
    line-height: 1.5;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.github-btn {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    background: #24292e;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.85rem 1.7rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(36,41,46,0.07);
    transition: background 0.2s, transform 0.1s;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.github-btn:hover {
    background: #444d56;
    transform: translateY(-2px) scale(1.03);
}

.github-icon {
    vertical-align: middle;
}
</style>