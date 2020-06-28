<template>
    <transition enter-active-class="animated slideInUp">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item :label="$t('resellerAccount')">
                        <el-input type="text" v-model="params.resellerAccount"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('resellerName')">
                        <el-input type="text" v-model="params.aliasName"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('resellerLevel')">
                        <el-select v-model="params.levelUid" clearable>
                            <el-option v-for="d in levelList" :key="d.uid" :label="d.name" :value="d.uid"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('state')">
                        <el-checkbox-group v-model="params.state" :max="1">
                            <el-checkbox :label="1">{{ $t('cooperation') }}</el-checkbox>
                            <el-checkbox :label="0">{{ $t('unCooperation') }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item :label="$t('addTime')">
                        <el-date-picker v-model="params.startDate" type="datetime" value-format="yyyy-mm-DD HH:mm:ss"></el-date-picker>--
                        <el-date-picker type="datetime" v-model="params.endDate" value-format="yyyy-mm-DD HH:mm:ss"></el-date-picker>
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
                        prop="uid"
                        :label="$t('resellerId')"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="resellerAccount"
                        align="center"
                        :label="$t('resellerAccount')"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="aliasName"
                        align="center"
                        :label="$t('resellerName')">
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        align="center"
                        :label="$t('state')">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        align="center"
                        :label="$t('addTime')">
                    </el-table-column>
                    <el-table-column
                        width="280"
                        align="center"
                        :label="$t('operation')">
                        <template slot-scope="scope">
                            <el-button type="text" @click="fetchDetail(scope.row.uid)">{{ $t('detail') }}</el-button>
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
            <el-dialog :title="$t('resellerInfo')" :visible.sync="showDialog">
                <el-form label-position="left" label-width="80px">
                    <el-row>
                        <el-form-item :label="$t('resellerId') + '：'">
                            {{ detail.uid }}
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item :label="$t('resellerName')">
                                <el-input v-model="detail.aliasName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item :label="$t('resellerNick')">
                                <el-input v-model="detail.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('resellerPhone')">
                                <el-input v-model="detail.resellerTel"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item :label="$t('resellerAddress')">
                                <!-- <el-cascader placeholder="请选择省/市/区" :options="[]"></el-cascader> -->
                                 <city v-model="detail.cityIds" :placeholder="newCityDatas" @choose="choose"></city>
                                 <!-- <input :placeholder="newCityDatas"/> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="">
                                <el-input v-model="detail.resellerAddress"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item :label="$t('resellerLevel')">
                                <el-select v-model="detail.levelUid" clearable>
                                    <el-option v-for="d in levelList" :key="d.uid" :label="d.name" :value="d.uid"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('allowToHaveChildLevel')">
                                <el-radio :label="1" v-model="detail.resellerAllowed">{{ $t('allowed') }}</el-radio>
                                <el-radio :label="0" v-model="detail.resellerAllowed">{{ $t('notAllowed') }}</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="$t('state')">
                                <el-radio :label="1" v-model="detail.state">{{ $t('cooperation') }}</el-radio>
                                <el-radio :label="0" v-model="detail.state">{{ $t('unCooperation') }}</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item :label="$t('account')">
                                <el-input v-model="detail.resellerAccount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="$t('password')">
                                <el-input v-model="detail.code" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item :label="$t('domain')">
                                    <el-input :placeholder="$t('enterDomain')" v-model="detail.shopDomain"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-button type="primary" @click="showDialog = false" size="small" 
                        style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('back') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                        <el-button type="primary" size="small" 
                        @click="updateDetail">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
    </transition>
</template>
<script>
import City from "@/components/common/city/city"
import Pager from '@/components/common/Pager'
import { resale } from '@/common/api.js'
import { treeFilter } from '@/common/utils/array.js'
import { base }from '@/common/api.js'
export default {
    name: 'Sold',
    props: ['productType'],
    created () {
        this.fetchData(this.currentPage, this.pageSize)
        this.fetchLevel()
    },
    data () {
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            params: {
                resellerAccount: '',
                aliasName: '',
                state: [],
                startDate: '',
                endDate: '',
                levelUid: '',
                shopDomain:''
            },
            tableData: [],
            showDialog: false,
            detail: {},
            levelList: [],
            defaultCity:'',
            //默认城市
            newCityDatas:''
        }
    },
    methods: {
         //筛选城市获取值
        choose(val){
           console.log(this.addData)
           this.addData=val
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
            this.$axios.post(resale.listDealerBySearch, {
                resellerAccount: this.params.resellerAccount,
                aliasName: this.params.aliasName,
                state: this.params.state.join(''),
                startDate: this.params.startDate,
                endDate: this.params.endDate,
                levelUid: this.params.levelUid,
                page: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.tableData = res.data.data.dataList
                    this.totalCount = res.data.data.totalCount
                }
            }).catch(err => {
                this.loading = false
            })
        },
        fetchDetail (uid) {
            this.showDialog = true
            this.$axios.post(resale.getOneDealerByUid, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.detail = res.data.data
                    //获取数组最后一个元素
                    this.detail.cityIds[this.detail.cityIds.length - 1]
                    this.defaultCity=this.detail.cityIds[this.detail.cityIds.length - 1]
                    this.getNewCity();
                    this.detail.levelUid=""+res.data.data.levelUid
                }
            })
        },
        //获取城市接口查询
        getNewCity(){
            this.$axios.post(base.getcity, {
                "cityId": this.defaultCity
            }).then(res => {
                if (res.data.state) {
                    this.newCityData = res.data.data
                    this.newCityDatas=this.newCityData.fullName
                    this.newCityDatas = this.newCityData.fullName
                }
            })
        },
    
        updateDetail () {
            this.addA=this.detail.cityIds;   //省市区
            this.addB=this.detail.resellerAddress;  //详细地址
            this.detail.resellerAddress=this.addA+'-'+this.addB; 
            this.$axios.post(resale.updateDealer, this.detail).then(res => {
                if (res.data.state) {
                    this.showDialog = false
                    this.detail = {}
                    this.fetchData(this.currentPage, this.pageSize)
                    this.$message({
                        type: 'success',
                        message: this.$t('saveSuccess')
                    })
                }
            })
        },
        // 经销商级别
        fetchLevel () {
            this.$axios.post(resale.listResellerLevel).then(res => {
                if (res.data.state) {
                    this.levelList = res.data.data
                }
            })
        }
    },
    components: {
        Pager,
        City
    }
}
</script>

<style lang="less" scoped>
.pd-t{
    padding-top: 40px;
}
</style>

