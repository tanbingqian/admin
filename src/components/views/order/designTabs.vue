<template>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane :label="$t('comProduct1')" name="first">
            <keep-alive>
                <design-order productType="FIXED" v-if="activeName === 'first'"></design-order>
            </keep-alive>
        </el-tab-pane>
        <el-tab-pane :label="$t('onLineMade1')" name="second">
            <keep-alive>
                <design-order productType="CUSONLINE" v-if="activeName === 'second'"></design-order>
            </keep-alive>
        </el-tab-pane>
    </el-tabs>
</template>

<script type="text/ecmascript-6">
import DesignOrder from './designOrder'
export default {
    data() {
        return {
            activeName: 'first'
        }
    },
    methods: {
        handleClick (val) {

        },
    },
    components: {
        DesignOrder
    }
}
</script>

<style scoped lang="less">
</style>
