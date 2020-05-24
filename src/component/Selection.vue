<template>
  <q-select
    ref="select"
    v-model="selection"
    use-input
    input-debounce="300"
    :options="options"
    :multiple="multiple"
    :option-label="optionLabel"
    :option-value="optionValue"
    :use-chips="multiple"
    :label="label"
    @filter="filterFn"
    @input="inputFn"
    :emit-value="emitValue"
    :map-options="mapOptions"
  ></q-select>
</template>
<script>
export default {
  name: "Selection",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {},
    label: String,
    emitValue: {
      type: Boolean,
      default: false,
    },
    mapOptions: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    optionLabel: {
      type: String,
    },
    optionValue: {
      type: String,
    },
    requestFn: {
      type: Function,
    },
  },
  data() {
    return {
      selection: null,
      options: [],
    };
  },
  watch: {
    value(val) {
      this.selection = val;
    },
  },
  mounted() {
    this.selection = this.value;
  },
  methods: {
    filterFn(val, update, abort) {
      if (this.requestFn) {
        update(() => {
          this.requestFn(val).then((ret) => {
            this.options = ret;
          });
        });
      } else {
        abort();
      }
    },
    inputFn(val) {
      this.selection = val;
      this.$emit("change", this.selection);
    },
  },
};
</script>
