<template>
  <div id="app" class="app-container">
    <header class="app-header">
      <h1>Проверка и калибровка СИ v1</h1>
    </header>
    <main class="app-box">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>
    <footer class="app-footer">
      <span>ФГУП "ВНИИФТРИ", Отдел 83, НИО-8, 2020г.</span>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss">
@font-face {
  font-family: "Roboto";
  src: url("./assets/fonts/Roboto/Roboto-Regular.ttf");
}
@font-face {
  font-family: "Roboto-Light";
  src: url("./assets/fonts/Roboto/Roboto-Light.ttf");
}

@font-face {
  font-family: "Roboto-Bold";
  src: url("./assets/fonts/Roboto/Roboto-Bold.ttf");
}
html,
body {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

body {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  font-size: 14px;
  overflow: hidden;
}
/* common containers */
.app {
  &-box {
    padding-left: 50px;
    padding-right: 50px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 175px);
  }
  &-container {
    grid-template-rows: 55px auto 55px;
    display: grid;
    min-height: 100%;
    overflow: hidden;
    grid-gap: 1.5em;
  }
  &-header, &-footer {
    background-color: #1496ed;
    color: #ffffff;
    display: flex;
    padding-left: 50px;
    padding-right: 50px;
    align-items: center;
  }
  &-header {
  font-size: 1.3em;
  }
}
</style>
