<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="normal-page">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="设计单号">
                        <el-input type="text" v-model="params.code"></el-input>
                    </el-form-item>
                    <el-form-item label="商品ID">
                        <el-input type="text" v-model="params.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="销售商">
                        <el-select placeholder="请选择"></el-select>
                    </el-form-item>
                    <el-form-item label="付款时间">
                        <el-date-picker type="datetime"></el-date-picker>--
                        <el-date-picker type="datetime"></el-date-picker>
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
                        prop="productUid"
                        label="设计单号"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="productCode"
                        align="center"
                        label="商品图片"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="productTitle"
                        align="center"
                        label="商品ID">
                    </el-table-column>
                    <el-table-column
                        prop="productTitle"
                        align="center"
                        label="商品名称">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        align="center"
                        label="会员名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="商品类型">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="销售商">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="提交时间">
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text">创建订单</el-button>
                            <el-button type="text">下载图片</el-button>
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
            <!-- 分销商详情dialog -->
            <el-dialog title="经销商信息" :visible.sync="showDialog">
                <el-form label-position="center" label-width="120px">
                    <el-row>
                        <el-form-item label="经销商ID："></el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="经销商账号">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="经销商名称">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="经销商姓名">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="经销商电话">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="经销商地址">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="经销商级别">
                                <el-select placeholder="请选择级别"></el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否允许有下一级">
                                <el-radio>允许</el-radio>
                                <el-radio>不允许</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="状态">
                                <el-radio>合作</el-radio>
                                <el-radio>停止合作</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="">
                                <el-button>返 回</el-button>
                                <el-button>保存 修改</el-button>
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-dialog>
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
        this.fetchData(this.currentPage, this.pageSize)
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            params: {
                time: ''
            },
            tableData: [1],
            categorys: [],
            showDialog: false
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
    },
    components: {
        Pager
    }
}
</script>

<style lang="less" scoped>
.pd-t{
    padding-top: 40px;
}
</style>

