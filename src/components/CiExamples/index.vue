<template>
  <div>
    <h4>Button</h4>
    <button class="btn primary">Sumbit</button>
    <button class="btn secondary">Cancel</button>
    <button class="btn danger">Delete</button>
    <h4>Paging</h4>
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
    <h4>Form field</h4>
    <div class="form-field is-required">
      <label for="name">Заголовок</label>
      <input type="text" name="name" required minlength="4" />
    </div>
    <div class="form-field is-required has-error">
      <label for="name">Заголовок</label>
      <input type="text" name="name" required minlength="4" />
      <div class="form-field__error">
        Поле необходимо заполнить. Длина заголовка должна быть более 4 символов
        <button
          type="button"
        >&#215;</button>
      </div>
    </div>
    <div class='form-field search'>
      <input type='search' id='search-input' placeholder="Поиск"/>
      <i class="fa fa-search icon"></i> 
    </div>
    <div class="form-field">
      <label for="date">Дата</label>
      <input type="date" name="date" />
    </div>
    <div class="form-field select-wrapper">
      <label for="select">Выбор</label>
      <select>
        <option>1</option>
        <option>2</option>
      </select>
    </div>
    <h4>Popup</h4>
    <button class="btn primary" v-on:click='onOpenPopup()'>Open Popup</button>
    <div class='popup' v-bind:class="{'is-open': isOpen}">
      <div class='popup__body'>
        <h6>Сохранить изменения?</h6>
        <div class='actions'>
          <button class="btn primary" v-on:click='onClosePopup()'>Сохранить</button>
          <button class="btn secondary"  v-on:click='onClosePopup()'>Не сохранять</button>
          <button class="btn secondary"  v-on:click='onClosePopup()'>Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CiExamples",
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    onOpenPopup() {
      this.isOpen = true;
    },
    onClosePopup() {
      this.isOpen = false;
    }
  }
};
</script>