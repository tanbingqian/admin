<template>
    <el-cascader
        style="width: 240px"
        v-bind:city="city"
        :placeholder="placeholder"
        :options="cities"
        :props="defaultProps"
        @change="handleChange"
        @active-item-change="handleItemChange"></el-cascader>
</template>

<script type="text/ecmascript-6">
import { base }from '@/common/api.js'
export default {
    name: 'City',
    model: {
        prop: 'city',
        event: 'choose'
    },
    props: ['city','placeholder'],
    created () {
        this.handleItemChange([0])
    },
    data() {
        return {
            cities: [],
            defaultProps: {
                label: 'cityName',
                value: 'cityId',
                children: 'children'
            }
        }
    },
    methods: {
        handleChange (val) {
            this.$emit('choose', val)
        },
        handleItemChange (val) {
            if (val.length === 0) {
                // 清除选择
                // this.$emit('choose', [])
            } else {
                this.$axios.post(base.listcity, {
                    parentUid: val[val.length - 1]
                }).then(res => {
                    if (res.data.state) {
                        const arr = res.data.data
                        const currId = val[val.length - 1]
                        const city = this.searchCity(val, this.cities)
                        if (city) {
                            // 判断是否有返回值
                            if (arr && arr.length > 0) {
                                city.children = []
                                arr.forEach(item => {
                                    city.children.push({
                                        cityId: item.cityId,
                                        parentCityId: item.parentCityId,
                                        cityName: item.cityName,
                                        children: []
                                    })
                                })
                            } else {
                                city.children = null
                            }

                        } else {
                            arr.forEach(item => {
                                this.cities.push({
                                    cityId: item.cityId,
                                    parentCityId: item.parentCityId,
                                    cityName: item.cityName,
                                    children: []
                                })
                            })
                        }
                        // this.$emit('choose', val)
                    }
                })
            }
        },
        // 递归查询城市列表中当前查询的城市
        searchCity (ids, arr) {
            const length = ids.length
            let p = 0
            // 先查询出省
            let data = null
            if (arr.length <= 0) {
                return null
            } else {
                for (let i = 0; i < arr.length; i++) {
                    if (ids[p] === arr[i].cityId) {
                        data = arr[i]
                        p++
                        break
                    }
                }
            }
            while (p < ids.length) {
                if (data.children) {
                    for (let i = 0; i < data.children.length; i++) {
                        if (data.children[i].cityId === ids[p]) {
                            data = data.children[i]
                            p++
                            break
                        }
                    }
                }
            }
            return data
        }
    }
}
</script>

<style scoped lang="less">
</style>
