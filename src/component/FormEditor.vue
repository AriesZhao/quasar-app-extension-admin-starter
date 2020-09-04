<template>
  <panel ref="panel" v-bind="$props" @init="init">
    <template slot="actions">
      <div class="q-gutter-sm">
        <slot
          name="actions"
          :readonly="readonly"
          :mode="status"
          :form="entity"
        />
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
    //新建对象
    create() {
      if (this.createFn) {
        this.createFn();
      } else if (this.$parent.create) {
        this.create();
      } else {
        this.process("create", null, (ret) => {
          this.status = "create";
          this.updateValue(ret);
        });
      }
    },
    //查看对象
    view(id) {
      if (this.viewFn) {
        this.viewFn(id);
      } else if (this.$parent.view) {
        this.$parent.view(id);
      } else {
        this.process("get", id, (ret) => {
          this.status = "view";
          this.updateValue(ret);
        });
      }
    },
    //编辑对象
    edit(id) {
      if (this.editFn) {
        this.editFn(id);
      } else if (this.$parent.edit) {
        this.$parent.edit(id);
      } else {
        this.process("get", id, (ret) => {
          this.status = "edit";
          this.updateValue(ret);
        });
      }
    },
    //保存对象
    save() {
      if (this.saveFn) {
        this.saveFn();
      } else if (this.$parent.save) {
        this.$parent.save();
      } else {
        this.process("save", this.entity, () => {
          this.status = "view";
          this.info("保存成功");
        });
      }
    },
    //删除对象确认
    remove() {
      this.confirm("确定要删除当前对象吗？", this.doRemove);
    },
    //删除对象
    doRemove() {
      this.process("remove", this.entity.id, () => {
        this.status = "blank";
        this.info("删除成功");
        this.$refs.panel.close();
      });
    },
    //取消编辑
    cancel() {
      this.status = "view";
    },
  },
};
</script>
