<template>
    <div class="nav" @mouseenter="enter" @mouseleave="leave">
        <div class="nav-item" v-for="(item, index) in menu" :key="index">
            <img v-if="item.imageDef.length === 0" src="../../../../../assets/imgs/cell-img.png"/>
            <img v-else :src="_fileHost.SHOP_IMAGE + item.imageDef[0]">
            <span class="nav-text" :style="activeClass" v-if="item.type === currentPage.type">{{ item.text }}</span>
            <span v-else class="nav-text">{{ item.text }}</span>
        </div>
        <transition name="pull">
            <div class="edit-menu" v-show="edit">
                <i class="el-icon-edit edit-func" @click="editMenu"></i>
            </div>
        </transition>
        <div class="border-div" v-show="edit">

        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { shop } from '@/common/api'
import { eventHub } from '@/common/share/eventHub'
export default {
    data() {
        return {
            menu: [],
            edit: false
        }
    },
    created () {
        eventHub.$on('reloadNav', this.listNavigationSlave)
        this.listNavigationSlave()
    },
    methods: {
        editMenu () {
            this.$emit('editItem', {
                type: 'NAV-BAR'
            })
        },
        enter () {
            this.edit = true
        },
        leave () {
            this.edit = false
        },
        // 获取底部导航菜单
        listNavigationSlave () {
            this.$axios.post(shop.listNavigationSlave).then(res => {
                if (res.data.state) {
                    this.menu = res.data.data
                }
            })
        }
    },
    computed: {
        themeColor () {
            return this.$store.state.shop.themeColor
        },
        activeClass () {
            return {
                color: this.themeColor
            }
        },
        currentPage () {
            return this.$store.state.shop.currentPage
        }
    },
    beforeDestroy () {
        eventHub.$off('reloadNav')
    }
}
</script>

<style scoped lang="less">
.nav{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 44px;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-top: 1px solid #ebebeb;
    &:hover{
        cursor: pointer;
    }
}
.border-div{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px dashed #0070ae;
}
.nav .nav-item{
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    padding: 4px 0;
    box-sizing: border-box;
}
.nav-item img{
    display: inline-block;
    width: 20px;
    height: 20px;
}
.edit-menu{
    position: absolute;
    top: 1px;
    left: 1px;
    width: 40px;
    height: 22px;
    line-height: 22px;
    border-radius: 5px;
    background-color: #ebebeb;
    text-align: center;
    z-index: 10;
}
.edit-func{
    font-size: 16px;
    color: #0070ae;
}
</style>
