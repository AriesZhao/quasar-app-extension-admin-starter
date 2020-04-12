<template>
  <div class="sidebar">
    <div class="left-header">
      <slot name="left-header" :appInfo="_appInfo" />
    </div>
    <q-list class="menu-list">
      <MenuItem v-for="item in _menus" :key="item.id" :data="item" :level="0" />
    </q-list>
  </div>
</template>

<script>
import MenuItem from "./MenuItem";
import { treeToArray } from "../../utils/helper";
import base from "./base";

export default {
  mixins: [base],
  components: {
    MenuItem,
  },
};
</script>

<style lang="sass" scoped>
.left-header
  position: sticky
  top: 0
  z-index: 2
  background: white
</style>
