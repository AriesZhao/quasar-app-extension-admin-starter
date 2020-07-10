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
    /**
     *
     * @param {String} action  后台方法名称
     * @param {Object} val 参数值
     * @param {Function} success 成功回调方法
     * @param {Function} error 失败回调方法
     */
    process(action, val, success, error) {
      this.loading = true;
      let valid = true;
      //前置方法
      let beforeFn = this.findFn(
        "before" + action.replace(action[0], action[0].toUpperCase())
      );
      if (beforeFn) {
        valid = beforeFn(val);
      }
      if (!valid) {
        this.loading = false;
        return;
      }
      //处理方法
      let fnRet = this.callFn(action, val || this.entity);
      if (fnRet) {
        fnRet
          .then((ret) => {
            this.loading = false;
            this.updateValue(ret);
            if (typeof success === "function") {
              success(this.entity);
            }
          })
          .catch((err) => {
            this.loading = false;
            if (!err.processed) {
              this.error(err);
            }
            if (typeof error === "function") {
              error(err);
            }
          });
        return true;
      } else if (this.$listeners[action]) {
        this.$emit(action);
        this.loading = false;
        if (typeof success === "function") {
          success(this.entity);
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
  },
};
