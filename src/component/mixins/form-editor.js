import http from "src/utils/http";
export default {
  props: {
    action: {
      type: String,
      default: "blank",
    },
  },
  data() {
    return {
      namespace: null,
      entity: null,
      entityId: null,
      status: "blank",
    };
  },
  computed: {
    readonly() {
      return this.status === "blank" || this.status === "view";
    },
  },
  mounted() {
    if (this.action === "create") {
      this.create();
    } else if (this.action.indexOf("!") === 0) {
      this.entityId = this.action.substring(1, this.action.length);
      this.edit();
    } else {
      this.entityId = this.action;
      this.view();
    }
  },
  methods: {
    create() {
      if (this.namespace) {
        http({
          url: `/api/${this.namespace}/create`,
          method: "get",
        })
          .then((ret) => {
            this.status = "create";
            this.entity = ret;
          })
          .catch((e) => {
            this.$q.notify({ message: "新建失败", color: "negative" });
          });
      }
    },
    save() {
      if (this.namespace) {
        http({
          headers: this.$headers.json,
          url: `/api/${this.namespace}`,
          method: "post",
          data: this.entity,
        })
          .then((ret) => {
            this.status = "view";
            this.entity = ret;
            this.$q.notify("保存成功");
          })
          .catch((e) => {
            this.$q.notify({ message: "保存失败", color: "negative" });
          });
      }
    },
    // 取消编辑
    cancel() {
      if (this.entity && this.entity.id) {
        this.view(this.entity.id);
      } else {
        this.status = "view";
      }
    },
    // 查看
    async view() {
      this.status = "view";
      this.get();
    },
    // 编辑
    async edit() {
      this.status = "edit";
      this.get();
    },
    // 获取对象
    async get() {
      if (this.namespace) {
        this.entity = await http({
          headers: this.$headers.json,
          url: `/api/${this.namespace}/${this.entityId}`,
          method: "get",
        });
      }
    },
  },
};
