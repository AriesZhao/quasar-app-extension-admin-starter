<template>
  <div class="row q-col-gutter-sm">
    <div :class="{ 'col-4': rows === 2, 'col-2': rows === 1 }">
      <q-select
        ref="province"
        label="省/直辖市"
        :options="provinces"
        option-label="name"
        option-value="id"
        v-model="model.province"
        emit-value
        map-options
        @input="onProvinceInput"
        :readonly="readonly"
      />
    </div>
    <div :class="{ 'col-4': rows === 2, 'col-2': rows === 1 }">
      <q-select
        ref="city"
        label="市/县"
        :options="cities"
        option-label="name"
        option-value="id"
        v-model="model.city"
        emit-value
        map-options
        @input="onCityInput"
        :readonly="readonly"
      />
    </div>
    <div :class="{ 'col-4': rows === 2, 'col-2': rows === 1 }">
      <q-select
        ref="town"
        label="地区"
        :options="areas"
        option-label="name"
        option-value="id"
        v-model="model.town"
        emit-value
        map-options
        @input="onTownInput"
        :readonly="readonly"
      />
    </div>
    <div :class="{ 'col-12': rows === 2, 'col-6': rows === 1 }">
      <q-input label="详细地址" v-model="model.address" :readonly="readonly" />
    </div>
  </div>
</template>
<script>
import input from "./mixins/input";
import region from "../utils/region";
export default {
  name: "InputRegion",
  mixins: [input],
  props: {
    rows: {
      type: Number,
      default() {
        return 1;
      },
    },
  },
  data() {
    return {
      model: {
        province: null,
        city: null,
        town: null,
        region: "",
        address: "",
      },
      province: "",
      city: "",
      town: "",
    };
  },
  watch: {
    value(val) {
      if (val) {
        this.model = val;
      }
    },
  },
  mounted() {
    if (this.value) {
      this.model = this.value;
    }
  },
  computed: {
    provinces() {
      return region.provinceOptions;
    },
    cities() {
      return region.getCity(this.model.province);
    },
    areas() {
      return region.getArea(this.model.city);
    },
  },
  methods: {
    onProvinceInput(val) {
      this.model.city = null;
      this.city = "";
      this.model.town = null;
      this.town = "";
      this.model.province = val;
      let item = this.provinces.find((item) => {
        return item.id === val;
      });
      this.province = item ? item.name : "";
      this.updateRegion();
      this.$emit("change", this.model);
    },
    onCityInput(val) {
      this.model.town = null;
      this.town = "";
      this.model.city = val;
      let item = this.cities.find((item) => {
        return item.id === val;
      });
      this.city = item ? item.name : "";
      this.updateRegion();
      this.$emit("change", this.model);
    },
    onTownInput(val) {
      this.model.town = val;
      let item = this.areas.find((item) => {
        return item.id === val;
      });
      this.town = item ? item.name : "";
      this.updateRegion();
      this.$emit("change", this.model);
    },
    updateRegion() {
      this.model.region = this.province + this.city + this.town;
    },
  },
};
</script>
