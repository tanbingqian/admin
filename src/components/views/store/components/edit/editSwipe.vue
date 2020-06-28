<template>
    <transition enter-active-class="animated slideInRight">
        <div class="edit-wrap">
            <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                <div class="edit-swipe">
                    <p>多图轮播设置</p>
                    <el-form label-width="80px" label-position="left">
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-form-item label="模块高度">
                                    <el-input v-model.number="form.height"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="模块圆角">
                                    <el-input v-model.number="form.itemRadius"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-form-item label="外边距(上)">
                                    <el-input v-model.number="form.marginTop"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="外边距(下)">
                                    <el-input v-model="form.marginBottom"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="12">
                                <el-form-item label="外边距(左)">
                                    <el-input v-model.number="form.marginLeft"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="外边距(右)">
                                    <el-input v-model="form.marginRight"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
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
                        <el-row :gutter="10">
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
                    </el-form>
                    <p>图片链接设置(最多添加八张轮播图)</p>
                    <el-table :data="form.listitem" v-if="form.listitem">
                        <el-table-column label="图片" align="center">
                            <template slot-scope="scope">
                                <img class="thumb-img" v-for="(item, index) in scope.row.image" :key="index" :src="_fileHost.SHOP_IMAGE + item">
                                <img v-if="scope.row.image.length = 0" class="thumb-img" src="../../../../../assets/imgs/default.png">
                            </template>
                        </el-table-column>
                        <el-table-column label="链接" align="center" prop="linkUrl"></el-table-column>
                        <el-table-column label="排序" align="center" type="index">
                            <template slot-scope="scope">
                                <div class="sort">
                                    <i class="el-icon-caret-top sort-icon"
                                        :class="{ disabled: scope.$index === 0 }"
                                        @click="move('up', scope.$index)"></i>
                                    <i class="el-icon-caret-bottom sort-icon"
                                        :class="{ disabled: scope.$index === form.listitem.length - 1 }"
                                        @click="move('down', scope.$index)"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <i class="el-icon-edit func-btn" @click="editItem(scope.row.uid)"></i>
                                <i class="el-icon-delete func-btn" @click="delItem(scope.row.uid)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="store-add" @click="addPicture">
                        + 添加图片
                    </div>
                    <div class="btn-groups">
                        <el-button type="primary" size="small" @click="cancelSelf">取消</el-button>
                        <el-button type="primary" size="small" @click="updateSwipe" :loading="updateLoading">保存</el-button>
                    </div>
                    <el-dialog :visible.sync="addDialog" :title="dialogTitle" width="40%">
                        <el-form label-width="80px">
                            <el-form-item label="图片：">
                                <img-gallery v-if="addDialog" :fileHost="_fileHost.SHOP_IMAGE" repoType="SHOP_IMAGE" v-model="link.image" :limit="1" :showPreview="true">
                                </img-gallery>
                            </el-form-item>
                            <el-form-item label="链接类型：">
                                <el-select v-model="link.linkType" placeholder="请选择跳转链接类型" @change="selectLinkType">
                                    <el-option label="类目" value="CATEGORY"></el-option>
                                    <el-option label="商品" value="PRODUCT"></el-option>
                                    <el-option label="页面" value="PAGE"></el-option>
                                    <el-option label="普通链接" value="LINK"></el-option>
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
                                    v-show="link.linkType === 'CATEGORY'">
                                </el-cascader>
                                <el-select v-model="link.link" v-show="link.linkType === 'PAGE'">
                                    <el-option label="页面一" value="a"></el-option>
                                </el-select>
                                <!-- <el-input v-show="link.linkType === 'LINK'" v-model="link.link"></el-input> -->
                                <el-input v-show="link.linkType === 'LINK' || link.linkType === 'PRODUCT'" v-model="link.linkUrl"></el-input>
                                <!-- <el-select v-model="link.link" v-show="link.linkType === 'PRODUCT'" filterable remote :remote-method="listProduct">
                                    <el-option v-for="(u, i) in productList" :key="i" :label="u.name" :value="u.uid"></el-option>
                                </el-select> -->
                            </el-form-item>
                            <el-form-item label=" ">
                                <el-button size="small" @click="addDialog = false">取消</el-button>
                                <el-button size="small" type="primary" @click="saveItem" :loading="saveLoading">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
            </el-scrollbar>
            
            <!--选择展示的商品弹窗-->
            <el-dialog :visible.sync="showDialogShow" title="选择展示的商品" width="40%">
            <el-input v-model="name" placeholder="请输入商品名称">
                <el-button slot="append" icon="el-icon-search" @click="searchP"></el-button>
            </el-input>
            <div class="product-wrap" ref="productWrap">
                <ul class="content">
                    <li class="radio-item" v-for="(p, index) in productList" :key="index">
                        <el-radio v-model="product" :label="p.uid">{{ p.langtitle || p.cntitle }}</el-radio>
                    </li>
                </ul>
            </div>
            <el-row>
                <el-button size="small" @click="cancel">取消</el-button>
                <el-button size="small" type="primary" @click="confirm">确定</el-button>
            </el-row>
        </el-dialog>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import ImgGallery from '@/components/common/upload/imgGallery'
import { shop, product } from '@/common/api.js'
import { eventHub } from '@/common/share/eventHub'
import BScroll from 'better-scroll'
import { treeFilter } from '@/common/utils/array.js'
import _ from 'underscore'
import { setTimeout } from 'timers';
export default {
    name: 'EditSwipe',
    props: ['uid'],
    data() {
        return {
            form: {},
            dialogTitle: '',
            addDialog: false,
            link: {
                link: '',
                linkType: '',
                uid: 0,
                image: []
            },
            updateLoading: false,
            saveLoading: false,
            linkFlag: 0,
            categorys: [],
            category: [],
            productList: [],
            showDialog: false,
            showDialogShow:false,
            name:'',
            product: '',
            currentPage: 1,
            totalPage: 0,
            reload: true
        }
    },
    created () {
        this.fetchDetail(this.uid)
        this.listAllCategory()
    },
    watch: {
        showDialogShow (newVal, oldVal) {
            if (newVal) {
                this.searchProductShop(1)
            } else {
                this.currentPage = 1
                this.productList = []
                this.name = ''
            }
        },
        'checkCell.uid' (newVal) {
            this.reloadImgGallery()
        }
    },
    methods: {
        cancelSelf () {
            eventHub.$emit('closeEditWrap')
        },
        // 根据商品名称查找商品
        listProduct: _.debounce(function (val) {
            this.$axios.post(product.searchProductShop, {
                categoryuid: 0,
                language: localStorage.lang,
                page: 1,
                pageSize: 15,
                procode: '',
                protitle: val,
                state: 1
            }).then(res => {
                if (res.data.state) {
                    this.productList = res.data.data.datalist
                } else {
                    this.productList = []
                }
            })
        }, 100),
        // 查询所有类目
        listAllCategory () {
            this.$axios.post(product.listAllCategory, {
                language: localStorage.lang
            }).then(res => {
                this.categorys = treeFilter('state', 0, res.data.data)
            })
        },
        // 获取轮播详细信息
        fetchDetail (uid) {
            this.$axios.post(shop.getBlockSlaveAndListItem, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.form = res.data.data
                }
            })
        },
        // 获取单个轮播图信息
        fetchSingleItem (uid) {
            this.$axios.post(shop.getSinglePageBlockItemSlave, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.link.uid = res.data.data.uid
                    this.link.linkType = res.data.data.linkType
                    this.link.linkUrl = res.data.data.linkUrl
                    this.link.image = res.data.data.image
                    this.addDialog = true
                }
            })
        },
        // 添加图片
        addPicture () {
            this.dialogTitle = '添加轮播图片'
            this.addDialog = true
            this.link = {
                image: [],
                link: '',
                linkType: '',
                uid: 0
            }
        },
        // 保存单个轮播图
        saveItem () {
            var url = ''
            this.saveLoading = true
            if (this.link.linkType === 'CATEGORY') {
                this.link.link = this.category[this.category.length - 1]
            } else if (this.link.linkType === 'PRODUCT') {
            } else if (this.linkType === '') {}
            if (this.link.uid) {
                // 修改
                url = shop.updatePageBlockItemSlaveCarousel
            } else {
                url = shop.savePageBlockItemSlaveCarousel
            }
            // 设置提交图片
            var imgs = []
            this.link.image.forEach(item => {
                if (item.storageFile) {
                    imgs.push(item.storageFile)
                } else {
                    imgs.push(item)
                }
            })
            // 添加
            this.$axios.post(url, {
                blockUid: this.form.uid,
                image: imgs,
                link: this.link.linkUrl,
                linkType: this.link.linkType,
                pageUid: this.form.pageUid,
                uid: this.link.uid
            }).then(res => {
                if (res.data.state) {
                    this.addDialog = false
                    this.saveLoading = false
                    this.fetchDetail(this.uid)
                    eventHub.$emit('reloadComponent')
                    this.link.image = []
                } else {
                    this.saveLoading = false
                }
            }).catch(err => {
                this.saveLoading = false
            })
        },
        // 编辑图片
        editItem (uid) {
            this.dialogTitle = '编辑轮播图片'
            this.fetchSingleItem(uid)
        },
        // 更新轮播图属性
        updateSwipe () {
            this.updateLoading = true
            this.$axios.post(shop.updatePageBlockSlaveCarousel, {
                height: this.form.height,
                itemRadius: this.form.itemRadius,
                marginBottom: this.form.marginBottom,
                marginLeft: this.form.marginLeft,
                marginRight: this.form.marginRight,
                marginTop: this.form.marginTop,
                paddingBottom: this.form.paddingBottom,
                paddingLeft: this.form.paddingLeft,
                paddingRight: this.form.paddingRight,
                paddingTop: this.form.paddingTop,
                uid: this.form.uid,
                pageUid: this.form.pageUid
            }).then(res => {
                this.updateLoading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    eventHub.$emit('reloadComponent')
                }
            }).catch(err => {
                this.updateLoading = false
            })
        },
        // 修改轮播图片
        updateImg () {
            this.$axios.post(shop.updatePageBlockItemSlaveCarousel, {})
        },
        // 删除模块子项
        delItem (uid) {
            this.$axios.post(shop.deletePageBlockItemSlave, {
                pageUid: this.uid,
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.fetchDetail(this.uid)
                    // 通知父元素重新加载组件
                    this.$emit('reloadComponent')
                }
            })
        },
        // 查询产品
        remote () {},
        // 轮播排序
        move (flag, index) {
            if (flag === 'up') {
                // 上移
                if (index !== 0) {
                    this.sortAjax(index, index - 1)
                }
            } else if (flag === 'down') {
                // 下移
                if (index < this.form.listitem.length - 1) {
                    this.sortAjax(index, index + 1)
                }
            }
        },
        // 排序接口
        sortAjax (from, to) {
            this.$axios.post(shop.setPageBlockItemSlaveDisplayNo, {
                fromUid: this.form.listitem[from].uid,
                pageUid: this.uid,
                toUid: this.form.listitem[to].uid
            }).then(res => {
                if (res.data.state) {
                    this.fetchDetail(this.uid)
                    this.$message({
                        type: 'success',
                        message: '排序成功'
                    })
                    eventHub.$emit('reloadComponent')
                }
            })
        },
        // 选择链接类型
        selectLinkType (val) {
            if (val === 'NONE') {
                this.link.linkUrl = ''
            } else if (val === 'CATEGORY') {
            } else if (val === 'PAGE') {
            } else if (val === 'PRODUCT') {
                this.showDialogShow = true
            }
        },
        searchP () {
            // 查询商品
            this.currentPage = 1
            this.productList = []
            this.searchProductShop(1)
        },
        // 查询选择商品
        searchProductShop (page) {
            this.$axios.post(product.searchProductShop, {
                categoryuid: 0,
                language: localStorage.lang,
                page: page,
                pageSize: 15,
                procode: '',
                protitle: this.name,
                state: 1
            }).then(res => {
                if (res.data.state) {
                    this.productList = this.productList.concat(res.data.data.dataList)
                    this.totalPage = res.data.data.totalPage
                    if (!this.scroll) {
                        this.$nextTick(function () {
                            this.scroll = new BScroll(this.$refs['productWrap'], {
                                probeType: 1,
                                pullUpLoad: {
                                    threshold: 0
                                },
                                scrollbar: {
                                    fade: true
                                },
                                mouseWheel: true
                            })
                            this.scroll.on('pullingUp', () => {
                                if (this.currentPage < this.totalPage) {
                                    this.currentPage++
                                    this.searchProductShop(this.currentPage)
                                } else {
                                    this.scroll.finishPullUp()
                                }
                                this.scroll.refresh()
                            })
                        })
                    } else {
                        if (this.scroll) {
                            this.scroll.refresh()
                        }
                    }
                    if (this.scroll) {
                        this.scroll.finishPullUp()
                    }
                }
            })
        },
        // 切换商品类型
        conTypeChange (val) {
            if (val === 'product') {
                this.showDialogShow = true
            }
        },
        // 根据uid查询商品
        findItem (uid) {
            for (let p of this.productList) {
                if (p.uid === this.product) {
                    return p
                }
            }
        },
        confirm () {
            if (!this.product) {
                this.$message({
                    type: 'error',
                    message: '请选择一个商品'
                })
            } else {
                var item = this.findItem(this.product)
                // 设置商品标题
                this.link.title = item.cntitle || item.langtitle
                // 设置商品链接
                this.link.linkType = 'PRODUCT'
                this.link.linkUrl = this.product
                this.showDialogShow = false
            }
        },
        cancel () {
            this.showDialogShow = false
        },
    },
    components: {
        ImgGallery
    }
}
</script>

<style scoped lang="less">
.edit-swipe{
    padding: 10px 10px 80px 10px;
    box-sizing: border-box;

}
.func-btn{
    padding: 4px;
}
.btn-groups{
    text-align: center;
    margin-top: 20px;
}
.thumb-img{
    display: inline-block;
    width: 60px;
    height: 40px;
}
.radio-item{
    display: block;
    height: 32px;
    line-height: 32px;
    list-style-type: none;
}
</style>
