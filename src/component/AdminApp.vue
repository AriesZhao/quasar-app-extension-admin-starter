<template>
  <q-layout
    view="lHh lpR lFf"
    class="admin-app"
    :class="{ 'mini-sider': enableMini, 'show-footer': hasFooter }"
  >
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="enableMini = !enableMini"
          :class="{ 'rotate-90': enableMini }"
        />
        <q-btn
          v-if="homePath"
          dense
          flat
          round
          :icon="homeIcon || 'home'"
          :to="{ path: homePath }"
        />
        <TabNav />
        <q-space />
        <!--Header Actions-->
        <slot name="actions" />
        <!--Settings-->
        <q-btn
          dense
          flat
          round
          icon="settings"
          @click="right = !right"
          v-if="hasDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      behavior="desktop"
      show-if-above
      side="left"
      elevated
      :width="siderWidth || 250"
      :mini-width="60"
      :mini="miniState && enableMini"
      :mini-to-overlay="enableMini"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :content-class="siderClass || ''"
    >
      <Sidebar @refresh-menus="$emit('refresh-menus')">
        <template v-slot:left-header="props">
          <slot name="left-header" :appInfo="props.appInfo" />
        </template>
      </Sidebar>
    </q-drawer>

    <q-drawer
      v-model="right"
      side="right"
      bordered
      elevated
      overlay
      v-if="hasDrawer"
    >
      <slot name="drawer" :app-info="_appInfo" />
    </q-drawer>

    <q-page-container>
      <q-tab-panels v-model="this.$route.path" animated keep-alive>
        <q-tab-panel
          v-for="tab in tabList"
          :key="tab.url"
          :name="tab.url"
          style="padding: 0;"
        >
          <router-view />
        </q-tab-panel>
      </q-tab-panels>
    </q-page-container>

    <!--Footer-->
    <q-footer>
      <slot name="footer" :app-info="_appInfo" />
    </q-footer>
  </q-layout>
</template>

<script>
import Sidebar from "./layout/Sidebar";
import TabNav from "./layout/TabNav";

import adminStore from "../store/admin-app.js";
import AdminApp from "./mixins/admin-app";
import router from "../utils/router";

import * as constants from "../store/constants";

export default {
  name: "AdminApp",
  mixins: [AdminApp],
  components: {
    Sidebar,
    TabNav,
  },
  data() {
    return {
      hasFooter: false,
      enableMini: false,
      miniState: true,
      right: false,
    };
  },
  beforeCreate() {
    this.hasFooter = this.$slots.footer || this.$scopedSlots.footer;
    this.hasDrawer = this.$slots.drawer || this.$scopedSlots.drawer;
  },
  created() {
    window.addEventListener("beforeunload", this.beforeunload);
    const localStore = getLocalStore(this.appKey);
    if (localStore != null) {
      adminStore.state = localStore;
    }
    this.$store.registerModule(constants.NAMESPACE, adminStore);
    router(this.$router);
    const existing = this.tabList.find((item) => {
      return item.url === this.$route.path;
    });
    if (!existing && !(this.$route.meta && this.$route.meta.tab === false)) {
      this.$store.commit(constants.NAMESPACE + "/" + constants.OPEN_TAB, {
        url: this.$route.path,
        title:
          this.$route.params.title ||
          this.$route.query.title ||
          this.$route.meta.title,
      });
    }
    const tab = this.tabList.find((item) => {
      return item.selected;
    });
    if (tab && tab.url !== this.$route.path) {
      this.$router.push({ path: tab.url });
    }
  },
  destroyed() {
    this.$store.unregisterModule(constants.NAMESPACE);
  },
  methods: {
    beforeunload() {
      if (this.$store.state[constants.NAMESPACE]) {
        localStorage.setItem(
          this.appKey,
          JSON.stringify(this.$store.state[constants.NAMESPACE])
        );
      }
    },
  },
};

function getLocalStore(appKey) {
  try {
    const localStore = localStorage.getItem(appKey);
    let store = null;
    if (localStore != null && localStore != "undefined") {
      store = JSON.parse(localStore);
    }
    if (
      store[constants.AppInfo] &&
      store[constants.Menus] &&
      store[constants.TabList] &&
      store[constants.Favorites]
    ) {
      return store;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}
</script>
