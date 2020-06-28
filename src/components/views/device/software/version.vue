<template>
    <transition enter-active-class="animated fadeInLeft">
        <div>
            <p style="border-bottom: 1px solid #f6f6f6;margin: 0; padding: 10px; font-size: 16px;">
                <el-button
                    type="text"
                    size="small"
                    v-show="_hasPermission('DEV_SOFT_ADD')"
                    @click="addVersion" plain>+ {{ $t('addVersion') }}</el-button>
            </p>
            <el-table :data="tableData">
                <el-table-column :label="$t('version')" prop="version"></el-table-column>
                <el-table-column :label="$t('downloadUrl')" prop="fileUrl"></el-table-column>
                <el-table-column :label="$t('type')">
                    <template slot-scope="scope">
                        {{ scope.row.versionType | versionType }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('explain')" prop="comment"></el-table-column>
                <el-table-column :label="$t('state')" prop="state">
                    <template slot-scope="scope">
                        {{ scope.row.state | versionState }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('operation')">
                    <template slot-scope="scope">
                        <el-button type="text" @click="setsoftwarestate(scope.row)">{{ scope.row.state === 1 ? $t('disable') : $t('able') }}</el-button>
                        <el-button
                            type="text"
                            v-show="_hasPermission('DEV_SOFT_EDT')"
                            @click="update(scope.row)">{{ $t('edit') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :title="$t('softwareVersionDetail')" :visible.sync="showDialog">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="$t('version')">
                                <el-input v-model="form.version"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('downloadUrl')">
                                <el-input v-model="form.fileUrl"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item :label="$t('explain')">
                            <el-input type="textarea" :rows="3" v-model="form.comment"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="$t('type')">
                                <el-radio label="GA" v-model="form.versionType">{{ $t('generalVersion') }}</el-radio>
                                <el-radio label="PREVIEW" v-model="form.versionType">{{ $t('previewVersion') }}</el-radio>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('state')">
                                <el-radio :label="1" v-model="form.state">{{ $t('disable') }}</el-radio>
                                <el-radio :label="0" v-model="form.state">{{ $t('able') }}</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="text-align: center">
                        <el-button type="primary" size="small" @click="saveVersion" :loading="loading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
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
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import Pager from '@/components/common/Pager'
import { device } from '@/common/api.js'
export default {
    props: ['uid'],
    name: 'modelVersion',
    created () {
        if (this.uid) {
            this.fetchData(1, this.pageSize)
        }
    },
    data() {
        return {
            showDialog: false,
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            tableData: [],
            dialogTitle: '',
            loading: false,
            form: {
                fileUrl: '',
                modelUid: this.uid,
                version: '',
                versionType: '',
                comment: ''
            },
            flag: ''
        }
    },
    watch: {
        showDialog (newVal, oldVal) {
            if (!newVal) {
                this.form = {
                    fileUrl: '',
                    modelUid: this.uid,
                    version: '',
                    versionType: ''
                }
            }
        },
        uid (newVal, oldVal) {
            if (newVal) {
                this.fetchData(1, this.pageSize)
            } else {
                this.tableData = []
            }
        }
    },
    methods: {
        setsoftwarestate (row) {
            this.$axios.post(device.setsoftwarestate, {
                state: row.state === 0 ? 1 : 0,
                uid: row.uid
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
        addVersion () {
            this.flag = 'add'
            if (this.uid.length === 0) {
                this.$message({
                    type: 'error',
                    message: this.$t('chooseDeviceModel')
                })
                return
            }
            this.showDialog = true
            this.dialogTitle = this.$t('addVersion')
        },
        saveVersion () {
            this.loading = true
            if (this.flag === 'add') {
                this.$axios.post(device.addsoftware, {
                    fileUrl: this.form.fileUrl,
                    modelUid: this.uid,
                    version: this.form.version,
                    versionType: this.form.versionType,
                    comment: this.form.comment
                }).then(res => {
                    this.loading = false
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('operationSuccess')
                        })
                        this.showDialog = false
                        this.fetchData(this.currentPage, this.pageSize)
                    } else {
                        this.loading = false
                    }
                }).catch(err => {
                    this.loading = false
                })
            } else if (this.flag === 'edit') {
                this.$axios.post(device.updatesoftware, {
                    fileUrl: this.form.fileUrl,
                    modelUid: this.uid,
                    version: this.form.version,
                    versionType: this.form.versionType,
                    state: this.form.state,
                    uid: this.form.uid,
                    comment: this.form.comment
                }).then(res => {
                    this.loading = false
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('operationSuccess')
                        })
                        this.showDialog = false
                        this.fetchData(this.currentPage, this.pageSize)
                    } else {
                        this.loading = false
                    }
                }).catch(err => {
                    this.loading = false
                })
            }
        },
        update (row) {
            this.flag = 'edit'
            this.showDialog = true
            this.dialogTitle = this.$t('editVersion')
            this.form = row
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
            this.$axios.post(device.listsoftware, {
                modelUid: this.uid,
                page: this.currentPage,
                pageSize: this.pageSize
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
    },
    components: {
        Pager
    }
}
</script>

<style scoped lang="less">
</style>
