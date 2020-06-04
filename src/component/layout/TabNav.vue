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
    <q-btn
      ref="left-btn"
      icon="fas fa-angle-double-left"
      dense
      flat
      text-color="white"
      color="primary"
      class="bg-primary go-left"
      @click="goRight"
      v-if="leftBtn"
    />
    <div class="tabs" ref="tabs">
      <q-chip
        class="tabnav-item"
        v-for="tab in tabList"
        :key="tab.url"
        clickable
        ripple
        removable
        :color="tab.selected ? 'secondary' : 'blue'"
        text-color="white"
        :style="{ left: pos + 'px' }"
        @click="selectTab(tab.url)"
        @remove="closeTab(tab)"
      >
        <div class="tabtitle">{{ tab.title }}</div>
      </q-chip>
    </div>
    <q-btn
      ref="right-btn"
      icon="fas fa-angle-double-right"
      flat
      dense
      text-color="white"
      color="primary"
      class="bg-primary go-right"
      @click="goLeft"
      v-if="rightBtn"
    />
  </div>
</template>

<script>
import base from "./base";
import * as constants from "../../store/constants";

export default {
  mixins: [base],
  data() {
    return {
      pos: 0,
      leftBtn: false,
      rightBtn: false,
    };
  },
  watch: {
    tabList() {
      this.resize();
    },
  },
  mounted() {
    this.$root.$on("closeTab", (url) => {
      let tab = this.tabList.find((item) => {
        return item.url === url;
      });
      this.closeTab(tab);
    });
  },
  methods: {
    tabWidth() {
      return parseFloat(
        window.getComputedStyle(this.$refs.tabs).width.replace("px", "")
      );
    },
    navWidth() {
      var width =
        parseFloat(window.getComputedStyle(this.$el).width.replace("px", "")) -
        window
          .getComputedStyle(this.$refs.dashboard.$el)
          .width.replace("px", "");
      if (this.$refs["left-btn"]) {
        width -= parseFloat(
          window
            .getComputedStyle(this.$refs["left-btn"].$el)
            .width.replace("px", "")
        );
      } else {
        width -= 30;
      }
      if (this.$refs["right-btn"]) {
        width -= parseFloat(
          window
            .getComputedStyle(this.$refs["right-btn"].$el)
            .width.replace("px", "")
        );
      } else {
        width -= 30;
      }
      return width;
    },
    selectTab(path) {
      if (path !== this.$route.path) {
        this.$router.push({ path: path });
      }
    },
    closeTab(tab) {
      this[constants.CLOSE_TAB](tab);
    },
    goLeft() {
      if (this.tabWidth() < this.navWidth()) {
        this.pos = 0;
      } else if (this.tabWidth() + this.pos - 200 > this.navWidth()) {
        this.pos = this.pos - 200;
      } else {
        this.pos = this.navWidth() - this.tabWidth();
      }
      this.resize();
    },
    goRight() {
      if (this.pos + 200 >= 0) {
        this.pos = 0;
      } else {
        this.pos = this.pos + 200;
      }
      this.resize();
    },
    clearTabs() {
      this[constants.CLEAR_TABS]();
      this.$router.replace({ path: "/" });
    },
    resize() {
      this.rightBtn = this.tabWidth() > this.navWidth();
      this.leftBtn = this.pos < 0;
    },
    removeFavority(favority) {
      this[constants.REMOVE_FAVORITY](favority);
    },
  },
};
</script>

<style scoped>
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

.tabtitle {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 3px;
}

.go-right {
  z-index: 5;
  right: 0px;
  top: 10px;
  position: absolute;
}
</style>
