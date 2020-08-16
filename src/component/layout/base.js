import * as constants from "../../store/constants";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers(constants.NAMESPACE);
export default {
  computed: {
    ...mapState({
      _appInfo: [constants.AppInfo], //App 信息
      _menus: [constants.Menus], //菜单
      _favorities: [constants.Favorites], //个人收藏
      tabList: [constants.TabList], //Tab 集合
      activedTab: [constants.ActivedTab], //当天 Tab
    }),
  },
  methods: {
    ...mapMutations([
      constants.SET_APP_INFO,
      constants.CLOSE_TAB,
      constants.CLEAR_TABS,
      constants.SET_MENUS,
      constants.ADD_FAVORITY,
      constants.REMOVE_FAVORITY,
    ]),
  },
};
