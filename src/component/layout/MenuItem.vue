<template>
  <div>
    <template v-if="data.children && data.children.length > 0">
      <q-expansion-item
        expand-separator
        :header-class="prop(data, 'class', '')"
        :icon="prop(data, 'icon', 'la la-list')"
        :label="prop(data, 'title')"
        :style="{ 'padding-left': level * 10 + 'px' }"
      >
        <q-list separator>
          <MenuItem
            v-for="item in data.children"
            :key="item.id"
            :data="item"
            :level="level + 1"
          />
        </q-list>
      </q-expansion-item>
    </template>
    <template v-else>
      <q-item
        :class="[prop(data, 'class', '')]"
        :style="{ 'padding-left': level * 10 + 15 + 'px' }"
        :to="prop(data, 'url')"
        clickable
        v-ripple
        exact
      >
        <q-item-section avatar>
          <q-icon :name="prop(data, 'icon', 'la la-angle-right')" />
        </q-item-section>
        <q-item-section>{{ prop(data, "title") }}</q-item-section>
      </q-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    data: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  methods: {
    prop(menu, key, defaultVal) {
      if (menu[key]) {
        return menu[key];
      } else if (menu.data && menu.data[key]) {
        return menu.data[key];
      } else if (defaultVal) {
        return defaultVal;
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="sass">
.menu-list .q-item__section--avatar
  min-width: 30px
.menu-list .q-item__section--side
  padding-right: 5px
.menu-list .q-item__section--main,.menu-list .q-item__label
  font-size: 14px
</style>
