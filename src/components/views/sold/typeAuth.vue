<template>
    <div class="type-auth">
        <p>
            <span class="type-title">{{ levelName }}-{{ $t('categoryAuth') }}</span>
            <span class="add-type" @click="addType">{{ $t('add') }}</span>
        </p>
        <el-row>
            <el-col :span="18">
                <el-table :data="authList" max-height="400">
                    <el-table-column :label="$t('category')" prop="categoryName"></el-table-column>
                    <el-table-column :label="$t('purchansePrice')" prop="purchasePrice"></el-table-column>
                    <el-table-column :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateType(scope.row)">{{ $t('edit') }}</el-button>
                            <el-button type="text" @click="removeAuthCategory(scope.row.uid)">{{ $t('delete') }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!-- 设置dialog -->
        <el-dialog :visible.sync="showDialog" :title="$t('addCategoryAuth')">
            <div class="dialog-wrap">
                <div class="tree-wrap">
                    <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                        <el-tree
                            :data="categorys"
                            @node-click="handleNodeClick"
                            :props="{ label: 'categoryName', child: 'children' }"
                            :default-expand-all="true">
                        </el-tree>
                    </el-scrollbar>
                </div>
                <div class="right-wrap" v-show="checkData.categoryUid">
                    <p class="title">{{ checkData.categoryName }}</p>
                    <el-form label-position="left" label-width="100px" :model="checkData" :rules="rules" ref="form">
                        <el-form-item :label="$t('goodsPurchansePrice')" prop="purchasePrice">
                            <el-col :span="12">
                                <el-input v-model="checkData.purchasePrice"></el-input>
                            </el-col>
                            <el-col :span="4" style="margin-left: 10px;">%</el-col>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                    @click="saveAuthCategory"
                                    :loading="loading"
                                    type="primary"
                                    size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { resale, product } from '@/common/api.js'
import { checkRate } from '@/common/utils/validate.js'
import Vue from 'vue';
export default {
    props: ['levelUid', 'levelName'],
    name: 'TypeAuth',
    created () {
        this.fetchAuthList()
    },
    data() {
        return {
            showDialog: false,
            authList: [],
            categorys: [],
            checkData: {
                categoryName: '',
                categoryUid: '',
                levelUid: '',
                purchasePrice: '',
                uid: null
            },
            loading: false,
            rules: {
                purchasePrice: [
                    { validator: checkRate, trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        levelUid: function (newVal, oldVal) {
            this.fetchAuthList()
        },
        showDialog: function (newVal, oldVal) {
            if (newVal) {
                this.fetchCategory()
            }
        }
    },
    methods: {
        fetchAuthList () {
            this.$axios.post(resale.listAuthCategory, {
                levelUid: this.levelUid,
                language: localStorage.lang
            }).then(res => {
                if (res.data.state) {
                    this.authList = res.data.data
                }
            })
        },
        fetchCategory () {
            this.$axios.post(resale.listAuthCategoryForTree, {
                language: localStorage.lang,
                levelUid: this.levelUid
            }).then(res => {
                if (res.data.state) {
                    this.categorys = res.data.data
                }
            })
        },
        handleNodeClick (data) {
            this.checkData.categoryName = data.categoryName
            this.checkData.categoryUid = data.categoryUid.toString()
            this.checkData.levelUid = this.levelUid.toString()
            this.checkData.purchasePrice = ''
            this.checkData.uid = null
        },
        // 保存授权类目
        saveAuthCategory () {
            this.loading = true
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.$axios.post(resale.saveAuthCategory, this.checkData).then(res => {
                        this.loading = false
                        this.showDialog = false
                        this.fetchAuthList()
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: this.$t('saveSuccess')
                            })
                        }
                    }).catch(err => {
                        this.loading = false
                    })
                }
            })
        },
        addType () {
            // 添加类目授权
            this.checkData.categoryName = ''
            this.checkData.categoryUid = ''
            this.checkData.levelUid = ''
            this.checkData.purchasePrice = ''
            this.checkData.uid = null
            this.showDialog = true
        },
        updateType (data) {
            // 修改授权类目
            this.checkData.categoryName = data.categoryName
            this.checkData.categoryUid = data.categoryUid
            this.checkData.levelUid = data.levelUid
            this.checkData.purchasePrice = data.purchasePrice
            this.checkData.uid = data.uid
            this.showDialog = true
        },
        removeAuthCategory (uid) {
            this.$axios.post(resale.removeAuthCategory, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('delSuccess')
                    })
                    this.fetchAuthList()
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
@import '../../../styles/variable.less';
.type-title{
    font-size: 18px;
}
.add-type{
    color: @baseColor;
    font-size: 12px;
    margin-left: 20px;
    &:hover{
        cursor: pointer;
    }
}
.dialog-wrap{
    display: flex;
}
.tree-wrap{
    flex-grow: 1;
    max-height: 300px;
    padding-bottom: 30px;
    margin-right: 30px;
}
.right-wrap{
    flex-grow: 2;
}
</style>
