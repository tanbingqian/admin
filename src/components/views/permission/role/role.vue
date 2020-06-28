<template>
    <div class="page-wrap">
        <div class="search-wrap">
            <el-button
                type="primary"
                size="small"
                v-show="_hasPermission('ROLE_ADD')"
                @click="add">{{ $t('addRole') }}</el-button>
        </div>
        <div class="table-wrap" v-loading="loading" :element-loading-text="$t('loadingText')">
            <el-table :data="data">
                <el-table-column :label="$t('roleId')" prop="uid"></el-table-column>
                <el-table-column :label="$t('roleName')" prop="roleName"></el-table-column>
                <el-table-column label="说明" prop="comment"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)" v-show="_hasPermission('ROLE_EDT')">编辑</el-button>
                        <el-button type="text" @click="delRole(scope.row.uid)" v-show="_hasPermission('ROLE_DEL')">删除</el-button>
                        <el-button type="text" @click="fetchPermission(scope.row)" v-show="_hasPermission('ROLE_FUNCTION')">权限</el-button>
                        <el-button type="text" @click="fetchUserList(scope.row)">用户列表</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 新增角色 -->
        <el-dialog :visible.sync="addDialog" :title="roleTitle" width="40%">
            <el-form ref="roleForm" :rules="rules" :model="form" label-width="80px">
                <el-form-item :label="$t('roleName')" prop="roleName">
                    <el-input v-model="form.roleName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('comment')" prop="comment">
                    <el-input v-model="form.comment"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="small"
                        @click="cancel">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('cancel') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button type="primary" size="small"
                        @click="saveRole" :loading="saveLoading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 角色用户列表 -->
        <el-dialog :visible.sync="userDialog">
            <div>
                <span class="title">{{ selectData.roleName }}</span>
                <el-button type="text" v-show="_hasPermission('USER_ADD')" @click="addUserDialog = true">  {{ $t('addUser') }}</el-button>
            </div>
            <el-table :data="userList">
                <el-table-column :label="$t('username')" align="center" prop="username"></el-table-column>
                <el-table-column :label="$t('nickName')" align="center" prop="nick"></el-table-column>
                <el-table-column :label="$t('phoneNum')" align="center" prop="cellphone"></el-table-column>
                <el-table-column :label="$t('email')" align="center" prop="email"></el-table-column>
                <el-table-column :label="$t('operation')" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="remove(scope.row)">{{ $t('remove') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 权限dialog-->
        <el-dialog :visible.sync="permissionDialog" :title="$t('settings') + selectData.roleName + $t('permission')">
            <el-tree v-if="permissionDialog"
                ref="tree"
                show-checkbox
                lazy
                :props="treeProps"
                :load="loadNode"
                @check="checkRoleId"
                node-key="uid" check-strictly>
                <span slot-scope="{ node, data }">
                    <span :class="{ isFunc: data.functionCode }">{{ data.label }}</span>
                </span>
            </el-tree>
            <div style="text-align: center; margin-top: 20px;">
                <el-button
                    type="primary"
                    size="small"
                    :loading="loading"
                    @click="save">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('confirm') }}&nbsp;&nbsp;&nbsp;&nbsp;
                </el-button>
            </div>
        </el-dialog>
        <!-- 添加用户dialog -->
        <el-dialog :visible.sync="addUserDialog" :title="$t('add') + selectData.roleName" width="40%">
            <el-form label-width="80px">
                <!-- <el-form-item label="用户账号">
                    <el-input></el-input>
                </el-form-item> -->
                <el-form-item label="姓名">
                    <el-select :loading="searchLoading" :placeholder="$t('searchByName')" v-model="searchUserList" filterable remote :remote-method="searchUser">
                        <el-option v-for="(item, index) in nameList" :key="index" :label="item.name" :value="item.uid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="small" @click="addUserDialog = false">{{ $t('cancel') }}</el-button>
                    <el-button type="primary" size="small" @click="saveAddUSer" :loading="saveAddUserLoading">{{ $t('save') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { permission } from '@/common/api.js'
import _ from 'underscore'
export default {
    name: 'Role',
    created () {
        this.fetchData()
    },
    data() {
        return {
            data: [],
            loading: false,
            saveLoading: false,
            searchLoading: false,
            addDialog: false,
            userDialog: false,
            selectData: {},
            permissionDialog: false,
            flag: '',
            roleTitle: '',
            form: {
                roleName: '',
                comment: ''
            },
            user: {},
            treeProps: {
                label: 'label',
                children: 'children',
                isLeaf: 'leaf'
            },
            checkedFuncUids: [],
            userList: [],
            addUserDialog: false,
            searchUserList: '',
            nameList: [],
            saveAddUserLoading: false,
            rules: {
                roleName: [
                    { required: true, message: this.$t('roleNameCannotBeNull'), trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        userDialog (newVal, oldVal) {
            this.userList = []
        },
        addUserDialog (newVal, oldVal) {
            if (!newVal) {
                this.searchUserList = ''
            }
        }
    },
    methods: {
        // 单击checkbox
        checkRoleId (data, node) {
            const index = this.checkedFuncUids.indexOf(data.uid)
            if (index > -1) {
                this.checkedFuncUids.splice(index, 1)
            } else {
                this.checkedFuncUids.push(data.uid)
            }
        },
        // 点击新增角色按钮
        add () {
            this.addDialog = true
            this.flag = 'add'
            this.roleTitle = this.$t('addRole')
            this.form = {
                roleName: '',
                comment: ''
            }
        },
        edit (row) {
            this.flag = 'edit'
            this.form = row
            this.roleTitle = this.$t('editRole')
            this.addDialog = true
        },
        cancel () {
            this.addDialog = false
        },
        fetchData () {
            this.$axios.post(permission.listrole).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.data = res.data.data
                }
            }).catch(err => {
                this.loading = false
            })
        },
        saveRole () {
            this.$refs['roleForm'].validate(valid => {
                if (valid) {
                    this.saveLoading = true
                    var url = ''
                    if (this.flag === 'add') {
                        // 新增角色
                        url = permission.addrole
                    } else {
                        // 编辑角色
                        url = permission.updaterole
                    }
                    this.$axios.post(url, this.form).then(res => {
                        this.saveLoading = false
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: this.$t('operationSuccess')
                            })
                            this.addDialog = false
                            this.fetchData()
                        }
                    }).catch(err => {
                        this.saveLoading = false
                    })
                }
            })
        },
        delRole (uid) {
            this.$confirm(this.$t('readyToDeleteRole'), this.$t('prompt'), {
                confirmButtonText: this.$t('sure'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                this.$axios.post(permission.deleterole, {
                    uid: uid
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
        },
        // 获取用户列表
        fetchUserList (row) {
            this.selectData = row
            this.userDialog = true
            this.$axios.post(permission.listusersofrole, {
                uid: row.uid
            }).then(res => {
                if (res.data.state) {
                    this.userList = res.data.data
                }
            })
        },
        // 移除用户
        remove (row) {
            this.$axios.post(permission.unbinduserrole, {
                roleUid: this.selectData.uid,
                userUid: row.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.fetchUserList(this.selectData)
                }
            })
        },
        // 设置角色权限
        fetchPermission (row) {
            this.selectData = row
            this.checkedFuncUids = []
            this.$axios.post(permission.listrolefunction, {
                uid: row.uid
            }).then(res => {
                if (res.data.state) {
                    this.permissionDialog = true
                    const arr = res.data.data
                    arr.forEach(row => {
                        this.checkedFuncUids.push(row.uid)
                    })
                }
            })
        },
        // 懒加载节点数据
        loadNode (node, resolve) {
            if (node.level === 0) {
                // 加载顶级功能组
                this.fetchGroupList(node).then(res => {
                    const arr = res
                    const resolveArr = []
                    arr.forEach(item => {
                        resolveArr.push(Object.assign(
                        {
                            label: item.groupName || item.functionName,
                            children: [],
                            disabled: true
                        }, item))
                    })
                    resolve(resolveArr)
                })
            }
            // 功能项直接resolve一个空数组
            if (node.data && node.data.functionCode) {
                resolve([])
            }
            // 不是顶级节点，同时加载功能子组和功能项
            if (node.data && node.data.groupName) {
                this.fetchGroupList(node).then(res => {
                    var arr = res
                    var resolveArr = []
                    arr.forEach(item => {
                        resolveArr.push(Object.assign(
                        {
                            label: item.groupName || item.functionName,
                            children: [],
                            disabled: true
                        }, item))
                    })
                    this.fetchFunctionList(node).then(res => {
                        var func = res
                        var resolveFunc = []
                        func.forEach(item => {
                            resolveArr.push(Object.assign(
                            {
                                label: item.groupName || item.functionName,
                                leaf: true,
                                children: []
                            }, item))
                        })
                        resolve(resolveArr.concat(resolveFunc))
                        // 根节点设置为inline-block
                        this.$nextTick(function () {
                            var isFuncNode = document.getElementsByClassName('isFunc')
                            var isFuncs = Array.prototype.slice.call(isFuncNode, 0)
                            isFuncs.forEach(item => {
                                let parent = item.parentNode.parentNode.parentNode
                                parent.style.display = 'inline-block'
                            })

                        })
                        // 设置选中的function
                        this.$refs['tree'].setCheckedKeys(this.checkedFuncUids)
                    })
                })

            }
        },
        // 获取功能组列表
        fetchGroupList (node) {
            return new Promise((resolve, reject) => {
                this.$axios.post(permission.listfunctiongroup, {
                parentGroupUid: node.data ? node.data.uid : 0
                }).then(res => {
                    if (res.data.state) {
                        resolve(res.data.data)
                    } else {
                        reject([])
                    }
                })
            })
        },
        // 获取功能组的function
        fetchFunctionList (node) {
            return new Promise((resolve, reject) => {
                this.$axios.post(permission.listfunction, {
                groupUid: node.data ? node.data.uid : 0
                }).then(res => {
                    if (res.data.state) {
                        resolve(res.data.data)
                    } else {
                        reject([])
                    }
                })
            })
        },
        // 确认保存权限功能项
        save () {
            const checkNodes = this.$refs['tree'].getCheckedNodes()
            var uids = []
            checkNodes.forEach(node => {
                uids.push(node.uid)
            })
            this.loading = true
            this.$axios.post(permission.setrolefunction, {
                functions: uids,
                roleUid: this.selectData.uid
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.permissionDialog = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 根据姓名查找用户
        searchUser: _.debounce(function (val)  {
            this.searchLoading = true
            this.$axios.post(permission.listuser, {
                name: val
            }).then(res => {
                this.searchLoading = false
                if (res.data.state) {
                    this.nameList = res.data.data
                }
            })
        }, 100),
        // 保存添加用户
        saveAddUSer () {
            this.saveAddUserLoading = true
            this.$axios.post(permission.binduserrole, {
                roleUid: this.selectData.uid,
                userUid: this.searchUserList
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.addUserDialog = false
                    this.saveAddUserLoading = false
                    this.searchUserList = ''
                    this.fetchUserList(this.selectData)
                } else {
                    this.saveAddUserLoading = false
                }
            }).catch(err => {
                this.saveAddUserLoading = false
            })
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.title{
    font-size: 16px;
    color: #000;
}
</style>
