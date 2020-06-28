<template>
    <div class="page-view">
        <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
            <transition
                mode="out-in"
                enter-active-class="animated slideInUp"
                >
                <router-view></router-view>
            </transition>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'PageView'
}
</script>

<style lang="less">
</style>

