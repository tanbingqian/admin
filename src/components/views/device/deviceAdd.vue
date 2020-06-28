<template>
    <div class="device-page">
        <el-row style="margin-bottom: 40px;">
            <el-col style="width: 80px; line-height: 32px;">{{ $t('deviceType') }}</el-col>
            <el-col style="width: 180px; margin-right: 20px;">
                <el-select v-model="type" @change="fetchModel" clearable>
                    <el-option v-for="(type, index) in typeList"
                        :key="index"
                        :label="type.typeName"
                        :value="type.uid">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="10">
                <el-button
                    type="primary"
                    size="small"
                    v-show="_hasPermission('DEVICE_TYPE_ADD')"
                    @click="add('addType')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('addType') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                <el-button
                    type="primary"
                    size="small"
                    v-show="_hasPermission('DEVICE_MODEL_ADD')"
                    @click="add('addModel')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('addModel') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-table :data="modelList">
                <el-table-column :label="$t('deviceCode')" prop="uid"></el-table-column>
                <el-table-column :label="$t('model')" prop="modelName"></el-table-column>
                <el-table-column :label="$t('operation')">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="text"
                            v-show="_hasPermission('DEVICE_MODEL_EDT')"
                            @click="add('editModel', scope.row)">{{ $t('edit') }}</el-button>
                        <el-button
                            size="small"
                            type="text"
                            v-show="_hasPermission('DEVICE_MODEL_DEL')"
                            @click="delModel(scope.row)">{{ $t('delete') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            </el-col>
        </el-row>
        <!-- 新增类型dialog -->
        <el-dialog :visible.sync="showDialog" :title="dialogTitle" width="40%">
            <el-form label-width="80px" label-position="left" :model="form" :rules="rules" ref="subForm">
                <el-form-item :label="formLabel" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-row style="text-align: center;">
                    <el-button type="primary" size="small" @click="save" :loading="loading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { device } from '@/common/api.js'
export default {
    name: 'DeviceAdd',
    created () {
        this.fetchType()
    },
    data () {
        return {
            typeList: [],
            modelList: [],
            type: '',
            loading: false,
            showDialog: false,
            dialogTitle: '',
            formLabel: '',
            form: {
                name: '',
                uid: ''
            },
            flag: '',
            rules: {
                name: [
                    { required: true, message: this.$t('数据不能为空'), trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        showDialog (newVal, oldVal) {
            if (!newVal) {
                this.form.name = ''
            }
        }
    },
    methods: {
        add (flag, model) {
            this.flag = flag
            if (flag === 'addType') {
                // 新增类型
                this.showDialog = true
                this.dialogTitle = this.$t('addDeviceType')
                this.formLabel = this.$t('deviceType')
            } else if (flag === 'addModel') {
                // 新增型号
                if (!this.type) {
                    this.$message({
                        type: 'error',
                        message: this.$t('chooseDeviceType')
                    })
                } else {
                    this.showDialog = true
                    this.dialogTitle = this.$t('addDeviceModel')
                    this.formLabel = this.$t('deviceModel')
                }
            } else if (flag === 'editModel') {
                // 编辑型号
                this.showDialog = true
                this.dialogTitle = this.$t('editDeviceModel')
                this.formLabel = this.$t('deviceModel')
                this.form.name = model.modelName
                this.form.uid = model.uid
            }
        },
        save () {
            this.$refs['subForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    if (this.flag === 'addType') {
                        // 添加类型
                        this.$axios.post(device.savedevicetype, {
                            typeName: this.form.name
                        }).then(res => {
                            this.loading = false
                            if (res.data.state) {
                                this.showDialog = false
                                this.type = ''
                                this.form.name = ''
                                this.fetchType()
                                this.$message({
                                    type: 'success',
                                    message: this.$t('operationSuccess')
                                })
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    } else if (this.flag === 'addModel') {
                        // 添加型号
                        this.$axios.post(device.adddevicemodel, {
                            modelName: this.form.name,
                            typeUid: this.type
                        }).then(res => {
                            this.loading = false
                            if (res.data.state) {
                                this.showDialog = false
                                this.form.name = ''
                                this.fetchModel(this.type)
                                this.$message({
                                    type: 'success',
                                    message: this.$t('operationSuccess')
                                })
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    } else if (this.flag === 'editModel') {
                        this.$axios.post(device.updatedevicemodel, {
                            modelName: this.form.name,
                            uid: this.form.uid
                        }).then(res => {
                            this.loading = false
                            if (res.data.state) {
                                this.showDialog = false
                                this.form.name = ''
                                this.fetchModel(this.type)
                                this.$message({
                                    type: 'success',
                                    message: this.$t('operationSuccess')
                                })
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                }
            })
        },
        fetchType () {
            this.$axios.post(device.listdevicetype).then(res => {
                if (res.data.state) {
                    this.typeList = res.data.data
                }
            })
        },
        fetchModel (typeUid) {
            if (typeUid) {
                this.$axios.post(device.listdevicemodel, {
                    typeUid: typeUid,
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
        delModel (model) {
            this.$confirm(this.$t('sureToDelModel'), this.$t('prompt'), {
                confirmButtonText: this.$t('sure'),
                cancelButtonText: this.$t('cancel')
            }).then(() => {
                this.$axios.post(device.deletedevicemodel, {
                    uid: model.uid
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('delSuccess')
                        })
                        this.fetchModel(this.type)
                    }
                })
            }).catch(() => {})
        }
    }
}
</script>

<style scoped lang="less">
.device-page{
    padding: 40px;
}
</style>
