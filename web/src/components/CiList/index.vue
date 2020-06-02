<template>
  <div>
    <div class="app-table_header">
      <b-input
        v-model="search"
        placeholder="Поиск..."
        type="search"
        icon="search"
        class="app-table_search"
      />
      <b-button
        tag="a"
        href="add"
        type="is-success"
        icon-right="plus"
        outlined
        class="app-table_btn-add"
      >Добавить СИ</b-button>
      <b-checkbox-button class="app-table_btn-filter" v-model="isHideSearch" type="is-info">
        <b-icon icon="filter"></b-icon>
        <span>Фильтр</span>
      </b-checkbox-button>
    </div>
    <CiTable v-bind:isHideSearch="isHideSearch" v-bind:filter="search" />
  </div>
</template>

<script>
import CiTable from "./CiTable.vue";
export default {
  name: "CiList",
  components: {
    CiTable
  },
  data: function() {
    return {
      search: "",
      isHideSearch: true
    };
  }
};
</script>

<style lang='scss' scoped>
.app-table {
  &_search {
    grid-area: search;
  }
  &_btn {
    &-add {
      grid-area: btn-add;
    }
    &-filter {
      grid-area: btn-filter;
    }
  }
  &_header {
    display: grid;
    grid-template-columns: 0.5fr auto auto 0.1fr 0.1fr;
    grid-template-areas: "search . . btn-add btn-filter";
    grid-gap: 10px;
    padding-bottom: 10px;
  }
}
</style>