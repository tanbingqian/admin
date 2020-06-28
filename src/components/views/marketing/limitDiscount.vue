<template>
    <div class="distribution-list">
        <el-button type="text" @click="addDiscount">+新增限时折扣</el-button>
        <el-table :data="tableData">
            <el-table-column align="center" label="活动名称" prop="name"></el-table-column>
            <el-table-column align="center" label="折扣" prop="discountValue"></el-table-column>
            <el-table-column align="center" label="活动时间" prop="">
                <template slot-scope="scope">
                    {{ scope.row.startTime }} - {{ scope.row.endTime }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="限购设置" prop="">
                <template slot-scope="scope">
                    {{ scope.row.restrictions === 0 ? '不限购' : '限购' + scope.row.restrictions + '件' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    {{ scope.row.state === 1 ? '生效' : '失效' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" @click="delDiscount(scope.row)">删除</el-button>
                    <el-button type="text" @click="setState(scope.row.uid)">{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button>
                </template>
            </el-table-column>
        </el-table>
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
        <!-- 限时折扣设置 -->
        <el-dialog title="限时折扣设置" :visible.sync="discountDialog">
            <el-form label-width="80px" label-position="right">
                <el-form-item label="活动名称" require>
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker type="datetime" value-format="yyyy-MM-dd hh:mm:ss" v-model="form.startTime"></el-date-picker> - 
                    <el-date-picker type="datetime" value-format="yyyy-MM-dd hh:mm:ss" v-model="form.endTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="活动标签">
                    <el-input v-model="form.label"></el-input>
                </el-form-item>
                <el-form-item label="限购设置">
                    <el-radio v-model="limitFlag" label="nolimit">不限购</el-radio>
                    <el-radio v-model="limitFlag" label="limited">
                        每人每种商品限购
                        <el-input style="width: 100px" 
                            :disabled="limitFlag === 'nolimit'" 
                            v-model.number="form.restrictions"></el-input>件
                    </el-radio>
                </el-form-item>
                <el-form-item label="会员等级">
                    <el-select style="width: 60%" multiple :collapse-tags="false" v-model="form.listLevelUid">
                        <el-option :disabled="form.listLevelUid.length > 0 && form.listLevelUid.indexOf('all') < 0" label="全部" value="all"></el-option>
                        <el-option
                            :disabled="form.listLevelUid.indexOf('all') > -1" 
                            v-for="item in levelList" 
                            :key="item.uid"
                            :label="item.levelName"
                            :value="item.uid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设置折扣">
                    <el-radio v-model="form.discountType" label="RATE">
                        全部打折<el-input style="width: 100px" v-model.number="form.discountRate"></el-input>折
                    </el-radio>
                    <el-radio v-model="form.discountType" label="AMOUNT">
                        全部减价<el-input style="width: 100px" v-model.number="form.discountPrice"></el-input>价
                    </el-radio>
                </el-form-item>
                <el-form-item label="是否可以使用优惠券">
                    <el-checkbox :true-label="1" :false-label="0" v-model="form.superpostion"></el-checkbox>
                </el-form-item>
                <el-form-item label="活动产品">
                    <el-checkbox 
                        v-model="form.productCollection"
                        :disabled="result.length > 0" 
                        :true-label="0" 
                        :false-label="1">全部商品</el-checkbox>
                    <div class="goods-wrap">
                        <div class="image-wrap" 
                            v-for="(res, index) in result" 
                            :key="index" 
                            :style="{ backgroundImage: 'url('+ _fileHost.PRODUCT_IMAGE +  res.firstImage + '?x-oss-process=image/resize,l_100' +')' }">
                            <i class="el-icon-delete del-icon" @click="delGoodsItem(res)"></i> 
                        </div>
                        <div class="add-btn" @click="chooseProduct">+</div>
                    </div>
                </el-form-item>
                <div class="tc">
                    <el-button size="small" @click="discountDialog = false">&nbsp;&nbsp;&nbsp;&nbsp;取 消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button 
                        size="small" 
                        type="primary"
                        :loading="saveLoading"
                        @click="save">&nbsp;&nbsp;&nbsp;&nbsp;保 存&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </el-form>
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
    </div>
</template>

<script>
// COUPON优惠券/TIME_LIMITED_DISCOUNT限时折扣/SUIT优惠套餐/BUY_GET_FREE买赠/GROUPON拼团/BARGAIN砍价
import Pager from '@/components/common/Pager'
import { promotion, product, member } from '@/common/api.js'
export default {
    name: 'LimitDiscount',
    created () {
        this.fetchData(1, this.pageSize)
        this.fetchCategory()
        this.getMemberLevels()
    },
    data () {
        return {
            proDialog: false,
            discountDialog: false,
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            tableData: [],
            flag: 'add',
            saveLoading: false,
            limitFlag: 'nolimit',
            isCheckAll: false,
            form: {
                discountRate: '',
                discountPrice: '',
                description: '',
                discountType: 'RATE',
                discountValue: 0,
                endTime: '',
                listLevelUid: [],
                listProductSku: [],
                memberLevelCollection: 0, // 全部传0，其他选项设为1
                minOrderAmount: 0,
                name: '',
                productCollection: 0,
                productCollectionType: 0,
                promotionType: 'TIME_LIMITED_DISCOUNT',
                startTime: '',
                label: '',
                restrictions: '',
                superpostion: 0
            },
            page: 1, //选择商品列表分页
            size: 10,
            total: 0,
            proList: [],
            result: [],
            tempList: [],
            params: {
                categoryUid: [],
                procode: '',
                protitle: ''
            },
            categorys: [],
            levelList: [], // 会员等级列表
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
        // 删除单个活动
        delDiscount (item) {
            this.$axios.post(promotion.deletePromotionPlan, {
                uid: item.uid,
                lang: localStorage.lang
            }).then(res => {
                if (res.data.state) {
                    this.fetchData(1, this.pageSize)
                }
            })
        },
        // 删除单项
        delGoodsItem (item) {
            const index = this.result.findIndex(res => res.productUid === item.productUid)
            this.result.splice(index)
        },
        edit (item) {
            this.flag = 'edit'
            this.$axios.post(promotion.discountDetail, {
                lang: localStorage.lang,
                uid: item.uid
            }).then(res => {
                if (res.data.data) {
                    this.discountDialog = true
                    this.form.name = res.data.data.name
                    this.form.discountType = res.data.data.discountType
                    this.form.endTime = res.data.data.endTime
                    this.form.startTime = res.data.data.startTime
                    this.form.memberLevelCollection = res.data.data.memberLevelCollection
                    this.form.superpostion = res.data.data.superpostion
                    if (res.data.data.listLevelUid) {
                        this.form.listLevelUid = res.data.data.listLevelUid
                    } else {
                        this.form.listLevelUid = []
                    }
                    this.form.label = res.data.data.label
                    this.form.restrictions = res.data.data.restrictions
                    this.form.uid = res.data.data.uid
                    // 限购设置字段
                    if (res.data.data.restrictions === 0) {
                        this.limitFlag = 'nolimit'
                    } else {
                        this.limitFlag = 'limited'
                    }
                    // 折扣设置字段
                    if (this.form.discountType === 'RATE') {
                        this.form.discountRate = res.data.data.discountValue
                    } else {
                        this.form.discountPrice = res.data.data.discountValue
                    }
                    let listProduct = res.data.data.listProduct
                    if (listProduct) {
                        listProduct.forEach(pro => {
                            this.result.push({
                                productUid: pro.productUid,
                                skuUid: 0,
                                firstImage: pro.firstImage
                            })
                        })
                    }
                }
            })
        },
        // 保存
        save () {
            this.saveLoading = true
            let url = ''
            if (this.flag === 'add') {
                url = promotion.discountAdd
                // 会员等级
                if (this.form.listLevelUid.indexOf('all') < 0 && this.form.listLevelUid.length > 0) {
                    this.form.memberLevelCollection = 1
                }
                // 是否是全部商品
                if (this.result.length > 0) {
                    this.form.productCollection = 1
                } else {
                    this.form.productCollection = 0
                }
            } else {
                url = promotion.discountUpdate
                // 会员等级
                if (this.form.listLevelUid.indexOf('all') < 0 && this.form.listLevelUid.length > 0) {
                    this.form.memberLevelCollection = this.form.uid
                } else {
                    this.form.memberLevelCollection = 0                    
                }
                if (this.result.length > 0) {
                    this.form.productCollection = this.form.uid
                } else {
                    this.form.productCollection = 0
                }
            }
            // 折扣设置
            if (this.form.discountType === 'RATE') {
                this.form.discountValue = this.form.discountRate
            } else {
                this.form.discountValue = this.form.discountPrice
            }
            // 限购设置
            if (this.limitFlag === 'nolimit') {
                this.form.restrictions = 0
            }
            
            this.form.listProductSku = this.result
            this.$axios.post(url, this.form).then(res => {
                this.saveLoading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    this.discountDialog = false
                    this.result.splice(0)
                    this.tempList.splice(0)
                    this.fetchData(1, 50)
                }
            }).catch(err => {
                this.saveLoading = false
            })
        },
        // 确认添加
        confirmAdd () {
            this.tempList.forEach(tmp => {
                if (!this.tempDataIsInResult(tmp, this.result)) {
                    this.result.push({
                        productUid: tmp.productUid,
                        skuUid: tmp.skuUid,
                        firstImage: tmp.firstImage
                    })
                }
            })
            this.proDialog = false
            this.tempList.splice(0)
        },
        // 勾选商品
        handleCheck (item) {
            if (item.isCheck) {
                // 选中
                this.tempList.push({
                    productUid: item.uid,
                    skuUid: 0,
                    firstImage: item.imageList[0]
                })
            } else {
                const index = this.tempList.findIndex(ele => ele.productUid === item.uid)
                this.tempList.splice(index, 1)
            }
        },
        // 判断商品是否已在临时列表中
        proIsAlreadyInTemp (pro, arr) {
            const index = arr.findIndex(tmp => pro.uid === tmp.productUid)
            return index > -1
        },
        // 判断临时列表的数据是否已在result中
        tempDataIsInResult (pro, arr) {
            const index = arr.findIndex(tmp => pro.productUid === tmp.productUid)
            return index > -1
        },
        chooseProduct () {
            if (this.form.productCollection === 1) {
                this.$message({
                    type: 'error',
                    message: '已选择全部商品，无法添加单个商品'
                })
                return
            }
            this.searchProduct(1, this.size)
            this.proDialog = true
            // 将result数据添加到tempList中
            this.result.forEach(item => {
                this.tempList.push(item)
            })
        },
        //选择商品列表分页
        getProCurrentSize (size) {
            this.searchProduct(1, size)
        },
        getProCurrentPage (num) {
            this.searchProduct(num, this.size)
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
                    this.total = res.data.data.totalCount
                }
            })
        },
        // 新增限时折扣
        addDiscount () {
            this.flag = 'add'
            this.discountDialog = true
            this.form.name = ''
            this.form.discountType = 'RATE'
            this.form.endTime = ''
            this.form.startTime = ''
            this.form.listLevelUid = []
            this.form.label = ''
            this.form.restrictions = 0
            this.limitFlag = 'nolimit'
            this.form.discountRate = ''
            this.form.discountPrice = ''
            this.form.superpostion = 0
            this.form.uid = 0
            this.tempList.splice(0)
            this.result.splice(0)
        },
        getCurrentSize (size) {
            this.fetchData(1, size)
        },
        getCurrentPage (num) {
            this.fetchData(num, this.pageSize)
        },
        // 限时折扣列表
        fetchData (pageNum, pageSize) {
            this.currentPage = pageNum
            this.pageSize = pageSize
            this.loading = true
            this.$axios.post(promotion.discountList, {
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
        // 会员等级列表
        getMemberLevels () {
            this.$axios.post(member.listmemberlevel).then(res => {
                if (res.data.state) {
                    this.levelList = res.data.data
                }
            })
        }
    },
    components: {
        Pager
    }
}
</script>

<style lang="less" scoped>
.goods-wrap{
    height: 200px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #ebebeb;
    .image-wrap{
        position: relative;
        float: left;
        width: 60px;
        height: 60px;
        margin-right: 10px;
        margin-bottom: 10px;
        background-size: contain;
        background-repeat: no-repeat;
        .del-icon{
            position: absolute;
            top: 0;
            right: 0;
            color: red;
            opacity: 0;
        }
    }
    .add-btn{
        float: left;
        width: 60px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        border: 1px dashed #0070ae;
        color: #0070ae;
        cursor: pointer;
    }
}
.image-wrap:hover .del-icon{
    opacity: 1;
}
</style>
