<template>
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick" :style="tabStyle">
        <el-tab-pane
            :label="_lang.langName"
            :name="_lang.langCode"
            :style="paneStyle"
            v-for="_lang in _langArr"
            :key="_lang.langCode"
            :disabled="disabled"
            >
            <slot :name="_lang.langCode"></slot>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
export default {
    name: 'LangTab',
    props: {
        pUid: {
            type: String
        },
        checkName: {
            type: String,
            default: 'zh-CN'
        },
        tabStyle: {
            type: Object
        },
        paneStyle: {
            type: Object
        }
    },
    data () {
        return {
            activeName: this.checkName,
            excludeComponent: [''] //添加商品页面，umeditor在keep-alive中存在bug，因此去掉改组件
        }
    },
    methods: {
        handleClick (tab, event) {
            this.$emit('getTabName', tab.name)
        }
    },
    computed: {
        disabled () {
            return this.pUid === ''
        }
    }
}
</script>

<style lang="less" scoped>
.card{
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.card-item{
    float: left;
    font-size: 12px;
    padding: 10px;
    background-color: #f6f6f6;
    color: #666;
    &:hover{
        cursor: pointer;
    }
}
</style>

