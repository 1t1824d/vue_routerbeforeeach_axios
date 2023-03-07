<template>
  <div class="about">
    <h1>This is an about page</h1>
    <nav>
      <router-link to="/home">Home</router-link> | 
      <router-link to="/vip">vip</router-link>
    </nav>
  </div>
</template>
<style lang="scss" scoped>
nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

