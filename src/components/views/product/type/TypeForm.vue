<template>
    <transition enter-active-class="animated fadeInLeft">
        <div>
            <div class="search-wrap">
                <div class="button-groups">
                    <el-button @click="addNode" v-show="_hasPermission('CATE_ADD')">{{ $t('addCategory') }}</el-button>
                    <el-button @click="addChild" v-show="_hasPermission('CATE_ADD')">{{ $t('addChildCategory') }}</el-button>
                    <el-button @click="delNode" v-show="_hasPermission('CATE_DEL')">{{ $t('delete') }}</el-button>
                    <el-button @click="moveUp">{{ $t('moveUp') }}</el-button>
                    <el-button @click="moveDown">{{ $t('moveDown') }}</el-button>
                </div>
                <div class="content">
                    <!-- 树形控件导航 -->
                    <div class="left">
                        <el-tree
                                ref="treeType"
                                :data="categorys"
                                :expand-on-click-node="false"
                                node-key="uid"
                                :default-expand-all="true"
                                :props="defaultProps"
                                @node-click="handleNodeClick">
                                <div class="custom-tree-node" slot-scope="{ node, data }" :class="{active: currentNode.data && data.uid === currentNode.data.uid}">
                                    <i class="el-icon-document"></i>
                                    <transition name="edit-slide">
                                        <span class="tree-label" v-if="!data.isEdit">{{ node.label }}</span>
                                        <div style="display: inline-block;" v-else>
                                            <input class="my-input" v-model="data.categoryName" :placeholder="$t('enterName')" @keyup.enter="updateLable(data)"/>
                                            <i class="el-icon-check sure-icon" @click.stop="updateLable(data)"></i>
                                        </div>
                                    </transition>
                                </div>
                        </el-tree>
                    </div>
                    <!-- 右侧类目信息展示 -->
                    <div class="right" v-show="currentNode.data.uid && currentNode.data.uid !== '0'">
                        <h1 class="right-title">{{ $t('categoryInfo') }}</h1>
                        <el-form label-width="60px" label-position="left">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item :label="$t('categoryName')">
                                        <el-input v-model="currentNode.data.categoryName"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" style="margin-left: 40px;">
                                    <el-form-item :label="$t('categoryIcon')">
                                        <img-gallery v-if="showGallery" :fileHost="_fileHost.PRODUCT_IMAGE" repoType="PRODUCT_IMAGE" v-model="imglistShow" :limit="1" :showPreview="true">
                                        </img-gallery>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-form-item v-show="_hasPermission('CATE_EDT')">
                                    <el-button type="primary" size="small" @click="updateLable(currentNode.data)">{{ $t('save') }}</el-button>
                                </el-form-item>
                            </el-row>
                            <el-row>
                                <el-form-item label="类目属性">
                                    <el-button type="text" @click="addSku" v-show="_defaultLang === lang">{{ $t('add') }}</el-button>
                                </el-form-item>
                            </el-row>
                            <el-row class="custom-table">
                                <el-row type="flex" justify="center" class="header-row">
                                    <el-col class="col-cell">{{ $t('displayNo') }}</el-col>
                                    <el-col class="col-cell">{{ $t('attribute') }}</el-col>
                                    <el-col class="col-cell">{{ $t('attributeName') }}</el-col>
                                    <el-col class="col-cell">{{ $t('valueType') }}</el-col>
                                    <el-col class="col-cell">{{ $t('operation') }}</el-col>
                                </el-row>
                                <div style="max-height: 300px;overflow-x: hidden;overflow-y:scroll;">
                                    <draggable v-model="typeList" @start="isDragging=true" @end="dragEnd">
                                        <transition-group name="flip-list" tag="div">
                                            <el-row type="flex" justify="center" class="row-item" v-for="(item, index) in typeList" :key="item.uid">
                                                <el-col class="col-cell">{{index}}</el-col>
                                                <el-col class="col-cell">{{item.attributeType}}</el-col>
                                                <el-col class="col-cell">{{item.attributeName}}</el-col>
                                                <el-col class="col-cell">{{item.valueType}}</el-col>
                                                <el-col class="col-cell">
                                                    <el-button type="text" @click="editSku(item)" v-show="item.isParent === 0">{{ $t('edit') }}</el-button>
                                                    <el-button type="text" @click="delSku(item.uid)" v-show="item.isParent === 0">{{ $t('delete') }}</el-button>
                                                </el-col>
                                            </el-row>
                                        </transition-group>
                                    </draggable>
                                </div>
                            </el-row>
                        </el-form>
                    </div>
                </div>
            </div>
            <!-- 添加编辑类目弹框 -->
            <el-dialog :visible.sync="showDialog" :title="$t('addCategoryAttr')" width="30%">
                <el-form label-width="80px" label-position="left">
                    <el-form-item :label="$t('attribute')">
                        <el-radio label="SKU" v-model="typeForm.attributeType">SKU</el-radio>
                        <el-radio label="SPU" v-model="typeForm.attributeType">SPU</el-radio>
                    </el-form-item>
                    <el-form-item :label="$t('attributeName')">
                        <el-input v-model="typeForm.attributeName"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('valueType')">
                        <el-radio label="TEXT" v-model="typeForm.valueType">{{ $t('text') }}</el-radio>
                        <el-radio label="NUM" v-model="typeForm.valueType">{{ $t('number') }}</el-radio>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showDialog = false">{{ $t('cancel') }}</el-button>
                    <el-button type="primary" @click="skuSave" :loading="saveLoading">{{ $t('save') }}</el-button>
                </span>
            </el-dialog>
        </div>
    </transition>
</template>

<script>
import { moveUp, moveDown, randomIndex, findNodeByUid } from '@/common/utils/array.js'
import ImgGallery from '@/components/common/upload/imgGallery'
import Draggable from 'vuedraggable'
import { product } from '@/common/api.js'
let id = 1000

export default {
    name: 'TypeForm',
    props: ['lang'],
    created () {
        this.fetchCategory()
    },
    data () {
        return {
            showDialog: false,
            isDragging: false,
            currentNode: {
                data: {}
            },
            typeForm: {
                uid: '',
                attributeType: 'SKU',
                valueType: 'TEXT',
                categoryUid: '',
                isRequired: 0,
                attributeName: '',
                attributeCode: '',
                language: this.lang
            },
            flag: 0, // flag = 0新增  1编辑
            typeList: [],
            categorys: [
                {
                    categoryName: '全部分类',
                    uid: '0',
                    parentId: '0',
                    language: this.lang,
                    distinguishPC: 1,
                    isEdit: false,
                    children: [],
                    state: 1
                }
            ],
            defaultProps: {
                children: 'children',
                label: 'categoryName'
            },
            saveLoading: false,
            imglistShow:[],
            showGallery: false
        }
    },
    methods: {
        // 重新加载图片
        reloadImg () {
            this.showGallery = false
            this.$nextTick(function () {
                this.showGallery = true
            })
        },
        initNode () {
            this.currentNode = {
                data: {}
            }
        },
        handleNodeClick (data, node) {
            this.currentNode = node
            // 点击类目是，获取对应的类目属性
            if (data.uid && data.uid !== '0') {
                this.queryAttrList()
                this.getCategoryList()
            }
        },
        // 获取类目树形结构
        fetchCategory () {
            this.$axios.post(product.listAllCategory, {
                language: this.lang
            }).then(res => {
                if (res.data.state) {
                    // 只显示state值为1的节点
                    this.categorys[0].children = res.data.data
                    // 重新获取数据后需要重置node节点
                    this.initNode()
                    // 需要刷新右侧菜单
                    // this.currentNode = findNodeByUid(this.currentNode.data.uid, this.categorys)
                }
            })
        },
        // 判断是否选中节点
        checkNode () {
            if (!this.currentNode.data.uid) {
                this.$message({
                    type: 'error',
                    message: this.$t('chooseOneCategory')
                })
                return false
            }
            return true
        },
        // 添加类目
        addNode () {
            if (!this.checkNode()) return
            const data = this.currentNode.data
            if (data.parentId && data.uid !== '0') {
                // 不是根节点, 添加同级类目
                this.currentNode.parent.data.children.push({
                    categoryName: '',
                    pUid: data.uid,
                    parentId: data.parentId,
                    language: this.lang,
                    distinguishPC: 0,
                    isEdit: true,
                    children: [],
                    state: 1
                })
            } else {
                // 根节点添加类目时，实际是添加子类目
                this.currentNode.data.children.push({
                    categoryName: '',
                    pUid: data.uid,
                    parentId: data.parentId,
                    language: this.lang,
                    distinguishPC: 1,
                    isEdit: true,
                    children: [],
                    state: 1
                })
            }

        },
        // 添加子类目
        addChild () {
            // console.log(this.currentNode.data)
            if (!this.checkNode()) return
            const data = this.currentNode.data
            if (!data.isEdit) {
                // 根节点添加类目时，实际是添加子类目
                this.currentNode.data.children.push({
                    categoryName: '',
                    pUid: data.uid,
                    parentId: data.parentId,
                    language: this.lang,
                    distinguishPC: 1,
                    isEdit: true,
                    children: [],
                    state: 1
                })
            } else {
                this.$message({
                    type: 'error',
                    message: this.$t('isOnEditChild')
                })
            }
        },
        // 删除类目
        delNode () {
            if (!this.checkNode()) return
            const data = this.currentNode.data
            if (data.parentId === 0) {
                // 根节点不能删除
                this.$message({
                    type: 'error',
                    message: this.$t('canNotDeleteRoot')
                })
            } else {
                this.$axios.post(product.removeCategory, {
                    uid: data.uid,
                    state: -1
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('delSuccess')
                        })
                        this.fetchCategory()
                    }
                })
            }
        },
        // 双击编辑类目
        doubleClick (data) {
            data.isEdit = true
        },
        // 保存类目名称
        updateLable (data) {
            //把返回的图片放到到数组里面
            const imgs = []
            this.imglistShow.forEach(img => {
                imgs.push(img.storageFile)
            })
            let params
            if (data.uid) {
                // 编辑
                params = {
                    categoryName: this.currentNode.data.categoryName,
                    uid: this.currentNode.data.uid,
                    parentId: this.currentNode.data.parentId,
                    language: this.lang,
                    distinguishPC: data.distinguishPC,
                    children: this.currentNode.data.children,
                    state: this.currentNode.data.state,
                    isAddOrUpdate: 1,
                    icon: imgs
                }
            } else {
                // 新增
                params = {
                    categoryName: data.categoryName,
                    uid: data.pUid,
                    parentId: data.parentId,
                    language: this.lang,
                    distinguishPC: data.distinguishPC,
                    children: data.children,
                    state: data.state,
                    isAddOrUpdate: 0,
                    icon: []
                }
            }
            this.$axios.post(product.saveCategory, params).then(res => {
                this.fetchCategory()
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                }
            })
        },
        //获取单条类目属性
        getCategoryList(){
           this.$axios.post(product.getCategory, {uid: this.currentNode.data.uid}).then(res => {
                this.imglistShow = res.data.data.icon
                // 重新加载图片组件
                this.reloadImg()
            })
        },
        // 上移
        moveUp () {
            if (!this.checkNode()) return
            const node = this.currentNode
            if (node.previousSibling) {
                this.$axios.post(product.categoryMoveUp, {
                    beforeUid: node.data.uid,
                    afterUid: node.previousSibling.data.uid,
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('operationsuccess')
                        })
                        this.fetchCategory()
                    }
                })
            } else {
                // 只能平级节点移动
                this.$message({
                    message: this.$t('canNotMoveOutParent'),
                    type: 'error'
                })
            }
        },
        // 下移
        moveDown () {
            if (!this.checkNode()) return
            const node = this.currentNode
            if (this.currentNode.nextSibling) {
                this.$axios.post(product.categoryMoveDown, {
                    beforeUid: node.data.uid,
                    afterUid:  node.nextSibling.data.uid,
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: this.$t('operationSuccess')
                        })
                        this.fetchCategory()
                    }
                })
            } else {
                // 只能平级节点移动
                this.$message({
                    message: this.$t('canNotMoveOutParent'),
                    type: 'error'
                })
            }
        },
        // 根据类目查询sku，spu
        queryAttrList () {
            this.$axios.post(product.listCategoryAttribute, {
                // fullId: this.currentNode.data.fullId,
                uid: this.currentNode.data.uid,
                lang: this.lang
            }).then(res => {
                if (res.data.state) {
                    this.typeList = res.data.data
                }
            })
        },
        // 添加sku属性
        addSku () {
            // 新增时重置typeForm属性
            this.typeForm = {
                uid: '',
                attributeType: 'SKU',
                valueType: 'TEXT',
                categoryUid: '',
                isRequired: 0,
                attributeName: '',
                attributeCode: '',
                language: this.lang
            },
            this.showDialog = true
        },
        // 删除sku
        delSku (uid) {
            this.$axios.post(product.removeCategoryAttribute, {
                uid: uid,
                state: -1
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('delSuccess')
                    })
                    this.queryAttrList()
                }
            })
        },
        // 编辑sku
        editSku (item) {
            // 编辑室需要设置typeForm属性uid
            this.typeForm.uid = item.uid
            this.typeForm.attributeType = item.attributeType
            this.typeForm.valueType = item.valueType
            this.typeForm.attributeName = item.attributeName
            this.showDialog = true
        },
        dragEnd (env) {
            // console.log(env.oldIndex, env.newIndex)
            var changeUid = ''
            var changeCategoryUid = ''
            if (env.oldIndex > env.newIndex) {
                changeUid = this.typeList[env.newIndex + 1].uid
                changeCategoryUid = this.typeList[env.newIndex + 1].categoryUid
            } else {
                changeUid = this.typeList[env.newIndex - 1].uid
                changeCategoryUid = this.typeList[env.newIndex - 1].categoryUid
            }
            this.isDragging = false
            // 拖拽完成后，重新获取属性数据
            this.$axios.post(product.categoryAttributeMove, {
                originalUid: this.typeList[env.newIndex].uid,
                originalCategoryUid: this.typeList[env.newIndex].categoryUid,
                changeUid: changeUid,
                changeCategoryUid: changeCategoryUid
            }).then(res => {
                this.queryAttrList()
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                }
            })
        },
        skuSave () {
            // 设置类目uid
            this.typeForm.categoryUid = this.currentNode.data.uid
            this.saveLoading = true
            this.$axios.post(product.saveCategoryAttribute, this.typeForm).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.showDialog = false
                    // 重新获取sku，spu列表数据
                    this.queryAttrList()
                }
                this.saveLoading = false
            }).catch(err => {
                this.saveLoading = false
            })
        }
    },
    components: {
        Draggable,
        ImgGallery
    }
}
</script>

<style lang="less" scoped>
@import '../../../../styles/variable.less';
@leftPWidth: 30px;
.content{
    margin-top: 24px;
    overflow: hidden;
    .left{
        float: left;
        min-width: 100px;
        padding-right: @leftPWidth;
        border-right: 1px solid #f6f6f6;
    }
    .right{
        overflow: hidden;
    }
}
.custom-tree-node{
    position: relative;
    &.active{
        color: @baseColor
    }
}
.tree-label{
    display: inline-block;
    width: 100px;
}
.sure-icon{
    padding: 5px;
}
.right{
    padding-left: @leftPWidth;
    .right-title{
        font-size: 16px;
        font-weight: 500;
        margin-top: 0;
    }
}
.custom-table{
    .header-row{
        font-size: 12px;
        font-weight: 600;
        line-height: 32px;
    }
    .el-row{
        line-height: 32px;
        font-size: 12px;
        border-bottom: 1px solid #f6f6f6;
    }
    .row-item{
        line-height: 32px;
        &:hover{
            background-color: #f6f6f6;
        }
    }
}
.col-cell{
    text-align: center;
}

</style>

