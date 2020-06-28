<template>
    <div class="page-wrap">
        <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <div class="phone-wrap" v-if="showIframe">
                <iframe class="pre-iframe" :src="iframeSrc"></iframe>
            </div>
        </transition>
        <transition enter-active-class="aniamted fadeIn" leave-active-class="animated fadeOut">
            <div class="shadow-wrap" v-show="showIframe" @click="$emit('closePage')"></div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        iframeSrc: {
            type: String,
            required: true
        },
        showIframe: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
</style>
