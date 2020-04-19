import * as constants from "../../store/constants";
import base from "../layout/base";
import { buildMenus } from "../../utils/menu";
import * as helper from "../../utils/helper";

export default {
  mixins: [base],
  props: {
    appKey: {
      type: String,
      default: "admin-app",
    },
    appInfo: {
      type: Object,
      default() {
        return {
          siderWidth: 250,
          siderClass: "bg-grey-3",
        };
      },
    },
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
      this[constants.SET_MENUS](this.menus);
    } else {
      let adminRoute = findAdminRoute(
        this.$router.options.routes,
        this.$route.path
      );
      this[constants.SET_MENUS](buildMenus(adminRoute.children));
    }
  },
};

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
