<template>
    <div class="store-page">
        <div class="header">
            <div class="left">
                <span class="device">PC版</span>
                <span class="device">手机版</span>
            </div>
            <div class="right">
                <el-dropdown trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link reset-label">
                        撤销操作<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="all">全部撤销</el-dropdown-item>
                        <el-dropdown-item command="currPage">撤销当前页</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="primary" size="small" plain @click="preview">预览</el-button>
                <el-button type="primary" size="small" plain @click="publishPage" v-show="_hasPermission('SITE_PUBLISH')">发布</el-button>
                <el-button type="primary" size="small" plain @click="offLine" v-show="_hasPermission('SITE_OFFLINE')">下线</el-button>
            </div>
        </div>
        <div class="content">
            <div class="left-wrap">
                <div class="uz-tab">
                    <div class="uz-tab-item" @click="chang('side-bar')" :class="{ active: activeTab === 'side-bar' }">模块</div>
                    <div class="uz-tab-item" @click="chang('add-page')" :class="{ active: activeTab === 'add-page' }">页面</div>
                </div>
                <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                    <add-page v-if="activeTab === 'add-page'"></add-page>
                    <side-bar v-if="activeTab === 'side-bar'"></side-bar>
                </el-scrollbar>
            </div>
            <div class="center-wrap">
                <center :page="currentPage"></center>
            </div>
        </div>
        <iframe-page :iframeSrc="iframeSrc" :showIframe="showIframe" @closePage="showIframe = !showIframe"></iframe-page>
    </div>
</template>

<script type="text/ecmascript-6">
import SideBar from './sidebar'
import AddPage from './addPage'
import Center from './center'
import IframePage from '@/components/common/page/preview'
import { shop } from '@/common/api'
import { eventHub } from '@/common/share/eventHub'
export default {
    name: 'StoreDecoration',
    data() {
        return {
            activeTab: 'add-page',
            reset: '',
            iframeSrc: '',
            showIframe: false
        }
    },
    created () {
        this.getShopTheme()
    },
    computed: {
        currentPage () {
            return this.$store.state.shop.currentPage
        }
    },
    methods: {
        // 预览网页
        preview () {
            this.iframeSrc = 'http://mall.dev.uzien.com/Index/previewPage?puid=' + this.currentPage.uid
            this.showIframe = true
        },
        chang (name) {
            this.activeTab = name
        },
        // 获取主题
        getShopTheme () {
            this.$axios.post(shop.getShopTheme).then(res => {
                if (res.data.state) {
                    this.$store.commit('setShopTheme', res.data.data.theme)
                }
            })
        },
        // 发布
        publishPage () {
            this.$axios.post(shop.publishPage).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '发布成功'
                    })
                    // 发布之后在设置主题
                    this.$axios.post(shop.saveShopTheme, {
                        theme: this.$store.state.shop.themeColor
                    }).then(res => {
                        if (res.data.state) {
                        }
                    })
                }
            })
        },
        // 下线
        offLine () {
            this.$axios.post(shop.onOffLine, {
                type: 'ON'
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '下线成功'
                    })
                }
            })
        },
        handleCommand (cmd) {
            if (cmd === 'all') {
                this.$confirm('确定撤销全部操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(res => {
                    this.$axios.post(shop.cancelAllPage).then(res => {
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: '撤销全部操作成功'
                            })
                            eventHub.$emit('reloadComponent')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            } else if (cmd === 'currPage') {
                if (!this.$store.state.shop.currentPage.uid) {
                    this.$message({
                        type: 'error',
                        message: '请选择一个页面'
                    })
                    return
                }
                this.$confirm('确定撤销当前页操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(res => {
                    this.$axios.post(shop.cancelSinglePage, {
                        pageUid: this.$store.state.shop.currentPage.uid
                    }).then(res => {
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: '撤销当前页操作成功'
                            })
                            eventHub.$emit('reloadComponent')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            }
        }
    },
    components: {
        SideBar,
        Center,
        AddPage,
        IframePage
    }
}
</script>

<style scoped lang="less">
.store-page{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    bottom: 0;
    overflow: hidden;
}
.header{
    position: absolute;
    top: 0;
    width: 100%;
    height: 40px;
    background-color: #ebebeb;
    box-sizing: border-box;
    padding: 0 20px;
    .left{
        float: left;
        height: 40px;
        display: flex;
        align-items: center;
        .device{
            margin-right: 10px;
        }
    }
    .right{
        float: right;
        height: 40px;
        display: flex;
        align-items: center;
    }
}
.content{
    height: 100%;
    padding-top: 40px;
    overflow: hidden;
    background-color: #f6f6f6;
    .left-wrap{
        float: left;
        width: 25%;
        height: 100%;
        background-color: #fff;
    }
    .center-wrap{
        position: relative;
        overflow: hidden;
        height: 100%;
    }
}
.reset-label{
    display: inline-block;
    color: #0070ae;
    font-size: 14px;
    width: 110px;
    text-align: center;
    cursor: pointer;
}

</style>
