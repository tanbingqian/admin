<template>
    <div class="list-page">
        <lang-tab :checkName="checkName" @getTabName="getTabName" :paneStyle="paneStyle">
            <template :slot="_lang.langCode" v-for="_lang in _langArr">
                <photo v-if="checkName === _lang.langCode" :lang="checkName" :key="_lang.langCode"></photo>
            </template>
        </lang-tab>
    </div>
</template>

<script>
import LangTab from '@/components/common/lang/LangTab'
import Photo from './photo'
export default {
    name: 'CustomGallery',
    data () {
        return {
            checkName: this._defaultLang,
            paneStyle: {
                'font-size': '12px'
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
        Photo
    }
}
</script>

