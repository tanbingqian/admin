<template>
    <div :class="wrapClass" class="swiper-container" :style="{ height: height + 'px' }">
        <div class="swiper-wrapper" @click="slideClick">
            <div class="swiper-slide" :style="{ height: height + 'px' }" :class="d" v-for="(d, i) in data" :key="i">{{ i }}</div>
        </div>
        <div class="swiper-pagination"></div>
    </div>
</template>

<script type="text/ecmascript-6">
import Swiper from 'swiper/dist/js/swiper.min.js'
import 'swiper/dist/css/swiper.min.css'
import _ from 'underscore'
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
            type: Number
        },
        speed: {
            type: Number,
            default: 300
        },
        delay: {
            type: Number,
            default: 2000
        }
    },
    mounted () {
        this.initSwiper()
    },
    data() {
        return {
            swiper: null
        }
    },
    watch: {
        height () {
            this.swiper.destroy()
            this.initSwiper()
        },
        delay (newVal, oldVal) {
            this.swiper.params.autoplay.delay = newVal
        },
        speed (newVal, oldVal) {
            this.swiper.params.speed = newVal
        }
    },
    methods: {
        initSwiper () {
            this.swiper = new Swiper('.' + this.wrapClass, {
                loop: true,
                speed: this.speed,
                autoplay: {
                    delay: this.delay
                },
                pagination: {
                    el: '.swiper-pagination'
                },
                observer:true,
                observeParents:true,
            })
        },
        slideClick (event) {
            console.log(event.target.dataset.swiperSlideIndex);

        }
    },
    destroyed () {
        this.swiper.destroy(true)
    }
}
</script>

<style scoped lang="less">
.swiper-container{
}
.primary{
    width: 100%;
}
.swiper-slide{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ccc;
}
.swiper-container-horizontal>.swiper-pagination-bullets{
    bottom: 0;
}
</style>
