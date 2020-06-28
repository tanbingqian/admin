<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" label-width="80px">
                    <el-form-item label="生成时间">
                        <el-input type="datetime"></el-input>
                    </el-form-item>
                    <el-form-item label="面值">
                        <el-select>
                            <option label="所有" value="all"></option>
                            <option label="1000元" value="all"></option>
                            <option label="500元" value="all"></option>
                            <option label="100元" value="all"></option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select>
                            <option label="所有" value="all"></option>
                            <option label="未激活" value="all"></option>
                            <option label="已激活" value="all"></option>
                            <option label="已用完" value="all"></option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="交易单号">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input></el-input>
                    </el-form-item>
                </el-form>
                <div class="search-btns">
                    <el-button 
                        type="primary" 
                        size="small"
                        @click="addCard" 
                        class="el-button-uzien search">新增礼品卡</el-button>
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
                        prop="time"
                        label="生成时间"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="recevierName"
                        align="center"
                        label="批次"
                        width="180" 
                        >
                         <template slot-scope="scope">
                             <span @click="batchLink(scope.row)">批次</span>
                            <!-- <i class="el-icon-edit icon" @click="batchLink(scope.row)"></i> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="telephone"
                        align="center"
                        label="礼品卡名称">
                    </el-table-column>
                    <el-table-column
                        prop="buyerName"
                        align="center"
                        label="面值">
                    </el-table-column>
                    <el-table-column
                        prop="totalAmount"
                        align="center"
                        label="生成数量">
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
            <!-- 新增礼品卡 -->
            <el-dialog title="新增礼品卡" :visible.sync="addDialog">
                <el-form label-width="100px">
                    <el-form-item label="礼品卡名称">
                        <el-input></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="面值">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发行数量">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="激活有效期">
                                <el-input type="date"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="tc">
                    <el-button size="small" @click="cancel">&nbsp;&nbsp;&nbsp;&nbsp;取 消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button size="small" type="primary">&nbsp;&nbsp;&nbsp;&nbsp;保 存&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </el-dialog>

             <!-- 批次弹窗 -->
            <el-dialog title="批次" :visible.sync="batchDialog">
                <el-form label-width="100px">
                    <el-form-item label="礼品卡名称">
                        <el-input></el-input>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="面值">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发行数量">
                                <el-input></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="激活有效期">
                                <el-input type="date"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="tc">
                    <el-button size="small" @click="cancel">&nbsp;&nbsp;&nbsp;&nbsp;取 消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button size="small" type="primary">&nbsp;&nbsp;&nbsp;&nbsp;保 存&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </el-dialog>
        </div>
    </transition>
</template>
<script>
import Pager from '@/components/common/Pager'
import { order } from '@/common/api.js'
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
            tableData: [{
                "time":'22:14:00',
                "recevierName":'PC12341000>',
                "telephone":'13510465439',
                "buyerName":'buyerName',
                "totalAmount":'1000'
            }],
            addDialog: false,
            //批次弹窗
            batchDialog: false
        }
    },
    methods: {
        addCard () {
            this.addDialog = true
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
        fetchData (pageNum, pageSize) {
            this.currentPage = pageNum
            this.pageSize = pageSize
            this.loading = true
            this.$axios.post('', {
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

        //点击批次弹窗
        batchLink(){
            this.batchDialog=true;
            alert("d")
        }
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


