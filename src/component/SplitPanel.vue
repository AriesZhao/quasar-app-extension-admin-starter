<template>
  <panel class="split-panel" @init="init">
    <template slot="actions">
      <slot name="actions" />
    </template>
    <q-splitter
      v-model="splitRatio"
      class="splitter-wrapper"
      :unit="unit"
      :reverse="reverse"
    >
      <template v-slot:before>
        <q-toolbar
          class="toolbar bg-grey-3"
          v-if="leftTitle || $slots['left-actions']"
        >
          <q-toolbar-title>
            {{ leftTitle }}
          </q-toolbar-title>
          <q-space />
          <slot name="left-actions" />
        </q-toolbar>
        <slot name="left" />
      </template>
      <template v-slot:after>
        <q-toolbar
          class="toolbar bg-grey-3"
          v-if="rightTitle || $slots['right-actions']"
        >
          <q-toolbar-title>
            {{ rightTitle }}
          </q-toolbar-title>
          <q-space />
          <slot name="right-actions" />
        </q-toolbar>
        <slot name="right" />
      </template>
    </q-splitter>
  </panel>
</template>

<script>
import base from "./layout/base";
import SplitPanel from "./mixins/split-panel";
export default {
  name: "SplitPanel",
  mixins: [base, SplitPanel],
  methods: {
    init() {
      this.$emit("init");
    },
  },
};
</script>

<style>
.panel .toolbar {
  position: sticky;
  top: 0px;
  z-index: 2;
}
.panel .toolbar .q-btn {
  max-height: 36px;
  margin-top: 10px;
}
</style>
