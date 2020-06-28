<template>
    <div>
        <div class="my-panel" @click="handleChange($event)">
            <div class="my-panel-item" label="batch" :class="{ active: activeTab === 'batch' }">{{ $t('searchByBatchNo') }}</div>
            <div class="my-panel-item" label="consumable" :class="{ active: activeTab === 'consumable' }">{{ $t('allConsumable') }}</div>
        </div>
        <component :is="showComponent" :batchNo="batchNo" @getBatchNo="getBatchNo"></component>
    </div>
</template>

<script type="text/ecmascript-6">
import Batch from './batch'
import Consumable from './consumables'
export default {
    data() {
        return {
            activeTab: 'batch',
            batchNo: '',
        }
    },
    methods: {
        handleChange (e) {
            let tab = e.target.getAttribute('label')
            if (tab) {
                this.activeTab = tab
            }
        },
        getBatchNo (bno) {
            // 监听子组件事件
            this.batchNo = bno
            this.activeTab = 'consumable'
        }
    },
    components: {
        Batch,
        Consumable
    },
    computed: {
        showComponent () {
            if (this.activeTab === 'batch') {
                return 'Batch'
            } else if (this.activeTab === 'consumable') {
                return 'Consumable'
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
