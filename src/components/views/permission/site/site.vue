<template>
    <transition enter-active-class="animated slideInUp">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-button
                    v-show="_hasPermission('SITE_ADD')"
                    type="primary"
                    class="el-button-uzien"
                    @click="addSite"
                    size="small">{{ $t('addSite') }}</el-button>
            </div>
            <!-- table表格 -->
            <div class="table-wrap" ref="myTable" v-loading="loading" :element-loading-text="$t('loadingText')">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="siteName"
                        :label="$t('siteName')"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="domain"
                        align="center"
                        :label="$t('domain')"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        align="center"
                        :label="$t('adminAccount')">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('state')">
                        <template slot-scope="scope">
                            {{ scope.row.state | siteState }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                v-show="_hasPermission('SITE_EDT')"
                                @click="edit(scope.row)">{{ $t('edit') }}</el-button>
                            <el-button
                                type="text"
                                @click="setSiteState(scope.row)">{{ scope.row.state === 1 ? $t('disable') : $t('able')}}</el-button>
                            <el-button
                                type="text"
                                v-show="_hasPermission('SITE_DEL')"
                                @click="delSite(scope.row)">{{ $t('delete') }}</el-button>
                            <el-button
                                type="text"
                                v-show="_hasPermission('SITE_CHG_PASS')"
                                @click="resetPass(scope.row)">{{ $t('resetPassword') }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 新增站点dialog -->
            <el-dialog :title="dialogTitle" :visible.sync="showDialog" width="40%" :rules="rules" :model="detail">
                <el-form label-position="left" label-width="80px">
                    <el-form-item :label="$t('siteName')" prop="siteName">
                        <el-input v-model="detail.siteName"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('domain')" prop="domain">
                        <el-input v-model="detail.domain"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('username')" prop="username" v-show="flag === 'add'">
                        <el-input v-model="detail.username"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('password')" prop="password" v-show="flag === 'add'">
                        <el-input v-model="detail.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="站点log" v-if="showDialog">
                        <img-gallery :showPreview="true" :imgs="detail.imgs" :fileHost="_fileHost.SHOP_IMAGE" repoType="SHOP_IMAGE"></img-gallery>
                    </el-form-item>
                    <el-row type="flex" justify="center">
                        <el-button @click="showDialog = false" type="primary" size="small" style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('back') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                        <el-button @click="updateDetail" type="primary" size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
            <!-- 重置密码 -->
            <el-dialog :title="$t('resetPassword')" :visible.sync="resetDialog" width="40%">
                <el-form label-width="90px" label-position="left" :model="resetForm" :rules="resetRules" ref="resetForm">
                    <el-form-item :label="$t('adminAccount')">
                        {{ detail.username }}
                    </el-form-item>
                    <el-form-item :label="$t('enterNewPassword')" prop="password">
                        <el-input v-model="resetForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('repeatNewPassword')">
                        <el-input v-model="resetForm.rePassword" type="password"></el-input>
                    </el-form-item>
                    <div style="text-align: center;">
                        <el-button
                            type="primary"
                            @click="confirm"
                            size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('confirm') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </el-button>
                    </div>
                </el-form>
            </el-dialog>
        </div>
    </transition>
</template>
<script>
import { permission } from '@/common/api.js'
import ImgGallery from '@/components/common/upload/imgGallery'
export default {
    name: 'Site',
    created () {
        this.fetchData()
    },
    data () {
        return {
            loading: true,
            saveLoading: false,
            params: {
                code: '',
                aliasName: '',
                state: [],
                startTime: '',
                endTime: ''
            },
            tableData: [],
            showDialog: false,
            resetDialog: false,
            resetForm: {
                password: '',
                rePassword: ''
            },
            flag: '',
            dialogTitle: '',
            detail: {
                domain: '',
                password: '',
                siteName: '',
                username: '',
                imgs: []
            },
            rules: {
                domain: [
                    { required: true, message: this.$t('domainCannotBeNull'), trigger: 'blur' }
                ]
            },
            resetRules: {
                password: [
                    { required: true, message: this.$t('noPass'), trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        fetchData () {
            this.loading = true
            this.$axios.post(permission.listsite).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.tableData = res.data.data
                }
            }).catch(err => {
                this.loading = false
            })
        },
        addSite (uid) {
            this.flag = 'add'
            this.dialogTitle = this.$t('addSite')
            this.showDialog = true
            this.detail = {
                domain: '',
                password: '',
                siteName: '',
                username: '',
                imgs: []
            }
        },
        // 添加站点
        updateDetail () {
            this.saveLoading = true
            if (this.detail.imgs.length > 0) {
                this.detail.imgs.forEach(ele => {
                    this.detail.logo = ele.storageFile || ele
                })
            } else {
                this.detail.logo = ''
            }
            var url = ''
            if (this.flag === 'edit') {
                url = permission.updatesite
            } else {
                url = permission.addsite
            }
            this.$axios.post(url, this.detail).then(res => {
                this.saveLoading = false
                if (res.data.state) {
                    this.showDialog = false
                    // 初始化dialog表单数据
                    this.detail = {}
                    this.fetchData()
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.$store.commit('setSiteLogo', logo)
                }
            })
        },
        // 启用、禁用站点
        setSiteState (row) {
            this.$axios.post(permission.setsitestate, {
                uid: row.uid,
                state: row.state === 1 ? 0 : 1
            }).then(res => {
                if (res.data.state) {
                    this.fetchData()
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                }
            })
        },
        // 删除站点
        delSite (row) {
            this.$confirm(this.$t('readyToDeleteSite'), this.$t('prompt'), {
                confirmButtonText: this.$t('sure'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                this.$axios.post(permission.deletesite, {
                    uid: row.uid
                }).then(res => {
                    if (res.data.state) {
                        this.fetchData()
                        this.$message({
                            type: 'success',
                            message: this.$t('operationSuccess')
                        })
                    }
                })
            })
        },
        // 编辑站点
        edit (row) {
            this.flag = 'edit'
            this.dialogTitle = this.$t('editSite')
            this.$axios.post(permission.getsite, {
                uid: row.uid
            }).then(res => {
                if (res.data.state) {
                    this.showDialog = true
                    this.detail = res.data.data
                    this.$set(this.detail, 'imgs', [])
                    if (res.data.data.logo) {
                        this.detail.imgs.push(res.data.data.logo)
                    }
                }
            })
        },
        // 重置密码
        resetPass (row) {
            this.detail = row
            this.resetDialog = true
        },
        // 确认密码
        confirm () {
            this.$axios.post(permission.resetadminpassword, {
                siteUid: this.detail.uid,
                password: this.resetForm.password,
                rePassword: this.resetForm.rePassword
            }).then(res => {
                if (res.data.state) {
                    this.resetDialog = false
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                }
            })
        }
    },
    components: {
        ImgGallery
    }
}
</script>

<style lang="less" scoped>
.pd-t{
    padding-top: 40px;
}
</style>

