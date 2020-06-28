<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item :label="$t('consumableCode')">
                        <el-input type="text" v-model="params.sn"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('batchNo')">
                        <el-input type="text" v-model="params.batchNo"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('accountName')">
                        <search-name @choose="chooseuser"></search-name>
                    </el-form-item>
                    <el-form-item :label="$t('deviceNo')">
                        <search-device @listdevice="chooseDevice"></search-device>
                    </el-form-item>
                </el-form>
                <div style="margin-top: 10px; text-align: center;">
                    <el-button
                        type="primary"
                        class="el-button-uzien search"
                        @click="fetchData(1, pageSize)"
                        size="small">{{$t('search')}}</el-button>
                    <!-- <el-button
                        type="primary"
                        v-show="_hasPermission('CON_ADD')"
                        class="el-button-uzien search"
                        @click="addConsum = true"
                        size="small">{{ $t('addConsumable') }}</el-button> -->
                </div>
            </div>
            <!-- table表格 -->
            <div class="table-wrap" ref="myTable" v-loading="loading" :element-loading-text="$t('loadingText')">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="sn"
                        :label="$t('consumableCode')"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="batchNo"
                        :label="$t('batchNo')"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="packageSize"
                        align="center"
                        :label="$t('packageSize')">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('state')">
                        <template slot-scope="scope">
                            {{ scope.row.state | consumState }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('isUsed')">
                        <template slot-scope="scope">
                            {{ scope.row.used | consumUsed }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="bindId"
                        align="center"
                        :label="$t('bindId')">
                    </el-table-column>
                    <el-table-column
                        prop="useTime"
                        align="center"
                        :label="$t('bindTime')">
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text" @click="fetchDetail(scope.row.uid)">{{ $t('detail') }}</el-button>
                            <el-button type="text"
                                v-show="_hasPermission('CON_STATE')"
                                @click="setstate(scope.row)"
                                :disabled="scope.row.used === 1">{{ scope.row.state === 1 ? $t('disable') : $t('able') }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页组件 -->
            <pager
                :total="totalCount"
                layout="total, sizes, prev, pager, next, jumper"
                :currentPage="currentPage"
                :pageSize="pageSize"
                :sizes="[20, 50, 100]"
                @getCurrentSize="getCurrentSize"
                @getCurrentPage="getCurrentPage">
            </pager>
            <!-- 详情dialog -->
            <el-dialog :title="$t('consumableDetail')" :visible.sync="showDialog">
                <el-form label-position="left" label-width="100px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="$t('consumableCode') + '：'">{{ detail.sn }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('batchNo') + '：'">{{ detail.batchNo }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('thisBatchNumber') + '：'">{{ detail.snNumber }}</el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="$t('model') + '：'">{{ modelNames }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('packageSize') + '：'">{{ detail.packageSize }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('generateTime') + '：'">{{ detail.createTime }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="$t('usedTimes') + '：'">{{ detail.usedNumber }}</el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('bindId') + '：'">
                                <div style="word-break: break-all">{{ detail.bindId }}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('bindTime') + '：'">{{ detail.useTime }}</el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-button @click="showDialog = false"
                            type="primary" size="small"
                            style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('back') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </el-button>
                        <el-button @click="updateDetail" type="primary" size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
            <el-dialog :visible.sync="addConsum" :title="$t('addConsumable')" width="40%">
                <el-form label-width="80px">
                    <el-row>
                        <el-form-item :label="$t('deviceModel')">
                            <device-model @choose="choose" :show-all-levels="false"></device-model>
                        </el-form-item>
                        <el-form-item :label="$t('consumablePackageSize')">
                            <el-select v-model="code.specificationUid">
                                <el-option v-for="(item, i) in slist" :key="i" :label="item.name" :value="item.uid"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="$t('generateNum')">
                                <el-input v-model="code.number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button
                            type="primary"
                            :loading="generateLoading"
                            @click="generateCode"
                            size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('generateBarCode') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </transition>
</template>
<script>
import Pager from '@/components/common/Pager'
import { device } from '@/common/api.js'
import DeviceModel from '@/components/common/page/deviceModel.vue'
import SearchName from '@/components/common/page/searchUsername.vue'
import SearchDevice from '@/components/common/page/searchDevice.vue'

export default {
    name: 'Consumables',
    props: ['batchNo'],
    created () {
        this.fetchData(this.currentPage, this.pageSize)
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            generateLoading: false,
            params: {
                userUid: '',
                sn: '',
                batchNo: this.batchNo,
                deviceUid: ''
            },
            tableData: [],
            showDialog: false,
            detail: {},
            addConsum: false,
            modelUid: [],
            code: {
                number: '',
                specificationUid: ''
            },
            slist: []
        }
    },
    watch: {
        addConsum (newVal, oldVal) {
            if (!newVal) {
                this.code.number = ''
                this.specificationUid = ''
                this.modelUid = []
            }
        }
    },
    computed: {
        modelNames () {
            if (this.detail.deviceModelList) {
                let str = ''
                this.detail.deviceModelList.forEach(item => {
                    str += item.modelName + ', '
                })
                return str
            } else {
                return this.detail.deviceType ? this.detail.deviceType.typeName : ''
            }
        }
    },
    methods: {
        chooseDevice (val) {
            this.params.deviceUid = val
        },
        chooseuser (val) {
            this.params.userUid = val
        },
        choose (val) {
            this.modelUid = val
            if (val.length === 2) {
                this.listspecification()
            } else {
                this.code.specificationUid = ''
            }
        },
        getCurrentSize (size) {
            this.fetchData(1, size)
        },
        getCurrentPage (num) {
            this.fetchData(num, this.pageSize)
        },
        fetchData (pageNum, pageSize) {
            this.currentPage = pageNum
            this.pageSize = pageSize
            this.loading = true
            this.$axios.post(device.listconsumablessn, {
                page: this.currentPage,
                pageSize: this.pageSize,
                sn: this.params.sn,
                userUid: this.params.userUid,
                deviceUid: this.params.deviceUid,
                batchNo: this.params.batchNo
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.tableData = res.data.data.dataList
                    this.totalCount = res.data.data.totalCount
                }
            }).catch(err => {
                this.loading = false
            })
        },
        fetchDetail (uid) {
            this.showDialog = true
            this.$axios.post(device.getconsumablessn, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.detail = res.data.data
                }
            })
        },
        updateDetail () {
            this.$axios.post(device.updatespecification, this.detail).then(res => {
                if (res.data.state) {
                    this.showDialog = false
                    // 初始化dialog表单数据
                    this.detail = {}
                    this.fetchData(this.currentPage, this.pageSize)
                    this.$message({
                        type: 'success',
                        message: this.$t('operationsuccess')
                    })
                }
            })
        },
        // 查询耗材规格
        listspecification () {
            this.$axios.post(device.listspecification, {
                modelUid: this.modelUid.length > 0 ? this.modelUid[this.modelUid.length - 1] : 0,
            }).then(res => {
                if (res.data.state) {
                    this.slist = res.data.data
                }
            })
        },
        // 设置序列号状态
        setstate (row) {
            this.$axios.post(device.setconsumablessnstate, {
                uid: row.uid,
                state: row.state === 0 ? 1 : 0
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.fetchData(this.currentPage, this.pageSize)
                }
            })
        },
        // 生成条码
        generateCode () {
            this.generateLoading = true
            this.$axios.post(device.generateserialno, this.code)
            .then(res => {
                this.generateLoading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.addConsum = false
                    this.fetchData(this.currentPage, this.pageSize)
                }
            }).catch(err => {
                this.generateLoading = false
            })
        }
    },
    components: {
        Pager,
        DeviceModel,
        SearchName,
        SearchDevice
    }
}
</script>

<style lang="less" scoped>
.pd-t{
    padding-top: 40px;
}
</style>

