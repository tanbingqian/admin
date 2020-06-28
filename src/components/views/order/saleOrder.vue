<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline" label-width="100px">
                    <el-form-item label="订单编号">
                        <el-input type="text" v-model="params.orderno"></el-input>
                    </el-form-item>
                    <el-form-item label="收货人姓名">
                        <el-input type="text" v-model="params.rename"></el-input>
                    </el-form-item>
                    <el-form-item label="收货人电话">
                        <el-input v-model="params.tel"></el-input>
                    </el-form-item>
                    <el-form-item label="收货区域">
                        <el-cascader v-model="params.areauid" :options="[]"></el-cascader>
                    </el-form-item>
                    <el-form-item label="物流单号">
                        <el-input v-model="params.expressno"></el-input>
                    </el-form-item>
                    <el-form-item label="会员名称">
                        <el-input v-model="params.buyername"></el-input>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-select placeholder="请选择" v-model="params.orderstate" :clearable="true">
                            <el-option v-for="(s, i) in orderState" :key="i" :label="s.label" :value="s.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="付款时间">
                        <el-date-picker type="datetime" value-format="yyyy-mm-dd HH:mm:ss" v-model="params.starttime"></el-date-picker>--
                        <el-date-picker type="datetime" value-format="yyyy-mm-dd HH:mm:ss" v-model="params.endtime"></el-date-picker>
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
                        label="订单编号"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="recevierName"
                        align="center"
                        label="收货人"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="telephone"
                        align="center"
                        label="收货人电话">
                    </el-table-column>
                    <el-table-column
                        prop="buyerName"
                        align="center"
                        label="会员名称">
                    </el-table-column>
                    <el-table-column
                        prop="totalAmount"
                        align="center"
                        label="订单金额">
                    </el-table-column>
                    <el-table-column
                        prop="payAmount"
                        align="center"
                        label="实付金额">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="订单状态">
                        <template slot-scope="scope">
                            {{ scope.row.orderState | orderState }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text" @click="detail(scope.row)">详情</el-button>
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
import { order } from '@/common/api.js'
import { orderState } from '@/common/state.js'
export default {
    name: 'SaleOrder',
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
                areauid: [],
                buyername: '',
                endtime: '',
                expressno: '',
                orderno: '',
                orderstate: '',
                rename: '',
                starttime: '',
                tel: null
            },
            orderState: orderState,
            tableData: []
        }
    },
    methods: {
        detail (item) {
            this.$router.push({
                path: '/saleOrderDetail/' + item.uid
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
            this.$axios.post(order.listOrders, {
                areauid: 0,
                buyername: this.params.buyername,
                endtime: this.params.endtime,
                expressno: this.params.expressno,
                orderno: this.params.orderno,
                orderstate: this.params.orderstate,
                rename: this.params.rename,
                starttime: this.params.starttime,
                tel: this.params.tel,
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
                } else {
                    this.$message({
                        type: 'error',
                        message: '请求失败'
                    })
                }
            }).catch(err => {
                this.loading = false
                this.$message({
                    type: 'error',
                    message: '服务器错误'
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

