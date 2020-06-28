<template>
    <div class="page-wrap">
        <div>
            <el-button size="small" class="my-button" @click="addFuncGroup('parent')">{{ $t('addGroup') }}</el-button>
            <el-button size="small" class="my-button" @click="addFuncGroup('child')">{{ $t('addChildGroup') }}</el-button>
            <el-button size="small" class="my-button" @click="addFunction" v-show="_hasPermission('FUNCTION_ADD')">{{ $t('addFunction') }}</el-button>
            <el-button size="small" class="my-button" @click="edit" v-show="_hasPermission('FUNCTION_EDT')">{{ $t('edit') }}</el-button>
            <el-button size="small" class="my-button" @click="del" v-show="_hasPermission('FUNCTION_DEL')">{{ $t('delete') }}</el-button>
            <el-button size="small" class="my-button" @click="refresh">{{ $t('refresh') }}</el-button>
        </div>
        <div class="tree-container">
            <p class="tip">*{{ $t('redTextMeans') }}</p>
            <el-tree ref="tree" show-checkbox lazy
                :props="treeProps"
                :load="loadNode"
                node-key="uid"
                check-strictly>
                <span slot-scope="{ node, data }">
                    <span
                        v-if="data.functionCode"
                        :class="{ isFunc: data.functionCode }">{{ data.label + '(' +data.functionCode + ')' }}</span>
                    <span
                        v-else
                        :class="{ isFunc: data.functionCode }">{{ data.label}}</span>
                </span>
            </el-tree>
        </div>
        <el-dialog :title="groupTitle" :visible.sync="groupDialog" width="40%">
            <el-form label-position="left" label-width="80px">
                <el-form-item :label="$t('groupName')">
                    <el-input v-model="group.groupName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('systemFunction')">
                    <el-radio-group v-model="group.functionType">
                        <el-radio label="SYSTEM">{{ $t('system') }}</el-radio>
                        <el-radio label="SITE">{{ $t('site') }}</el-radio>
                        <el-radio label="USER">{{ $t('user') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="small" @click="cancelGroup">{{ $t('cancel') }}</el-button>
                    <el-button type="primary" size="small" :loading="groupLoading" @click="saveGroup">{{ $t('save') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :title="funcTitle" :visible.sync="funcDialog" width="40%">
            <el-form label-position="left" label-width="80px">
                <el-form-item :label="$t('functionCode')">
                    <el-input v-model="func.functionCode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('functionName')">
                    <el-input v-model="func.functionName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('systemFunction')">
                    <el-radio-group v-model="func.functionType">
                        <el-radio label="SYSTEM">{{ $t('system') }}</el-radio>
                        <el-radio label="SITE">{{ $t('site') }}</el-radio>
                        <el-radio label="USER">{{ $t('user') }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="small" @click="funcDialog = false">{{ $t('cancel') }}</el-button>
                    <el-button type="primary" size="small" :loading="funcLoading" @click="saveFunc">{{ $t('save') }}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { permission } from '@/common/api.js'
import { isInArray } from '@/common/utils/array';
export default {
    name: 'function',
    data() {
        return {
            treeProps: {
                label: 'label',
                children: 'children',
                isLeaf: 'leaf'
            },
            groupDialog: false,
            groupLoading: false,
            groupTitle: '',
            group: {
                parentGroupUid: 0,
                groupName: '',
                uid: 0,
                functionType: ''
            },
            groupList: [],
            funcDialog: false,
            funcLoading: false,
            funcTitle: '',
            func: {
                functionCode: '',
                functionName: '',
                groupUid: '',
                uid: 0,
                functionType: ''
            },
            showTree: true,
            flag: '' //添加功能组还是子功能组
        }
    },
    watch: {
        groupDialog (newVal, oldVal) {
            if (!newVal) {
                this.group.parentGroupUid = 0
                this.group.groupName = ''
                this.group.functionType = ''
                this.group.uid = 0
            }
            this.showTree = !this.showTree
        },
        funcDialog (newVal, oldVal) {
            if (!newVal) {
                this.func.functionCode = ''
                this.func.functionName = ''
                this.func.groupUid = ''
                this.func.uid = 0
                this.func.functionType = ''
            }
            this.showTree = !this.showTree
        }
    },
    methods: {
        checkNode (data, node) {
        },
        handleNodeClick (data, node) {
        },
        // 关闭groupDialog
        cancelGroup () {
            this.groupDialog = false
        },
        // 添加功能
        addFunction () {
            const checkNode = this.$refs['tree'].getCheckedNodes()
            if (checkNode.length !== 1) {
                this.$message({
                    type: 'error',
                    message: this.$t('chooseOneGroup')
                })
                return
            }
            if (checkNode[0].functionCode) {
                this.$message({
                    type: 'error',
                    message: this.$t('functionCannotAddFunc')
                })
                return
            }
            this.func.groupUid = checkNode[0].uid
            this.funcDialog = true
            this.funcTitle = this.$t('addFunction')
        },
        // 保存功能项
        saveFunc () {
            const checkNode = this.$refs['tree'].getCheckedNodes()
            const data = checkNode[0]
            if (this.func.uid === 0) {
                // 添加
                this.funcLoading = true
                this.$axios.post(permission.addfunction, this.func).then(res => {
                    if (res.data.state) {
                        this.funcLoading = false
                        this.$message({
                            type: 'success',
                            message: this.$t('operationSuccess')
                        })
                        this.funcDialog = false
                        var tree = this.$refs['tree']
                        const checkNode = tree.getCheckedNodes()[0]
                        checkNode.children.push({
                            label: res.data.data.functionName,
                            functionName: res.data.data.functionName,
                            functionCode: res.data.data.functionCode,
                            groupUid: res.data.data.groupUid,
                            functionType: res.data.data.functionType,
                            uid: res.data.data.uid,
                            leaf: true,
                        })
                        // this.refresh()
                    } else {
                        this.funcLoading = false
                    }
                })
            } else {
                // 编辑
                this.funcLoading = true
                this.$axios.post(permission.updatefunction, this.func).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('operationSuccess')
                        })
                        data.functionCode = res.data.data.functionCode
                        data.functionName = res.data.data.functionName
                        data.label = res.data.data.functionName
                        data.functionType = res.data.data.functionType
                        this.funcDialog = false
                        // this.refresh()
                        this.funcLoading = false
                    } else {
                        this.funcLoading = false
                    }
                })
            }

        },
        // 添加功能组
        addFuncGroup (flag) {
            this.flag = flag
            // 添加子功能组
            if (flag === 'parent') {
                this.groupTitle = this.$t('addGroup')
                this.groupDialog = true
            } else if (flag === 'child') {
                const checkNode = this.$refs['tree'].getCheckedNodes()
                if (checkNode.length !== 1) {
                    this.$message({
                        type: 'error',
                        message: this.$t('chooseOneGroup')
                    })
                    return
                }
                if (checkNode[0].functionCode) {
                    this.$message({
                        type: 'error',
                        message: '功能项无法添加功能组'
                    })
                    return
                }
                this.groupTitle = this.$t('addChildGroup')
                this.group.parentGroupUid = checkNode[0].uid
                this.groupDialog = true
            }
        },
        // 保存功能组
        saveGroup () {
            const checkNode = this.$refs['tree'].getCheckedNodes()
            const data = checkNode[0]
            if (this.group.uid === 0) {
                // 添加功能组
                this.groupLoading = true
                this.$axios.post(permission.addfunctiongroup, this.group).then(res => {
                    if (res.data.state) {
                        this.groupLoading = false
                        this.groupDialog = false
                        this.$message({
                            type: 'success',
                            message: this.$t('operationSuccess')
                        })
                        if (this.flag === 'parent') {
                            // 添加第一层功能组
                            this.refresh()
                        } else {
                            // 添加功能子组
                            var tree = this.$refs['tree']
                            const checkNode = tree.getCheckedNodes()[0]
                            checkNode.children.push({
                                label: res.data.data.groupName,
                                groupName: res.data.data.groupName,
                                functionType: res.data.data.functionType,
                                parentGroupUid: res.data.data.parentGroupUid,
                                uid: res.data.data.uid,
                                children: []
                            })
                        }
                        // this.refresh()
                    } else {
                        this.groupLoading = false
                    }
                })
            } else {
                // 编辑保存
                this.groupLoading = true
                this.$axios.post(permission.updatefunctiongroup, this.group).then(res => {
                    if (res.data.state) {
                        this.groupLoading = false
                        this.groupDialog = false
                        this.$message({
                            type: 'success',
                            message: this.$t('operationSuccess')
                        })
                        data.label = res.data.data.groupName
                        data.groupName = res.data.data.groupName
                        data.functionType = res.data.data.functionType
                        // this.refresh()
                    } else {
                        this.groupLoading = false
                    }
                })
            }
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
                            children: []
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
                node.data.children = []
                this.fetchGroupList(node).then(res => {
                    var arr = res
                    arr.forEach(item => {
                        node.data.children.push(Object.assign({
                            label: item.groupName || item.functionName,
                            children: []
                        }, item))
                    })
                    this.fetchFunctionList(node).then(res => {
                        var func = res
                        func.forEach(item => {
                            node.data.children.push(Object.assign(
                            {
                                label: item.groupName || item.functionName,
                                leaf: true,
                                children: []
                            }, item))
                        })
                        resolve(node.data.children)
                        // 根节点设置为inline-block
                        this.$nextTick(function () {
                            var isFuncNode = document.getElementsByClassName('isFunc')
                            var isFuncs = Array.prototype.slice.call(isFuncNode, 0)
                            isFuncs.forEach(item => {
                                let parent = item.parentNode.parentNode.parentNode
                                parent.style.display = 'inline-block'
                            })
                        })
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
        // 删除
        del () {
            const checkNode = this.$refs['tree'].getCheckedNodes()
            const data = checkNode[0]
            if (checkNode.length !== 1) {
                this.$message({
                    type: 'error',
                    message: this.$t('checkOneToDelete')
                })
                return
            }
            if (data.functionCode) {
                // 删除功能项
                this.$axios.post(permission.deletefunction, {
                    uid: data.uid
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('delSuccess')
                        })
                        // this.refresh()
                        this.$refs['tree'].remove(data)
                    }
                })
            } else {
                // 删除功能组
                this.$axios.post(permission.deletefunctiongroup, {
                    uid: data.uid
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('delSuccess')
                        })
                        // this.refresh()
                        this.$refs['tree'].remove(data)
                    }
                })
            }
        },
        // 编辑
        edit () {
            const checkNode = this.$refs['tree'].getCheckedNodes()
            const data = checkNode[0]
            if (checkNode.length !== 1) {
                this.$message({
                    type: 'error',
                    message: this.$t('onlyCanEditSingleData')
                })
                return
            }

            if (data.functionCode) {
                // 编辑功能项
                this.func.groupUid = data.groupUid
                this.func.functionCode = data.functionCode
                this.func.functionName = data.functionName
                this.func.uid = data.uid
                this.func.functionType = data.functionType
                this.funcDialog = true
                this.funcTitle = this.$t('editFunction')
            } else {
                // 编辑功能组
                this.group.parentGroupUid = data.parentGroupUid
                this.group.groupName = data.groupName
                this.group.functionType = data.functionType
                this.group.uid = data.uid
                this.groupDialog = true
                this.groupTitle = this.$t('editGroup')
            }
        },
        // 强制刷新当前view
        refresh () {
            this.$router.go({
                path: '/function/',
                force: true
            })
        }
    }
}
</script>

<style scoped lang="less">
.tree-container{
    margin-top: 20px;
}
.isFunc{
    color: red;
}
.tip{
    color: red;
    font-size: 12px;
}
</style>
