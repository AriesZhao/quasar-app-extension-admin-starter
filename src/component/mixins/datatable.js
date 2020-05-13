export default {
  model: {
    prop: "selected",
    event: "change",
  },
  props: {
    request: {
      type: Function,
    },
    rowKey: {
      type: String,
      default: "id",
    },
    method: {
      type: String,
      default: "GET",
    },
    title: {
      type: String,
    },
    data: {
      type: Array,
    },
    selected: {
      type: Array,
      default: [],
    },
    selection: {
      type: String,
    },
    columns: {
      type: Array,
    },
    excludes: {
      type: Array,
    },
    actionColumn: {
      type: String,
      default: "actions",
    },
    rowsPerPage: {
      type: Number,
      default: 50,
    },
    stickyFirst: {
      type: Boolean,
      default: false,
    },
    stickyLast: {
      type: Boolean,
      default: false,
    },
    rowsPerPageOptions: {
      type: Array,
      default() {
        return [50, 100, 200, 500];
      },
    },
  },
};
