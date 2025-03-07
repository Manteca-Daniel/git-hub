<template>
    <div class="token-page">
        <header class="token-header">
            <h1>Guía Completa sobre Tokens de GitHub</h1>
            <p>Aprende qué son los tokens, cómo generarlos y sus diferentes tipos.</p>
        </header>

        <section class="token-section">
            <h2>¿Qué es un Token de GitHub?</h2>
            <p>Un token de acceso personal (PAT) es una clave que te permite autenticarte en la API de GitHub sin
                necesidad de usar tu contraseña.</p>
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Token"
                class="token-image" />
        </section>

        <section class="token-section">
            <h2>Cómo Obtener un Token</h2>
            <ol>
                <li>Dirígete a <a href="https://github.com/settings/tokens" target="_blank">Configuración de Tokens en
                        GitHub</a>.</li>
                <li>Haz clic en "Generar nuevo token".</li>
                <li>Elige el tipo de token que necesitas.</li>
                <li>Selecciona los permisos adecuados.</li>
                <li>Genera y guarda el token en un lugar seguro.</li>
            </ol>
            <p class="important">⚠️ <strong>Importante:</strong> No compartas tu token con nadie y guárdalo en un lugar
                seguro.</p>
        </section>

        <section class="token-section">
            <h2>Tipos de Tokens</h2>
            <ul>
                <li><strong>Personal Access Token (PAT):</strong> Se usa para acceder a la API de GitHub.</li>
                <li><strong>Fine-grained PAT:</strong> Un token con permisos específicos y mayor control.</li>
                <li><strong>OAuth Token:</strong> Se usa para autenticaciones en aplicaciones de terceros.</li>
                <li><strong>GitHub App Token:</strong> Generado por aplicaciones de GitHub para autenticaciones seguras.
                </li>
            </ul>
        </section>

        <section class="token-section">
            <h2>Mejores Prácticas</h2>
            <p>Para mantener tus tokens seguros:</p>
            <ul>
                <li>🔒 Nunca compartas tu token públicamente.</li>
                <li>🛠️ Usa tokens con permisos mínimos necesarios.</li>
                <li>📅 Revoca tokens que ya no uses.</li>
                <li>📌 Almacena los tokens en variables de entorno en lugar de incluirlos en el código.</li>
            </ul>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.token-page {
    font-family: "Poppins", sans-serif;
    padding: 40px;
    max-width: 900px;
    margin: auto;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.token-header {
    text-align: center;
    background: #1f6feb;
    color: white;
    padding: 20px;
    border-radius: 10px;
}

.token-section {
    margin-top: 30px;
}

.token-section h2 {
    color: #1f6feb;
    border-bottom: 2px solid #1f6feb;
    padding-bottom: 5px;
}

.token-image {
    display: block;
    width: 150px;
    margin: 20px auto;
}

.important {
    background: #fff3cd;
    padding: 10px;
    border-left: 5px solid #ffa502;
    border-radius: 5px;
    margin-top: 15px;
}

a {
    color: #1f6feb;
    text-decoration: none;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
}
</style>