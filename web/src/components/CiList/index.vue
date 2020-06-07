<template>
  <div class='app-list'>
    <div class='app-list__header'>
      <div class='form-field search'>
        <input type='search' id='search-input' placeholder="Поиск"/>
        <i class="fa fa-search icon"></i> 
      </div>
      <button class="btn primary">Добавить новое СИ</button>
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
      <tbody>
        <tr>
          <td>Не готов</td>
          <td>Leica TS60</td>
          <td>886674</td>
          <td>ФБУ “Кемеровский ЦСМ”</td>
          <td>Калибровка по длине</td>
          <td>1й разряд</td>
        </tr>
        <tr>
          <td>Отправлен</td>
          <td>NET05AXII</td>
          <td>ILS081546257</td>
          <td>ФБУ “Ростовский ЦСМ”</td>
          <td>Поверка</td>
          <td>С протоколом</td>
        </tr>
         <tr>
          <td>Не готов</td>
          <td>Leica TS60</td>
          <td>886674</td>
          <td>ФБУ “Кемеровский ЦСМ”</td>
          <td>Калибровка по длине</td>
          <td>1й разряд</td>
        </tr>
        <tr>
          <td>Отправлен</td>
          <td>NET05AXII</td>
          <td>ILS081546257</td>
          <td>ФБУ “Ростовский ЦСМ”</td>
          <td>Поверка</td>
          <td>С протоколом</td>
        </tr>
         <tr>
          <td>Не готов</td>
          <td>Leica TS60</td>
          <td>886674</td>
          <td>ФБУ “Кемеровский ЦСМ”</td>
          <td>Калибровка по длине</td>
          <td>1й разряд</td>
        </tr>
        <tr>
          <td>Отправлен</td>
          <td>NET05AXII</td>
          <td>ILS081546257</td>
          <td>ФБУ “Ростовский ЦСМ”</td>
          <td>Поверка</td>
          <td>С протоколом</td>
        </tr>
         <tr>
          <td>Не готов</td>
          <td>Leica TS60</td>
          <td>886674</td>
          <td>ФБУ “Кемеровский ЦСМ”</td>
          <td>Калибровка по длине</td>
          <td>1й разряд</td>
        </tr>
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
    };
  },
  //  methods: {
  //   onClickRow(row) {
  //     //https://router.vuejs.org/ru/guide/essentials/named-routes.html
  //     this.$router.push({ name: 'detail', params: { id: row.id } })
  //   },
  //  }
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
    border-radius: 5px;
    border-collapse: collapse;
    & thead {
      background-color: rgba(43, 48, 183, 0.05);
      line-height: 70px;
    }
    & th, td {
      padding: 0 20px;
    }
    & tr {
      height: 70px;
      border-bottom:  1px solid rgba(0, 0, 0, 0.15);
    }
    & tbody tr:hover {
      background-color: rgba(93, 97, 219, 0.05);
      cursor: pointer;
    }
  }
}
</style>