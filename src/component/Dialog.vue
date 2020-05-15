<template>
  <q-dialog v-model="showDlg" @input="onChange" :persistent="persistent">
    <q-card style="min-height: 200px; min-width: 300px;">
      <q-toolbar>
        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-toolbar>
      <slot />
      <q-card-actions v-if="showFooter" align="around">
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
      required: true,
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
    onChange(val) {
      this.showDlg = val;
      this.$emit("change", this.showDlg);
    },
  },
};
</script>
