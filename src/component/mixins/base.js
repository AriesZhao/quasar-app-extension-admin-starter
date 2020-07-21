//全局Mixin
export default {
  methods: {
    /**
     * 判断对象是否为空
     * @param {Any} obj
     */
    isEmpty(obj) {
      if (!obj || obj === null || JSON.stringify(obj) === "{}") {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 错误信息
     * @param {Object}} err
     */
    error(err) {
      this.$appHelper.error(msg);
    },
    /**
     * 警告信息
     * @param {Object}} err
     */
    warn(msg) {
      this.$appHelper.warn(msg);
    },
    /**
     * 提示信息
     * @param {String}} msg
     */
    info(msg) {
      this.$appHelper.info(msg);
    },
    /**
     * 确认
     * @param {String} text
     * @param {Function} okFn
     */
    confirm(text, okFn) {
      this.$appHelper.confirm(text, okFn);
    },
    /**
     * 取得需要调用的方法
     * @param {String} name
     */
    findFn(name) {
      // 1. 有方法定义
      if (this[name + "Fn"]) {
        return this[name + "Fn"];
      }
      // 2. 父类有定义
      if (this.$parent && this.$parent[name]) {
        return this.$parent[name];
      }
      // 3. 有Service定义
      if (this.service && this.service[name]) {
        return this.service[name];
      }
      return null;
    },
    /**
     * 调用方法
     * @param {String} name
     * @param {Object} param
     */
    callFn(name, param, defaultVal) {
      try {
        let fn = this.findFn(name);
        if (fn) {
          let ret = fn(param);
          if (ret && ret instanceof Promise) {
            return ret;
          } else {
            return new Promise((resolve) => {
              resolve(ret);
            });
          }
        } else if (this.$listeners[name]) {
          this.$emit(name, param);
          return new Promise((resolve) => {
            resolve();
          });
        } else {
          return new Promise((resolve) => {
            resolve(defaultVal);
          });
        }
      } catch (err) {
        return new Promise((resolve, reject) => {
          reject(err);
        });
      }
    },
  },
};
