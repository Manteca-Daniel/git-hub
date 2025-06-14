<template>
    <div class="login-container">
        <h1>Iniciar sesión con GitHub</h1>
        <button @click="loginWithGitHub">Login con GitHub</button>
    </div>
</template>

<script setup>
const CLIENT_ID = 'Ov23lifQwdIouclDvvnr'; // Reemplázalo con el real

const loginWithGitHub = () => {
    const redirectUri = encodeURIComponent('http://localhost:5173/callback');
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user`;

    window.location.href = githubAuthUrl;
};
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
}

button {
    padding: 10px 20px;
    background-color: #24292e;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #444;
}
</style>