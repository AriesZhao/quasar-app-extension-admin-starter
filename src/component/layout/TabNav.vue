<template>
  <div class="tabnav">
    <q-btn-dropdown
      ref="dashboard"
      icon="dashboard"
      flat
      round
      dense
      class="hide-arrow"
    >
      <div
        class="q-pa-md q-gutter-sm"
        style="min-width: 500px; max-width: 800px;"
      >
        <div style="height: 30px;">
          <span class="text-h6">当前应用</span>
          <span class="float-right">
            <q-btn
              dense
              flat
              color="negative"
              label="关闭所有"
              v-if="tabList.length > 0"
              @click="clearTabs"
            />
            <q-btn dense flat v-close-popup icon="close" />
          </span>
        </div>
        <q-chip v-if="tabList.length == 0">
          当前应用用为空
        </q-chip>
        <q-chip
          v-for="tab in tabList"
          :key="'tab_' + tab.url"
          clickable
          ripple
          removable
          square
          :color="tab.selected ? 'secondary' : 'blue'"
          text-color="white"
          @click="selectTab(tab.url)"
          @remove="closeTab(tab)"
        >
          {{ tab.title }}
        </q-chip>
        <q-separator />
        <div style="height: 30px;">
          <span class="text-h6">我的收藏</span>
        </div>
        <q-chip ripple square v-if="!_favorities || _favorities.length < 1">
          我的收藏为空
        </q-chip>
        <q-chip
          v-for="favority in _favorities"
          :key="'favority_' + favority.url"
          color="primary"
          clickable
          ripple
          removable
          square
          text-color="white"
          @click="selectTab(favority.url)"
          @remove="removeFavority(favority)"
        >
          {{ favority.title }}
        </q-chip>
      </div>
    </q-btn-dropdown>
    <div class="tabs" ref="tabs" style="width: 100%; padding-right: 30px;">
      <q-tabs v-model="tab" align="left">
        <q-route-tab
          content-class="nav-tab"
          v-for="tab in tabList"
          :key="tab.url"
          :to="tab.url"
          v-bind="tab"
        >
          <div class="q-tab__label">{{ tab.title }}</div>
          <q-icon
            class="close-tab-btn"
            name="close"
            @click.stop.prevent="closeTab(tab)"
          />
        </q-route-tab>
      </q-tabs>
    </div>
  </div>
</template>

<script>
import base from "./base";
import * as constants from "../../store/constants";

export default {
  mixins: [base],
  data() {
    return {
      tab: null,
    };
  },
  mounted() {
    this.$root.$on("closeTab", (url) => {
      let tab = this.tabList.find((item) => {
        return item.url === url;
      });
      this[constants.CLOSE_TAB](tab);
    });
  },
  methods: {
    selectTab(path) {
      if (path !== this.$route.path) {
        this.$router.push({ path: path });
      }
    },
    closeTab(tab) {
      this[constants.CLOSE_TAB](tab);
      this.$root.$emit("closeTab", tab.url);
    },
    clearTabs() {
      this[constants.CLEAR_TABS]();
      this.$router.replace({ path: "/" });
      this.$root.$emit("clearTabs");
    },
    removeFavority(favority) {
      this[constants.REMOVE_FAVORITY](favority);
    },
  },
};
</script>

<style>
.tabnav {
  white-space: nowrap;
  overflow: hidden;
  position: inherit;
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.tabnav .tabs {
  display: inline-block;
  overflow: hidden;
  position: absolute;
}
.tabnav .q-tab {
  padding: 0 5px;
}
.tabnav .close-tab-btn {
  position: absolute;
  right: -3px;
  top: 3px;
  display: none;
}
.tabnav .nav-tab {
  min-width: 50px !important;
}
.tabnav .q-tab__content:hover .close-tab-btn {
  display: block;
}
</style>
