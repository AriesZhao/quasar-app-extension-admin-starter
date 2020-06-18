export default {
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
    saveFn: {
      type: Function,
    },
    removeFn: {},
    service: {},
  },
  data() {
    return {
      status: "blank",
      saving: false,
      removing: false,
      entityVal: null,
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
    entity(val) {
      this.entityVal = val;
    },
  },
  mounted() {
    this.status = this.mode;
    this.entityVal = this.entity;
  },
  methods: {
    create() {
      this.status = "create";
      this.$parent.create && this.$parent.create();
      this.$emit("create");
    },
    edit() {
      this.status = "edit";
      this.$parent.edit && this.$parent.edit();
      this.$emit("edit");
    },
    save() {
      //1.方法有定义
      let fn = this.saveFn;
      //2.父方法有定义
      if (!fn && this.$parent && this.$parent.save) {
        fn = this.$parent.save;
      }
      //3.服务有定义
      if (!fn && this.service && this.service.save) {
        fn = this.service.save;
      }
      if (fn) {
        //4.有方法可调用
        this.saving = true;
        fn(this.entityVal)
          .then((ret) => {
            this.saving = false;
            this.status = "view";
            this.entityVal = ret;
            this.$emit("change", this.entityVal);
            this.$appHelper.info("保存成功");
          })
          .catch((err) => {
            this.saving = false;
            this.$appHelper.error(err);
          });
      } else if (this.$listeners.save) {
        //5.有事件监听
        this.$emit("save");
      }
      //6.全局事件
      if (this.$parent) {
        this.$root.$emit(`${this.$parent.name}-save`);
      }
    },
    remove() {
      this.$appHelper.confirm("确定要删除当前对象吗？", this.doRemove);
    },
    doRemove() {
      this.status = "blank";
      //1.方法有定义
      let fn = this.removeFn;
      //2.父方法有定义
      if (!fn && this.$parent && this.$parent.remove) {
        fn = this.$parent.remove;
      }
      //3.服务有定义
      if (!fn && this.service && this.service.remove) {
        fn = this.service.remove;
      }
      if (fn) {
        //4.有方法可调用
        this.removing = true;
        fn(this.entityVal.id)
          .then((ret) => {
            this.removing = false;
            this.status = "blank";
            this.entityVal = null;
            this.$emit("change", this.entityVal);
            this.$q.notify("删除成功");
          })
          .catch((err) => {
            this.removing = false;
            this.$appHelper.error(err);
          });
      } else if (this.$listeners.remove) {
        //5.有事件监听
        this.$appHelper.info("remove");
      }
      //6.全局事件
      if (this.$parent) {
        this.$root.$emit(`${this.$parent.name}-remove`);
      }
    },
  },
};
