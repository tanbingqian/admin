<template>
    <transition enter-active-class="animated slideInRight">
        <div class="edit-wrap">
            <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                <div class="edit-cube-module">
                    <p>模板展示设置</p>
                    <el-form label-width="80px">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="模板行高">
                                    <el-input v-model.number="form.height"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="模板背景色">
                                    <el-color-picker size="small" v-model="form.background"></el-color-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="行">
                                    <div class="add-row">
                                        <i class="el-icon-minus" @click="minusRow"></i>
                                        <span class="num">{{ cubeTableRow }}</span>
                                        <i class="el-icon-plus" @click="addRow"></i>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="列">
                                    <div class="add-row">
                                        <i class="el-icon-minus" @click="minusCol"></i>
                                        <span class="num">{{ cubeTableCol }}</span>
                                        <i class="el-icon-plus" @click="addCol"></i>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="模块标题">
                                    <el-input v-model="form.title"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" style="line-height: 32px; margin-left: 10px;">
                                <el-checkbox v-model="form.showTitle" :true-label="0" :false-label="1">不显示</el-checkbox>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="外边距(上)">
                                    <el-input v-model.number="form.marginTop"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="外边距(下)">
                                    <el-input v-model.number="form.marginBottom"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="外边距(左)">
                                    <el-input v-model.number="form.marginLeft"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="外边距(右)">
                                    <el-input v-model.number="form.marginRight"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="内边距(上)">
                                    <el-input v-model.number="form.paddingTop"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="内边距(下)">
                                    <el-input v-model.number="form.paddingBottom"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="内边距(左)">
                                    <el-input v-model.number="form.paddingLeft"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="内边距(右)">
                                    <el-input v-model.number="form.paddingRight"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="行间距">
                                    <el-input v-model.number="form.rowPadding"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="列间距">
                                    <el-input v-model.number="form.colPadding"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="图文间距">
                                    <el-input v-model.number="form.textSpace"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="链接类型11">
                            <el-select v-model="form.linkType" @change="selectLinkType">
                                <el-option label="类目" value="CATEGORY"></el-option>
                                <!-- <el-option label="商品" value="PRODUCT"></el-option> -->
                                <el-option label="页面" value="PAGE"></el-option>
                                <el-option label="外部链接" value="LINK"></el-option>
                                <el-option label="无" value="NONE"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设置链接">
                            <el-cascader
                                v-model="category"
                                :options="categorys"
                                :show-all-levels="false"
                                clearable
                                change-on-select
                                :props="{ value: 'uid', label: 'categoryName' }"
                                v-show="form.linkType === 'CATEGORY'">
                            </el-cascader>
                            <el-select v-model="form.linkUrl" v-show="form.linkType === 'PAGE'">
                                <el-option label="页面一" value="a"></el-option>
                            </el-select>
                            <el-input v-show="form.linkType === 'LINK'" v-model="form.linkUrl"></el-input>
                        </el-form-item>
                        <div class="product-list">
                            <div class="list-header">
                                <span>图片/图标</span>
                                <span>序号</span>
                                <span>标题</span>
                                <span>操作</span>
                            </div>
                            <!-- <draggable v-model="form.listitem" @start="isDragging=true">
                            </draggable> -->
                            <div class="list-item" v-for="(item, index) in form.listitem" :key="item.uid">
                                <div class="cell">
                                    <img class="cell-img" v-if="item.image.length > 0 && item.image[0] !== ''" :src="_fileHost.SHOP_IMAGE + item.image[0]">
                                    <img class="cell-img" v-else src="../../../../../assets/imgs/default.png">
                                </div>
                                <div class="cell">
                                    <div class="sort-wrap">
                                        <i class="el-icon-caret-top sort-icon"
                                        :class="{ disabled: index === 0 }"
                                        @click="move('up', index)"></i>
                                        <i class="el-icon-caret-bottom sort-icon"
                                        :class="{ disabled: index === form.listitem.length - 1 }"
                                        @click="move('down', index)"></i>
                                    </div>
                                </div>
                                <div class="cell">
                                    {{ item.title }}
                                </div>
                                <div class="cell">
                                    <i class="el-icon-edit" @click="cellEdit(item)"></i>
                                </div>
                            </div>
                        </div>
                        <el-form-item label=" ">
                            <el-button size="small" @click="closeSelf">取消</el-button>
                            <el-button size="small" type="primary" :loading="loading" @click="saveModule">保存</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { shop, product } from '@/common/api.js'
import { eventHub } from '@/common/share/eventHub'
import Draggable from 'vuedraggable'
import { treeFilter } from '@/common/utils/array.js'
export default {
    name: 'EditCubeModule',
    props: ['moduleUid'],
    data() {
        return {
            form: {
            },
            linkUrl: '',
            loading: false,
            rowNumber: this.$store.state.shop.cubeTableRow,
            categorys: [],
            category: []
        }
    },
    created () {
        this.fetchDetail(this.moduleUid)
        eventHub.$on('refreshData', this.refreshData)
    },
    watch: {
        moduleUid (newVal, oldVal) {
            if (newVal) {
                this.fetchDetail(newVal)
            }
        }
    },
    methods: {
        // 刷新页面数据
        refreshData () {
            this.fetchDetail(this.moduleUid)
        },
        // 关闭编辑窗
        closeSelf () {
            eventHub.$emit('closeEditWrap')
        },
        // 移动
        move (type, index) {
            if (type === 'up') {
                // 上移
                if (index === 0) {
                    return
                }
                this.sortApi(this.form.listitem[index].uid, this.form.listitem[index - 1].uid, this.form.pageUid)
            } else {
                // 下移
                if (index === this.form.listitem.length) {
                    return
                }
                this.sortApi(this.form.listitem[index].uid, this.form.listitem[index + 1].uid, this.form.pageUid)
            }
        },
        // 排序交换内容
        sortApi (from, to, pageUid) {
            this.$axios.post(shop.changePageBlockItemSlave, {
                fromUid: from,
                toUid: to,
                pageUid: pageUid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    this.fetchDetail(this.moduleUid)
                    eventHub.$emit('reloadComponent', true)
                }
            })
        },
        // 选择链接类型
        selectLinkType (val) {
            if (val === 'NONE') {
                this.form.linkUrl = ''
            } else if (val === 'CATEGORY') {
                this.listAllCategory()
            } else if (val === 'PAGE') {}
        },
        listAllCategory () {
            this.$axios.post(product.listAllCategory, {
                language: localStorage.lang
            }).then(res => {
                this.categorys = treeFilter('state', 0, res.data.data)
            })
        },
        // 添加一行
        addRow () {
            eventHub.$emit('addRow', {
                blockUid: this.form.uid
            })
        },
        // 删除最后一行
        minusRow () {
            if (this.cubeTableRow <= 1) {
                this.$message({
                    type: 'error',
                    message: '至少保留一行数据'
                })
                return
            }
            eventHub.$emit('minusRow', {
                blockUid: this.form.uid
            })
        },
        // 添加一列
        addCol () {
            eventHub.$emit('addCol', {
                blockUid: this.form.uid
            })
        },
        // 删除最后一列
        minusCol () {
            if (this.cubeTableRow <= 1) {
                this.$message({
                    type: 'error',
                    message: '至少保留一列数据'
                })
                return
            }
            eventHub.$emit('minusCol', {
                blockUid: this.form.uid
            })
        },
        fetchDetail (uid) {
            this.$axios.post(shop.getBlockSlaveAndListItem, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.form = res.data.data
                }
            })
        },
        saveModule () {
            this.loading = true
            if (this.form.linkType === 'NONE') {
                this.form.linkUrl = ''
            } else if (this.form.linkType  === 'CATEGORY') {
                if (this.category.length > 0) {
                    this.form.linkUrl = this.category[this.category.length - 1]
                } else {
                    this.form.linkUrl = ''
                }
            } else if (this.form.linkType  === 'PAGE') {}
            this.$axios.post(shop.updateSinglePageBlockSlave, this.form).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    eventHub.$emit('reloadComponent', true)
                }
            }).catch(err => {
                this.loading = false
            })
        },
        cellEdit (item) {
            eventHub.$emit('cellEdit', {
                top: 0,
                left: 0,
                height: '',
                width: '',
                colspan: item.cols,
                rowspan: item.rows,
                layout: item.textAlign,
                imgW: item.imageWidth,
                imgH: item.imageHeight,
                uid: item.uid,
                fontAlign: item.fontAlign,
                blockUid: item.blockUid,
                titleSpace: item.titleSpace,
                title: item.title,
                showTitle: item.showTitle,
                titleFontSize: item.titleFontSize,
                titleRows: item.titleRows,
                subTitle: item.subTitle,
                showSubtitle: item.showSubtitle,
                subTitleFontSize: item.subTitleFontSize,
                subTitleRows: item.subTitleRows,
                linkType: item.linkType,
                linkUrl: item.linkUrl,
                background: item.background,
                subTitleColor: item.subTitleColor,
                titleColor: item.subTitleColor,
                image: item.image
            })
        }
    },
    computed: {
        cubeTableRow () {
            return this.$store.state.shop.cubeTableRow
        },
        cubeTableCol () {
            return this.$store.state.shop.cubeTableCol
        }
    },
    beforeDestroy () {
        eventHub.$off('refreshData')
    },
    components: {
        Draggable
    }
}
</script>

<style scoped lang="less">
.edit-cube-module{
    padding-bottom: 80px;
    padding-right: 6px;
}
.add-row{
    display: flex;
    width: 120px;
    height: 30px;
    align-items: center;
    border: 1px solid #ebebeb;
    border-radius: 5px;
    cursor: pointer;
    .num{
        flex-grow: 1;
        text-align: center;
        border-left: 1px solid #ebebeb;
        border-right: 1px solid #ebebeb;
    }
    i{
        padding: 0 10px;
    }
}
.product-list{
    margin: 5px;
    padding: 5px;
    box-sizing: border-box;
}
.list-header{
    font-size: 14px;
    font-weight: 600;
    color: #000;
    overflow: hidden;
    border-bottom: 1px solid #ebebee;
    border-top: 1px solid #ebebeb;
    box-sizing: border-box;
    span{
        height: 32px;
        line-height: 32px;
        float: left;
        width: 25%;;
        text-align: center;
        box-sizing: border-box;
    }
}
.list-item{
    font-size: 14px;
    color: #333;
    overflow: hidden;
    border-bottom: 1px solid #ebebee;
    box-sizing: border-box;
    &:hover{
        background-color: #f6f6f6;
    }
    .cell{
        height: 50px;
        line-height: 50px;
        float: left;
        width: 25%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.sort-wrap{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.cell-img{
    display: block;
    width: 60px;
    height: 40px;
}
</style>
