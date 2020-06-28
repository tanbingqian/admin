<template>
    <div class="device-regist">
        <el-form label-width="80px" label-position="left" :inline="true">
            <el-row>
                <el-form-item :label="$t('deviceType')">
                    <el-select v-model="type" @change="fetchModel">
                        <el-option v-for="(type, index) in typeList"
                            :key="index"
                            :label="type.typeName"
                            :value="type.uid"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceModel')">
                    <el-select v-model="model">
                        <el-option v-for="(type, index) in modelList" :key="index" :label="type.modelName" :value="type.uid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button
                        type="primary"
                        size="small"
                        v-show="_hasPermission('DEVICE_REG')"
                        @click="active">{{ $t('startRegist') }}</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
import { device } from '@/common/api.js'
export default {
    name: 'DeviceRegist',
    created () {
        this.fetchType()
    },
    data() {
        return {
            typeList: [],
            modelList: [],
            type: '',
            model: ''
        }
    },
    methods: {
        fetchType () {
            this.$axios.post(device.listdevicetype).then(res => {
                if (res.data.state) {
                    this.typeList = res.data.data
                }
            })
        },
        fetchModel (type) {
            if (type) {
                this.$axios.post(device.listdevicemodel, {
                    typeUid: type,
                    page: 1,
                    pageSize: 50
                }).then(res => {
                    if (res.data.state) {
                        this.modelList = res.data.data
                    }
                })
            } else {
                this.modelList = []
            }

        },
        active () {
            if (this.type && this.model) {
                // 查询对应的名称传递到激活页面
                var typeName = ''
                var modelName = ''
                this.typeList.forEach(type => {
                    if (type.uid === this.type) {
                        typeName = type.typeName
                    }
                })
                this.modelList.forEach(model => {
                    if (this.model === model.uid) {
                        modelName = model.modelName
                    }
                })
                this.$router.push({
                    path: '/deviceRegistSN/' + this.type +'/' + this.model + '?typeName=' + typeName + '&modelName=' + modelName
                })
            } else {
                this.$message({
                    type: 'error',
                    message: this.$t('chooseModelAndType')
                })
            }

        }
    }
}
</script>

<style scoped lang="less">
.device-regist{
    padding-top: 40px;
    padding-left: 40px;
}
</style>
