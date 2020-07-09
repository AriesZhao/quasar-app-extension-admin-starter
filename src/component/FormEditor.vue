<template>
  <panel ref="panel" v-bind="$props">
    <template slot="actions">
      <div class="q-gutter-sm">
        <q-btn
          label="新建"
          :loading="loading"
          color="secondary"
          v-if="creatable && (status === 'view' || status === 'blank')"
          @click="process('create')"
        />
        <q-btn
          label="保存"
          :loading="loading"
          color="primary"
          v-if="status === 'create' || status === 'edit'"
          @click="process('save')"
        />
        <q-btn
          label="编辑"
          :loading="loading"
          color="primary"
          v-if="editable && status === 'view'"
          @click="process('edit')"
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
        this.process("create");
      } else if (action.indexOf("@") === 0) {
        //编辑
        this.process("get", action.substring(1, action.length), () => {
          this.status = "edit";
        });
      } else {
        //查看
        this.process("get", action, () => {
          this.status = "view";
        });
      }
    },
    //删除确认
    remove() {
      this.confirm("确定要删除当前对象吗？", this.doRemove);
    },
    //删除操作
    doRemove() {
      this.process("remove", this.entityVal.id),
        () => {
          this.status = "blank";
          this.$refs.panel.close()
        };
    },
    //取消编辑
    cancel() {
      this.status = "view";
    },
  },
};
</script>
