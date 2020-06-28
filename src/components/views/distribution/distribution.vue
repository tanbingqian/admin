<template>
    <transition enter-active-class="animated slideInUp">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="分销商账号">
                        <el-input type="text" v-model="params.code"></el-input>
                    </el-form-item>
                    <el-form-item label="分销商名称">
                        <el-input type="text" v-model="params.aliasName"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-checkbox-group v-model="params.state" :max="1">
                            <el-checkbox :label="1">合作</el-checkbox>
                            <el-checkbox :label="0">停止合作</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="添加时间">
                        <el-date-picker v-model="params.startTime" type="datetime" value-format="yyyy-mm-DD HH:mm:ss"></el-date-picker>--
                        <el-date-picker type="datetime" v-model="params.endTime" value-format="yyyy-mm-DD HH:mm:ss"></el-date-picker>
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
                        label="分销商ID"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="resellerAccount"
                        align="center"
                        label="账号名"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="aliasName"
                        align="center"
                        label="分销商名称">
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        align="center"
                        label="状态">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        align="center"
                        label="添加时间">
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
            <!-- 分销商详情dialog -->
            <el-dialog title="分销商信息" :visible.sync="showDialog">
                <el-form label-position="left" label-width="80px">
                    <el-row>
                        <el-form-item label="分销商ID：">
                            {{ detail.uid }}
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="分销商名称">
                                <el-input v-model="detail.aliasName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="联系人">
                                <el-input v-model="detail.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话">
                                <el-input v-model="detail.resellerTel"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="分销商地址">
                                <!-- <el-cascader placeholder="请选择省/市/区" :options="[]"></el-cascader> -->
                                <city v-model="detail.cityIds" :placeholder="newCityDatas" @choose="choose"></city>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="18">
                            <el-form-item label="">
                                <el-input v-model="detail.resellerAddress" :placeholder="detail.resellerAddress"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="所在地区">
                                <el-radio :label="1" v-model="detail.state">合作</el-radio>
                                <el-radio :label="0" v-model="detail.state">停止合作</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="账号">
                                <el-input v-model="detail.resellerAccount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密码">
                                <el-input v-model="detail.code" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="域名">
                                <el-input placeholder="请输入域名" v-model="detail.shopDomain"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-button
                            @click="showDialog = false"
                            type="primary"
                            size="small"
                            style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                        <el-button
                            @click="updateDetail"
                            type="primary"
                            v-show="_hasPermission('RESELLER_EDT')"
                            size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
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
import { base }from '@/common/api.js'
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
            params: {
                code: '',
                aliasName: '',
                state: [],
                startTime: '',
                endTime: '',
                shopDomain:'',
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
            this.$axios.post(resale.listDistributorBySearch, {
                resellerAccount: this.params.code,
                aliasName: this.params.aliasName,
                state: this.params.state.join(''),
                startDate: this.params.startTime,
                endDate: this.params.endTime,
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
                    //获取数组最后一个元素
                    this.detail.cityIds[this.detail.cityIds.length - 1]
                    this.defaultCity=this.detail.cityIds[this.detail.cityIds.length - 1]
                    this.getNewCity();
                } else {
                    this.$message({
                        type: 'error',
                        message: '获取详情失败'
                    })
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
                } else {
                    this.$message({
                        type: 'error',
                        message: '获取详情失败'
                    })
                }
            })
        },
        updateDetail () {
            this.addA=this.detail.cityIds;   //省市区
            this.addB=this.detail.resellerAddress;  //详细地址
            this.detail.resellerAddress=this.addA+'-'+this.addB;
            this.$axios.post(resale.updateDistributor, this.detail).then(res => {
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

