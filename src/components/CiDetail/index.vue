<template src='./template.html'></template>

<script>
import DatePicker from "vue2-datepicker";
import OrderService from "../../services/order.service";
export default {
  components: { DatePicker },
  name: "CiDetail",
  data() {
    return {
      certificate: {
        date: "",
        number: "",
        issuer: "",
        sign: "",
        comments: ""
      },
      order: {
        model: "",
        type: "",
        serial: "",
        service: "",
        pastCertificateSign: "",
        registry: "",
        comments: "",
        client: "",
        bill: "",
        departedAt: "",
        arrivedToApproverAt: "",
        arrivedAt: "",
        deadlineAt: "",
        number: ""
      },
      isEdit: false,
      activePopup: undefined,
      isSubmitted: false,
      cachedValues: { order: null, certificate: null },
      id: this.$route.params.id,
      status: "",
      isLoading: true,
      isError: false
    };
  },
  mounted() {
    this.isEdit = this.id !== undefined;
    this.isLoading = this.isEdit;
    if (this.isEdit) {
      this.fetchData(this.id).then(item => {
        if (item === null) {
          this.isLoading = false;
          this.isError = true;
        } else {
          this.setData(item);
          this.isLoading = false;
        }
      });
    } else {
      this.cachedValues = {
        order: {...this.order},
        certificate: {...this.certificate}
      }
    }
  },
  methods: {
    fetchData(id) {
      return OrderService.getOrder(id);
    },
    onOpenPopup(state) {
      this.activePopup = state;
    },
    onClosePopup(result) {
      this.activePopup = undefined;
      switch(result) {
        case "save": break;
        case "notSave": {
        this.goBack();
        break;
      }
        case "delete": break;
        default: break;
      }
    },
    onSubmit() {
      this.isSubmitted = true;
    },
    isEmpty(value) {
      return value.length === 0;
    },
    goBack(){
      if (window.history.length > 2) {
        this.$router.go(-1);
      } else {
        this.$router.push({ path: "/" });
      }
    },
    onClickBack() {
      let isEqual = (obj1, obj2) =>  JSON.stringify(obj1) === JSON.stringify(obj2);
      let isOpenPopup = isEdit => isEdit
        ? !isEqual(this.cachedValues.order, this.order) || !isEqual(this.cachedValues.certificate, this.certificate)
        : !isEqual(this.cachedValues.order, this.order)

      if (isOpenPopup(this.isEdit)) {
        this.onOpenPopup("save");
      } else {
        this.goBack()
      }
    },
    formatDate(date) {
      if (!date) {
        return "";
      }
      let dd = new Date(date).getDate(),
        mm = new Date(date).getMonth() + 1,
        yyyy = new Date(date).getFullYear();
      return `${dd < 10 ? "0" + dd : dd}.${mm < 10 ? "0" + mm : mm}.${yyyy}`;
    },
    setData(item) {
      this.status = item.status;
      this.order = {
        model: item.instrument.model,
        type: item.instrument.type,
        serial: item.instrument.serial,
        service: item.service,
        pastCertificateSign: item.pastCertificateSign,
        registry: item.instrument.registry,
        comments: item.comments,
        client: item.client,
        bill: item.bill,
        departedAt: item.departedAt,
        arrivedToApproverAt: item.arrivedToApproverAt,
        arrivedAt: item.arrivedAt,
        deadlineAt: item.deadlineAt,
        number: item.number
      };
      if (item.certificate !== null && item.certificate !== undefined) {
        this.certificate = {
          date: item.certificate.date,
          number: item.certificate.number,
          issuer: item.certificate.issuer,
          sign: item.certificate.sign,
          comments: item.certificate.comments
        };
      }
      this.cachedValues = {
        order: {...this.order},
        certificate: {...this.certificate}
      }
    }
  }
};
</script>

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