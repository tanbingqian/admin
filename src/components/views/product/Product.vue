<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="panel-page">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item :label="$t('pCode')">
                        <el-input type="text" v-model="params.code"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('pName')">
                        <el-input type="text" v-model="params.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('pType')">
                        <el-cascader
                            :clearable="true"
                            :show-all-levels="false"
                            :options="categorys"
                            :props="{ label: 'categoryName', value: 'uid' }"
                            change-on-select
                            v-model="params.category"
                            expand-trigger="hover">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item :label="$t('isOnShop')">
                        <el-checkbox-group v-model="params.state" :max="1">
                            <el-checkbox :label="1" :key="1">{{ $t('onShop') }}</el-checkbox>
                            <el-checkbox :label="0" :key="0">{{ $t('offShop') }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div class="search-btns">
                    <el-button
                        type="primary"
                        class="el-button-uzien search"
                        @click="fetchData(1, pageSize)"
                        size="small">{{$t('search')}}</el-button>
                </div>
            </div>
            <!-- table表格 -->
            <div class="table-wrap" ref="myTable" v-loading="loading" :element-loading-text="$t('loadingText')">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="uid"
                        label="ID"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="productCode"
                        align="center"
                        :label="$t('pCode')"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('pName')">
                        <template slot-scope="scope">
                            {{ scope.row.langtitle ? scope.row.langtitle : scope.row.cntitle }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        align="center"
                        :label="$t('price')">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('status')">
                        <template slot-scope="scope">
                            {{ scope.row.state | prodState }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text" @click="edit(scope.row)" v-show="_hasPermission('PRO_EDT')">{{ $t('edit') }}</el-button>
                            <el-button type="text" @click="delProduct(scope.row.uid)" v-show="_hasPermission('PRO_DEL')">{{ $t('delete') }}</el-button>
                            <el-button type="text" @click="updateState(scope.row.uid)" v-show="_hasPermission('PRO_STATE')">{{ scope.row.state === 0 ? $t('putaway') : $t('soldOut') }}</el-button>
                            <el-button type="text" v-show="productType === 'FIXED' || productType === 'CUSONLINE'">{{ $t('tempEdit') }}</el-button>
                            <el-button type="text" v-show="productType === 'PLOT'">{{ $t('downLoadPlotImage') }}</el-button>
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
        </div>
    </transition>
</template>
<script>
import Pager from '@/components/common/Pager'
import { product } from '@/common/api.js'
import { treeFilter } from '@/common/utils/array.js'
export default {
    name: 'Product',
    props: ['productType'],
    created () {
        this.fetchCategory()
        this.fetchData(this.currentPage, this.pageSize)
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            params: {
                code: '',
                name: '',
                category: [],
                state: []
            },
            tableData: [],
            categorys: [],
        }
    },
    methods: {
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
            this.$axios.post(product.searchProduct, {
                categoryuid: this.params.category.length > 0 ? this.params.category[this.params.category.length - 1] : 0,
                page: pageNum,
                pageSize: pageSize,
                procode: this.params.code,
                protitle: this.params.name,
                protype: this.productType,
                state: this.params.state.length > 0 ? this.params.state[0] : -1
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.tableData = res.data.data.dataList
                    this.totalCount = res.data.data.totalCount
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$t(res.data.code)
                    })
                }
            }).catch(err => {
                this.loading = false
                this.$message({
                    type: 'error',
                    message: this.$t(err.code)
                })
            })
        },
        delRequest (pid) {
            this.$axios.post(product.deleteProduct, {
                uid: pid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('delSuccess')
                    })
                    this.fetchData(this.currentPage, this.pageSize)
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$t(res.data.code)
                    })
                }
            })
        },
        delProduct (id) {
            this.$confirm(this.$t('delProductConfirm'), this.$t('prompt'), {
                confirmButtonText: this.$t('sure'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
            }).then(() => {
                console.log('del')
                this.delRequest(id)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: this.$t('canceled')
                })
            })
        },
        updateState (pid) {
            this.$axios.post(product.updateProductState, {
                uid: pid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.fetchData(this.currentPage, this.pageSize)
                }
            })
        },
        fetchCategory () {
            this.$axios.post(product.listAllCategory, {
                language: localStorage.lang
            }).then(res => {
                if (res.data.state) {
                    this.categorys = treeFilter('state', 0, res.data.data)
                }
            })
        },
        edit (item) {
            this.$router.push({
                path: '/productEdit/' + item.uid + '/' + item.productType
            })
        }
    },
    components: {
        Pager
    }
}
</script>
<style lang="less">
.panel-page{
    animation-duration: 1.5s;
}
</style>
