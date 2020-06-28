<template>
    <div class="page-wrap">
        <div class="search-wrap">
            <el-form label-width="80px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="耗材型号">
                            <el-cascader :options="[]"></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="耗材规格">
                        <el-cascader :options="[]"></el-cascader>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="生成数量">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="18" class="search-btns">
                    <el-button type="primary" size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生成条码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-col>
            </el-row>
        </div>
        <p class="title">
            <span>批次号：xxxx</span>
            <span>生成数量：1000</span>
            <span>生成时间：2018-12-12 12:12:12</span>
        </p>
        <el-row style="margin-top: 10px;">
            <el-col :span="6">
                <el-table :data="[1, 2, 3]">
                    <el-table-column type="index" label="序号" align="center"></el-table-column>
                    <el-table-column label="耗材编码" align="center"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <pager
            :total="totalCount"
            :styles="{
                'background-color': '#fff',
                'margin-top': '20px'
            }"
            layout="total, sizes, prev, pager, next, jumper"
            :currentPage="currentPage"
            :pageSize="pageSize"
            :sizes="[20, 50, 100]"
            @getCurrentSize="getCurrentSize"
            @getCurrentPage="getCurrentPage">
        </pager>
    </div>
</template>

<script type="text/ecmascript-6">
import Pager from '@/components/common/Pager'
export default {
    data() {
        return {
            totalCount: 0,
            currentPage: 1,
            pageSize: 50
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
    },
    components: {
        Pager
    }
}
</script>

<style scoped lang="less">
.title{
    line-height: 28px;
    font-size: 14px;
    color: #222;
    span{
        margin: 0 10px;
    }
}
</style>
