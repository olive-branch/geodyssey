<template>
  <div class="app-list">
    <div class="app-list__header">
      <div class="form-field search">
        <input
          type="search"
          id="search-input"
          placeholder="Поиск"
          v-model="search"
          v-on:input="onSearch($event.target.value)"
        />
        <i class="fa fa-search icon"></i>
      </div>
      <router-link to="/add">
        <button class="btn primary">Добавить новое СИ</button>
      </router-link>
    </div>
    <table>
      <thead>
        <tr>
          <th>Статус</th>
          <th>Наименование СИ</th>
          <th>Серийный номер</th>
          <th>Заказчик</th>
          <th>Услуга</th>
          <th>Примечание</th>
        </tr>
      </thead>
      <tbody v-if="items.length > 0">
        <div v-if="isLoading" class="preloader">
          Загрузка данных...
          <i class="fas fa-spinner fa-pulse"></i>
        </div>
        <tr v-for="item in items" :key="item.id" v-on:click="onClickRow(item)">
          <td class="status" v-bind:class="[item.status.code]">
            <span class="title">{{item.status.title}}</span>
            <div class="info" v-if="item.status.date">
              <span v-if="item.status.code !== 'done'">Отправить до</span>
              <span v-else>Отправлен</span>
              <span>{{formatDate(item.status.date)}}</span>
            </div>
          </td>
          <td>{{item.title}}</td>
          <td>{{item.serial}}</td>
          <td>{{item.client}}</td>
          <td>{{item.service}}</td>
          <td class='comments'>{{item.comments}}</td>
        </tr>
      </tbody>
      <tbody v-else-if="isLoading">
        <tr>
          <td colspan="6" class="not-found">
            Загрузка данных...
            <i class="fas fa-spinner fa-pulse"></i>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6" class="not-found">
            Список пуст
            <i class="fas fa-cat fa-2x fa-flip-horizontal"></i>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination" v-if="items.length > 0">
      <button
        type="button"
        aria-label="В начало списка"
        :disabled="currentPage === 0"
        v-on:click="onClickPage(0)"
      >
        <i class="fa fa-angle-double-left"></i>
      </button>
      <button
        type="button"
        aria-label="На предыдущую страницу"
        :disabled="currentPage === 0"
        v-on:click="onClickPage(currentPage - 1)"
      >
        <i class="fa fa-angle-left"></i>
      </button>
      <div class="select-wrapper">
        <select aria-label="Сортировка по году" v-on:change="onChangeYear($event.target.value)">
          <option value="2020">2020</option>
          <option value="2019">2019</option>
          <option value="2018">2018</option>
        </select>
      </div>
      <button
        type="button"
        aria-label="На следующую страницу"
        :disabled="currentPage === lastPage"
        v-on:click="onClickPage(currentPage + 1)"
      >
        <i class="fa fa-angle-right"></i>
      </button>
      <button
        :disabled="currentPage === lastPage"
        aria-label="В конец списка"
        v-on:click="onClickPage(lastPage)"
      >
        <i class="fa fa-angle-double-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import ListService from "../../services/list.service";
export default {
  name: "CiList",
  data: function() {
    return {
      search: "",
      items: [],
      limit: 7,
      currentPage: 0,
      total: 0,
      isLoading: true
    };
  },
  mounted() {
    let { page, search } = this.$route.query;
    if (page !== undefined) {
      this.currentPage = page - 1;
    }
    if (search !== undefined) {
      this.search = search;
    }
    this.getItems(this.limit, this.currentPage, this.search);
  },
  computed: {
    lastPage() {
      return Math.floor(this.total / this.limit);
    }
  },
  methods: {
    onClickRow(row) {
      this.$router.push({ name: "detail", params: { id: row.id } });
    },
    getItems(limit, currentPage, query, year) {
      this.isLoading = true;
      ListService.getList(limit, currentPage, query, year).then(
        ({ items, total, currentPage }) => {
          this.items = items;
          this.total = total;
          this.currentPage = currentPage;
          this.isLoading = false;
        }
      );
    },
    onClickPage(page) {
      this.updateQueryParams(page + 1, this.search);
      this.getItems(this.limit, page);
    },
    onSearch(value) {
      if (value.length >= 3 || value.length === 0) {
        this.updateQueryParams(this.currentPage + 1, this.search);
        this.getItems(this.limit, this.currentPage, value);
      }
    },
    onChangeYear(value) {
      this.getItems(this.limit, this.currentPage, "", parseInt(value, 10));
    },
    formatDate(date) {
      let dd = new Date(date).getDate(),
        mm = new Date(date).getMonth() + 1,
        yyyy = new Date(date).getFullYear();
      return `${dd < 10 ? "0" + dd : dd}.${mm < 10 ? "0" + mm : mm}.${yyyy}`;
    },
    updateQueryParams(page, search) {
      this.$router.push({ path: '/', query: { page, search } }).catch(()=>{});
    }
  }
};
</script>

<style lang='scss' scoped>
@keyframes changeOpacity {
  0%   { opacity: 0.1; }
  5%   { opacity: 0.1; }
  50%  { opacity: 0.3; } 
  90%  { opacity: 0.1; }
  100% { opacity: 0.1; }
}
.app-list {
  display: grid;
  grid-gap: 10px;
  grid-template-rows: 1fr auto 1fr;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & table {
    width: 100%;
    height: 100%;
    text-align: left;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-collapse: collapse;
    border-radius: 5px;
    border-style: hidden;
    position: relative;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    & .preloader {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: #000000;
      text-align: center;
      font-size: 16px;
      animation: 5s infinite ease-in-out changeOpacity ; 
    }
    & thead {
      background-color: rgba(43, 48, 183, 0.05);
      line-height: 70px;
      white-space: nowrap;
    }
    & th, td {
      padding: 5px 20px;
    }
    & tr {
      height: 70px;
      border-bottom:  1px solid rgba(0, 0, 0, 0.15);
    }
    & tbody {
      & tr:hover {
        background-color: rgba(93, 97, 219, 0.05);
        cursor: pointer;
      }
      & td {
        white-space: nowrap;
        &.comments{ 
          display: block;		
          overflow: hidden;		
          text-overflow: ellipsis;		
          width: 200px;
          word-break: break-all;
          white-space: pre;
        }
        &.not-found {
          text-align: center;
          font-size: 16px;
        }
        &.status {
          display: grid;
          grid-template-columns: 80px min-content;
          background-color: rgb(244,245,250);
          padding: 8px 10px;
          align-items: center;
          margin-left: 10px;
          border-top-right-radius: 25px;
          border-bottom-right-radius: 25px;
          margin-top: 10px;
          min-height: 30px;
          border-left: 3px solid;
          align-content: center;
          &.notReady {
            border-left-color:#BD4949;
          }
          &.ready {
            border-left-color: rgb(144, 148, 212);
          }
          &.done {
            border-left-color: #7DC46B;
          }
          & .info {
            padding-left: 10px;
            border-left: 1px solid rgba(0, 0, 0, 0.15);
            width: 100%;
            white-space: nowrap;
            display: grid;
          }
          & .title {
            padding-right: 10px;
          }
        }
      }
    }
  }
}

.pagination {
  display: grid;
  grid-template-columns: 35px 35px 80px 35px 35px;
  grid-gap: 7px;
  width: 100%;
  justify-content: center;

  & button {
    border: 1px solid rgba(0,0,0, 0.15);
    background-color: white;
    border-radius: 5px;
    width: 35px;
    height: 35px;
    font-size: 18px;
    color: rgba(0,0,0, 1);
    cursor: pointer;
    &:hover {
      color: #2b30b7;
    }
    &:enabled:active {
      background-color: rgba(127, 129, 219, 0.1);
    }
    &:disabled{
     color: rgba(0,0,0, 0.5);
    }
  }
  & .select-wrapper {
    position: relative;
    width: 80px;
    &:after {
      position: absolute;
      right: 10px;
      top: 12px;
      pointer-events: none;
      border: solid #ffffff;
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      transform: rotate(45deg);
      content: "";
    }

    & select {
      color: white;
      font-style: italic;
      background-color: #2b30b7;
      font-size: 14px;
      width: 100%;
      outline: 0;
      -webkit-appearance: none;
      border-radius: 5px;
      padding: 5px 15px 5px 15px;
      min-width: 50px;
      height: 35px;
    }
  }
}
</style>