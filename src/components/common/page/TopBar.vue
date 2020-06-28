<template>
    <div class="top-bar">
        <div class="logo-wrapper">
            <img class="logo-img" :src="logo ? _fileHost.SHOP_IMAGE + '/' + logo : require('../../../assets/imgs/logo_uzien_login.png')">
        </div>
        <div class="right-drop-wrap">
            <el-dropdown @command="handleLangCommand" trigger="click">
                <span class="el-dropdown-link">
                    {{ $t('languageSwitch') }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="_lang.langCode" v-for="_lang in _langArr" :key="_lang.langCode">{{ _lang.langName }}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="handleCommand" trigger="hover">
                <span class="el-dropdown-link">
                    {{ name }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="updatePass">修改密码</el-dropdown-item>
                    <el-dropdown-item command="exit">{{ $t('exit') }}</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { bus } from '@/common/share/bus'
export default {
    name: 'TopBar',
    data () {
        return {
            name: JSON.parse(sessionStorage.user).name
        }
    },
    methods: {
        handleLangCommand (lang) {
            this.$i18n.locale = lang
            localStorage.lang = lang
            // 切换语言刷新当前页面
            // location.reload()
        },
        handleCommand (cmd) {
            if (cmd === 'exit') {
                sessionStorage.clear()
                this.$router.push({
                    path: '/login'
                })
            } else if (cmd === 'updatePass') {
                this.$router.push({
                    path: '/updatePass'
                })
            }
        }
    },
    computed: {
        logo () {
            return this.$store.state.siteLogo
        }
    }
}
</script>
<style>
.top-bar{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background-color: #0070ae;
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    z-index: 12;
}
.logo-wrapper{
    display: inline-block;
    width: 160px;
    height: 40px;
    line-height: 40px;
    text-align: center;
}
.logo-img{
    display: inline-block;
    width: 128px;
    height: 32px;
    vertical-align: middle;
    object-fit: contain;
}
.el-dropdown-link{
    color: #fff;
}
.right-drop-wrap{
    position: absolute;
    right: 40px;
}
.right-drop-wrap .el-dropdown{
    margin-left: 40px;
    cursor: pointer;
}
</style>

