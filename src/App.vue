<template>
  <div id="app">
    <top-bar v-if="showMenu"></top-bar>
    <div class="content">
        <side-bar v-if="showMenu"></side-bar>
        <page-view></page-view>
    </div>
  </div>
</template>

<script>
import '@/styles/main.less'
import SideBar from '@/components/common/page/SideBar'
import TopBar from '@/components/common/page/TopBar'
import PageView from '@/components/common/page/PageView'
import { getSite } from '@/common/utils/tool.js'
import { bus } from '@/common/share/bus'
import Vue from 'vue'
export default {
    name: 'App',
    data () {
        return {
            hidePath: ['/login', '/forgetPass', '/']
        }
    },
    mounted () {
        // 获取站点logo
        getSite().then(res => {
            let logo = res.data.data.logo
            let siteName = res.data.data.siteName
            let $title = document.querySelector('title')
            $title.innerHTML = siteName + '-后台管理系统'
            this.$store.commit('setSiteLogo', logo)
        })
    },
    computed: {
        showMenu () {
            if (this.hidePath.indexOf(this.$route.fullPath) > -1) {
                return false
            } else {
                return true
            }
        },
    },
    components: {
      SideBar,
      TopBar,
      PageView
    },
}
</script>
<style lang="less" scoped>
.content{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    box-sizing: border-box;
    display: flex;
    padding-top: 40px;
}
</style>
