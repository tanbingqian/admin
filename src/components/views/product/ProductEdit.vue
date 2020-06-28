<template>
    <div>
        <div class="bread-wrap">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item :to="'/product?type=' + type" >商品查询</el-breadcrumb-item>
                <el-breadcrumb-item>{{ categoryName }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <lang-tab :checkName="checkName" @getTabName="getTabName" :pUid="pUid">
            <template :slot="_lang.langCode" v-for="_lang in _langArr">
                <edit-form
                    v-if="checkName === _lang.langCode"
                    :lang="checkName"
                    :key="_lang.langCode"
                    :pUid="pUid">
                </edit-form>
            </template>
        </lang-tab>
    </div>
</template>

<script>
import LangTab from '@/components/common/lang/LangTab'
import EditForm from './goods/EditForm'
export default {
    name: 'ComProductEdit',
    props: {
        pUid: {
            type: String
        },
        type: {
            type: String
        }
    },
    data () {
        return {
            checkName: this._defaultLang,
            initUid: this.pUid
        }
    },
    methods: {
        getTabName (tabName) {
            this.checkName = tabName
        },
        changeProductId (pid) {
            this.initUid = pid
        }
    },
    computed: {
        categoryName () {
            if (this.type === 'FIXED') {
                return this.$t('comProduct1')
            } else if (this.type === 'CUSONLINE') {
                return this.$t('onLineMade1')
            } else if (this.type === 'CUSOFFLINE') {
                return this.$t('offLineMade1')
            } else if (this.type === 'PLOT') {
                return this.$t('cutProduct1')
            } else {
                return ''
            }
        }
    },
    components: {
        LangTab,
        EditForm
    }
}
</script>

<style lang="less">
</style>

