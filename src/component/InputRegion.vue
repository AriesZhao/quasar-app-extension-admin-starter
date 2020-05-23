<template>
  <div class="row q-col-gutter-sm" style="width:500px">
    <div class="col-4">
      <q-select
        label="省/直辖市"
        :options="provinces"
        option-label="name"
        option-value="id"
        v-model="proviceId"
        emit-value
        map-options
        @input="onInput"
      />
    </div>
    <div class="col-4">
      <q-select
        label="市/县"
        :options="cities"
        option-label="name"
        option-value="id"
        v-model="cityId"
        emit-value
        map-options
        @input="onInput"
      />
    </div>
    <div class="col-4">
      <q-select
        label="地区"
        :options="areas"
        option-label="name"
        option-value="id"
        v-model="areaId"
        emit-value
        map-options
        @input="onInput"
      />
    </div>
  </div>
</template>
<script>
import region from '../utils/region'
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ['value'],
  data () {
    return {
      regionId: null,
      proviceId: null,
      cityId: null,
      areaId: null
    }
  },
  mounted () {
    this.regionId = this.value
  },
  computed: {
    provinces () {
      return region.provinceOptions
    },
    cities () {
      return region.getCity(this.proviceId)
    },
    areas () {
      return region.getArea(this.cityId)
    }
  },
  methods: {
    onInput (val) {
      this.regionId = val
      this.$emit('change', val)
    }
  }
}
</script>
