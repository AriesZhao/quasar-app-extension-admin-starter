<template>
  <panel class="split-panel">
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
        <q-card flat class="no-border-radius">
          <q-toolbar class="toolbar bg-grey-3">
            <q-toolbar-title>
              {{ leftTitle }}
            </q-toolbar-title>
            <q-space />
            <slot name="left-actions" />
          </q-toolbar>
          <slot name="left" />
        </q-card>
      </template>
      <template v-slot:after>
        <q-card flat class="no-border-radius">
          <q-toolbar class="toolbar bg-grey-3">
            <q-toolbar-title>
              {{ rightTitle }}
            </q-toolbar-title>
            <q-space />
            <slot name="right-actions" />
          </q-toolbar>
          <slot name="right" />
        </q-card>
      </template>
    </q-splitter>
  </panel>
</template>

<script>
import base from "./layout/base";
import SplitPanel from "./mixins/split-panel";
export default {
  name:'SplitPanel',
  mixins: [base, SplitPanel]
};
</script>

<style>
.panel .toolbar {
  position: sticky;
  top: 0px;
  z-index: 1;
}
</style>
