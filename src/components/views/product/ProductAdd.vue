<template>
    <div>
        <div class="bread-wrap">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item to="/productCategory">{{ $t('pAdd') }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ categoryName }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <lang-tab :checkName="checkName" @getTabName="getTabName" :pUid="pUid">
            <template :slot="_lang.langCode" v-for="_lang in _langArr">
                <add-form
                    v-if="checkName === _lang.langCode"
                    :lang="checkName"
                    :key="_lang.langCode"
                    :pUid="pUid">
                </add-form>
            </template>
        </lang-tab>
    </div>
</template>

<script>
import LangTab from '@/components/common/lang/LangTab'
import AddForm from './goods/AddForm'
export default {
    name: 'ComProductAdd',
    props: {
        pUid: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            checkName: this._defaultLang
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
        AddForm
    }
}
</script>

<style lang="less">
</style>

