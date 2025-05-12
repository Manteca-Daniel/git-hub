<template>
    <div class="token-page">
        <header class="token-header">
            <h1>{{ $t('token.guia_titulo') }}</h1>
            <p>{{ $t('token.guia_intro') }}</p>
        </header>

        <section class="token-section">
            <h2>{{ $t('token.que_es_token_titulo') }}</h2>
            <p>{{ $t('token.que_es_token_texto') }}</p>
            <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Token"
                class="token-image" />
        </section>

        <section class="token-section">
            <h2>{{ $t('token.como_obtener_titulo') }}</h2>
            <ol>
                <li>{{ $t("dirigite_a") }} <a href="https://github.com/settings/tokens" target="_blank">{{ $t("configuracion_tokens_git") }}</a>.</li>
                <li>{{ $t('token.paso_2') }}</li>
                <li>{{ $t('token.paso_3') }}</li>
                <li>{{ $t('token.paso_4') }}</li>
                <li>{{ $t('token.paso_5') }}</li>
            </ol>
            <p class="important">⚠️ <strong>{{ $t('token.importante') }}</strong> {{ $t('token.no_compartir') }}</p>
        </section>

        <section class="token-section">
            <h2>{{ $t('token.tipos_titulo') }}</h2>
            <ul>
                <li><strong>{{ $t('token.tipo_pat') }}</strong> {{ $t('token.tipo_pat_desc') }}</li>
                <li><strong>{{ $t('token.tipo_fine') }}</strong> {{ $t('token.tipo_fine_desc') }}</li>
                <li><strong>{{ $t('token.tipo_oauth') }}</strong> {{ $t('token.tipo_oauth_desc') }}</li>
                <li><strong>{{ $t('token.tipo_app') }}</strong> {{ $t('token.tipo_app_desc') }}</li>
            </ul>
        </section>

        <section class="token-section">
            <h2>{{ $t('token.buenas_practicas_titulo') }}</h2>
            <p>{{ $t('token.buenas_practicas_intro') }}</p>
            <ul>
                <li>🔒 {{ $t('token.practica_1') }}</li>
                <li>🛠️ {{ $t('token.practica_2') }}</li>
                <li>📅 {{ $t('token.practica_3') }}</li>
                <li>📌 {{ $t('token.practica_4') }}</li>
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

    @media (max-width: 768px) {
        padding: 15px;
    }
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

    @media (max-width: 768px) {
        margin-top: 20px;
    }
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

    @media (max-width: 480px) {
        width: 100px;
    }
}

ul,
ol {
    padding-left: 20px;

    @media (max-width: 480px) {
        padding-left: 15px;
    }
}

.important {
    background: #fff3cd;
    padding: 10px;
    border-left: 5px solid #ffa502;
    border-radius: 5px;
    margin-top: 15px;

    @media (max-width: 768px) {
        font-size: 0.8em;
    }
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