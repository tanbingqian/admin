<template>
    <transition enter-active-class="animated slideInLeft">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="交易时间">
                        <el-date-picker type="datetime" v-model="params.startTime" value-format="yyyy-mm-dd hh:mm:ss"></el-date-picker>--
                        <el-date-picker type="datetime" v-model="params.endTime" value-format="yyyy-mm-dd hh:mm:ss"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="交易金额">
                        <el-input type="text" v-model.number="params.minAmount" style="width: 100px"></el-input>--
                        <el-input type="text" v-model.number="params.maxAmount" style="width: 100px"></el-input>
                    </el-form-item>
                    <el-form-item label="交易类型">
                        <el-checkbox-group v-model="params.amountType" :max="1">
                            <el-checkbox :label="1">收入</el-checkbox>
                            <el-checkbox :label="-1">支出</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
                <div class="center">
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
                        prop="payOrderUid"
                        align="center"
                        label="交易流水号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="uid"
                        align="center"
                        label="订单号">
                        <a></a>
                    </el-table-column>
                    <el-table-column
                        prop="oldAmount"
                        align="center"
                        label="交易前余额">
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        align="center"
                        label="交易金额">
                    </el-table-column>
                    <el-table-column
                        prop="newAmount"
                        align="center"
                        label="交易后余额">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="交易时间"
                        align="center"
                        width="180">
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
import { pay } from '@/common/api.js'
import { eventHub } from '@/common/share/eventHub'
export default {
    name: 'Distribution',
    created () {
        this.fetchData(this.currentPage, this.pageSize)
        eventHub.$on('paySuccess', this.paySuccess)
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            params: {
                amountType: [],
                startTime: '',
                endTime: '',
                minAmount: '',
                maxAmount: ''
            },
            tableData: []
        }
    },
    methods: {
        // 支付完成刷新数据
        paySuccess () {
            this.fetchData(1, this.pageSize)
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
            this.$axios.post(pay.listaccountdetail, {
                amountType: this.params.amountType.toString(),
                minAmount: this.params.minAmount,
                maxAmount: this.params.maxAmount,
                startTime: this.params.startTime,
                endTime: this.params.endTime,
                page: this.currentPage,
                pageSize: this.pageSize
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
    },
    beforeDestroy () {
        eventHub.$off('paySuccess')
    }
}
</script>

<style lang="less" scoped>

</style>

