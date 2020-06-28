<template>
    <div class="type-auth">
        <el-form label-width="80px" label-position="right">
            <el-row>
                <el-col :span="8">
                    <el-form-item :label="$t('pCode')">
                        <el-input v-model="authParam.procode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('pName')">
                        <el-input v-model="authParam.protitle"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="$t('pType')">
                        <el-cascader
                            :clearable="true"
                            :show-all-levels="false"
                            :options="categorys"
                            :props="{ label: 'categoryName', value: 'categoryUid' }"
                            change-on-select
                            v-model="authParam.category"
                            expand-trigger="hover">
                        </el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="text-align: center; margin-bottom: 22px;">
                <el-col>
                    <el-button type="primary" size="small" @click="fetchAuthList">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('search') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-col>
            </el-row>
        </el-form>
        <p>
            <span class="type-title">{{ levelName }}-{{ $t('goodsAuth') }}</span>
            <span class="add-type" @click="addGoodsAuth">{{ $t('add') }}</span>
        </p>
        <el-row>
            <el-col>
                <el-table :data="authList" max-height="400">
                    <el-table-column label="ID" prop="productUid"></el-table-column>
                    <el-table-column :label="$t('goodsId')" prop="procode"></el-table-column>
                    <el-table-column :label="$t('pName')">
                        <template slot-scope="scope">
                            {{ scope.row.protitle }}
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('price')" prop="price"></el-table-column>
                    <el-table-column :label="$t('resellerPurchansePrice')" prop="priceShow"></el-table-column>
                    <el-table-column :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text" @click="editFixAuthProduct(scope.row, 'edit')">{{ $t('edit') }}</el-button>
                            <el-button type="text" @click="removeAuthProduct(scope.row.productUid)">{{ $t('delete') }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!-- 商品列表dialog -->
        <el-dialog :visible.sync="showDialog" :title="$t('addGoodsAuth')" width="60%">
            <el-form label-width="80px" label-position="right">
                <el-row>
                    <el-col :span="8">
                        <el-form-item :label="$t('pCode')">
                            <el-input v-model="params.procode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('pName')">
                            <el-input v-model="params.protitle"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('pType')">
                            <el-cascader
                                :clearable="true"
                                :show-all-levels="false"
                                :options="categorys"
                                :props="{ label: 'categoryName', value: 'categoryUid', children: 'children' }"
                                change-on-select
                                v-model="params.category"
                                expand-trigger="hover">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: center; margin-bottom: 22px;">
                    <el-button type="primary" size="small" 
                    @click="fetchData(1, pageSize)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('search') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-row>
            </el-form>
            <el-table ref="goodsTable" :data="tableData" max-height="300" highlight-current-row @current-change="handleChange">
                <el-table-column align="center" label="ID" prop="uid"></el-table-column>
                <el-table-column align="center" :label="$t('pCode')" prop="productCode"></el-table-column>
                <el-table-column align="center" :label="$t('pName')" prop="productTitle">
                    <template slot-scope="scope">
                        {{ scope.row.langtitle ? scope.row.langtitle : scope.row.cntitle }}
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" label="供应商" prop="supplierUid"></el-table-column>
                <el-table-column align="center" label="商品类型" prop="productType"></el-table-column> -->
                <el-table-column align="center" :label="$t('state')">
                    <template slot-scope="scope">
                        {{ scope.row.state === 0 ? $t('offShop') : $t('onShop') }}
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <pager
                :style="{'background-color': '#fff'}"
                :total="totalCount"
                layout="prev, pager, next"
                :currentPage="currentPage"
                :pageSize="pageSize"
                @getCurrentSize="getCurrentSize"
                @getCurrentPage="getCurrentPage">
            </pager>
        </el-dialog>
        <!-- 定制商品 -->
        <el-dialog :visible.sync="customDialog" :title="$t('setGoodsAuth')">
            <el-form label-position="right" label-width="80px" :model="form" :rules="rules" ref="goodsForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="ID：">{{ selectGoods.uid }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('pCode') + '：'">{{ selectGoods.productCode }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row style="border-bottom: 1px solid #f6f6f6; margin-bottom: 30px;">
                    <el-col :span="12">
                        <el-form-item :label="$t('pName') + '：'">{{ selectGoods.langtitle ? selectGoods.langtitle : selectGoods.langtitle}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('price') + '：'">{{ selectGoods.price }}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('resellerPrice')" prop="price">
                            <el-input v-model="form.price"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: center;">
                    <el-button type="primary" size="small" @click="saveAuthProduct" 
                    :loading="typeLoading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-row>
            </el-form>
        </el-dialog>
        <!-- 成品商品 -->
        <el-dialog :visible.sync="fixDialog" :title="$t('setGoodsAuth')">
            <el-form label-position="right" label-width="80px" :model="form" :rules="rules" ref="goodsForm">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="ID：">{{ selectGoods.uid }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('pCode') + '：'">{{ selectGoods.productCode }}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item :label="$t('pName') + '：'">{{ selectGoods.langtitle ? selectGoods.langtitle : selectGoods.langtitle}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex">
                    <el-col class="col-header">SKU</el-col>
                    <el-col class="col-header">{{ $t('price') }}</el-col>
                    <el-col class="col-header">{{ $t('resellerPrice') }}</el-col>
                </el-row>
                <el-row class="row-text" v-for="(item, index) in form.skuTable" :key="index" type="flex">
                    <el-col class="col-text">
                        {{ item.skuValueUidText }}
                    </el-col>
                    <el-col class="col-text">
                        {{ item.price }}
                    </el-col>
                    <el-col class="col-text">
                        <el-form-item label="" style="margin-bottom: 0;"
                        :prop="'skuTable.' + index + '.purchasePrice'"
                        :rules="{ validator: checkNumber, trigger: 'blur' }">
                            <el-input v-model="item.purchasePrice"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: center; margin-top: 20px;">
                    <el-button type="primary" size="small" @click="saveFixAuthProduct" 
                    :loading="goodsLoading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import Pager from '@/components/common/Pager'
import { product, resale } from '@/common/api.js'
import { checkNumber } from '@/common/utils/validate.js'
export default {
    props: ['levelUid', 'levelName'],
    name: 'GoodsAuth',
    created () {
        this.fetchData(this.currentPage, this.pageSize)
        this.fetchCategory()
        this.fetchAuthList()
    },
    data() {
        return {
            showDialog: false,
            fixDialog: false,
            customDialog: false,
            goodsLoading: false,
            typeLoading: false,
            params: {
                procode: '',
                protitle: '',
                protype: '',
                category: []
            },
            authParam: {
                procode: '',
                protitle: '',
                category: []
            },
            totalCount: 0,
            currentPage: 1,
            pageSize: 15,
            authList: [],
            categorys: [],
            tableData: [],
            selectGoods: {},
            skuList: [],
            form: {
                price: '',
                skuTable: []
            },
            flag: '', // 编辑商品授权
            checkNumber: checkNumber,
            rules: {
                price: [
                    { validator: checkNumber, trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        levelUid: function (newVal, oldVal) {
            this.fetchAuthList()
        },
        showDialog: function (newVal, old) {
            if (newVal) {
                this.fetchData(1, this.pageSize)
            } else {
                // 清空选中的数据
                this.$refs['goodsTable'].setCurrentRow()
            }
        },
        fixDialog: function (newVal, oldVal) {
            if (newVal) {
                this.$axios.post(product.listProductSkuValueLang, {
                    uid: this.selectGoods.uid,
                    lang: localStorage.lang,
                    language: localStorage.lang
                }).then(res => {
                    if (res.data.state) {
                        this.skuList = res.data.data
                        this.form.skuTable = this.skuList
                        this.form.skuTable.forEach(item => {
                            this.$set(item, 'purchasePrice', '')
                        })
                        if (this.flag === 'edit') {
                            // 编辑商品授权
                            this.listAuthProduct()
                        }
                    } else {
                    }
                }).catch(err => {
                })
            } else {
                // 清空选中的数据
                if (this.flag !== 'edit') {
                    this.$refs['goodsTable'].setCurrentRow()
                }
            }
        }
    },
    methods: {
        listAuthProduct () {
            // 编辑授权类目时，获取采购价
            this.$axios.post(resale.listAuthProduct, {
                levelUid: this.levelUid,
                productUid: this.selectGoods.uid
            }).then(res => {
                if (res.data.state) {
                    // 获取采购价列表
                    var arr = res.data.data.resellerAuthSKUShowVO
                    if (arr.length > 0) {
                        arr.forEach(item => {
                            this.form.skuTable.forEach(sku => {
                                if (item.uid === sku.proskuuid) {
                                    sku.price = item.price
                                }
                            })
                        })
                    }
                    //判断循环经销商价格是否相等
                    if (arr.length > 0) {
                        arr.forEach(item => {
                            this.form.skuTable.forEach(sku => {
                                if (item.uid === sku.uid) {
                                    sku.purchasePrice = item.purchasePrice
                                }
                            })
                        })
                    }
                }
            })
        },
        // 将skuList数据组装给table显示
        packSkuList (data) {
            var tempArr = []
            data.forEach(el => {
                let str = ''
                if (el.listSkuValuLang) {
                    el.listSkuValuLang.forEach(sku => {
                        str += '  ' + sku.text
                    })
                }
                tempArr.push({
                    proskuuid: el.proskuuid,
                    originalPrice: el.price,
                    price: '', //经销价
                    name: str
                })
            })
            return tempArr
        },
        fetchAuthList () {
            this.$axios.post(resale.authProductBySearch, {
                levelUid: this.levelUid,
                procode: this.authParam.procode,
                protitle: this.authParam.protitle
            }).then(res => {
                if (res.data.state) {
                    this.authList = res.data.data
                } else {
                    this.authList = []
                }
            })
        },
        getCurrentSize (size) {
            this.fetchData(1, size)
        },
        getCurrentPage (num) {
            this.fetchData(num, this.pageSize)
        },
        fetchData (pageNum, pageSize) {
            this.currentPage = pageNum
            this.pageSize = pageSize
            this.loading = true
            this.$axios.post(product.searchProductApi, {
                categoryuid: this.params.category.length > 0 ? this.params.category[this.params.category.length - 1] : 0,
                page: pageNum,
                pageSize: pageSize,
                procode: this.params.procode,
                protitle: this.params.protitle,
                protype: this.params.protype,
                state: -1
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.tableData = res.data.data.dataList
                    this.totalCount = res.data.data.totalCount
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
        handleChange (val) {
            if (val) {
                // 设置选中商品table
                this.selectGoods = val
                // this.showDialog = false
                if (val.productType === 'FIXED') {
                    this.fixDialog = true
                } else {
                    this.customDialog = true
                }
            }
        },
        // 添加授权商品
        addGoodsAuth () {
            this.showDialog = true
            // 初始化价格
            this.form.price = ''
        },
        // 保存成品商品授权
        saveFixAuthProduct () {
            this.$refs['goodsForm'].validate(valid => {
                if (valid) {
                    this.goodsLoading = true
                    const subArr = []
                    // this.form.skuTable.forEach(item => {
                    //     subArr.push({
                    //         price: item.price,
                    //         uid: item.proskuuid,
                    //         valueText: (this.selectGoods.langtitle || this.selectGoods.cntitle) + item.name
                    //     })
                    // })

                    this.$axios.post(resale.saveAuthProduct, {
                        levelUid: this.levelUid,
                        productUid: this.selectGoods.uid,
                        productCode: this.selectGoods.productCode,
                        productType: this.selectGoods.productType,
                        skuVOList: this.form.skuTable
                    }).then(res => {
                        this.goodsLoading = false
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            })
                            this.fetchAuthList()
                            this.fixDialog = false
                            this.showDialog = false
                        }
                    }).catch(err => {
                        this.goodsLoading = false
                    })
                }
            })
        },
        // 编辑商品授权
        editFixAuthProduct (data, flag) {
            this.flag = flag
            // 区分成品还是定制商品
            if (data.productType === 'FIXED') {
                // 成品
                this.selectGoods = {
                    uid: data.productUid,
                    productCode: data.procode,
                    langtitle: data.protitle,
                    price: data.price
                }
                this.fixDialog = true
            } else if (data.productType === 'CUSONLINE') {
                // 定制
                this.selectGoods = {
                    uid: data.productUid,
                    productCode: data.procode,
                    langtitle: data.protitle,
                    price: data.price
                }
                this.form.price = data.purchasePrice
                this.customDialog = true
            }
        },
        // 保存定制商品授权
        saveAuthProduct () {
            this.$refs['goodsForm'].validate(valid => {
                if (valid) {
                    this.typeLoading = true
                    this.$axios.post(resale.saveAuthProduct, {
                        levelUid: this.levelUid,
                        productUid: this.selectGoods.uid,
                        productCode: this.selectGoods.productCode,
                        productType: this.selectGoods.productType,
                        price: this.form.price
                    }).then(res => {
                        this.typeLoading = false
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: this.$t('operationSuccess')
                            })
                            this.fetchAuthList()
                            this.customDialog = false
                            this.showDialog = false
                        }
                    }).catch(err => {
                        this.typeLoading = false
                    })
                }
            })
        },
        // 删除授权商品
        removeAuthProduct (uid) {
            this.$axios.post(resale.removeAuthProduct, {
                productUid: uid,
                levelUid: this.levelUid
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
    },
    components: {
        Pager
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
.col-header{
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    color: #000;
    height: 32px;
    line-height: 32px;
}
.row-text{
    border-top: 1px solid #f6f6f6;
    padding: 20px 4px 20px 4px;
    &:hover{
        background-color: #f6f6f6;
    }
}
.col-text{
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    text-align: center;
    box-sizing: border-box;
}
</style>
