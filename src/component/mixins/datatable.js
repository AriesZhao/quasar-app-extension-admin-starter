export default {
  props: {
    request: {
      type: Function,
    },
    remove: {
      type: Function,
    },
    title: {
      type: String,
    },
    data: {
      type: Array,
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
    // sticky last column
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
