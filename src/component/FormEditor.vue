<template>
  <panel ref="panel" v-bind="$props" @init="init">
    <template slot="actions">
      <div class="q-gutter-sm">
        <q-btn
          label="新建"
          :loading="loading"
          color="secondary"
          v-if="creatable && (status === 'view' || status === 'blank')"
          @click="create"
        />
        <q-btn
          label="保存"
          :loading="loading"
          color="primary"
          v-if="status === 'create' || status === 'edit'"
          @click="save"
        />
        <q-btn
          label="编辑"
          :loading="loading"
          color="primary"
          v-if="editable && status === 'view'"
          @click="edit(entity.id)"
        />
        <q-btn
          label="删除"
          :loading="loading"
          color="negative"
          v-if="removable && status === 'view'"
          @click="remove"
        />
        <q-btn
          label="取消"
          color="secondary"
          v-if="status === 'edit'"
          @click="cancel"
        />
      </div>
    </template>
    <slot name="form" :readonly="readonly" :mode="status" />
  </panel>
</template>

<script>
import CRUD from "./mixins/crud";
import Panel from "./Panel";
export default {
  name: "FormEditor",
  mixins: [CRUD, Panel],
  props: {
    actoin: {
      type: String,
    },
    initFn: {
      type: Function,
    },
  },
  mounted() {
    if (this.initFn) {
      this.initFn();
    } else {
      this.init();
    }
  },
  methods: {
    //初始化
    init() {
      let action = this.action || this.$parent.$props.action;
      if (action === "create" || !action) {
        //新建
        this.create();
      } else if (action.indexOf("@") === 0) {
        //编辑
        this.edit(action.substring(1, action.length));
      } else {
        //查看
        this.view(action);
      }
    },
    //新建
    create() {
      this.process("create", null, () => {
        this.status = "create";
      });
    },
    //查看
    view(id) {
      this.process("get", id, () => {
        this.status = "view";
      });
    },
    //编辑
    edit(id) {
      this.process("get", id, () => {
        this.status = "edit";
      });
    },
    //保存
    save() {
      let validateFn = this.findFn("validate");
      if (validateFn && validateFn(this.entity)) {
        //验证通过
        this.doSave();
      } else if (!validateFn) {
        //没有定义验证方法
        this.doSave();
      }
    },
    //保存处理
    doSave() {
      this.process("save", this.entity, () => {
        this.status = "view";
        this.info("保存成功");
      });
    },
    //删除确认
    remove() {
      this.confirm("确定要删除当前对象吗？", this.doRemove);
    },
    //删除处理
    doRemove() {
      this.process("remove", this.entity.id),
        () => {
          this.status = "blank";
          this.$refs.panel.close();
        };
    },
    //取消编辑
    cancel() {
      this.status = "view";
    },
  },
};
</script>
