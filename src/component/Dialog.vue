<template>
  <q-dialog v-model="showDlg" @input="onChange" :persistent="persistent">
    <q-card
      style="min-height: 100px; min-width: 300px;"
      :style="{ width:'auto' }"
    >
      <q-toolbar class="dialog-toolbar">
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <slot />
      <q-card-actions v-if="showFooter" align="around" class="dialog-footer">
        <slot name="footer" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "Dialog",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "对话框",
    },
    width: {
      type: Number,
      default: 300,
    },
  },
  computed: {
    showFooter() {
      return this.$slots.footer || this.$scopedSlots.footer;
    },
  },
  watch: {
    value(val) {
      this.showDlg = val;
    },
  },
  mounted() {
    this.showDlg = this.value;
  },
  data() {
    return {
      showDlg: false,
    };
  },
  methods: {
    show() {
      this.showDlg = true;
      this.$emit("change", this.showDlg);
    },
    hide() {
      this.showDlg = false;
      this.$emit("change", this.showDlg);
    },
    onChange(val) {
      this.showDlg = val;
      this.$emit("change", this.showDlg);
    },
  },
};
</script>

<style>
.dialog-toolbar {
  border-bottom: 1px solid #ddd;
}
.dialog-footer {
  border-top: 1px solid #ddd;
}
</style>
