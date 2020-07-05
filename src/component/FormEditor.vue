<template>
  <panel v-bind="$props">
    <template slot="actions">
      <div class="q-gutter-sm">
        <q-btn
          label="新建"
          color="secondary"
          v-if="creatable && (status === 'view' || status === 'blank')"
          @click="create"
        />
        <q-btn
          :loading="saving"
          label="保存"
          color="primary"
          v-if="status === 'create' || status === 'edit'"
          @click="save"
        />
        <q-btn
          label="编辑"
          color="primary"
          v-if="editable && status === 'view'"
          @click="edit"
        />
        <q-btn
          label="删除"
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
  },
  methods: {
    cancel() {
      this.status = "view";
    },
  },
};
</script>
