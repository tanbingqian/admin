<template>
    <el-select filterable remote :remote-method="listdevice" v-model="uid" clearable>
        <el-option v-for="(u, i) in List" :key="i" :label="u.sn" :value="u.uid"></el-option>
    </el-select>
</template>

<script type="text/ecmascript-6">
import { device } from '@/common/api.js'
import _ from 'underscore'
export default {
    data() {
        return {
            uid: '',
            List: []
        }
    },
    watch: {
        uid (newVal, oldVal) {
            this.$emit('listdevice', newVal)
        }
    },
    methods: {
        listdevice: _.debounce(function (val) {
            this.$axios.post(device.listdevice, {
                sn: val,
                page: 1,
                pageSize: 100
            }).then(res => {
                if (res.data.state) {
                    this.List = res.data.data.dataList
                } else {
                    this.List = []
                }
            })
        }, 100)
    }
}
</script>

<style scoped lang="less">
</style>
