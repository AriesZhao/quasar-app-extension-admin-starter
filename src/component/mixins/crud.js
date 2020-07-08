import base from "./base";
export default {
  mixins: [base],
  model: {
    prop: "entity",
    event: "change",
  },
  props: {
    mode: {
      type: String,
      default: "blank",
    },
    entity: {
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
      entityVal: null,
      modeVal: "blank",
      loading: false,
    };
  },
  computed: {
    readonly() {
      return this.modeVal === "blank" || this.modeVal === "view";
    },
  },
  watch: {
    mode(val) {
      this.modeVal = val;
    },
    entity(val) {
      this.entityVal = val;
    },
  },
  mounted() {
    this.modeVal = this.mode;
    this.entityVal = this.entity;
  },
  methods: {
    //处理
    process(action, val, callback) {
      this.modeVal = action;
      this.loading = true;
      let fnRet = this.callFn(action, val || this.entityVal);
      if (fnRet) {
        fnRet
          .then((ret) => {
            this.updateEntityValue(ret, callback);
          })
          .catch((err) => {
            this.onError(err);
          });
        this.$emit(action);
      }else{
        this.loading = false
      }
    },
    //删除确认
    remove() {
      this.confirm(
        "确定要删除当前对象吗？",
        this.process("remove", this.entityVal.id),
        () => {
          this.modeVal = "blank";
        }
      );
    },
    //更新模型
    updateEntityValue(val, callback) {
      this.loading = false;
      if (!this.isEmpty(val)) {
        this.entityVal = val;
        this.$emit("change", this.entityVal);
        if (typeof callback === "function") {
          callback(this.entityVal);
        }
      }
    },
    //错误处理
    onError(err) {
      this.loading = false;
      this.error(err);
    },
  },
};
