import * as constants from "./constants";

export default {
  namespaced: true,
  state: {
    [constants.AppInfo]: {
      logo: "",
      title: "Admin-Template",
      siderWidth: 250,
      siderClass: "bg-grey-3"
    },
    [constants.Menus]: [],
    [constants.Favorites]: [],
    [constants.TabList]: [],
    [constants.ActivedTab]: null
  },
  getters: {},
  mutations: {
    [constants.SET_APP_INFO](state, payload) {
      state[constants.AppInfo] = payload;
    },
    [constants.SET_MENUS](state, payload) {
      state[constants.Menus] = payload;
    },
    //open new tab
    [constants.OPEN_TAB](state, payload) {
      var opened = false;
      state[constants.TabList].forEach(item => {
        if (item.url === payload.url) {
          opened = true;
          item.selected = true;
          state[constants.ActivedTab] = item;
        } else {
          item.selected = false;
        }
      });
      if (!opened) {
        payload.selected = true;
        state[constants.TabList].push(payload);
        state[constants.ActivedTab] = payload;
      }
    },
    //close a tab
    [constants.CLOSE_TAB](state, payload) {
      const tabList = state[constants.TabList];
      const tabIndex = tabList.indexOf(payload);
      if (tabIndex >= 0) {
        tabList.splice(tabIndex, 1);
      } else {
        return;
      }
      if (payload.selected) {
        if (tabList.length < 1) {
          this.$router.replace({ path: "/" });
        } else if (tabIndex > tabList.length - 1) {
          state[constants.ActivedTab] = tabList[tabList.length - 1];
          tabList[tabList.length - 1].selected = true;
          this.$router.replace({
            path: tabList[tabList.length - 1].url
          });
        } else if (tabIndex < 1) {
          state[constants.ActivedTab] = tabList[0];
          tabList[0].selected = true;
          this.$router.replace({ path: tabList[0].url });
        } else {
          state[constants.ActivedTab] = tabList[tabIndex - 1];
          tabList[tabIndex - 1].selected = true;
          this.$router.replace({
            path: tabList[tabIndex - 1].url
          });
        }
      }
    },
    // clear tabs
    [constants.CLEAR_TABS](state) {
      state[constants.TabList] = [];
      state[constants.ActivedTab] = null;
    },
    // add favority
    [constants.ADD_FAVORITY](state, payload) {
      if (
        !state[constants.Favorites].find(item => {
          return item.url === payload.url;
        })
      ) {
        state[constants.Favorites].push(payload);
      }
    },
    // remove favority
    [constants.REMOVE_FAVORITY](state, payload) {
      let index = state[constants.Favorites].indexOf(payload);
      if (index > -1) {
        state[constants.Favorites].splice(index, 1);
      }
    }
  }
};
