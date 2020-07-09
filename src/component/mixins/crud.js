import base from "./base";
export default {
  mixins: [base],
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    mode: {
      type: String,
      default: "blank",
    },
    value: {
      type: Object,
    },
    creatable: {
      type: Boolean,
      default: true,
    },
    removable: {
      type: Boolean,
      default: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    createFn: {
      type: Function,
    },
    getFn: {
      type: Function,
    },
    editFn: {
      type: Function,
    },
    saveFn: {
      type: Function,
    },
    removeFn: {
      type: Function,
    },
    service: {},
  },
  data() {
    return {
      entity: null,
      status: "blank",
      loading: false,
    };
  },
  computed: {
    readonly() {
      return this.status === "blank" || this.status === "view";
    },
  },
  watch: {
    mode(val) {
      this.status = val;
    },
    value(val) {
      this.entity = val;
    },
  },
  mounted() {
    this.status = this.mode;
    this.entity = this.value;
  },
  methods: {
    //处理
    process(action, val, callback) {
      this.status = action;
      this.loading = true;
      let fnRet = this.callFn(action, val || this.entity);
      if (fnRet) {
        fnRet
          .then((ret) => {
            this.updateValue(ret);
            if (typeof callback === "function") {
              callback(this.entity);
            }
          })
          .catch((err) => {
            if (!err.processed) {
              this.onError(err);
            }
          });
        return true;
      } else if (this.$listeners[action]) {
        this.$emit(action);
        this.loading = false;
        if (typeof callback === "function") {
          callback(this.entity);
        }
        return true;
      } else {
        this.loading = false;
        return false;
      }
    },
    //更新模型
    updateValue(val) {
      this.loading = false;
      if (!this.isEmpty(val)) {
        //结果不为空
        this.entity = val;
        this.$emit("change", this.entity);
      }
    },
    //错误处理
    onError(err) {
      this.loading = false;
      this.error(err);
    },
  },
};
