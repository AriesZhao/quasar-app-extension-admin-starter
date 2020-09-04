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
    load: {
      type: Boolean,
      default: false,
    },
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
    load(val) {
      this.loading = val;
    },
  },
  mounted() {
    this.status = this.mode;
    this.entity = this.value;
    this.loading = this.load;
  },
  methods: {
    /**
     *
     * @param {String} action  后台方法名称
     * @param {Object} val 参数值
     * @param {Function} success 成功回调方法
     * @param {Function} failed 失败回调方法
     */
    process(action, val, success, failed) {
      this.loading = true;
      //处理方法
      let promise = this.callFn(action, val || this.entity);
      if (promise) {
        promise
          .then((ret) => {
            this.loading = false;
            if (typeof success === "function") {
              success(ret);
            }
          })
          .catch((err) => {
            this.loading = false;
            if (failed && !err.processed) {
              failed(err);
            }
          });
      } else if (this.$listeners[action]) {
        this.$emit(action);
        this.loading = false;
      } else {
        this.loading = false;
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
