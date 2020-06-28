<template>
    <div class="form-wrap">
        <div class="search-condition">
            <div class="search-item">
                <div class="date-btn" @click="changeTab('plot')" :class="{ active: activeTab === 'plot' }">模切机</div>
                <div class="date-btn" @click="changeTab('print')" :class="{ active: activeTab === 'print' }">打印机</div>
            </div>
        </div>
        <el-row class="total-amount">
            <el-col :span="4" class="total-item">
                <p class="label">累计出货（台）</p>
                <p class="count">1000000</p>
            </el-col>
            <el-col :span="4" class="total-item">
                <p class="label">累计模切（个）</p>
                <p class="count">5000000000</p>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <h4>城市分布比图</h4>
                <ve-ring :data="chartData"></ve-ring>
                <h4>模切数量城市排名Top 5</h4>
                <ve-bar :data="barData" :settings="barSetting"></ve-bar>
            </el-col>
            <el-col :span="12">
                <ve-map :settings="mapSetting" :data="mapData"></ve-map>
            </el-col>
        </el-row>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: 'SaleStatistics',
    data() {
        return {
            activeTab: 'plot',
            chartData: {
                columns: ['city', 'total'],
                rows: [
                    {
                        'city': '广东省',
                        'total': '100'
                    },
                    {
                        'city': '北京',
                        'total': '200'
                    },
                    {
                        'city': '上海',
                        'total': '120'
                    },
                    {
                        'city': '浙江',
                        'total': '150'
                    },
                    {
                        'city': '辽宁',
                        'total': '300'
                    },
                    {
                        'city': '江西',
                        'total': '100'
                    }
                ]
            },
            barSetting: {
                labelMap: {
                    'number': '模切数量'
                },
                dataOrder: {
                    label: 'number',
                    order: 'desc'
                }
            },
            barData: {
                columns: ['city', 'number'],
                rows: [
                    {
                        'city': '深圳市',
                        'number': 4400
                    },
                    {
                        'city': '上海市',
                        'number': 4000
                    },
                    {
                        'city': '广州市',
                        'number': 3500
                    },
                    {
                        'city': '北京市',
                        'number': 3000
                    },
                    {
                        'city': '海外',
                        'number': 2800
                    }
                ]
            },
            mapSetting: {
                position: 'world',
                label: false
            },
            mapData: {
                columns: ['位置', '税收'],
                rows: [
                    {
                        '位置': 'China',
                        '税收': 123
                    },
                    {
                        '位置': 'Japan',
                        '税收': 1223
                    },
                    {
                        '位置': 'Italy',
                        '税收': 2123
                    },
                    {
                        '位置': 'Canada',
                        '税收': 4123
                    }
                ]
            }
        }
    },
    methods: {
        changeTab (val) {
            this.activeTab = val
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.search-condition{
    overflow: hidden;
    cursor: pointer;
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
        box-sizing: border-box;
        padding: 10px;
    }
}
.label{
    font-size: 14px;
    font-weight: 500;
}
.count{
    font-weight: 700;
    font-size: 24px;
    color: #0070ae;
}
</style>
