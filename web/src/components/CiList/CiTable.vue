<template>
  <b-table
    :data="tableData"
    :paginated="isPaginated"
    :per-page="perPage"
    :current-page.sync="currentPage"
    :pagination-position="paginationPosition"
    aria-next-label="Next page"
    aria-previous-label="Previous page"
    aria-page-label="Page"
    aria-current-label="Current page"
    @click="onClickRow"
    @filters-change="onChangeFilter"
  >
    /** 
      add total, backend-pagination, loading
    */
    <template slot-scope="props">
      <template v-for="column in columns">
        <b-table-column
          :key="column.id"
          v-bind="column"
          v-bind:searchable="!isHideSearch && column.searchable"
        >{{ props.row[column.field] }}</b-table-column>
      </template>
    </template>
    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="cat" size="is-large"></b-icon>
          </p>
          <p>Nothing here.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script>
// https://buefy.org/documentation/table/#async-data

const data = require("@/assets/data.json");
export default {
  name: "CiTable",
  props: {
    isHideSearch: Boolean,
    filter: String
  },
  data() {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      paginationPosition: "bottom",
      currentPage: 1,
      perPage: 10,
      data,
      columns: [
        {
          field: "mode",
          label: "Модификация СИ",
          searchable: true
        },
        {
          field: "customer",
          label: "Заказчик",
          searchable: true
        },
        {
          field: "service",
          label: "Услуга",
          searchable: true
        },
        {
          field: "status",
          label: "Статус",
          searchable: true
        },
        {
          field: "description",
          label: "Примечание",
          searchable: true
        }
      ]
    };
  },
  computed: {
    tableData() {
      if (this.filter === "") {
        return this.data;
      }
      let filter = this.filter.toLowerCase();
      return [...this.data.filter(x => 
        x.mode.toLowerCase().includes(filter) ||
        x.customer.toLowerCase().includes(filter) ||
        x.service.toLowerCase().includes(filter) ||
        x.status.toLowerCase().includes(filter) ||
        x.description.toLowerCase().includes(filter)
      )];
    }
  },
  methods: {
    onClickRow(row) {
      //https://router.vuejs.org/ru/guide/essentials/named-routes.html
      this.$router.push({ name: 'detail', params: { id: row.id } })
    },
    // not working
    onChangeFilter(filter) {
      //set params to url 
      console.log(filter);
    }
  }
};
</script>