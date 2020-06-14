<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <h1><router-link to='/'><b>Лаборатория 832</b> | Поверка и калибровка СИ</router-link></h1>
    </header>
    <main class="app-box">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss" src='./App.scss'></style>
