<template>
    <div>
        <div class="view-wrap">
            <!-- 根据系统语言列表显示tab -->
            <lang-tab :checkName="checkName" @getTabName="getTabName" :customStyle="customStyle">
                    <template :slot="_lang.langCode" v-for="_lang in _langArr">
                        <add-form v-if="checkName === _lang.langCode" :lang="checkName" :key="_lang.langCode"></add-form>
                    </template>
            </lang-tab>
        </div>
    </div>
</template>

<script>
import LangTab from '@/components/common/lang/LangTab'
import AddForm from './TypeForm'
export default {
    name: 'ComProductAdd',
    data () {
        return {
            checkName: this._defaultLang,
            customStyle: {
                'text-align': 'center'
            }
        }
    },
    methods: {
        getTabName (tabName) {
            this.checkName = tabName
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

