export default {
  props: {
    ratio: { type: Number, default: 30 },
    unit: { type: String, default: "%" },
    reverse: { type: Boolean, default: false },
    leftTitle: { type: String },
    rightTitle: { type: String },
  },
  data() {
    return {
      splitRatio: 30,
    };
  },
  mounted() {
    this.splitRatio = this.ratio;
  },
};
