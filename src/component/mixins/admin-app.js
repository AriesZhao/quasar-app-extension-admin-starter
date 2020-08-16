import * as constants from "../../store/constants";
import base from "../layout/base";
import { buildMenus } from "../../utils/menu";

export default {
  mixins: [base],
  props: {
    //侧边栏宽度
    siderWidth: {
      type: Number,
      default: 250,
    },
    //侧边栏ClassName
    siderClass: {
      type: String,
      default: "bg-grey-3",
    },
    //App Key
    appKey: {
      type: String,
      default: "admin-app",
    },
    //首页路径
    homePath: {
      type: String,
    },
    //首页图标
    homeIcon: {
      type: String,
      default: "home",
    },
    //App信息
    appInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    //菜单
    menus: {
      type: Array,
    },
  },
  watch: {
    appInfo(val) {
      this[constants.SET_APP_INFO](val);
    },
    menus(val) {
      this[constants.SET_MENUS](val);
    },
  },
  mounted() {
    if (this.appInfo) {
      this[constants.SET_APP_INFO](this.appInfo);
    }
    if (this.menus) {
      //A.传入菜单定义
      this[constants.SET_MENUS](this.menus);
    } else {
      //B.从路由加载菜单
      let adminRoute = findAdminRoute(
        this.$router.options.routes,
        this.$route.path
      );
      this[constants.SET_MENUS](buildMenus(adminRoute.children));
    }
  },
};

/**
 * 查找 AdminApp 根路由
 * @param {Array} routes 
 */
export function findAdminRoute(routes) {
  let ret = null;
  routes.forEach((route) => {
    if (route.meta && route.meta.root === true) {
      ret = route;
    } else if (route.children && route.children.length > 0) {
      let sub = findAdminRoute(route.children);
      if (sub) {
        ret = sub;
      }
    }
  });
  return ret;
}
