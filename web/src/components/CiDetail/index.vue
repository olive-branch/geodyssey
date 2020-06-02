<template>
  <div class="app-detail">
    <div class="app-detail__header">
      <h2>
        Редактирование СИ
        <b>{{$route.params.id}}</b>
      </h2>
      <div class="status">
        <span>В работе</span>
        <b-progress type="is-info is-small" :value="80" size="is-small"></b-progress>
      </div>
    </div>
    <div class="app-detail__body">
      <div class="app-panel">
        <h3>Основная информация</h3>
        <div class="form">
          <div>
            <label for>Наименование СИ</label>
            <b-select placeholder="Наименование СИ" expanded>
              <option>Тахеометр электронный</option>
              <option selected>Тахеометр неэлектронный</option>
              <option>Нетахеометр электронный</option>
              <option>Нетахеометр неэлектронный</option>
            </b-select>
          </div>
          <div class="form-field col-2">
            <div>
              <label>Модификация</label>
              <b-select placeholder="Модификация" expanded>
                <option>Leica TS60I</option>
                <option selected>Leica TS60Q</option>
                <option>Leica TS61I</option>
              </b-select>
            </div>
            <div>
              <label>Номер в Гос.Реестре</label>
              <b-input value="52664-10"></b-input>
            </div>
          </div>

          <div class="form-field col-2">
            <div>
              <label>Заводской номер</label>
              <b-input value="358564"></b-input>
            </div>
            <div>
              <label>Номер предыдущего знака</label>
              <b-input value="ГМС 1800554423"></b-input>
            </div>
          </div>
          <div>
            <label>Услуга</label>
            <b-select placeholder="Услуга" expanded>
              <option selected>Калибровка по длине</option>
              <option>Калибровка по углу</option>
              <option>Калибровка по длине и углу</option>
            </b-select>
          </div>
          <div>
            <label for>Примечание</label>
            <b-input maxlength="200" type="textarea" value="Разряд 1"></b-input>
          </div>
        </div>
      </div>
      <div class="app-panel">
        <h3>Информация о заказчике</h3>
        <div class="form">
          <div>
            <label>Заказчик</label>
            <b-input value="ФБУ “Самарский ЦСМ”"></b-input>
          </div>
          <div>
            <label>Счет</label>
            <b-input value="МК1515 от 25.12.2020"></b-input>
          </div>
          <div>
            <label>Номер заявки</label>
            <b-input value="3545"></b-input>
          </div>
          <div>
            <label>Дата поступления в ОПСИ</label>
            <b-datepicker  placeholder="Дата поступления в ОПСИ" icon="calendar"  v-model="date"></b-datepicker>
          </div>
          <div>
            <label>Дата поступления в отдел</label>
            <b-datepicker placeholder="Дата поступления в отдел" icon="calendar"    v-model="date"></b-datepicker>
          </div>
          <div>
            <label>Работы выполнить до</label>
            <b-datepicker placeholder="Работы выполнить до" icon="calendar"    v-model="date"></b-datepicker>
          </div>
          <div>
            <label>CИ отправлено</label>
            <b-datepicker placeholder="CИ отправлено " icon="calendar"    v-model="date"></b-datepicker>
          </div>
        </div>
      </div>
      <div class="app-panel" v-if="isEdit">
        <h3>Информация о свидетельстве</h3>
        <div class="form">
          <div>
            <label>Номер документа</label>
            <b-input value="8/832-115-20"></b-input>
          </div>
          <div>
            <label>Номер знака</label>
            <b-input value="ГМС 1900554423"></b-input>
          </div>
          <div>
            <label>Поверитель</label>
            <b-select placeholder="Поверитель" expanded>
              <option>Иванов Иван Иванович</option>
              <option selected>Пономарева Василиса Константиновна</option>
              <option>Петров Петр Петрович</option>
            </b-select>
          </div>

          <div>
            <label>Дата проверки</label>
            <b-datepicker placeholder="Дата проверки"    icon="calendar" v-model="date"></b-datepicker>
          </div>
        </div>
      </div>
    </div>
    <div class="app-detail__footer">
      <b-button type="is-info">Сохранить</b-button>
      <b-button tag="a" href="/" outlined>Отмена</b-button>
      <b-button type="is-danger" outlined @click="onClickDelete">Удалить</b-button>
    </div>
  </div>
</template>


<script>
export default {
  name: "CiDetail",
  data() {
    return {
      date: new Date(),
      isAppendToBody: true,
      isEdit: true
    };
  },
  created() {
    this.isEdit = this.$route.params.id !== undefined;
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      // console.log(this.$route.params.id);
    },
    onClickDelete() {
      this.$buefy.dialog.confirm({
        title: "Удаление СИ",
        message: "Вы уверены, что хотите удалить ?",
        confirmText: "Удалить",
        cancelText: "Отмена",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.$buefy.toast.open("Account deleted!")
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-detail {
  height: 100%;
  display: grid;
  grid-gap: 10px;
  grid-template-rows: 0.1fr auto 0.1fr;
  &__header {
    display: grid;
    grid-template-columns: 1fr 0.4fr;
    & h2 {
      font-size: 1.2em;
      & b {
        font-family: "Roboto-Bold";
      }
    }
    & .status {
      text-align: end;
    }
  }
  &__body {
    display: grid;
    grid-template-columns: 0.6fr 0.5fr 0.4fr;
    grid-gap: 20px;
    & .app-panel {
      border-right: 1px solid #d9d9d9;
      padding-right: 1.5em;
      &:last-child {
        border: none;
        padding-right: 0;
      }
      & h3 {
        font-size: 1.15em;
        margin-bottom: 0.5em;
      }
      & .form {
        display: grid;
        grid-gap: 10px;
        grid-auto-rows: 0.1fr;
        height: 100%;
        overflow-y: auto;
        position: relative;
        overflow-x: hidden;
        &-field {
          &.col-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 10px;
          }
        }
      }
    }
  }
  &__footer {
    display: grid;
    grid-template-columns: 0.01fr 0.01fr auto;
    width: 100%;
    grid-gap: 10px;
    margin-top: auto;
    & button:last-of-type {
      margin-left: auto;
    }
  }
}
</style> 