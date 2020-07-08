<template>
  <panel v-bind="$props">
    <template slot="actions">
      <div class="q-gutter-sm">
        <q-btn
          label="新建"
          :loading="loading"
          color="secondary"
          v-if="creatable && (modeVal === 'view' || modeVal === 'blank')"
          @click="process('create')"
        />
        <q-btn
          label="保存"
          :loading="loading"
          color="primary"
          v-if="modeVal === 'create' || modeVal === 'edit'"
          @click="process('save')"
        />
        <q-btn
          label="编辑"
          :loading="loading"
          color="primary"
          v-if="editable && modeVal === 'view'"
          @click="process('edit')"
        />
        <q-btn
          label="删除"
          :loading="loading"
          color="negative"
          v-if="removable && modeVal === 'view'"
          @click="remove"
        />
        <q-btn
          label="取消"
          color="secondary"
          v-if="modeVal === 'edit'"
          @click="cancel"
        />
      </div>
    </template>
    <slot name="form" :readonly="readonly" :mode="modeVal" />
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
    this.init();
  },
  methods: {
    init() {
      let action = this.action || this.$parent.$props.action;
      if (action === "create" || !action) {
        //新建
        this.process("create");
      } else if (action.indexOf("@") === 0) {
        //编辑
        this.process("get", action.substring(1, action.length), () => {
          this.modeVal = "edit";
        });
      } else {
        //查看
        this.process("get", action, () => {
          this.modeVal = "view";
        });
      }
      this.callFn("init", action);
    },
    //取消编辑
    cancel() {
      this.modeVal = "view";
    },
  },
};
</script>
