<template>
  <div class="selection">
    <q-select
      v-if="!readonly && filter"
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
      :emit-value="emitValue"
      :map-options="mapOptions"
      @filter="filterFn"
      @input="inputFn"
    />
    <q-select
      v-if="!readonly && !filter"
      ref="select"
      v-model="selection"
      :options="options"
      :multiple="multiple"
      :option-label="optionLabel"
      :option-value="optionValue"
      :use-chips="multiple"
      :label="label"
      :emit-value="emitValue"
      :map-options="mapOptions"
      @input="inputFn"
    />
    <q-input :label="label" v-model="displayValue" readonly v-if="readonly" />
  </div>
</template>

<script>
import input from "./mixins/input";

export default {
  name: "Selection",
  mixins: [input],
  props: {
    filter: {
      type: Boolean,
      default: false,
    },
    displayValue: {
      type: String,
    },
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
    this.requestFn("").then((ret) => {
      this.options = ret;
    });
  },
  methods: {
    filterFn(val, update, abort) {
      if (this.requestFn) {
        update(() => {
          this.requestFn(val + "").then((ret) => {
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

<style>
.selection {
  min-width: 150px;
}
</style>
