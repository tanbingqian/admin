<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="disribution-list">
            <!-- 搜索区域 -->
            <div class="search-wrap">
                <h3>积分规则配置</h3>
                <el-row class="rule-item">
                    <el-checkbox></el-checkbox>消费<input style="width: 80px;">元，获得<input style="width: 80px;">个积分
                </el-row>
                <el-row class="rule-item">
                    <el-checkbox></el-checkbox>积分抵现：<input style="width: 80px;">个积分=<input style="width: 80px;">元
                </el-row>
                <el-row class="rule-item">
                    <el-checkbox></el-checkbox>完成注册，获得<input style="width: 80px;">个积分
                </el-row>
                <el-row class="rule-item">
                    <el-checkbox></el-checkbox>完成首单，获得<input style="width: 80px;">个积分
                </el-row>
                <el-row class="rule-item">
                    <el-checkbox></el-checkbox>绑定手机号，获得<input style="width: 80px;">个积分
                </el-row>
                <el-row class="rule-item">
                    <el-checkbox></el-checkbox>完成一条文字评论，获得<input style="width: 80px;">个积分
                </el-row>
                <el-row class="rule-item">
                    <el-checkbox></el-checkbox>完成一条图文评论，获得<input style="width: 80px;">个积分
                </el-row>
                <el-row class="rule-item">
                    <el-checkbox></el-checkbox>完成<input style="width: 80px;">笔订单，获得<input style="width: 80px;">个积分
                </el-row>
                <el-row class="rule-item">
                    积分有效期：
                    <el-radio>永久有效</el-radio>
                    <el-radio>年底清零去年所有积分</el-radio>
                    <el-radio>
                        每笔积分有效期为
                        <el-select>
                            <el-option label="一年" value="one"></el-option>
                            <el-option label="两年" value="one"></el-option>
                            <el-option label="三年" value="one"></el-option>
                        </el-select>
                    </el-radio>
                </el-row>
                <el-button type="primary" size="small">&nbsp;&nbsp;&nbsp;&nbsp;保 存&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </div>
            <!-- table表格 -->
            <div class="table-wrap" ref="myTable" v-loading="loading" :element-loading-text="$t('loadingText')">
                <span class="span-title">会员等级设置</span>
                <el-button type="text" @click="addLevel">+新增会员等级</el-button>
                <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="uid"
                        label="等级ID"
                        align="center"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="recevierName"
                        align="center"
                        label="名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="telephone"
                        align="center"
                        label="所需积分">
                    </el-table-column>
                    <el-table-column
                        prop="buyerName"
                        align="center"
                        label="会员权益">
                    </el-table-column>
                    <el-table-column
                        prop="totalAmount"
                        align="center"
                        label="会员图标">
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button icon="el-icon-edit"></el-button>
                            <el-button icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 新增礼品卡 -->
            <el-dialog title="会员等级设置" :visible.sync="addDialog">
                <el-form label-width="100px">
                    <el-form-item label="等级名称">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="所需积分">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="会员权益">
                        <el-checkbox>会员专享折扣</el-checkbox>
                        <input style="width: 80px;"/>折
                        <el-checkbox>会员全场包邮</el-checkbox>
                    </el-form-item>
                    <el-form-item label="会员图标">
                        <img-gallery></img-gallery>
                    </el-form-item>
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
import ImgGallery from '@/components/common/upload/imgGallery'
export default {
    name: 'SaleOrder',
    props: ['productType'],
    created () {
        this.fetchData(this.currentPage, this.pageSize)
    },
    data () {
        return {
            loading: true,
            params: {
            },
            tableData: [],
            addDialog: false
        }
    },
    methods: {
        addLevel () {
            this.addDialog = true
        },
        cancel () {
            this.addDialog = false
        },
        fetchData () {
            this.loading = true
            this.$axios.post('', {
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    if (res.data.data) {
                        this.tableData = res.data.data.dataList
                    } else {
                        this.tableData = []
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
        ImgGallery
    }
}
</script>

<style lang="less" scoped>
.rule-item{
    height: 30px;
    line-height: 30px;
}
.span-title{
    font-size: 18px;
    font-weight: 500;
}
</style>


