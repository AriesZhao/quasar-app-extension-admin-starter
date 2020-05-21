import { uid } from "quasar";

export function buildMenus(routes) {
  let menu = [];
  routes.forEach((item) => {
    if (item.meta && item.meta.menu === false) {
      //skip
    } else if (item instanceof Array) {
      item.forEach((subItem) => {
        menu.push(routerToMenu(subItem, ""));
      });
    } else {
      menu.push(routerToMenu(item, ""));
    }
  });
  return menu;
}

// 将路由规则转为菜单树结点
function routerToMenu(route, path) {
  let menu = {
    id: uid(),
    title: route.meta ? route.meta.title : route.path,
    icon: route.meta ? route.meta.icon : "la la-angle-right",
    class: route.meta ? route.meta.class : "",
  };
  if (route.children && route.children.length > 0) {
    menu.children = [];
    route.children.forEach((element) => {
      if (!element.props) {
        menu.children.push(routerToMenu(element, path + "/" + route.path));
      }
    });
  } else {
    menu.url = path + "/" + route.path;
  }
  return menu;
}
