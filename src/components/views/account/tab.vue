<template>
    <div class="tab-wrap">
        <div
            class="tab-item"
            v-for="(d, i) in data"
            :key="i"
            @click="tabClick(d)"
            :class="{ active: d.value === value }">
            {{ d.name }}
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {

        }
    },
    methods: {
        tabClick (tab) {
            if (tab.value !== this.value) {
                this.$emit('tabChange', tab)
            }
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.tab-wrap{
    overflow: hidden;
    background-color: #ebebeb;
    box-sizing: border-box;
    .tab-item{
        float: left;
        width: 100px;
        font-size: 14px;
        color: #000;
        text-align: center;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        &:hover{
            cursor: pointer;
        }
        &.active{
            background-color: #fff;
            border-bottom: none;
        }
    }
}
</style>
