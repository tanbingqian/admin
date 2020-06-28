<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="form-wrap">
            <div class="search-wrap">
                <el-form :inline="true">
                    <el-form-item :label="$t('device')">
                        <el-radio label="PLOT_TOTAL" v-model="params.statType">{{ $t('plotMachine') }}</el-radio>
                        <!-- <el-radio label="PRINT_TOTAL" v-model="params.statType">{{ $t('printer') }}</el-radio> -->
                    </el-form-item>
                    <el-form-item :label="$t('time')">
                        <el-date-picker type="month" value-format="yyyy-MM" v-model="params.startMonth"></el-date-picker>-
                        <el-date-picker type="month" value-format="yyyy-MM" v-model="params.endMonth"></el-date-picker>
                    </el-form-item>
                    <!-- <el-form-item :label="$t('searchCondition')">
                        <el-select v-model="searchCondition" @change="selectChange">
                            <el-option :label="$t('all')" value="all"></el-option>
                            <el-option :label="$t('bySeller')" value="reseller"></el-option>
                            <el-option :label="$t('byMechant')" value="mechant"></el-option>
                            <el-option :label="$t('byDevice')" value="device"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item :label="$t('reseller')">
                        <el-select filterable remote :remote-method="listuser" v-model="params.sellerUid" clearable :placeholder="$t('enterResellerName')">
                            <el-option v-for="(u, i) in userList" :key="i" :label="u.aliasName" :value="u.uid"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="search-btns">
                    <el-button
                        type="primary"
                        class="el-button-uzien search"
                        @click="fetchData(1, pageSize)"
                        size="small">{{$t('search')}}</el-button>
                    <el-button
                    class="el-button-uzien search"
                    @click="fetchData(1, pageSize)"
                    size="small">{{ $t('exportData') }}</el-button>
                </div>
            </div>
            <!-- <h3>{{ $t('MonthPrintBar') }}</h3> -->
            <ve-histogram :extend="extend" :data="chartData" :settings="chartSetting"></ve-histogram>
            <!-- 销售商、商户筛选 -->
            <el-dialog :visible.sync="showDialog" :title="$t('chooseSeller')" width="40%">
                <el-input v-model="aliasName" :placeholder="$t('enterProName')">
                    <el-button slot="append" icon="el-icon-search" @click="searchP"></el-button>
                </el-input>
                <div class="product-wrap" ref="productWrap">
                    <ul class="content">
                        <li class="radio-item" v-for="(p, index) in conditionList" :key="index">
                            <el-radio v-model="params.sellerUid" :label="p.uid">{{ p.aliasName }}</el-radio>
                        </li>
                    </ul>
                </div>
                <el-row>
                    <el-button size="small" @click="cancel">{{ $t('cancel') }}</el-button>
                    <el-button size="small" type="primary" @click="sure">{{ $t('sure') }}</el-button>
                </el-row>
            </el-dialog>
        </div>
    </transition>
</template>

<script>
import Pager from '@/components/common/Pager'
import BScroll from 'better-scroll'
import { shop, resale, stat } from '@/common/api.js'
import moment from 'moment'
import _ from 'underscore'
export default {
    name: 'Print',
    created () {
        this.fetchData()
    },
    data () {
        return {
            statPage: 1,
            statTotal: 0,
            statSize: 20,
            searchCondition: 'all',
            chartSetting: {
                labelMap: {
                    statValue: this.$t('printNumber')
                }
            },
            extend: {
                series: {
                    label: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            chartData: {
                columns: ['statDate', 'statValue'],
                rows: []
            },
            params: {
                statType: 'PLOT_TOTAL',
                startMonth: moment().subtract(13, 'months').format('YYYY-MM'),
                endMonth: moment().subtract(1, 'months').format('YYYY-MM'),
                statObjectUid: '',
                sellerUid: ''
            },
            list: [],
            totalCount: 0,
            currentPage: 1,
            pageSize: 50,
            showDialog: false,
            name: '',
            conditionList: [], // 销售商查询列表
            condition: '',
            snDailog: false,
            snCode: '',
            deviceDialog: false,
            page: 1,
            aliasName: '',
            userList: [],
        }
    },
    methods: {
        listuser: _.debounce(function (val) {
            console.log('data change...' + val);
            
            this.$axios.post(resale.listDealerBySearch, {
                aliasName: val,
                page: 1,
                pageSize: 50
            }).then(res => {
                if (res.data.state) {
                    this.userList = res.data.data.dataList
                } else {
                    this.userList = []
                }
            })
        }, 100),
        selectChange (val) {
            if (val === 'all') {
                this.params.sellerUid = 0
                // this.searchProductShop(1)
            } else if (val === 'reseller') {
                // 按经销商查询
                this.showDialog = true
                this.searchProductShop(1)
            } else if (val === '3') {}
        },
        getCurrentSize (size) {
            this.fetchData(1, size)
        },
        getCurrentPage (num) {
            this.fetchData(num, this.pageSize)
        },
        fetchData (page, size) {
            this.statPage = page
            this.statSize = size
            if (this.searchCondition === 'all') {
                this.params.statObjectUid = 0
            }
            this.$axios.post(stat.listmonthsun, {
                statType: this.params.statType,
                startMonth: this.params.startMonth,
                endMonth: this.params.endMonth,
                statObjectUid: this.params.statObjectUid,
                sellerUid: this.params.sellerUid !== '' ? this.params.sellerUid : 0                
            }).then(res => {
                if (res.data.state) {
                    this.statTotal = res.data.data.totalCount
                    this.chartData.rows = res.data.data
                    this.list = res.data.data
                    this.$message({
                        type: 'success',
                        message: this.$t('searchSuccess')
                    })
                }
            })
        },
        cancel () {
            this.aliasName = ''
            this.params.sellerUid = 0
            this.searchCondition = 'all'
            this.showDialog = false
        },
        sure () {
            this.fetchData(1, this.pageSize)
            this.showDialog = false
        },
        searchP () {
            this.conditionList.splice(0)
            this.searchProductShop(1)
        },
        searchProductShop (page) {
            this.$axios.post(resale.listDealerBySearch, {
                aliasName: this.aliasName,
                page: page,
                pageSize: 50
            }).then(res => {
                if (res.data.state) {
                    this.conditionList = this.conditionList.concat(res.data.data.dataList)
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
                                if (this.page < this.totalPage) {
                                    this.page++
                                    this.searchProductShop(this.page)
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
    },
    components: {
        Pager
    }
}
</script>

<style lang="less" scoped>
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