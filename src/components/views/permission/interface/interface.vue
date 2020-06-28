<template>
    <transition enter-active-class="animated slideInUp">
        <div class="normal-page">
            <el-select v-model="selectService" @change="listapi">
                <el-option v-for="(s, i) in serviceList" :key="i" :label="s" :value="s"></el-option>
            </el-select>
            <el-button
                type="primary"
                v-show="_hasPermission('API_SYNC')"
                size="small"
                @click="syncapifromservice">{{ $t('syncApifromServer') }}</el-button>
            <el-table :data="apiList">
                <el-table-column :label="$t('serviceName')" prop="serviceName" align="center"></el-table-column>
                <el-table-column :label="$t('apiUrl')" prop="apiUrl" align="left"></el-table-column>
                <el-table-column :label="$t('type')" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.accessType | accessType }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('function')" align="center"></el-table-column>
                <el-table-column :label="$t('operation')" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-show="_hasPermission('API_FUNCTION')"
                            @click="associated(scope.row)">{{ $t('assFunction') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :visible.sync="funcDialog" :title="title + $t('assFunction')">
                <el-form label-width="80px">
                    <el-form-item :label="$t('type')">
                        <el-select v-model="accessType">
                            <el-option :label="$t('forbidden')" value="FORBIDDEN"></el-option>
                            <el-option :label="$t('open')" value="OPEN"></el-option>
                            <el-option :label="$t('private')" value="PRIVATE"></el-option>
                            <el-option :label="$t('mixed')" value="MIXED"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('userType')" v-if="(accessType === 'PRIVATE' && funcDialog) || (accessType === 'MIXED' && funcDialog)">
                        <el-checkbox-group v-model="userTypeList">
                            <el-checkbox v-for="(item, index) in typeList" :key="index" :label="item">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item :label="$t('function')" v-if="(accessType === 'PRIVATE' && funcDialog)">
                        <el-tree
                            ref="tree"
                            show-checkbox
                            lazy
                            :props="treeProps"
                            :load="loadNode"
                            node-key="uid" check-strictly>
                            <span slot-scope="{ node, data }">
                                <span
                                    v-if="data.functionCode"
                                    :class="{ isFunc: data.functionCode }">{{ data.label + '(' +data.functionCode + ')' }}</span>
                                <span
                                    v-else
                                    :class="{ isFunc: data.functionCode }">{{ data.label}}</span>
                            </span>
                        </el-tree>
                    </el-form-item>
                </el-form>
                <div style="text-align: center; margin-top: 20px;">
                    <el-button
                        type="primary"
                        size="small"
                        :loading="loading"
                        @click="save">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('confirm') }}&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { permission } from '@/common/api.js'
export default {
    name: 'Interface',
    created () {
        this.listallservice()
        this.getusertype()
    },
    data() {
        return {
            serviceList: [],
            selectService: '',
            apiList: [],
            funcDialog: false,
            treeProps: {
                label: 'label',
                children: 'children',
                isLeaf: 'leaf'
            },
            accessType: '',
            loading: false,
            apiUid: '',
            checkedFuncUids: [],
            title: '',
            userTypeList: [], // 用户类型
            typeList: []
        }
    },
    methods: {
        // 获取用户类型
        getusertype () {
            this.$axios.post(permission.getusertype).then(res => {
                if (res.data.state) {
                    this.typeList = res.data.data
                }
            })
        },
        // 确认保存
        save () {
            var checkNodes = []
            const uids = []
            if (this.accessType === 'PRIVATE') {
                checkNodes = this.$refs['tree'].getCheckedNodes()
                checkNodes.forEach(node => {
                    uids.push(node.uid)
                })
            }
            this.loading = true
            this.$axios.post(permission.updateapi, {
                accessType: this.accessType,
                functionUidList: uids,
                uid: this.apiUid,
                userTypeList: this.userTypeList
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.funcDialog = false
                    this.listapi(this.selectService)
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 关联功能项
        associated (row) {
            this.apiUid = row.uid
            this.title = row.apiUrl
            this.accessType = row.accessType
            this.funcDialog = true
            this.userTypeList = row.apiUserTypes
            this.getApi(row)
        },
        // 获取api信息
        getApi (row) {
            this.$axios.post(permission.getapi, {
                apiUrl: row.apiUrl,
                serviceName: row.serviceName
            }).then(res => {
                if (res.data.state) {
                    this.checkedFuncUids = res.data.data.functionIds
                }
            })
        },
        // 查询所有服务
        listallservice () {
            this.$axios.post(permission.listallservice).then(res => {
                if (res.data.state) {
                    this.serviceList = res.data.data
                }
            })
        },
        // 同步指定服务api
        syncapifromservice () {
            this.$axios.post(permission.syncapifromservice, {
                serviceName: this.selectService
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.listapi(this.selectService)
                }
            })
        },
        // 查询服务已配置的api
        listapi (val) {
            this.$axios.post(permission.listapi, {
                serviceName: val
            }).then(res => {
                if (res.data.state) {
                    this.apiList = res.data.data
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
    }
}
</script>

<style scoped lang="less">
</style>
