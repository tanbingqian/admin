<template>
    <el-cascader
        v-model="val"
        :options="typeList"
        :props="{ children: 'model' }"
        @active-item-change="fetchModel"
        :show-all-levels="showAllLevels"
        clearable>
    </el-cascader>
</template>

<script type="text/ecmascript-6">
import { device } from '@/common/api.js'
export default {
    name: 'DeviceModel',
    props: {
        showAllLevels: {
            type: Boolean,
            default: true
        }
    },
    created () {
        this.fetchType()
    },
    data() {
        return {
            typeList: [],
            val: []
        }
    },
    watch: {
        val (newVal, oldVal) {
            this.$emit('choose', newVal)
        }
    },
    methods: {
        // 获取设备类型
        fetchType () {
            this.$axios.post(device.listdevicetype).then(res => {
                if (res.data.state) {
                    var arr = res.data.data
                    arr.forEach(type => {
                        this.typeList.push({
                            label: type.typeName,
                            value: type.uid,
                            model: []
                        })
                    })
                } else {
                   this.$message({
                       type: 'error',
                       message: '获取设备类型列表失败'
                    })
                }
            }).catch(err => {
            })
        },
        // 获取设备型号
        fetchModel (type) {
            const index = this.typeList.findIndex(item => item.value === type.toString())
            this.$axios.post(device.listdevicemodel, {
                typeUid: type.toString(),
                page: 1,
                pageSize: 50
            }).then(res => {
                if (res.data.state) {
                    var modelList = res.data.data
                    this.typeList[index].model = []
                    modelList.forEach(m => {
                        this.typeList[index].model.push({
                            label: m.modelName,
                            value: m.uid
                        })
                    })
                    this.$emit('choose', type)
                } else {
                    this.$message({
                        type: 'error',
                        message: '获取设备型号失败'
                    })
                }
            })
        },
    },
    components: {

    }
}
</script>

<style scoped lang="less">
</style>
