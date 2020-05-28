export default {
  name: "Input",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {},
    label: {
      type: String,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
};
