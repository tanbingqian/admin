<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="disribution-list">
            <div class="search-wrap">
                <el-button type="text" @click="addBargain">+新增拼团活动</el-button>
            </div>
            <!-- table表格 -->
            <div class="table-wrap" ref="myTable" v-loading="loading" :element-loading-text="$t('loadingText')">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="活动名称"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="recevierName"
                        align="center"
                        label="活动时间"
                        width="180">
                        <template slot-scope="scope">
                            {{ scope.row.startTime }} - {{ scope.row.endTime }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="recevierName"
                        align="center"
                        label="成团有效期"
                        width="180">
                        <template slot-scope="scope">
                            {{ scope.row.startTime }} - {{ scope.row.endTime }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="person"
                        align="center"
                        label="成团人数">
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        align="center"
                        label="商品">
                        <template slot-scope="scope">
                            <img class="bargain-img-thumb" 
                                v-for="(img, index) in scope.row.imageList" 
                                :src="_fileHost.PRODUCT_IMAGE + '/' + img + '?x-oss-process=image/resize,l_100'" 
                                :key="index">
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="状态">
                        <template slot-scope="scope">
                            {{ scope.row.state === 1 ? '生效' : '失效' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="editBargain(scope.row)">编辑</el-button>
                            <el-button type="text" @click="delBargain(scope.row.uid)">删除</el-button>
                            <el-button type="text" @click="setState(scope.row.uid)">{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页组件 -->
            <pager
                :total="totalCount"
                layout="total, sizes, prev, pager, next, jumper"
                :currentPage="currentPage"
                :pageSize="pageSize"
                :sizes="[20, 50, 100]"
                @getCurrentSize="getCurrentSize"
                @getCurrentPage="getCurrentPage">
            </pager>
            <!-- 添加编辑拼团 -->
            <el-dialog :title="dialogTitle" :visible.sync="addDialog">
                <el-form label-width="100px">
                    <el-form-item label="活动名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="活动时间">
                        <el-col :span="8">
                            <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" type="datetime" v-model="form.startTime"></el-date-picker>
                        </el-col>
                        <el-col :span="2" style="text-align: center;">至</el-col>
                        <el-col :span="8">
                            <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" type="datetime" v-model="form.endTime"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="成团有效期">
                        <el-select v-model="form.duration" placeholder="请选择" style="width:253px;">
                            <el-option
                                v-for="item in groupValidity"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="成团人数">
                          <el-input v-model="form.person" style="width:185px;"></el-input>
                    </el-form-item>
                    <el-form-item label="是否包邮">
                        <el-checkbox :true-label="1" :false-label="0" v-model="form.exceptShipfee">包邮</el-checkbox>
                    </el-form-item>
                    <el-form-item label="是否叠加">
                        <el-checkbox :true-label="1" :false-label="0" v-model="form.superpostion">叠加</el-checkbox>
                    </el-form-item>
                    <el-form-item label="商品限购">
                        <el-input v-model="form.number" style="width:100px;"></el-input>&nbsp;&nbsp;件/人
                    </el-form-item>
                    <el-form-item label="砍价商品">
                        <el-table :data="result">
                            <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
                            <el-table-column align="center"  label="SKU" prop="skuValueUidText"></el-table-column>
                            <!-- <el-table-column align="center"  label="底价">
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.price"></el-input>
                                </template>
                            </el-table-column> -->
                            <el-table-column align="center"  label="团购价格">
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.price"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column align="center"  label="操作">
                                <template slot-scope="scope">
                                    <el-button size="small" icon="el-icon-delete" @click="deleteResult(scope.row.uid, scope.row.index)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="text" @click="chooseProduct">+添加商品</el-button>
                    </el-form-item>
                </el-form>
                <div class="tc">
                    <el-button size="small" @click="cancel">&nbsp;&nbsp;&nbsp;&nbsp;取 消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button 
                        size="small" 
                        type="primary"
                        :loading="saveLoading"
                        @click="save">&nbsp;&nbsp;&nbsp;&nbsp;保 存&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </el-dialog>
            <!-- 选择商品 -->
            <el-dialog :visible.sync="proDialog" title="添加商品" width="60%">
                <el-form label-width="80px" label-position="right">
                    <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品编码">
                        <el-input v-model="params.procode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品名称">
                        <el-input v-model="params.protitle"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品类目">
                        <el-cascader
                            :clearable="true"
                            :show-all-levels="false"
                            :options="categorys"
                            :props="{ label: 'categoryName', value: 'uid' }"
                            change-on-select
                            v-model="params.categoryUid"
                            expand-trigger="hover"
                        ></el-cascader>
                        </el-form-item>
                    </el-col>
                    </el-row>
                    <el-row style="text-align: center; margin-bottom: 22px;">
                    <el-button
                        type="primary"
                        size="small"
                        @click="searchProduct(1, pageSize)"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;查 询&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-row>
                </el-form>
                <el-table :data="proList" max-height="400">
                    <el-table-column align="center">
                    <template slot-scope="scope">
                        <el-checkbox @change="handleCheck(scope.row)" v-model="scope.row.isCheck"></el-checkbox>
                    </template>
                    </el-table-column>
                    <el-table-column align="center" label="ID" prop="uid"></el-table-column>
                    <el-table-column align="center" label="商品编码" prop="productCode"></el-table-column>
                    <el-table-column align="center" label="商品名称">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.langtitle ? scope.row.langtitle : scope.row.cntitle }}</template>
                    </el-table-column>
                    <el-table-column align="center" label="供应商" prop="supplierUid"></el-table-column>
                    <el-table-column align="center" label="价格" prop="price"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button v-show="scope.row.productType === 'FIXED'" type="text" @click="chooseSku(scope.row)">选择sku</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页组件 -->
                <pager
                    :style="{'background-color': '#fff'}"
                    :total="total"
                    layout="prev, pager, next"
                    :currentPage="page"
                    :pageSize="size"
                    @getCurrentSize="getProCurrentSize"
                    @getCurrentPage="getProCurrentPage"
                ></pager>
                <el-row style="text-align: center;">
                    <el-button type="primary" size="small" @click="confirmAdd">&nbsp;&nbsp;确认添加&nbsp;&nbsp;</el-button>
                </el-row>
            </el-dialog>
            <!-- sku选择 -->
            <el-dialog
                :visible.sync="checkSkuDialog"
                title="选择sku"
                width="30%"
                >
                <el-row type="flex" v-for="sku in skuValue" :key="sku.uid" style="padding: 10px 0;">
                    <el-col style="padding-right: 20px; padding-left: 20px; width: 40px; text-align: center;">
                    <el-checkbox v-model="sku.isCheck" @change="handleSkuCheck(sku)"></el-checkbox>
                    </el-col>
                    <el-col class="col-body-l">{{ sku.skuValueUidText }}</el-col>
                </el-row>
                <el-row style="padding-top: 30px; text-align:center;">
                    <!-- <el-button type="primary" size="small" @click="checkSkuDialog = false">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button> -->
                    <el-button
                    type="primary"
                    size="small"
                    @click="confirmSku"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-row>
                </el-dialog>
        </div>
    </transition>
</template>
<script>
import Pager from '@/components/common/Pager'
import { promotion, product } from '@/common/api.js'
export default {
    name: 'Bargain',
    created () {
        this.fetchData(this.currentPage, this.pageSize)
        this.fetchCategory()
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            tableData: [],
            addDialog: false,
            dialogTitle: '',
            form: {
                name: '',
                endTime: '',
                startTime: '',
                exceptShipfee: 0,
                listProductSku: [],
                promotionType: 'GROUPON',
                productCollection: 1,
                uid: 0,
                duration:'',
                person:'', //成团人数
                number:'', //商品限购
                superpostion:'', //是否叠加
            },
             groupValidity:[{
                    value: '24',
                    label: '24小时'
                    }, {
                    value: '36',
                    label: '36小时'
                    }, {
                    value: '48',
                    label: '48小时'
                    }],
            saveLoading: false,
            flag: 'add',
            categorys: [],
            params: {
                categoryUid: [],
                procode: '',
                protitle: ''
            },
            proDialog: false,
            page: 1, //选择商品列表分页
            size: 10,
            total: 0,
            proList: [],
            checkSkuDialog: false,
            skuValue: [],
            currentGood: null,
            result: [], // 砍价商品
            tempList: [] // 临时存储即将添加到砍价商品的sku数据
        }
    },
    methods: {
        // 设置状态
        setState (uid) {
            this.$axios.post(promotion.setState, {
                uid: uid,
                lang: localStorage.lang
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    this.fetchData(1, this.pageSize)
                }
            })
        },
        //删除整行商品
        delBargain (uid) {
            this.$axios.post(promotion.deletePromotionPlan, {
                uid: uid,
                lang: localStorage.lang
            }).then(res => {
                if (res.data.state) {
                    this.fetchData(1, this.pageSize)
                }
            })
        },
        chooseProduct () {
            this.searchProduct(1, this.size)
            this.proDialog = true
            // 将result数据添加到tempList中
            this.result.forEach(item => {
                this.tempList.push(item)
            })
        },
        editBargain (item) {
            this.addDialog = true
            this.dialogTitle = '编辑拼团'
            this.flag = 'edit'
            this.result.splice(0)
            this.getBargainDetail(item.uid)
        },
        //修改返回
        getBargainDetail (uid) {
            this.$axios.post(promotion.getPromotionGrouponPlan, {
                uid: uid,
                lang: localStorage.lang
            }).then(res => {
                if (res.data.state) {
                    this.form.name = res.data.data.name
                    this.form.startTime = res.data.data.startTime
                    this.form.endTime = res.data.data.endTime
                    this.form.exceptShipfee = res.data.data.exceptShipfee
                    this.form.person = res.data.data.person
                    this.form.number = res.data.data.number
                    this.form.duration = res.data.data.duration
                    this.form.superpostion = res.data.data.superpostion
                    this.form.uid = res.data.data.uid
                    let list = res.data.data.listProduct
                    if (list) {
                        list.forEach(tmp => {
                            this.result.push({
                                name: tmp.productTitle,
                                productUid: tmp.productUid,
                                skuUid: tmp.skuUid,
                                skuValueUidText: tmp.skuValue,
                                price: tmp.price, // 团购价格
                                number: tmp.number, //库存
                                promotionUid: tmp.promotionUid,
                                uid: tmp.uid
                            })
                        })
                    }
                }
            })
        },
        addBargain () {
            this.flag = 'add'
            this.dialogTitle = '新增拼团'
            this.addDialog = true
            this.form.name = ''
            this.form.startTime = ''
            this.form.endTime = ''
            this.form.exceptShipfee = 0
            this.form.superpostion = 0
            this.form.person = 0
            this.form.number = 0
            this.form.uid = 0
            this.form.listProductSku.splice(0)
        },
        cancel () {
            this.addDialog = false
        },
        getCurrentSize (size) {
            this.fetchData(1, size)
        },
        getCurrentPage (num) {
            this.fetchData(num, this.pageSize)
        },
        //拼团列表
        fetchData (pageNum, pageSize) {
            this.currentPage = pageNum
            this.pageSize = pageSize
            this.loading = true
            this.$axios.post(promotion.lsitPromotionGrouponPlan, {
                lang: localStorage.lang,
                pageSize: this.pageSize,
                page: this.currentPage
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    if (res.data.data) {
                        this.tableData = res.data.data.dataList
                        this.totalCount = res.data.data.totalCount
                    } else {
                        this.tableData = []
                        this.totalCount = 0
                    }
                }
            }).catch(err => {
                this.loading = false
                this.$message({
                    type: 'error',
                    message: '获取数据失败'
                })
            })
        },
        //选择商品列表分页
        getProCurrentSize (size) {
            this.searchProduct(1, size)
        },
        getProCurrentPage (num) {
            this.searchProduct(num, this.size)
        },
        // 判断临时列表tempLsit商品是否已经添加到拼团列表
        isAlreadyInBargain (item, arr) {
            if (item.skuUid === 0) {
                // 非成品，没有sku
                const index = arr.findIndex(ele => ele.productUid === item.productUid)
                return index > -1
            } else {
                // 成品商品，存在sku
                const index = arr.findIndex(ele => ele.skuUid === item.skuUid)
                return index > -1
            }
        },
        // 判断商品是否已在临时列表中
        proIsAlreadyInTemp (pro, arr) {
            const index = arr.findIndex(tmp => pro.uid === tmp.productUid)
            return index > -1
        },
        // 判断sku是否已在临时列表中
        skuIsAlreadyInTemp (item, arr) {
            const index = arr.findIndex(tmp => item.uid === tmp.skuUid)
            return index > -1
        },
        //获取商品列表
        searchProduct (page, size) {
            this.$axios.post(product.searchProductApi, {
                page: page,
                pageSize: size,
                procode: this.params.procode,
                protitle: this.params.protitle,
                language: this._defaultLang,
                state: 1,
                protype: '',
                categoryuid: this.params.categoryUid.length > 0 ? this.params.categoryUid[this.params.categoryUid.length - 1] : 0
            }).then(res => {
                if (res.data.state) {
                    this.proList = res.data.data.dataList
                    // 设置商品的勾选状态
                    this.proList.forEach(p => {
                        if (this.proIsAlreadyInTemp(p, this.tempList)) {
                            this.$set(p, 'isCheck', true)
                        } else {
                            this.$set(p, 'isCheck', false)
                        }
                    })
                    // 判断数据是否已在tempList中
                    this.total = res.data.data.totalCount
                }
            })
        },
        // 选择sku按钮
        chooseSku (item) {
            item.isCheck = true
            this.handleCheck(item)
        },
        //勾选商品
        handleCheck (item) {
            // 判断商品类型，添加到勾选列表
            if (item.productType === 'FIXED') {
                this.$axios.post(product.listProductSkuValueLang, {
                    lang: localStorage.lang,
                    uid: item.uid
                }).then(res => {
                    if (item.isCheck) {
                        // 选中时，判断是否存在sku
                        if (res.data.data.length > 0) {
                            // 有sku，显示sku列表选择
                            this.checkSkuDialog = true
                            this.skuValue = res.data.data
                            // 设置sku的选中状态
                            this.skuValue.forEach(item => {
                                if (this.skuIsAlreadyInTemp(item, this.tempList)) {
                                    this.$set(item, 'isCheck', true)
                                } else {
                                    this.$set(item, 'isCheck', false)
                                }
                            })
                            this.currentGood = item
                        } else {
                            this.$message({
                                type: 'error',
                                message: '该成品商品没有sku，无法添加'
                            })
                        }
                    } else {
                        // 取消选中，tempList移除该商品所有的sku数据
                        this.tempList.forEach((tmp, index) => {
                            if (tmp.productUid === item.uid) {
                                this.tempList.splice(index, 1)
                            }
                        })
                    }
                })
            } else {
                // 不是成品商品，不存在sku
                if (item.isCheck) {
                    // 没有sku的数据，勾选后直接添加到临时列表tempList中
                    if (!this.proIsAlreadyInTemp(item, this.tempList)) {
                        this.tempList.push({
                            name: item.langtitle,
                            productUid: item.uid,
                            skuUid: 0,
                            skuValueUidText: '',
                            price: 0, // 团购价格
                            number: 0, //库存
                            promotionUid: 0,
                            uid: 0
                        })
                    }
                } else {
                    // 取消直接在临时列表删除该数据
                    const index = this.tempList.findIndex(tmp => tmp.uid === item.uid)
                    if (index > -1) this.tempList.splice(index, 1)
                }
            }
        },
        // 删除砍价商品
        deleteResult (uid, index) {
            // if (uid === 0) {
            //     this.result.splice(index, 1)
            // } else {
            //     this.$axios.post(promotion.deleteGroupShopping, {
            //         uid: uid,
            //         lang: localStorage.lang
            //     }).then(res => {
            //         if (res.data.state) {
            //             this.result.splice(index, 1)
            //         }
            //     })
            // }
            this.$axios.post(promotion.deleteGroupShopping, {
                    uid: uid,
                    lang: localStorage.lang
            }).then(res => {
                if (res.data.state) {
                    this.result.splice(index, 1)
                }
            })
        },
        // 选择取消sku
        handleSkuCheck (sku) {},
        // 确认sku，添加
        confirmSku () {
            this.skuValue.forEach(item => {
                if (item.isCheck && !this.skuIsAlreadyInTemp(item, this.tempList)) {
                    this.tempList.push({
                        name: this.currentGood.langtitle,
                        productUid: this.currentGood.uid,
                        skuUid: item.uid,
                        skuValueUidText: item.skuValueUidText,
                        price: 0, // 团购价格
                        number: 0, //库存
                        promotionUid: 0,
                        uid: 0
                    })
                }
            })
            this.checkSkuDialog = false
        },
        // 确认添加
        confirmAdd () {
            // 判断临时列表tempList数据是否已在砍价列表中
            this.tempList.forEach(tmp => {
                if (!this.isAlreadyInBargain(tmp, this.result)) {
                    this.result.push({
                        name: tmp.name,
                        productUid: tmp.productUid,
                        skuUid: tmp.skuUid,
                        skuValueUidText: tmp.skuValueUidText,
                        price: tmp.price, // 团购价格
                        number: tmp.number, //库存
                        promotionUid: tmp.promotionUid,
                        uid: tmp.uid
                    })
                }
            })
            this.proDialog = false
            // 清空临时列表tempList
            this.tempList.splice(0)
        },
        fetchCategory() {
            this.$axios
                .post(product.listAllCategory, {
                    language: localStorage.lang
                })
                .then(res => {
                if (res.data.state) {
                    this.categorys = res.data.data
                }
            });
        },
        save () {
            this.form.listProductSku = this.result
            let url = ''
            if (this.flag === 'add') {
                url = promotion.savePromotionGrouponPlan
            } else {
                url = promotion.saveUpdatePromotionGrouponPlan
            }
             //保存时判断是否有SKU
            if(this.form.listProductSku.length==0){
               alert("请填写SKU")
            }else{
                this.$axios.post(url, this.form).then(res => {
                    this.saveLoading = false
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        })
                        this.fetchData(1, this.pageSize)
                        this.addDialog = false
                        // 保存成功后清空数据
                        this.result.splice(0)
                    }
                }).catch(err => {
                    this.saveLoading = false
                })
            }
           
        }
    },
    components: {
        Pager
    }
}
</script>

<style lang="less" scoped>
.bargain-img-thumb{
    width: 60px;
    height: 40px;
    margin: 2px;
    object-fit: cover;
}
.pd-t{
    padding-top: 40px;
}
.pick-product{
    width: 80%;
    height: 400px;
    border: 1px solid #ebebeb;
    box-sizing: border-box;
    padding: 10px;
    .pick-btn{
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        border: 1px dashed #169BD5;
        box-sizing: border-box;
        color: #169BD5;
        cursor: pointer;
    }
}
</style>


