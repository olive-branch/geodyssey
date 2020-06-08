<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <h1><b>Лаборатория 832</b> | Поверка и калибровка СИ</h1>
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
