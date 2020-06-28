<template>
    <div>
        <div class="my-panel" @click="handleChange($event)">
            <div class="my-panel-item" label="print" :class="{ active: activeTab === 'print' }">{{ $t('printDataCount') }}</div>
            <div class="my-panel-item" label="product" :class="{ active: activeTab === 'product' }">{{ $t('productPrintCount') }}</div>
            <div class="my-panel-item" label="mechant" :class="{ active: activeTab === 'mechant' }">{{ $t('mechantPrintCount') }}</div>
            <div class="my-panel-item" label="month" :class="{ active: activeTab === 'month' }">{{ $t('monthPrintCount') }}</div>
        </div>
        <keep-alive>
            <component :is="showComponent"></component>
        </keep-alive>
    </div>
</template>

<script type="text/ecmascript-6">
import Print from './device/print'
import Product from './device/product'
import Mechant from './device/mechant'
import Month from './device/month'
export default {
    data() {
        return {
            activeTab: 'print'
        }
    },
    methods: {
        handleChange (e) {
            let tab = e.target.getAttribute('label')
            if (tab) {
                this.activeTab = tab
            }
        }
    },
    components: {
        Print,
        Product,
        Mechant,
        Month
    },
    computed: {
        showComponent () {
            if (this.activeTab === 'print') {
                return 'Print'
            } else if (this.activeTab === 'product') {
                return 'Product'
            } else if (this.activeTab === 'mechant') {
                return 'Mechant'
            } else if (this.activeTab === 'month') {
                return 'Month'
            }
        }
    }
}
</script>

<style scoped lang="less">
.my-panel{
    overflow: hidden;
    cursor: pointer;
    .my-panel-item{
        float: left;
        width: 140px;
        height: 38px;
        line-height: 38px;
        background-color: #fff;
        text-align: center;
        box-sizing: border-box;
        border-top: 1px solid #ebebeb;
        border-right: 1px solid #ebebeb;
        border-bottom: 1px solid #ebebeb;
        transition: all ease-in-out .3s;
        &:first-child{
            border-left: 1px solid #ebebeb;
        }
        &.active{
            background-color: #ebebeb;
            border-bottom: none;
            color: #0070ae;
        }
    }
}
</style>
