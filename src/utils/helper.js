/**
 * 判断对象是否为空
 * @param {*} obj
 */
export function isEmpty(obj) {
  if (!obj || obj === null || JSON.stringify(obj) === "{}") {
    return true;
  } else {
    return false;
  }
}

// convert array to tree
export function arrayToTree(array, rootKey, idField, parentField) {
  const ret = [];
  const id = idField || "id";
  const parentId = parentField || "parentId";
  array.forEach((item) => {
    if (!isEmpty(rootKey) && item[parentId] === rootKey) {
      let node = {};
      Object.assign(node, item);
      buildTreeNode(array, node, id, parentId);
      ret.push(node);
    } else if (isEmpty(rootKey) && isEmpty(item[parentId])) {
      let node = {};
      Object.assign(node, item);
      buildTreeNode(array, node, id, parentId);
      ret.push(node);
    }
  });
  return ret;
}

function buildTreeNode(array, parent, idField, parentField) {
  array.forEach((item) => {
    if (item[parentField] === parent[idField]) {
      let node = {};
      Object.assign(node, item);
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
      buildTreeNode(array, node, idField, parentField);
    }
  });
}

export function convertArray(array, convertFun) {
  let ret = [];
  array.forEach((item) => {
    var obj = convertFun(item);
    if (obj) {
      ret.push(obj);
    }
  });
  return ret;
}

export function treeToArray(tree, filter) {
  let ret = [];
  tree.forEach((element) => {
    if (filter && filter(element)) {
      let item = {};
      Object.assign(item, element);
      item.children = null;
      ret.push(item);
    } else if (!filter) {
      let item = {};
      Object.assign(item, element);
      item.children = null;
      ret.push(item);
    }
    if (element.children && element.children.length > 0) {
      ret = ret.concat(treeToArray(element.children, filter));
    }
  });
  return ret;
}

export function filterTree(tree, filterFn) {
  let ret = [];
  tree.forEach((element) => {
    if (filterFn(element)) {
      ret.push(element);
    } else if (element.children && element.children.length > 0) {
      let children = filterTree(element.children, filterFn);
      if (children.length > 0) {
        element.children = children;
        ret.push(element);
      }
    }
  });
  return ret;
}

export function findInTree(tree, filterFn) {
  let ret = null;
  tree.forEach((element) => {
    if (filterFn(element)) {
      ret = {};
      Object.assign(ret, element);
      ret.children = null;
    } else if (element.children && element.children.length > 0) {
      let sub = findInTree(element.children, filterFn);
      if (sub) {
        ret = sub;
      }
    }
  });
  return ret;
}

export function findChildren(node, value, prop) {
  var ret = [];
  ret.push(node[prop || "id"]);
  if (node.children && node.children.length > 0) {
    node.children.forEach((item) => {
      ret = ret.concat(findChildren(item, item[prop || "id"], prop));
    });
  }
  return ret;
}

export function visitTree(tree, hanlder) {
  tree.forEach((node) => {
    if (node.children && node.children.length > 0) {
      visitTree(node.children, hanlder);
    } else {
      hanlder(node);
    }
  });
}

/**
 * 构建树结构
 *
 * @param {Array} list
 * @param {String} root
 */
export function buildTree(list, root) {
  let tree = [];
  list.forEach((item) => {
    if ((isEmpty(root) && isEmpty(item.parentId)) || item.parentId === root) {
      let node = {};
      node = Object.assign(node, item);
      let children = buildTree(list, item.id);
      if (children.length > 0) {
        node.children = children;
      }
      tree.push(node);
    }
  });
  return tree;
}

/**
 * 更新树结构
 *
 * @param {Array} tree
 * @param {Object} entity
 * @param {Boolean} insert
 */
export function updateTree(tree, entity, insert) {
  tree.forEach((node) => {
    if (insert) {
      if (!entity.parentId) {
        tree.push(entity);
      } else if (node.id === entity.parentId) {
        if (!node.children) {
          node.children = [];
        }
        node.children.push(entity);
      } else if (node.children) {
        updateTree(node.children, entity, insert);
      }
    } else {
      if (node.id === entity.id) {
        Object.assign(node, entity);
      } else if (node.children && node.children.length > 0) {
        updateTree(node.children, entity, insert);
      }
    }
  });
}

/**
 *
 * @param {Array} tree
 * @param {Object} entity
 */
export function removeTreeNode(tree, entity) {
  let index = 0;
  tree.forEach((node) => {
    index++;
    if (node.id === entity.id) {
      tree.splice(index - 1, 1);
    } else if (node.children) {
      removeTreeNode(node.children, entity);
    }
  });
}

/**
 * 取得需要调用的方法
 * @param {String} name
 * @param {Vue Component} vm
 */
export function getFn(name, vm) {
  // 1. 有方法定义
  if (vm && vm[name + "Fn"]) {
    return vm[name + "Fn"];
  }
  // 2. 父类有定义
  if (vm.$parent && vm.$parent[name]) {
    return vm.$parent[name];
  }
  // 3. 有Service定义
  if (vm.$parent.service && vm.$parent.service[name]) {
    return vm.$parent.service[name];
  } else if (vm.service && vm.service[name]) {
    return vm.service[name];
  }
  return null;
}

/**
 * 调用方法
 * @param {String} name
 * @param {Vue Component} vm
 * @param {Object} param
 */
export function callFn(name, vm, param) {
  let fn = getFn(name, vm);
  if (fn) {
    return fn(param);
  } else if (vm.$listeners[name]) {
    vm.$emit(name, param);
    return new Promise((resolve) => {
      resolve();
    });
  }
}
