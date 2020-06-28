<template>
    <div :class="wrapClass" class="swiper-container"
        :style="{
            height: height + 'px',
            marginTop: marginTop +'px',
            marginBottom: marginBottom + 'px',
            marginLeft: marginLeft + 'px',
            marginRight: marginRight + 'px'
        }">
        <mt-swipe :speed="speed">
            <mt-swipe-item v-for="d in data" :key="d.uid">
                <div
                v-if="d.image.length > 0 && d.image[0] !== ''"
                class="swipe-img"
                :style="{
                    borderRadius: itemRadius + 'px',
                    backgroundImage: 'url('+ _fileHost.SHOP_IMAGE + d.image[0] +')'
                }"
                >
                </div>
                <div
                    v-else
                    class="swipe-img"
                    :style="{
                        borderRadius: itemRadius + 'px',
                    }"
                >
                </div>
            </mt-swipe-item>
        </mt-swipe>
    </div>
</template>

<script type="text/ecmascript-6">
import { Swipe, SwipeItem } from 'mint-ui'
import 'mint-ui/lib/swipe/style.css'
import 'mint-ui/lib/swipe-item/style.css'
export default {
    name: 'Swipe',
    props: {
        wrapClass: {
            type: String,
            required: true
        },
        data: {
            type: Array,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        speed: {
            type: Number,
            default: 300
        },
        delay: {
            type: Number,
            default: 3000
        },
        marginTop: {
            type: Number,
            default: 0
        },
        marginBottom: {
            type: Number,
            default: 0
        },
        marginLeft: {
            type: Number,
            default: 0
        },
        marginRight: {
            type: Number,
            default: 0
        },
        paddingTop: {
            type: Number,
            default: 0
        },
        paddingBottom: {
            type: Number,
            default: 0
        },
        paddingLeft: {
            type: Number,
            default: 0
        },
        paddingRight: {
            type: Number,
            default: 0
        },
        itemRadius: {
            type: Number,
            default: 0
        }
    },
    mounted () {

    },
    data() {
        return {

        }
    },
    components: {
        MtSwipe: Swipe,
        MtSwipeItem: SwipeItem
    }
}
</script>

<style lang="less">
.swipe-img{
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('../../../../../assets/imgs/default.png');
}
.mint-swipe-indicators .mint-swipe-indicator{
    background: #fff;
    opacity: 1;
    &.is-active{
        opacity: 1;
        background: rgb(239, 56, 122);;
    }
}
</style>
