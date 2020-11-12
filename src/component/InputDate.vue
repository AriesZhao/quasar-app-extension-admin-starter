<template>
  <q-input
    class="input-date"
    :readonly="readonly"
    :outlined="outlined"
    :label="label"
    v-model="dateValue"
    @input="onInput"
    :dense="dense"
  >
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" v-if="!readonly">
          <q-date v-model="dateValue" @input="onInput" />
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append v-if="showTime">
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy ref="qTimeProxy" v-if="!readonly">
          <q-time
            v-model="dateValue"
            mask="YYYY/MM/DD HH:mm"
            :minute-options="minuteOptions"
            format24h
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="关闭" color="primary" flat />
            </div>
          </q-time>
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
  props: {
    showTime: {
      type: Boolean,
      default: false,
    },
    minuteOptions: {
      type: Array,
      default() {
        return [0, 15, 30, 45];
      },
    },
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
  mounted() {
    this.dateValue = this.value;
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
