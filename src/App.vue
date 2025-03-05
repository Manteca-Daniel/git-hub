<template>

<header class="app-header">
    <h1>GitHub Insights</h1>
    <nav>
      <router-link to="/">Inicio</router-link>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer></footer>
</template>

<style lang="scss" scoped>
.app-header {
  background: #2c3e50;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  nav a {
    color: white;
    text-decoration: none;
    margin-left: 15px;
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>