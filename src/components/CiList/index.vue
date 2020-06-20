<template>
  <div class='app-list'>
    <div class='app-list__header'>
      <div class='form-field search'>
        <input type='search' id='search-input' placeholder="Поиск" v-model="search"/>
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
      <tbody v-if="filteredItems.length > 0" >
        <tr v-for="item in filteredItems" :key="item.id" v-on:click="onClickRow(item)">
          <td class='status' v-bind:class="[item.state.class]">
            <span class='title'>{{item.state.title}}</span>
            <div class="info"><span>Отправить до</span><span> 28.05.2020</span></div>
          </td>
          <td>{{item.title}}</td>
          <td>{{item.serialNum}}</td>
          <td>{{item.customer}}</td>
          <td>{{item.service}}</td>
          <td>{{item.description}}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr><td colspan="6" class='not-found'>Список пуст <i class="fas fa-cat fa-2x fa-flip-horizontal"></i></td></tr>
      </tbody>
    </table>
    <div class='pagination'>
      <button disabled><i class="fa fa-angle-double-left"></i></button>
      <button><i class="fa fa-angle-left"></i></button>
      <div class='select-wrapper'>
        <select>
          <option>2020</option>
          <option>2019</option>
          <option>2018</option>
        </select>
      </div>
      <button><i class="fa fa-angle-right"></i></button>
      <button><i class="fa fa-angle-double-right"></i></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CiList",
  data: function() {
    return {
      search: "",
      items: [
        {
          id: 1,
          state: {title: "Не готов", class: "not-ready"},
          title: "Leica TS60",
          serialNum: "886674",
          customer: "ФБУ “Кемеровский ЦСМ”",
          service: "Калибровка по длине",
          description: ""
        },
         {
          id: 2,
          state: {title: "Не готов", class: "not-ready"},
          title: "NET05AXII",
          serialNum: "ILS081546257",
          customer: "ФБУ “Ростовский ЦСМ”",
          service: "Поверка",
          description: "С протоколом"
        },
        {
          id: 3,
          state: {title: "Готов", class: "ready"},
          title: "NET05AXII",
          serialNum: "ILS081546257",
          customer: "ФБУ “Ростовский ЦСМ”",
          service: "Поверка",
          description: "1й разряд"
        },

        {
          id: 4,
          state: {title: "Отправлен", class: "send"},
          title: "Leica TS60",
          serialNum: "886674",
          customer: "ФБУ “Ростовский ЦСМ”",
          service: "Калибровка по длине",
          description: "С протоколом"
        },
        {
          id: 5,
          state: {title: "Готов", class: "ready"},
          title: "Leica TS60",
          serialNum: "886674",
          customer: "ФБУ “Ростовский ЦСМ”",
          service: "Поверка",
          description: ""
        },
        {
          id: 6,
          state: {title: "Отправлен", class: "send"},
          title: "NET05AXII",
          serialNum: "ILS081546257",
          customer: "ФБУ “Ростовский ЦСМ”",
          service: "Поверка",
          description: ""
        },
        {
          id: 7,
          state: {title: "Не готов", class: "not-ready"},
          title: "NET05AXII",
          serialNum: "ILS081546257",
          customer: "ФБУ “Ростовский ЦСМ”",
          service: "Поверка",
          description: "1й разряд"
        },
      ]
    };
  },
   computed: {
    filteredItems() {
      if (this.search.length === 0) {
        return this.items;
      }
      let filter = this.search.toLowerCase();
      return [...this.items.filter(x => 
        x.title.toLowerCase().includes(filter) ||
        x.customer.toLowerCase().includes(filter) ||
        x.service.toLowerCase().includes(filter) ||
        x.description.toLowerCase().includes(filter)
      )];
    }
  },
  methods: {
    onClickRow(row) {
      //https://router.vuejs.org/ru/guide/essentials/named-routes.html
      this.$router.push({ name: 'detail', params: { id: row.id } })
    }
   }
};
</script>

<style lang='scss' scoped>
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
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
    & thead {
      background-color: rgba(43, 48, 183, 0.05);
      line-height: 70px;
    }
    & th, td {
      padding: 0 20px;
    }
    & tr:last-child td:first-child {
      border-bottom-left-radius: 10px;
    }
    & tr:last-child td:last-child {
      border-bottom-right-radius: 10px;
    }
    & tr {
      height: 70px;
      border-bottom:  1px solid rgba(0, 0, 0, 0.15);
    }
    & tbody tr:hover {
      background-color: rgba(93, 97, 219, 0.05);
      cursor: pointer;
    }
    & td.not-found {
      text-align: center;
      font-size: 16px;
    }
    & td.status {
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
      &.not-ready {
        border-left-color:#BD4949;
      }
      &.ready {
        border-left-color: rgb(144, 148, 212);
      }
      &.send {
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