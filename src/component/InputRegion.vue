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
        @input="onProvinceInput"
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
        @input="onCityInput"
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
        @input="onTownInput"
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
        townId: null
      },
    };
  },
  mounted() {
    if (this.value) {
      this.model.provinceId = this.value.provinceId;
      this.model.cityId = this.value.cityId;
      this.model.townId = this.value.townId;
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
    onProvinceInput(val) {
      this.model.provinceId = val;
      this.$emit("change", this.model);
    },
    onCityInput(val) {
      this.model.cityId = val;
      this.$emit("change", this.model);
    },
    onTownInput(val) {
      this.model.townId = val;
      this.$emit("change", this.model);
    }
  },
};
</script>
