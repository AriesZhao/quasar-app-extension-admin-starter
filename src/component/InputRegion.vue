<template>
  <div class="row q-col-gutter-sm">
    <div class="col-4">
      <q-select
        label="省/直辖市"
        :options="provinceIds"
        option-label="name"
        option-value="id"
        v-model="model.provinceId"
        emit-value
        map-options
        @input="onInput"
        :readonly="readonly"
      />
    </div>
    <div class="col-4">
      <q-select
        label="市/县"
        :options="cities"
        option-label="name"
        option-value="id"
        v-model="model.cityId"
        emit-value
        map-options
        @input="onInput"
        :readonly="readonly"
      />
    </div>
    <div class="col-4">
      <q-select
        label="地区"
        :options="areas"
        option-label="name"
        option-value="id"
        v-model="model.townId"
        emit-value
        map-options
        @input="onInput"
        :readonly="readonly"
      />
    </div>
  </div>
</template>
<script>
import input from "./mixins/input";
import region from "../utils/region";
export default {
  name: "InputRegion",
  mixins: [input],
  data() {
    return {
      model: {
        provinceId: null,
        cityId: null,
        townId: null,
        address: null,
      },
    };
  },
  mounted() {
    if (this.value) {
      this.model.provinceId = this.value.provinceId;
      this.model.cityId = this.value.cityId;
      this.model.townId = this.value.townId;
      this.model.address = this.value.address;
    }
  },
  computed: {
    provinceIds() {
      return region.provinceOptions;
    },
    cities() {
      return region.getCity(this.model.provinceId);
    },
    areas() {
      return region.getArea(this.model.cityId);
    },
  },
  methods: {
    onInput(val) {
      this.regionId = val;
      this.$emit("change", val);
    },
  },
};
</script>
