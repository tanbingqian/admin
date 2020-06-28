<template>
    <!-- 自定义头部区域 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane :label="$t('comProduct1')" name="FIXED">
            <keep-alive>
                <product productType="FIXED" v-if="activeName === 'FIXED'"></product>
            </keep-alive>
        </el-tab-pane>
        <el-tab-pane :label="$t('onLineMade1')" name="CUSONLINE">
            <keep-alive>
                <product productType="CUSONLINE" v-if="activeName === 'CUSONLINE'"></product>
            </keep-alive>
        </el-tab-pane>
        <el-tab-pane :label="$t('offLineMade1')" name="CUSOFFLINE">
            <keep-alive>
                <product productType="CUSOFFLINE" v-if="activeName === 'CUSOFFLINE'"></product>
            </keep-alive>
        </el-tab-pane>
        <el-tab-pane :label="$t('cutProduct1')" name="PLOT">
            <keep-alive>
                <product productType="PLOT" v-if="activeName === 'PLOT'"></product>
            </keep-alive>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import Product from '@/components/views/product/Product'
export default {
    name: 'Tab',
    data () {
        return {
            activeName: this.$route.query.type
        }
    },
    methods: {
        handleClick (tab, event) {
            this.activeName = tab.name
            this.$router.push({
                path: '/product?type=' + tab.name
            })
        }
    },
    components: {
        Product
    }
}
</script>

<style>
</style>
