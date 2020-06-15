<template>
  <q-input
    class="input-date"
    :readonly="readonly"
    :outlined="outlined"
    :label="label"
    v-model="dateValue"
    :rules="['date']"
    @input="onInput"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" v-if="!readonly">
          <q-date v-model="dateValue" @input="onInput" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import input from "./mixins/input";

export default {
  name: "InputDate",
  mixins: [input],
  mounted() {
    this.dateValue = this.value;
  },
  data() {
    return {
      dateValue: null,
    };
  },
  watch: {
    value(val) {
      this.dateValue = val;
    },
  },
  methods: {
    onInput(e) {
      this.$refs.qDateProxy.hide();
      this.$emit("change", this.dateValue);
    },
  },
};
</script>

<style>
.input-date {
  padding-bottom: 0px;
}
</style>
