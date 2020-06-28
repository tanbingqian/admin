<template>
    <div class="page-nav" @mouseenter="enter" @mouseleave="leave">
        <i class="el-icon-close"></i>
        <div class="text">{{ currentPage.pageTitle }}</div>
        <span class="menu">...</span>
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
export default {
    data() {
        return {
            edit: false
        }
    },
    methods: {
        editMenu () {
            // 判断是否有选中页面
            if (!this.$store.state.shop.currentPage.uid) {
                this.$message({
                    type: 'error',
                    message: '请选择一个页面'
                })
                return
            }
            this.$emit('editItem', {
                type: 'PAGE-TITLE'
            })
        },
        enter () {
            this.edit = true
        },
        leave () {
            this.edit = false
        }
    },
    computed: {
        currentPage () {
            return this.$store.state.shop.currentPage
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.page-nav{
    position: absolute;
    top: 0;
    left: 0;
    height: 44px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    box-sizing: border-box;
    background-color: #fff;
    padding: 0 10px;
    cursor: pointer;
    .text{
        flex-grow: 1;
        text-align: center;
    }
    .menu{
        position: relative;
        top: -4px;
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
