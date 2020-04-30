import * as constants from "../store/constants";
const OPEN_TAB = constants.NAMESPACE + "/" + constants.OPEN_TAB;

function isTab(to) {
  if (to.meta.tab !== null && to.meta.tab === false) {
    return false;
  } else if (to.meta.root === true) {
    return false;
  }
  return true;
}

export default function (router) {
  router.beforeEach((to, from, next) => {
    if (isTab(to)) {
      router.app.$options.store.commit(OPEN_TAB, {
        url: to.path,
        title: to.params.title || to.query.title || to.meta.title,
      });
    }
    document.title = to.params.title || to.query.title || to.meta.title;
    next();
  });
}
