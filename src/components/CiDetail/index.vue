<template src='./template.html'></template>

<script src='./script.js'></script>

<style lang="scss" scoped>
.app-card {
  width: 100%;
  display: grid;
  grid-template-rows: 100px auto;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  & .header {
    background-color: rgb(244, 245, 250);
    padding-left: 30px;
    display: grid;
    border-bottom: 7px solid #2b30b7;
    grid-template-columns: 1fr 100px;
    &.status {
      &.notReady {
        border-bottom-color: #bd4949;
      }
      &.ready {
        border-bottom-color: rgb(144, 148, 212);
      }
      &.done {
        border-bottom-color: #7dc46b;
      }
    }
    & h1,
    h3 {
      margin: 0;
    }
    & h1 {
      padding-top: 10px;
      &.preloader {
        color: rgba(0, 0, 0, 0.5);
      }
    }
    & h3 {
      grid-row: 2/2;
      font-weight: normal;
    }
    & a {
      grid-row: 1/3;
      background-color: #2b30b7;
      color: white;
      text-decoration: none;
      font-size: 16px;
      padding: 25px 10px 10px 10px;
      text-align: center;
      border-top-right-radius: 5px;

      &:hover {
        background-color: #5d61db;
        cursor: pointer;
      }
    }
  }
  & .body {
    padding: 10px 30px;
    display: grid;
    overflow-y: auto;
    grid-gap: 30px;
    grid-template-columns: 1fr 1fr 1fr;
    & .w-100 {
      width: 100%;
    }
    & h3 {
      margin: 10px 0;
    }
    & .block-bottom {
      grid-column: 2/2;
      grid-row: 2/2;
    }
    & .block-large {
      grid-row: 1/3;
      display: flex;
      flex-direction: column;
    }
    & .form-actions {
      margin-top: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 10px;
      & .btn-add {
        grid-column: 2/2;
      }
    }
  }
}

.popup {
  display: flex;
  width: 0;
  height: 0;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease-in;
  &.is-open {
    opacity: 1;
    width: 100%;
    height: 100%;
    visibility: visible;
  }
  &__body {
    background-color: #ffffff;
    border-radius: 10px;
    margin: auto;
    min-width: 350px;
    min-height: 150px;
    display: grid;
    padding: 10px 20px;
    & h6 {
      font-size: 18px;
      color: #2b30b7;
      margin: 40px auto;
    }
    & .actions {
      display: grid;
      margin: auto;
      width: 100%;
      grid-gap: 10px;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
    }
  }
}

</style>
