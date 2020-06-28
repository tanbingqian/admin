<template>
    <div class="page-wrap">
        <div style="margin-bottom: 20px;">
            <el-form :inline="true">
                <el-form-item :label="$t('deviceType')">
                    <el-select v-model="typeUid" clearable @change="fetchModel">
                        <el-option v-for="(type, i) in typeList" :key="i" :label="type.typeName" :value="type.uid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceModel')">
                    <el-select v-model="model" clearable>
                        <el-option v-for="(type, i) in modelList" :key="i" :label="type.modelName" :value="type.uid"></el-option>
                    </el-select>
                    <el-button type="primary" size="small" @click="listspecification"> {{ $t('search') }} </el-button>
                    <el-button
                        type="primary"
                        size="small"
                        v-show="_hasPermission('CON_SPEC_ADD')"
                        @click="addconsum"> + {{ $t('addConsumablePackageSize') }} </el-button>
                </el-form-item>
            </el-form>

        </div>
        <el-col :span="18">
            <el-table :data="table">
                <el-table-column label="ID" prop="uid" align="center"></el-table-column>
                <el-table-column :label="$t('deviceType')" prop="deviceType" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deviceType">{{ scope.row.deviceType.typeName }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('standardName')" prop="name" align="center"></el-table-column>
                <el-table-column :label="$t('quantity')" prop="packageSize" align="center"></el-table-column>
                <el-table-column :label="$t('deviceModel')" prop="deviceModels" align="center">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.deviceModels"
                            v-for="item in scope.row.deviceModels"
                            :key="item.uid">{{ item.modelName + '，' }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('operation')" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-show="_hasPermission('CON_SPEC_EDT')"
                            @click="edit(scope.row)">{{ $t('edit') }}</el-button>
                        <el-button
                            type="text"
                            v-show="_hasPermission('CON_SPEC_DEL')"
                            @click="del(scope.row)">{{ $t('delete') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-col>
        <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="40%">
            <el-form label-width="80px" :model="form" :rules="rules" ref="form">
                <el-form-item :label="$t('deviceType')" prop="typeUid">
                    <el-select v-model="form.typeUid" @change="fetchModel">
                        <el-option v-for="(type, i) in typeList" :key="i" :label="type.typeName" :value="type.uid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceModel')">
                    <el-checkbox-group v-model="form.modelUidList" v-show="form.typeUid">
                        <el-checkbox label="all" :disabled="form.modelUidList.length > 0 && form.modelUidList.indexOf('all') < 0">{{ $t('allModel') }}</el-checkbox>
                        <el-checkbox v-for="(model, i) in modelList" :label="model.uid" :key="i" :disabled="form.modelUidList.indexOf('all') > -1">{{ model.modelName }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('standardName')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('quantity')" prop="packageSize">
                    <el-input v-model.number="form.packageSize"></el-input>
                </el-form-item>

                <el-form-item label=" ">
                    <el-row style="display: flex; justify-content: space-between;">
                        <el-button
                            type="primary"
                            size="small"
                            @click="showDialog = false">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('cancel') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </el-button>
                        <el-button
                            type="primary"
                            @click="save"
                            :loading="loading"
                            size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </el-button>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { device } from '@/common/api.js'
import DeviceModel from '@/components/common/page/deviceModel.vue'
import { checkCount } from '@/common/utils/validate.js'
export default {
    name: 'Listspecification',
    created () {
        this.listspecification()
        this.fetchType()
    },
    data() {
        return {
            showDialog: false,
            table: [],
            modelUid: [],
            typeUid: '',
            model: '',
            typeList: [],
            modelList: [],
            loading: false,
            flag: '',
            dialogTitle: '',
            form: {
                typeUid: '',
                packageSize: '',
                name: '',
                modelUidList: [],
                uid: ''
            },
            rules: {
                packageSize: [
                    { required: true, message: this.$t('numberNotNull'), trigger: 'blur' },
                    { validator: checkCount, trigger: 'blur' }
                ],
                name: [
                    { required: true, message: this.$t('standardNameNotNull'), trigger: 'blur' }
                ],
                typeUid: [
                    { required: true, message: this.$t('chooseDeviceType'), trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        typeUid (newVal, oldVal) {
            if (newVal === '') {
                this.modelList = []
                this.model = ''
            }
        },
        showDialog (newVal, oldVal) {
            if (!newVal) {
                this.form.typeUid = ''
                this.form.packageSize = ''
                this.form.uid = ''
                this.form.name = ''
                this.form.modelUidList = []

            }
        }
    },
    methods: {
        edit (row) {
            this.flag = 'edit'
            this.dialogTitle = this.$t('editConsumablePackageSize')
            this.form.name = row.name
            this.form.packageSize = row.packageSize
            this.form.uid = row.uid
            if (row.deviceModels) {
                row.deviceModels.forEach(item => {
                    this.form.modelUidList.push(item.uid)
                    this.form.typeUid = item.typeUid
                })
                this.fetchModel(this.form.typeUid, true)
            }
            if (row.deviceType) {
                this.form.typeUid = row.deviceType.uid
                this.fetchModel(this.form.typeUid, true)
            }
            this.showDialog = true
        },
        addconsum () {
            this.flag = 'add'
            this.dialogTitle = this.$t('addConsumablePackageSize')
            this.showDialog = true
        },
        // 保存耗材
        save () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.loading = true
                    let params = {}
                    if (this.form.modelUidList.length > 0 && this.form.modelUidList.indexOf('all') < 0) {
                        params = {
                            modelUidList: this.form.modelUidList,
                            packageSize: this.form.packageSize,
                            name: this.form.name
                        }
                    } else {
                        params = {
                            typeUid: this.form.typeUid,
                            packageSize: this.form.packageSize,
                            name: this.form.name
                        }
                    }
                    if (this.flag === 'add') {
                        this.$axios.post(device.addspecification, params).then(res => {
                            this.loading = false
                            if (res.data.state) {
                                this.$message({
                                    type: 'success',
                                    message: this.$t('operationSuccess')
                                })
                                this.showDialog = false
                                this.listspecification()
                            } else {}
                        }).catch(err => {
                            this.loading = false
                        })
                    } else if (this.flag === 'edit') {
                        this.$axios.post(device.updatespecification, Object.assign({
                            uid: this.form.uid
                        }, params)).then(res => {
                            this.loading = false
                            if (res.data.state) {
                                this.$message({
                                    type: 'success',
                                    message: this.$t('operationSuccess')
                                })
                                this.showDialog = false
                                this.listspecification()
                            } else {}
                        }).catch(err => {
                            this.loading = false
                        })
                    }
                }
            })
        },
        listspecification () {
            this.$axios.post(device.listspecification, {
                modelUid: this.model ? this.model : 0,
                typeUid: this.typeUid ? this.typeUid : 0,
            }).then(res => {
                if (res.data.state) {
                    this.table = res.data.data
                }
            })
        },
        // 获取设备类型
        fetchType () {
            this.$axios.post(device.listdevicetype).then(res => {
                if (res.data.state) {
                    this.typeList = res.data.data
                }
            }).catch(err => {
            })
        },
        // 获取设备型号
        fetchModel (type, flag) {
            this.model = ''
            if (!flag) {
                this.form.modelUidList = []
            }
            if (type !== '') {
                this.$axios.post(device.listdevicemodel, {
                    typeUid: type.toString(),
                    page: 1,
                    pageSize: 50
                }).then(res => {
                    if (res.data.state) {
                        this.modelList = res.data.data
                    }
                })
            }
        },
        del (row) {
            this.$confirm(this.$t('sureToDeleteStandard'), this.$t('prompt'), {
                confirmButtonText: this.$t('sure'),
                cancelButtonText: this.$t('cancel')
            }).then(() => {
                this.$axios.post(device.deletespecification, {
                    uid: row.uid
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('delSuccess')
                        })
                        this.listspecification()
                    }
                })
            })
        }
    },
    components: {
        DeviceModel
    }
}
</script>

<style scoped lang="less">
</style>
