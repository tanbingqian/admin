<template>
    <div class="flash" :style="{ height: 100 + 'px' }">
        <div class="flash-item"></div>
        <div class="flash-pager">
            <span class="pager-item" v-for="(f, i) in arr" :key="i" :class="{ active: activeIndex === i }">
            </span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: 'flash',
    props: {
        num: {
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
        height: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            activeIndex: 0,
            timer: null
        }
    },
    mounted () {
        this.initFlash()
    },
    methods: {
        initFlash () {
            this.timer = setInterval(() => {
                this.activeIndex++
                if (this.activeIndex > this.num - 1) {
                    this.activeIndex = 0
                }
            }, this.delay)
        }
    },
    destroyed () {
        clearInterval(this.timer)
    },
    computed: {
        arr () {
            let arr = []
            for (var i = 0; i < this.num; i++) {
                arr.push(i)
            }
            return arr
        }
    }
}
</script>

<style scoped lang="less">
.flash{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.flash-item{
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url('../../../../../assets/imgs/default.png');
    // background-color: #f6f6f6;
    background-size: cover;
    background-repeat: no-repeat;
}
.flash-pager{
    z-index: 10;
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 24px;
    line-height: 24px;
    text-align: center;
    .pager-item{
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        border: 1px solid #ccc;
        background-color: #fff;
        margin-right: 5px;
        &.active{
            background-color: #666;
        }
    }
}
</style>
