<template>
    <div class="">
        <!-- 自定义头部区域 -->
        <!-- 搜索区域 -->
        <div class="search-wrap">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item :label="$t('pCode')">
                    <el-input type="text"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pName')">
                    <el-input type="text"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pType')">
                    <el-input type="text"></el-input>
                </el-form-item>
                <el-form-item :label="$t('pSupply')">
                    <el-select v-model="params.supply">
                        <el-option :label="$t('all')" value=""></el-option>
                        <el-option label="云智印" value="uzien"></el-option>
                        <el-option label="云智印" value="uzien"></el-option>
                        <el-option label="云智印" value="uzien"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否上架">
                    <el-checkbox-group v-model="params.on">
                        <el-checkbox label="已上架" :key="1"></el-checkbox>
                        <el-checkbox label="未上架" :key="2"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button class="primary" :loading="loading">{{$t('search')}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- table表格 -->
        <div class="table-wrap">
            <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="date"
                label="ID"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="商品编号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="address"
                label="商品名称">
            </el-table-column>
            <el-table-column
                prop="address"
                label="供应商">
            </el-table-column>
            <el-table-column
                prop="address"
                label="价格">
            </el-table-column>
            <el-table-column
                prop="address"
                label="采购价">
            </el-table-column>
            <el-table-column
                prop="address"
                label="商品类型">
            </el-table-column>
            <el-table-column
                prop="address"
                label="状态">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
            </el-table-column>
        </el-table>
        </div>
        <!-- 分页组件 -->
        <pager :total="100" :currentPage="currentPage" @getCurrentPage="getCurrentPage"></pager>
    </div>
</template>

<script>
import Pager from '@/components/common/Pager'
export default {
    name: 'Product',
    data () {
        return {
            currentPage: 1,
            loading: true,
            params: {
                supply: '',
                on: []
            },
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '嘿嘿嘿'
            }
            ]
        }
    },
    methods: {
        getCurrentPage (num) {
            this.currentPage = num
            console.log('parent-' + num)
        }
    },
    components: {
        Pager
    }
}
</script>
