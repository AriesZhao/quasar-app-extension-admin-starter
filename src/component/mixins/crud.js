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
      this.$appHelper.callFn("create", this).then((ret) => {
        this.status = "create";
        this.entityVal = ret;
        this.$emit("change", this.entityVal);
      });
      this.$emit("create");
    },
    edit() {
      this.status = "edit";
      this.$parent.edit && this.$parent.edit();
      this.$emit("edit");
    },
    save() {
      this.$appHelper
        .callFn("save", this, this.entityVal)
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
      this.$emit("save");
    },
    remove() {
      this.$appHelper.confirm("确定要删除当前对象吗？", this.doRemove);
    },
    doRemove() {
      this.status = "blank";
      this.$appHelper
        .callFn("remove", this, this.entityVal.id)
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
      this.$appHelper.info("remove");
    },
  },
};
