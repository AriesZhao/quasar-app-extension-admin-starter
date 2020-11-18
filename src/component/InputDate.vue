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
          <q-date v-model="dateValue" @input="onInput" :mask="patternValue" />
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-slot:append v-if="showTime || showHour">
      <q-icon name="access_time" class="cursor-pointer" v-if="showTime">
        <q-popup-proxy ref="qTimeProxy" v-if="!readonly">
          <q-time
            v-model="dateValue"
            :mask="patternValue"
            :hour-options="hourOptions"
            :minute-options="minuteOptions"
            format24h
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="关闭" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
      <q-select
        v-model.number="hourValue"
        v-if="showHour"
        :options="hourArray"
        emit-value
        map-options
        @input="hourChange"
      />
    </template>
  </q-input>
</template>

<script>
import { date } from "quasar";
import input from "./mixins/input";

const hours = [
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

const DEFAULT_PATTERN = "YYYY-MM-DD";

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
    showHour: {
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
        return hours;
      },
    },
  },
  data() {
    return {
      dateValue: null,
      hourValue: 12,
      hourArray: [],
      patternValue: null,
    };
  },
  watch: {
    value(val) {
      this.dateValue = val;
    },
  },
  mounted() {
    this.dateValue = this.value;
    this.patternValue = this.pattern;
    if (this.showTime && this.patternValue === DEFAULT_PATTERN) {
      this.patternValue = DEFAULT_PATTERN + " HH:mm";
    }
    //日期没有指定，则指定为当前日期
    if (!this.dateValue) {
      let timeStamp = Date.now();
      this.dateValue = date.formatDate(timeStamp, this.patternValue);
    }
    //设置小时选项
    if (this.showHour) {
      this.hourArray = [];
      this.hourOptions.forEach((item) => {
        if (item < 6) {
          this.hourArray.push({ label: `凌晨${item}时`, value: item });
        } else if (item >= 6 && item <= 12) {
          this.hourArray.push({ label: `上午${item}时`, value: item });
        } else if (item > 12 && item <= 18) {
          this.hourArray.push({ label: `下午${item}时`, value: item });
        } else if (item > 18) {
          this.hourArray.push({ label: `晚上${item}时`, value: item });
        }
      });
    }
  },
  methods: {
    onInput(e) {
      this.$refs.qDateProxy.hide();
      this.$emit("change", this.dateValue);
    },
    //小时变更
    hourChange(hour) {
      let timeStamp = date.extractDate(this.dateValue, this.patternValue);
      timeStamp = date.adjustDate(timeStamp, {
        hours: hour,
        minutes: 0,
        seconds: 0,
      });
      this.$emit(
        "change",
        date.formatDate(timeStamp, DEFAULT_PATTERN + " HH:mm:ss")
      );
    },
  },
};
</script>

<style>
.input-date {
  padding-bottom: 0px;
}
</style>
