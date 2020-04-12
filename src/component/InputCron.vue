<template>
  <div class="row q-gutter-sm" style="width:300px">
    <div class="col">
      <q-select
        label="频次"
        :options="freqOptions"
        v-model="model.freq"
        emit-value
        map-options
        @input="onFreqChange"
        :readonly="readonly"
      />
    </div>
    <div class="col" v-if="model.freq === 'w'">
      <q-select
        label="每周"
        :options="weekOptions"
        v-model="model.week"
        emit-value
        map-options
        @input="onWeekChange"
        :readonly="readonly"
      />
    </div>
    <div class="col" v-if="model.freq === 'm'">
      <q-select
        label="每月"
        :options="monthOptions"
        v-model="model.month"
        emit-value
        map-options
        @input="onMonthChange"
        :readonly="readonly"
      />
    </div>
    <div class="col">
      <q-input
        label="时间"
        v-model="model.time"
        mask="time"
        :rules="['time']"
        @input="onChange"
        :readonly="readonly"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              transition-show="scale"
              transition-hide="scale"
              v-if="!readonly"
            >
              <q-time v-model="model.time" @input="onTimeChange" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      model: {
        freq: 'd',
        year: '*',
        month: '1',
        week: '1',
        time: '09:00',
        hour: 9,
        minute: 0,
        cron: null
      },
      freqOptions: [
        { label: '每天', value: 'd' },
        { label: '每周', value: 'w' },
        { label: '每月', value: 'm' }
      ],
      weekOptions: [
        { label: '星期一', value: '1' },
        { label: '星期二', value: '2' },
        { label: '星期三', value: '3' },
        { label: '星期四', value: '4' },
        { label: '星期五', value: '5' },
        { label: '星期六', value: '6' },
        { label: '星期日', value: '0' }
      ],
      monthOptions: []
    }
  },
  mounted () {
    for (var i = 1; i <= 31; i++) {
      this.monthOptions.push({
        label: i + '日',
        value: i + ''
      })
    }
    this.onChange()
  },
  watch: {
    value (val) {
      this.onChange()
    }
  },
  methods: {
    onFreqChange () {
      this.onChange()
    },
    onWeekChange () {
      this.onChange()
    },
    onMonthChange () {
      this.onChange()
    },
    onTimeChange (value, details) {
      this.model.hour = details.hour
      this.model.minute = details.minute
      this.onChange()
    },
    onChange () {
      if (this.model.freq === 'd') {
        this.model.cron =
          this.model.minute + ' ' + this.model.hour + ' * * * ?'
      } else if (this.model.freq === 'w') {
        this.model.cron =
          this.model.minute +
          ' ' +
          this.model.hour +
          ' * * ' +
          this.model.week +
          ' ?'
      } else if (this.model.freq === 'm') {
        this.model.cron =
          this.model.minute +
          ' ' +
          this.model.hour +
          ' ' +
          this.month +
          ' * * ?'
      }
      this.$emit('change', this.model.cron)
    }
  }
}
</script>
