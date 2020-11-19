<template>
  <q-input
    class="input-date"
    :readonly="readonly"
    :outlined="outlined"
    :label="label"
    v-model="dateValue"
    @input="onDateChange"
    :dense="dense"
    mask="datetime"
  >
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy" v-if="!readonly">
          <q-date
            v-model="dateValue"
            @input="onDateChange"
            :mask="patternValue"
          />
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append v-if="showTime">
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy ref="qTimeProxy" v-if="!readonly">
          <q-time
            v-model="dateValue"
            :mask="patternValue"
            :hour-options="hourOptions"
            :minute-options="minuteOptions"
            @input="onDateChange"
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
import { date } from "quasar";
import input from "./mixins/input";

const DEFAULT_HOURS = [
  0,
  1,
  2,
  3,
  4,
  5,
  ,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
];

const DEFAULT_PATTERN = "YYYY/MM/DD";

export default {
  name: "InputDate",
  mixins: [input],
  props: {
    //日期显示格式
    pattern: {
      type: String,
      default: DEFAULT_PATTERN,
    },
    //是否支持时间
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
    hourOptions: {
      type: Array,
      default() {
        return DEFAULT_HOURS;
      },
    },
  },
  data() {
    return {
      dateValue: null,
      hourValue: 12,
      patternValue: null,
      mask: "date",
    };
  },
  watch: {
    value(val) {
      this.dateValue = val;
    },
  },
  beforeMount() {
    //初始化参数
    this.dateValue = this.value;
    this.patternValue = this.pattern;
    if (this.showTime) {
      this.mask = "datetime";
      if (this.patternValue === DEFAULT_PATTERN) {
        this.patternValue = DEFAULT_PATTERN + " HH:mm";
      }
    }
    //日期没有指定，则指定为当前日期
    if (!this.dateValue) {
      let timeStamp = Date.now();
      this.dateValue = date.formatDate(timeStamp, this.patternValue);
      this.$emit("change", this.dateValue);
    }
  },
  methods: {
    //选择日期
    onDateChange(e) {
      if (this.$refs.qDateProxy) {
        this.$refs.qDateProxy.hide();
      }
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
