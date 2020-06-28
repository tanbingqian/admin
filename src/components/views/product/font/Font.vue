<template>
    <!-- 自定义头部区域 -->
    <lang-tab :checkName="checkName" @getTabName="getTabName">
        <template :slot="_lang.langCode" v-for="_lang in _langArr">
            <font-list v-if="checkName === _lang.langCode" :lang="checkName" :key="_lang.langCode"></font-list>
        </template>
    </lang-tab>
</template>

<script>
import LangTab from '@/components/common/lang/LangTab'
import FontList from '@/components/views/product/font/FontList'
export default {
    name: 'Tab',
    data () {
        return {
            checkName: this._defaultLang
        }
    },
    methods: {
        getTabName (lang) {
            this.checkName = lang
            // console.log(tab)
        }
    },
    components: {
        FontList,
        LangTab
    }
}
</script>

<style>
</style>
