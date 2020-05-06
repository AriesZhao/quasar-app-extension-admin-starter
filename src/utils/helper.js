export function isEmpty(obj) {
  if (!obj || obj === null || JSON.stringify(obj) === "{}") {
    return true;
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
