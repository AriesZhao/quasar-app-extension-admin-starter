import { country } from './country'
import { province } from './province'
import { city } from './city'

import { countryObject } from './country_object'
import { provinceObject } from './province_object'
import { cityObject } from './city_object'

export default {
  provinceOptions: province,
  cityOptions: city,
  areaOptions: country,
  getCity (provinceId) {
    return provinceId ? city[provinceId] : []
  },
  getArea (cityId) {
    return cityId ? country[cityId] : []
  },
  getProvinceObject (id) {
    return provinceObject[id] || ''
  },
  getCityObject (id) {
    return cityObject[id] || ''
  },
  getAreaObject (id) {
    return countryObject[id] || ''
  }
}
