<template>
    <div class="form-wrap">
        <h3>销售数据统计</h3>
        <div class="search-condition">
            <div class="search-item">
                <div class="date-btn" :class="{ active: activeTab === 'today' }">今日</div>
                <div class="date-btn" :class="{ active: activeTab === 'yesterday' }">昨日</div>
                <div class="date-btn" :class="{ active: activeTab === 'lastSevenDay' }">近7日</div>
                <div class="date-btn" :class="{ active: activeTab === 'lastThirtyDay' }">近30日</div>
            </div>
            <div class="search-item">
                <span class="label">选择时间</span>
                <el-date-picker></el-date-picker>
                <span>-</span>
                <el-date-picker></el-date-picker>
            </div>
            <div class="search-item">
                <el-input placeholder="商品名称">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
        </div>
        <el-row class="total-amount">
            <el-col :span="4" class="total-item">
                <p>成交金额</p>
                <p>0</p>
                <p>商品总额：000000.00</p>
                <p>运费总额：000000000.00</p>
            </el-col>
            <el-col :span="4" class="total-item">
                <p>成交订单数</p>
                <p>0</p>
            </el-col>
            <el-col :span="4" class="total-item">
                <p>成交买家数</p>
                <p>0</p>
            </el-col>
            <el-col :span="4" class="total-item">
                <p>成交商品件数</p>
                <p>0</p>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <ve-pie :data="chartData"></ve-pie>
            </el-col>
            <el-col :span="12">
                <h4>定制商品生产数据统计</h4>
                <el-table :data="[]">
                    <el-table-column label="生产商"></el-table-column>
                    <el-table-column label="订单总数"></el-table-column>
                    <el-table-column label="商品总数"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>  
</template>

<script type="text/ecmascript-6">
export default {
    name: 'SaleStatistics',
    data() {
        return {
            activeTab: 'today',
            chartData: {
                columns: ['type', 'total'],
                rows: [
                    {
                        'type': '成品商品',
                        'total': '100'
                    },
                    {
                        'type': '定制商品',
                        'total': '200'
                    }
                ]
            }
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.border-r{
    border-right: 1px solid #999;
}
.search-condition{
    overflow: hidden;
}
.search-item{
    float: left;
    margin-right: 10px;
}
.date-btn{
    display: inline-block;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #000;
    border: 1px solid #0070ae;
    border-radius: 5px;
    margin-right: 20px;
    &.active{
        background-color: #0070ae;
        color: #fff;
    }
}
.total-amount{  
    margin: 30px 0;
    text-align: center;
    .total-item{
        height: 140px;
        box-sizing: border-box;
        padding: 10px;
        border-right: 1px solid #999;
        border-top: 1px solid #999;
        border-bottom: 1px solid #999;
        &:last-child{
            border-right: none;
        }
    }
}
</style>
