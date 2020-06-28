<template>
    <div>
        <el-form label-width="80px">
            <el-form-item label="模块内容">
                <el-radio-group v-model="conType" @change="conTypeChange">
                    <el-radio label="product">产品</el-radio>
                    <el-radio label="custom">自定义</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="标题">
                        <el-input v-model="checkCell.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" style="line-height: 32px; margin-left: 10px;">
                    <el-checkbox v-model="checkCell.showTitle" :true-label="0" :false-label="1">不显示</el-checkbox>
                </el-col>
            </el-row>
            <el-form-item label=" ">
                <el-row :gutter="5">
                    <el-col class="label" style="width: 44px;">
                        字号：
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model.number="checkCell.titleFontSize" placeholder="px"></el-input>
                    </el-col>
                    <el-col :span="2" class="label">
                        <el-color-picker size="small" v-model="checkCell.titleColor"></el-color-picker>
                    </el-col>
                    <el-col class="label" style="width: 70px;">
                        标题行数：
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model.number="checkCell.titleRows"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-row>
                <el-col :span="16">
                    <el-form-item label="副标题">
                        <el-input v-model="checkCell.subTitle"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4" style="line-height: 32px; margin-left: 10px;">
                    <el-checkbox v-model="checkCell.showSubtitle" :true-label="0" :false-label="1">不显示</el-checkbox>
                </el-col>
            </el-row>
            <el-form-item label=" ">
                <el-row :gutter="5">
                    <el-col style="width: 44px;" class="label">
                        字号：
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model.number="checkCell.subTitleFontSize" placeholder="px"></el-input>
                    </el-col>
                    <el-col :span="2" class="label">
                        <el-color-picker size="small" v-model="checkCell.subTitleColor"></el-color-picker>
                    </el-col>
                    <el-col style="width: 70px;" class="label">
                        标题行数：
                    </el-col>
                    <el-col :span="4">
                        <el-input v-model.number="checkCell.subTitleRows"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="图片">
                <img-gallery v-if="reload" repoType="SHOP_IMAGE" :fileHost="_fileHost.SHOP_IMAGE" v-model="checkCell.image" :limit="1" :showPreview="true"></img-gallery>
            </el-form-item>
            <el-form-item label="背景颜色">
                <el-color-picker size="small" v-model="checkCell.background"></el-color-picker>
            </el-form-item>
            <el-form-item label="链接类型">
                <el-select v-model="checkCell.linkType" @change="selectLinkType">
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
                    v-show="checkCell.linkType === 'CATEGORY'">
                </el-cascader>
                <el-select v-model="checkCell.linkUrl" v-show="checkCell.linkType === 'PAGE'">
                    <el-option label="页面一" value="a"></el-option>
                </el-select>
                <el-input v-show="checkCell.linkType === 'LINK' || checkCell.linkType === 'PRODUCT'" v-model="checkCell.linkUrl"></el-input>
            </el-form-item>
            <el-form-item label=" ">
                <el-button size="small" @click="closeSelf">取消</el-button>
                <el-button size="small" type="primary" @click="save" :loading="loading">保存</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="showDialog" title="选择展示的商品" width="40%">
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
</template>

<script type="text/ecmascript-6">
import ImgGallery from '@/components/common/upload/imgGallery'
import { shop, product } from '@/common/api.js'
import { eventHub } from '@/common/share/eventHub'
import BScroll from 'better-scroll'
import { treeFilter } from '@/common/utils/array.js'
export default {
    name: 'EditCubeContent',
    props: ['pageUid', 'moduleUid', 'checkCell'],
    data() {
        return {
            loading: false,
            categorys: [],
            category: [],
            conType: 'custom',
            showDialog: false,
            productList: [],
            name: '',
            product: '',
            currentPage: 1,
            totalPage: 0,
            reload: true
        }
    },
    created () {
        this.listAllCategory()
    },
    watch: {
        showDialog (newVal, oldVal) {
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
        // 重新加载图片组件
        reloadImgGallery () {
            this.reload = false
            this.$nextTick(function () {
                this.reload = true
            })
        },
        // 关闭编辑窗
        closeSelf () {
            eventHub.$emit('closeEditWrap')
        },
        confirm () {
            if (!this.product) {
                this.$message({
                    type: 'error',
                    message: '请选择一个商品'
                })
            } else {
                var item = this.findItem(this.product)
                console.log(this.checkCell.title)
                // 设置商品标题
                this.checkCell.title = item.cntitle || item.langtitle
                // 设置商品链接
                this.checkCell.linkType = 'PRODUCT'
                this.checkCell.linkUrl = this.product
                this.showDialog = false
            }
        },
        cancel () {
            this.showDialog = false
        },
        // 切换商品类型
        conTypeChange (val) {
            if (val === 'product') {
                this.showDialog = true
            }
        },
        // 选择链接类型
        selectLinkType (val) {
            if (val === 'NONE') {
                this.checkCell.linkUrl = ''
            } else if (val === 'CATEGORY') {
            } else if (val === 'PAGE') {
            } else if (val === 'PRODUCT') {
                this.showDialog = true
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
        // 根据uid查询商品
        findItem (uid) {
            for (let p of this.productList) {
                if (p.uid === this.product) {
                    return p
                }
            }
        },
        // 查询所有类目
        listAllCategory () {
            this.$axios.post(product.listAllCategory, {
                language: localStorage.lang
            }).then(res => {
                this.categorys = treeFilter('state', 0, res.data.data)
            })
        },
        save () {
            if (this.checkCell.linkType === 'NONE') {
                this.checkCell.linkUrl = ''
            } else if (this.checkCell.linkType  === 'CATEGORY') {
                if (this.category.length > 0) {
                    this.checkCell.linkUrl = this.category[this.category.length - 1]
                } else {
                    this.checkCell.linkUrl = ''
                }
            } else if (this.checkCell.linkType  === 'PAGE') {}
            this.loading = true
            let imgs = []
            this.checkCell.image.forEach(item => {
                if (item.storageFile) {
                    imgs.push(item.storageFile)
                } else {
                    imgs.push(item)
                }
            })
            this.$axios.post(shop.saveSinglePageBlockItemSlave, {
                "background": this.checkCell.background,
                "blockUid": this.checkCell.blockUid,
                "imageUrl": this.checkCell.imageUrl,
                "linkType": this.checkCell.linkType,
                "linkUrl": this.checkCell.linkUrl,
                "pageUid": this.pageUid,
                "showSubtitle": this.checkCell.showSubtitle,
                "showTitle": this.checkCell.showTitle,
                "subTitle": this.checkCell.subTitle,
                "subTitleFontSize": this.checkCell.subTitleFontSize,
                "subTitleRows": this.checkCell.subTitleRows,
                "title": this.checkCell.title,
                "titleFontSize": this.checkCell.titleFontSize,
                "titleRows": this.checkCell.titleRows,
                "uid": this.checkCell.uid,
                "titleColor": this.checkCell.titleColor,
                "subTitleColor": this.checkCell.subTitleColor,
                "image": imgs
            }).then(res => {
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
        }
    },
    components: {
        ImgGallery
    },
    beforeDestroy () {
        if (this.scroll) {
            this.scroll.destroy()
        }
    }
}
</script>

<style scoped lang="less">
.label{
    font-size: 12px;
    color: #333;
}
.product-wrap{
    height: 300px;
    overflow: hidden;
    padding: 20px;
    margin: 10px 0;
    border: 1px solid #ebebeb;
}
.content{
    margin: 0;
    padding: 0;
}
.radio-item{
    display: block;
    height: 32px;
    line-height: 32px;
    list-style-type: none;
}
</style>
