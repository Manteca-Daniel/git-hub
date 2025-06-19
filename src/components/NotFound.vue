<template>
    <div class="not-found-container">
        <div class="not-found-content">
            <h1 class="error-code">404</h1>
            <p class="error-message">{{ $t("not_found.pagina_no_existe") }}</p>
            <router-link to="/" class="home-link">
                {{ $t("not_found.volver_inicio") }}
            </router-link>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.not-found-container {
    margin-top: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.not-found-content {
    text-align: center;
    padding: 2rem;
    animation: fadeIn 1s ease;
}

.error-code {
    font-size: 8rem;
    font-weight: 800;
    color: #f87171;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
    margin: 0;
}

.error-message {
    font-size: 1.5rem;
    margin: 1rem 0;
}

.home-link {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #2563eb;
    color: white;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.home-link:hover {
    background-color: #1d4ed8;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-15px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 📱 Mobile */
@media (max-width: 480px) {
    .error-code {
        font-size: 4rem;
    }

    .error-message {
        font-size: 1.2rem;
    }

    .home-link {
        font-size: 0.9rem;
        padding: 0.6rem 1.2rem;
    }
}

/* 📱 Tablet */
@media (max-width: 768px) {
    .error-code {
        font-size: 6rem;
    }

    .not-found-content {
        padding: 1.5rem;
    }
}
</style>