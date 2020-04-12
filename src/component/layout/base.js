import * as constants from "../../store/constants";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers(
  constants.NAMESPACE
);
export default {
  computed: {
    ...mapState({
      _appInfo: [constants.AppInfo],
      _menus: [constants.Menus],
      _favorities: [constants.Favorites],
      tabList: [constants.TabList],
      activedTab: [constants.ActivedTab]
    })
  },
  methods: {
    ...mapMutations([
      constants.SET_APP_INFO,
      constants.CLOSE_TAB,
      constants.CLEAR_TABS,
      constants.SET_MENUS,
      constants.ADD_FAVORITY,
      constants.REMOVE_FAVORITY
    ])
  }
};
