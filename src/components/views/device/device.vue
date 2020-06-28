<template>
    <transition enter-active-class="animated slideInUp">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline" label-width="80px">
                    <el-form-item :label="$t('deviceModel')">
                        <device-model @choose="choose"></device-model>
                    </el-form-item>
                    <el-form-item :label="$t('isOnline')">
                        <el-select :clearable="true" v-model="params.online">
                            <el-option v-for="(item, index) in onlineState" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('reseller')">
                        <el-select filterable remote :remote-method="listuser" v-model="params.resellerUid" clearable :placeholder="$t('enterResellerName')">
                            <el-option v-for="(u, i) in userList" :key="i" :label="u.aliasName" :value="u.uid"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('useLocation')">
                        <city v-model="city"></city>
                    </el-form-item>
                    <el-form-item label="SN">
                        <el-input v-model="params.sn"></el-input>
                    </el-form-item>
                </el-form>
                <div style="margin-top: 10px; text-align: center;">
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
                        prop="sn"
                        label="SN"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="typeName"
                        align="center"
                        :label="$t('deviceType')"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="modelName"
                        align="center"
                        :label="$t('deviceModel')">
                    </el-table-column>
                    <el-table-column
                        prop="online"
                        align="center"
                        :label="$t('isOnline')">
                        <template slot-scope="scope">
                            {{ scope.row.online | isOnline }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        align="center"
                        :label="$t('username')">
                    </el-table-column>
                    <el-table-column
                        prop="resellerName"
                        align="center"
                        :label="$t('reseller')">
                    </el-table-column>
                    <el-table-column
                        prop=""
                        align="center"
                        :label="$t('useLocation')">
                        <template slot-scope="scope">
                            {{ scope.row.province ? scope.row.country + scope.row.province + scope.row.city : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="clientVersion"
                        align="center"
                        :label="$t('currentVersion')">
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        align="center"
                        :label="$t('deviceState')">
                        <template slot-scope="scope">
                            {{ scope.row.state | deviceState }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text" @click="fetchDetail(scope.row.uid)">{{ $t('detail') }}</el-button>
                            <el-button
                                type="text"
                                v-show="_hasPermission('DEVICE_STATE')"
                                @click="setDeviceState(scope.row)">
                                {{ scope.row.state === 1 ? $t('disable') : $t('able') }}
                            </el-button>
                            <el-button type="text" @click="bindReseller(scope.row.uid)">绑定经销商</el-button>
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
            <el-dialog :visible.sync="showDialog" width="50%">
                <!-- 设备详情 -->
                <el-form label-position="left" label-width="90px">
                    <el-row style="margin-bottom: 20px;">
                        <span style="font-size: 20px; color: #000;">{{ detail.modelName + '-' + detail.typeName }}</span>
                        <el-button v-if="false" type="text" @click="showChangeDetail = !showChangeDetail">{{ $t('operationDetail') }}</el-button>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="ID：">
                                {{ detail.uid }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('username') + '：'">
                                {{ detail.username }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="SN：">
                                <span style="word-break: break-all">
                                    {{ detail.sn }}
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item :label="'SN' + $t('activeDate') + '：'">
                                {{ detail.lastActiveTime }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('registDate') + '：'">
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('currentVersion') + '：'">
                                {{ detail.clientVersion }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item :label="$t('useLocation') + '：'">
                                {{ detail.country + detail.province + detail.city }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="IP：">
                                {{ detail.lastActiveIp }}
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('isOnline') + '：'">
                                {{ detail.online | isOnline }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item :label="$t('deviceState') + '：'">
                                {{ detail.state | deviceState }}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-button
                            @click="unbinduser"
                            :loading="bindloading"
                            v-show="_hasPermission('DEVICE_USER')"
                            type="primary" size="small"
                            style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('unbindUser') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </el-button>
                    </el-row>
                </el-form>
                <!-- 变更详情 -->
                <div class="change-record" v-show="showChangeDetail">
                    <p class="title">{{ $t('operationRecord') }}</p>
                    <p class="item">
                        <span class="name">UZIEN</span>
                        <span class="operate">创建订单</span>
                        <span class="time">2018-02-21 12:12:23</span>
                    </p>
                    <p class="item">
                        <span class="name">UZIEN</span>
                        <span class="operate">设置订单为已支付</span>
                        <span class="time">2018-02-21 12:12:23</span>
                    </p>
                    <p class="item">
                        <span class="name">UZIEN</span>
                        <span class="operate">打印产品条码&开始生产打印产品条码&开始生产</span>
                        <span class="time">2018-02-21 12:12:23</span>
                    </p>
                </div>
            </el-dialog>
            <!-- 绑定经销商 -->
            <el-dialog :visible.sync="showSellerDialog" :title="$t('chooseresaller')" width="40%">
                <el-input v-model="aliasName" :placeholder="$t('enterResellerName')">
                    <el-button slot="append" icon="el-icon-search" @click="searchP"></el-button>
                </el-input>
                <div class="product-wrap" ref="productWrap">
                    <ul class="content">
                        <li class="radio-item" v-for="(p, index) in conditionList" :key="index">
                            <el-radio v-model="condition" :label="p.uid">{{ p.aliasName }}</el-radio>
                        </li>
                    </ul>
                </div>
                <el-row>
                    <el-button size="small" @click="showSellerDialog = false">{{ $t('cancel') }}</el-button>
                    <el-button size="small" type="primary" @click="sureBind">{{ $t('sure') }}</el-button>
                </el-row>
            </el-dialog>
        </div>
    </transition>
</template>
<script>
import Pager from '@/components/common/Pager'
import { device, permission, resale } from '@/common/api.js'
import { onlineState } from '@/common/state.js'
import City from '@/components/common/city/city'
import DeviceModel from '@/components/common/page/deviceModel'
import _ from 'underscore'
import BScroll from 'better-scroll'
export default {
    name: 'Device',
    created () {
        this.fetchData(this.currentPage, this.pageSize)
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            bindloading: false,
            params: {
                clientVersion: '',
                lastActiveTime: '',
                modelUid: [],
                online: '',
                sn: '',
                resellerUid: '',
            },
            tableData: [],
            showDialog: false,
            detail: {},
            showChangeDetail: false,
            onlineState: onlineState,
            userList: [],
            city: [],
            conditionList: [],
            totalPage: 1,
            page: 1,
            showSellerDialog: false,
            aliasName: '',
            condition: '',
            deviceUid: ''
        }
    },
    methods: {
        sureBind () {
            this.$axios.post(device.bindreseller, {
                deviceUid: this.deviceUid,
                resellerUid: this.condition
            }).then(res => {
                if (res.data.state) {
                    this.fetchData(1, 50)
                    this.showSellerDialog = false
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                }
            })
        },
        bindReseller (uid) {
            this.deviceUid = uid
            this.condition = ''
            this.showSellerDialog = true
            this.searchProductShop(1)
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
        choose (val) {
            this.params.modelUid = val
        },
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
            this.$axios.post(device.listdevice, {
                clientVersion: this.params.clientVersion,
                lastActiveTime: this.params.lastActiveTime,
                modelUid: this.params.modelUid.length > 0 ? this.params.modelUid[this.params.modelUid.length - 1] : 0,
                online: this.params.online,
                sn: this.params.sn,
                resellerUid: this.params.resellerUid ? this.params.resellerUid : 0,
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
            this.$axios.post(device.getdevicebyuid, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.detail = res.data.data
                }
            })
        },
        updateDetail () {
            this.$axios.post(device.setdevicestate, {
                sn: this.detail.sn,
                state: this.detail.state
            }).then(res => {
                if (res.data.state) {
                    this.showDialog = false
                    // 初始化dialog表单数据
                    this.detail = {}
                    this.fetchData(this.currentPage, this.pageSize)
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                }
            })
        },
        setDeviceState (sn) {
            var title = ''
            if (sn.state === 1) {
                title = this.$t('sureToDisableDevice')
            } else {
                title = this.$t('sureToAbleDevice')
            }
            this.$confirm(title, this.$t('prompt'), {
                confirmButtonText: this.$t('sure'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
                }).then(() => {
                    this.$axios.post(device.setdevicestate, {
                        sn: sn.sn,
                        state: sn.state === 1 ? -1 : 1
                    }).then(res => {
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: this.$t('operationSuccess')
                            })
                            this.fetchData(this.currentPage, this.pageSize)
                        }
                    })
                }).catch(() => {
            })
        },
        // 解绑用户
        unbinduser () {
            this.bindloading = true
            this.$axios.post(device.binduser, {
                deviceUid: this.detail.uid,
                userUid: 0
            }).then(res => {
                this.bindloading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('operationSuccess')
                    })
                    this.showDialog = false
                    this.fetchData(this.currentPage, this.pageSize)
                }
            }).catch(err => {
                this.bindloading = false
            })
        }
    },
    components: {
        Pager,
        City,
        DeviceModel
    }
}
</script>

<style lang="less" scoped>
.change-record{
    font-size: 12px;
    color: #999;
    .title{
        color: #666;
        font-size: 14px;
    }
    .item{
        line-height: 20px;
        margin: 0;
        padding-bottom: 10px;
        .name{
            display: inline-block;
            margin-right: 20px;
            vertical-align: top;
        }
        .operate{
            display: inline-block;
            width: 200px;
            margin-right: 20px;
            vertical-align: top;
        }
        .time{
            vertical-align: top;
        }
    }
}
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

