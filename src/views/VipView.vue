<template>
    <div class="vip">
      <h1>This is an vip page</h1>
      <router-link to="/home">Home</router-link> | 
      <router-link to="/about">About</router-link>
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
  
  