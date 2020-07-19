import DatePicker from "vue2-datepicker";
import OrderService from "../../services/order.service";
import AutocompleteService from "../../services/autocomplete.service";

export default {
  components: { DatePicker },
  name: "CiDetail",
  data() {
    return {
      initValue: null,
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
      isError: false,
      typesList: [],
      issuers: [],
      cachedValue: ''
    };
  },
  mounted() {
    this.isEdit = this.id !== undefined;
    this.isLoading = this.isEdit;
    if (this.isEdit) {
      OrderService.getOrder(this.id).then(item => {
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
        order: { ...this.order },
        certificate: { ...this.certificate }
      }
    }

    AutocompleteService.getInitValues()
      .then(({ types, issuers }) => {
        this.typesList = types;
        this.issuers = issuers;
      })
  },
  methods: {
    onSearchType(input) {
      let isEmpty = this.typesList.filter(this.filterSelects(input)).length === 0;
      if (isEmpty) {
        AutocompleteService.getTypes(input).then(x => this.typesList = [...x]);
      }
    },
    onSearchIssuer(input) {
      let isEmpty = this.issuers.filter(this.filterSelects(input)).length === 0;
      if (isEmpty) {
        AutocompleteService.getIssuers(input).then(x => this.issuers = [...x]);
      }
    },
    filterSelects(input) {
      return (value) => value.toLowerCase().includes(input.toLowerCase())
    },
    onOpenPopup(state) {
      this.activePopup = state;
    },
    onClosePopup(result) {
      this.activePopup = undefined;
      switch (result) {
        case "save": {
          this.onSave(this.isEdit, this.order, this.certificate);
          break;
        }
        case "notSave": {
          this.goBack();
          break;
        }
        case "delete": {
          this.onDelete(this.initValue.id);
          break;
        }
        default: break;
      }
    },
    onDelete(id) {
      OrderService.delete(id).then(x => {
        if (x === null) {
          this.openNotify('Произошла ошибка при удалении. Попробуйте позже или обратитесь к администратору.', 'error');
        } else {
          this.openNotify('СИ успешно удалено', 'success');
          this.goBack();
        }
      })
    },
    onSave(isEdit, order, certificate) {
      let saveValue = {
        ...this.initValue,
        service: order.service,
        comments: order.comments,
        client: order.client,
        bill: order.bill,
        departedAt: this.toUTC(order.departedAt),
        arrivedToApproverAt: this.toUTC(order.arrivedToApproverAt),
        arrivedAt: this.toUTC(order.arrivedAt),
        deadlineAt: this.toUTC(order.deadlineAt),
        number: order.number,
        instrument: {
          ...(this.initValue || {instrument: {}}).instrument,
          model: order.model,
          type: order.type,
          serial: order.serial,
          registry: order.registry,
          pastCertificateSign: order.pastCertificateSign
        },
        certificate: isEdit
          ? {
            ...(this.initValue.certificate || {}),
            ...certificate,
            instrumentId: this.initValue.instrumentId
          }
          : undefined
      };
      let save = item => isEdit
        ? OrderService.update(item)
        : OrderService.save(item);

      save(saveValue).then(x => {
        if (x === null) {
          this.openNotify('Упс, что-то пошло не так :( Попробуйте еще раз или обратитесь к администратору.', 'error');
        } else {
          this.openNotify('Сохранение прошло успешно!', 'success');
          this.goBack();
        }
      })
    },
    onSubmit() {
      this.isSubmitted = true;
      let isValidForm = true;
      let requiredElements =  document.getElementById('form').querySelectorAll("[required]");
      for (let i = 0; i < requiredElements.length; i++) {
        if (this.isEmpty(requiredElements[i].value)) {
          isValidForm = false;
          break;
        }
      }
      if (isValidForm && !this.isEmpty(this.order.arrivedToApproverAt) && !this.isEmpty(this.order.arrivedAt)) {
        this.onSave(this.isEdit, this.order, this.certificate);
      } else {
        this.openNotify('Проверьте, что все обязательные поля заполнены', 'info');
      }
    },
    isEmpty(value) {
      return value === null || value === undefined || (value !== null && value !== undefined && value.length === 0);
    },
    goBack() {
      if (window.history.length > 2) {
        this.$router.go(-1);
      } else {
        this.$router.push({ path: "/" });
      }
    },
    onClickBack() {
      let isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
      let isOpenPopup = isEdit => isEdit
        ? !isEqual(this.cachedValues.order, this.order) || !isEqual(this.cachedValues.certificate, this.certificate)
        : !isEqual(this.cachedValues.order, this.order)

      if (!this.isError && isOpenPopup(this.isEdit)) {
        this.onOpenPopup("save");
      } else {
        this.goBack()
      }
    },
    openNotify(message, type){
      this.$toast.open({message, type});
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
    onBlurType(event) {
      if (this.isEmpty(event)) {
        this.order.type = this.cachedValue;
      }
      this.cachedValue = ''
    },
    onBlurIssuer(event) {
      if (this.isEmpty(event)) {
        this.certificate.issuer = this.cachedValue;
      }
      this.cachedValue = ''
    },
    setData(item) {
      this.status = item.status;
      this.initValue = {...item};
      this.order = {
        model: item.instrument.model,
        type: item.instrument.type,
        serial: item.instrument.serial,
        service: item.service,
        pastCertificateSign: item.instrument.pastCertificateSign,
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
          date: this.toUTC(item.certificate.date),
          number: item.certificate.number,
          issuer: item.certificate.issuer,
          sign: item.certificate.sign,
          comments: item.certificate.comments
        };
      }
      this.cachedValues = {
        order: { ...this.order },
        certificate: { ...this.certificate }
      }
    },
    toUTC(d) {
      return !d
        ? d
        : new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    }
  },
};
