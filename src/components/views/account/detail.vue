<template>
    <transition enter-active-class="animated slideInLeft">
        <div class="disribution-list pd-t">
            <!-- table表格 -->
            <div class="table-wrap" ref="myTable" v-loading="loading" :element-loading-text="$t('loadingText')">
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="uid"
                        label="创建时间"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="resellerAccount"
                        align="center"
                        label="交易流水号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="aliasName"
                        align="center"
                        label="订单号">
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        align="center"
                        label="交易前余额">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        align="center"
                        label="余额">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        align="center"
                        label="交易后余额">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        align="center"
                        label="订单状态">
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text" @click="fetchDetail(scope.row.uid)">详情</el-button>
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
            <!-- 充值详情dialog -->
            <el-dialog title="充值详情" :visible.sync="showDialog">
                <el-form label-position="left" label-width="80px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="订单号：">
                                <el-input v-model="detail.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="充值金额：">
                                <el-input v-model="detail.resellerTel"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="当前状态：">
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="支付方式：">
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="流水号：">
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="支付时间：">
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-button @click="updateDetail" type="primary" size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;确认支付&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </transition>
</template>
<script>
import Pager from '@/components/common/Pager'
import { resale } from '@/common/api.js'
export default {
    name: 'Distribution',
    created () {
        this.fetchData(this.currentPage, this.pageSize)
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            tableData: [],
            showDialog: false,
            detail: {}
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
            this.$axios.post(resale.listDistributorBySearch, {
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
        fetchDetail (uid) {
            this.showDialog = true
            this.$axios.post(resale.getDistributor, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.detail = res.data.data
                } else {
                    this.$message({
                        type: 'error',
                        message: '获取详情失败'
                    })
                }
            })
        },
        updateDetail () {
            this.$axios.post(resale.saveDistributor, this.detail).then(res => {
                if (res.data.state) {
                    this.showDialog = false
                    // 初始化dialog表单数据
                    this.detail = {}
                    this.fetchData(this.currentPage, this.pageSize)
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
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
.pd-t{
    padding-top: 20px;
}
</style>

