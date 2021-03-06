<template>
  <q-page class="panel">
    <q-toolbar
      class="bg-grey-2 tab-toolbar"
      :style="{ 'padding-right': _appInfo.siderWidth + 15 + 'px' }"
    >
      <q-breadcrumbs active-color="primary" style="font-size: 16px;">
        <q-breadcrumbs-el
          v-for="item in $route.matched"
          :key="item.path"
          :label="item.meta.title"
        />
      </q-breadcrumbs>
      <q-space />
      <slot name="actions" />
      <q-btn
        round
        color="primary"
        flat
        @click="$q.fullscreen.toggle()"
        :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      />
      <q-btn
        flat
        round
        dense
        icon="star_border"
        v-if="!favority"
        color="secondary"
        @click="addFavority"
      />
      <q-btn
        flat
        round
        dense
        icon="star"
        v-if="favority"
        color="primary"
        @click="removeFavority"
      />
      <q-btn flat round dense color="negative" icon="close" @click="close" />
    </q-toolbar>
    <div class="panel-content">
      <div class="q-pa-sm content-wrapper">
        <q-card
          class="no-box-shadow"
          :style="{
            background: background || 'white',
            width: width,
            height: height,
          }"
          ><q-scroll-area class="fit" v-if="scroll">
            <slot />
          </q-scroll-area>
          <div v-if="!scroll">
            <slot />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import * as constants from "../store/constants";
import base from "./layout/base";
import panel from "./mixins/panel";
export default {
  name: "Panel",
  mixins: [base, panel],
  props: {
    background: {
      type: String,
    },
    scroll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tabPath: null,
      tabClosed: false,
    };
  },
  computed: {
    favority() {
      return this._favorities.find((item) => {
        return item.url === this.$route.path;
      });
    },
  },
  mounted() {
    this.tabPath = this.$route.path;
    // 监听Tab关闭
    this.$root.$on("closeTab", (path) => {
      if (this.tabPath === path) {
        this.tabClosed = true;
      }
    });
  },
  activated() {
    if (this.tabClosed) {
      this.$emit("init");
      this.tabClosed = false;
    }
  },
  methods: {
    //关闭当前面板
    close() {
      let tabToClose = this.tabList.find((item) => {
        return item.url === this.$route.path;
      });
      if (tabToClose) {
        this[constants.CLOSE_TAB](tabToClose);
      }
      this.tabClosed = true;
    },
    //添加至收藏
    addFavority() {
      this[constants.ADD_FAVORITY]({
        title:
          this.$route.params.title ||
          this.$route.query.title ||
          this.$route.meta.title,
        url: this.$route.path,
      });
    },
    //从收藏移除
    removeFavority() {
      this[constants.REMOVE_FAVORITY](this.favority);
    },
  },
};
</script>
