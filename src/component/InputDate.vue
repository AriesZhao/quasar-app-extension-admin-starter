<template>
  <q-input
    :outlined="outlined"
    :label="label"
    v-model="dateValue"
    :rules="['date']"
    @input="onInput"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy ref="qDateProxy">
          <q-date v-model="dateValue" @input="onInput" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String,
    outlined: {
      type: Boolean,
      default () {
        return false
      }
    },
    label: String
  },
  mounted () {
    this.dateValue = this.value
  },
  data () {
    return {
      dateValue: null
    }
  },
  methods: {
    onInput (e) {
      this.$refs.qDateProxy.hide()
      this.$emit('change', this.dateValue)
    }
  }
}
</script>
