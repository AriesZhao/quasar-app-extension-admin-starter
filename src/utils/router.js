import * as constants from "../store/constants";
const publicList = ["/login"];
const OPEN_TAB = constants.NAMESPACE + "/" + constants.OPEN_TAB;

function isTab(to) {
  if (to.meta.tab !== null && to.meta.tab === false) {
    return false;
  }
  return true;
}

export default function(router) {
  router.beforeEach((to, from, next) => {
    var isPrivate = false;
    publicList.forEach(item => {
      if (item === to.path) {
        isPrivate = false;
      }
    });
    if (isTab(to)) {
      router.app.$options.store.commit(OPEN_TAB, {
        url: to.path,
        title: to.params.title || to.query.title || to.meta.title
      });
    }
    if (isPrivate) {
      next("/login");
    } else {
      document.title =
        to.params.title || to.query.title || to.meta.title;
      next();
    }
  });
}
