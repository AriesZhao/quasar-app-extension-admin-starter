import { Dialog, Notify } from "quasar";

/**
 * 提示错误信息
 * @param {Object}} err
 */
export function error(err) {
  Notify.create({
    message: err,
    color: "negative",
  });
}

/**
 * 提示警告信息
 * @param {Object}} err
 */
export function warn(msg) {
  Notify.create({
    message: msg,
  });
}

/**
 * 提示信息
 * @param {String}} msg
 */
export function info(msg) {
  Notify.create({
    message: msg,
    icon: "announcement",
  });
}

/**
 * 弹出确认对话框
 * @param {String} text
 * @param {Function} okFn
 */
export function confirm(text, okFn) {
  Dialog.create({
    title: "确认",
    message: text,
    persistent: true,
    ok: { color: "primary" },
    cancel: { flat: true },
  }).onOk(() => {
    okFn && okFn();
  });
}
