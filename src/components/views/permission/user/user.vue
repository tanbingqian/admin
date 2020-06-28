<template>
    <transition enter-active-class="animated slideInUp">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item :label="$t('username')">
                        <el-input type="text" v-model="params.username"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('nickName')">
                        <el-input type="text" v-model="params.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('state')">
                        <el-checkbox-group v-model="params.state" :max="1">
                            <el-checkbox :label="1">{{ $t('able') }}</el-checkbox>
                            <el-checkbox :label="0">{{ $t('disable') }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div class="center">
                    <el-button
                        type="primary"
                        class="el-button-uzien search"
                        v-show="_hasPermission('USER_ADD')"
                        size="small" @click="add">{{ $t('createAccount') }}</el-button>
                    <el-button
                        type="primary"
                        class="el-button-uzien search"
                        @click="fetchData(1, pageSize)"
                        size="small">{{$t('search')}}</el-button>
                </div>
            </div>
            <!-- table表格 -->
            <div class="table-wrap" ref="myTable" v-loading="loading" :element-loading-text="$t('loadingText')">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="uid"
                        label="UID"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        align="center"
                        :label="$t('username')"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        align="center"
                        :label="$t('nickName')">
                    </el-table-column>
                    <el-table-column
                        prop="cellphone"
                        align="center"
                        :label="$t('phoneNum')">
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        align="center"
                        :label="$t('email')">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('state')">
                        <template slot-scope="scope">
                            {{ scope.row.state | userState }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text"
                                v-show="_hasPermission('USER_EDT')"
                                @click="fetchDetail(scope.row)">{{ $t('edit') }}</el-button>
                            <el-button type="text"
                                :disabled="scope.row.mainUid === scope.row.uid"
                                @click="setUserState(scope.row)">{{ scope.row.state === 1 ? $t('disable') : $t('able') }}</el-button>
                            <el-button type="text"
                                v-show="_hasPermission('USER_DEL')"
                                :disabled="scope.row.mainUid === scope.row.uid"
                                @click="deleteUser(scope.row)">{{ $t('delete') }}</el-button>
                            <!-- <el-button type="text" @click="passDialog = true">修改密码</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页组件 -->
            <!-- 创建或编辑账户dialog -->
            <el-dialog :title="userDialogTitle" :visible.sync="userDialog" width="40%">
                <el-form label-position="left" label-width="80px" :model="user" :rules="userRules" ref="userForm">
                    <el-form-item :label="$t('username')" prop="username">
                        <el-input v-model="user.username"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('password')" prop="password" v-if="!user.uid">
                        <el-input v-model="user.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('password')" v-else>
                        <el-input v-model="user.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('nickName')" prop="name">
                        <el-input v-model="user.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('email')" prop="email">
                        <el-input v-model="user.email"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('phoneNum')" prop="cellphone">
                        <el-input v-model="user.cellphone"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('role')" prop="roleUidList" v-if="user.uid !== user.mainUid && _hasPermission('USER_ROLE')">
                        <el-checkbox-group v-model="user.roleUidList">
                            <el-checkbox v-for="(c, index) in roleList" :key="index" :label="c.uid">{{ c.roleName }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-row type="flex" justify="center">
                        <el-button
                            @click="userDialog = false"
                            type="primary"
                            size="small"
                            style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('back') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                        <el-button type="primary"
                            size="small"
                            :loading="userLoading"
                            @click="save">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
            <!-- 修改密码dialog -->
            <el-dialog :title="$t('updatePassword')" width="40%" :visible.sync="passDialog">
                <el-form label-position="left" label-width="80px">
                    <el-form-item :label="$t('username')">
                        XXXXX
                    </el-form-item>
                    <el-form-item :label="$t('enterNewPassword')">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('repeatNewPassword')">
                        <el-input></el-input>
                    </el-form-item>
                    <el-row type="flex" justify="center">
                        <el-button
                            type="primary"
                            size="small"
                            @click="passDialog = false"
                            style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('back') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                        <el-button
                            type="primary"
                            size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </transition>
</template>
<script>
import Pager from '@/components/common/Pager'
import { permission } from '@/common/api.js'
export default {
    name: 'User',
    created () {
        this.fetchData(this.currentPage, this.pageSize)
        this.listrole()
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            userLoading: false,
            params: {
                name: '',
                username: '',
                state: []
            },
            tableData: [],
            userDialog: false,
            userDialogTitle: '',
            passDialog: false,
            user: {
                cellphone: '',
                email: '',
                name: '',
                nick: '',
                password: '',
                username: '',
                roleUidList: [],
                mainUid: 0,
                siteUid: 0
            },
            roleList: [],
            userRules: {
                username: [
                    { required: true, message: this.$t('accountNotNull'), trigger: 'blur' },
                    { min: 5, message: this.$t('atLeastFiveWord'), trigger: 'blur' }
                ],
                password: [
                    { required: true, message: this.$t('passwordNotNull'), trigger: 'blur' }
                ],
                name: [
                    { required: true, message: this.$t('usernameNotNull'), trigger: 'blur' },
                    { min: 2, message: this.$t('atLeastTwoWord'), trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        userDialog (newVal, oldVal) {
            if (!newVal) {
                this.initUser()
            }
        }
    },
    methods: {
        // 获取角色列表
        listrole () {
            this.$axios.post(permission.listrole).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.roleList = res.data.data
                }
            }).catch(err => {
                this.loading = false
            })
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
            this.$axios.post(permission.listuser, {
                name: this.params.name,
                username: this.params.username,
                state: this.params.state.toString(),
                page: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.tableData = res.data.data
                    this.totalCount = res.data.data.totalCount
                }
            }).catch(err => {
                this.loading = false
            })
        },
        add () {
            this.userDialogTitle = this.$t('createAccount')
            this.userDialog = true
        },
        // 编辑用户
        fetchDetail (row) {
            this.userDialogTitle = this.$t('editAccount')
            this.userDialog = true
            this.$axios.post(permission.getuser, {
                privilege: true,
                uid: row.uid
            }).then(res => {
                if (res.data.state) {
                    this.user = res.data.data.user
                    this.$set(this.user, 'roleUidList', res.data.data.roles)
                }
            })
        },
        // 初始化保存用户表单
        initUser () {
            this.user = {
                cellphone: '',
                email: '',
                name: '',
                nick: '',
                password: '',
                username: '',
                roleUidList: [],
                mainUid: 0,
                siteUid: 0
            }
        },
        // 保存用户
        save () {
            this.$refs['userForm'].validate(valid => {
                if (valid) {
                    var url =''
                    var params = ''
                    this.user.nick = this.user.name
                    if (!this.user.uid) {
                        url = permission.adduser
                        params = {
                            cellphone: this.user.cellphone,
                            email: this.user.email,
                            name: this.user.name,
                            nick: this.user.nick,
                            password: this.user.password,
                            roleUidList: this.user.roleUidList,
                            uid: this.user.uid,
                            username: this.user.username,
                            mainUid: 0,
                            siteUid: 0
                        }
                    } else {
                        url = permission.updateuser
                        params = {
                            cellphone: this.user.cellphone,
                            email: this.user.email,
                            name: this.user.name,
                            password: this.user.password,
                            roleIdList: this.user.roleUidList,
                            uid: this.user.uid,
                            username: this.user.username
                        }
                    }
                    this.userLoading = true
                    this.$axios.post(url, params).then(res => {
                        this.userLoading = false
                        if (res.data.state) {
                            // 初始化dialog表单数据
                            this.fetchData(this.currentPage, this.pageSize)
                            this.userDialog = false
                            this.$message({
                                type: 'success',
                                message: this.$t('operationSuccess')
                            })
                        }
                    }).catch(err => {
                        this.userLoading = false
                    })
                }
            })
        },
        // 设置用户状态
        setUserState (row) {
            this.$axios.post(permission.setuserstate, {
                uid: row.uid,
                state: row.state === 1 ? 0 : 1
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.fetchData()
                }
            })
        },
        // 删除用户
        deleteUser (row) {
            this.$confirm(this.$t('readyToDeleteAccount'), this.$t('prompt'), {
                confirmButtonText: this.$t('sure'),
                cancelButtonText: this.$t('cancel')
            }).then(res => {
                this.$axios.post(permission.deleteuser, {
                    uid: row.uid
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('delSuccess')
                        })
                        this.fetchData()
                    }
                })
            })
        }
    },
    components: {
        Pager
    }
}
</script>

<style lang="less" scoped>
.pd-t{
    padding-top: 40px;
}
</style>

