<template>
    <transition leave-active-class="animated hinge">
        <div class="login-page">
            <div class="login-wrap">
                <div class="img-wrap">
                    <img class="logo-img" :src="logo ? _fileHost.SHOP_IMAGE + '/' + logo : require('../../../assets/imgs/logo_uzien_login.png')">                    
                </div>
                <div class="login-form" v-loading="loading" :element-loading-text="$t('loadingText')">
                    <div class="u-item border-bottom" :class="{ active: focusId === 'username' }">
                        <img v-show="!form.userId" class="u-icon" src="../../../assets/imgs/icon_user_nor.png">
                        <img v-show="form.userId" class="u-icon" src="../../../assets/imgs/icon_user_pre.png">
                        <input type="password" style="display: none;"/>
                        <input class="u-input"
                                autofocus="true"
                                :class="{ active: form.userId !== '' && form.userId !== undefined }"
                                autocomplete="off"
                                id="username"
                                v-on:focus="focus"
                                v-on:blur="blur"
                                type="text"
                                v-model="form.userId"
                                :placeholder="$t('userPlaceholder')"/>
                    </div>
                    <div class="u-item border-bottom" :class="{ active: focusId === 'password' }">
                        <img v-show="!form.password" class="u-icon" src="../../../assets/imgs/icon_password_nor.png">
                        <img v-show="form.password" class="u-icon" src="../../../assets/imgs/icon_password_pre.png">
                        <input class="u-input"
                                :class="{ active: form.password !== '' && form.password !== undefined }"
                                autocomplete="off"
                                id="password"
                                v-on:focus="focus"
                                v-on:blur="blur"
                                type="password"
                                v-model="form.password"
                                @keyup.enter="loginIn"
                                :placeholder="$t('passPlaceholder')"/>
                    </div>
                    <div class="u-item space-between mg-t20">
                        <div class="cb-wrap">
                            <img v-show="!remember" class="u-checkbox-img" src="../../../assets/imgs/icon_check_nor.png">
                            <img v-show="remember" class="u-checkbox-img" src="../../../assets/imgs/icon_check_pre.png">
                            <input v-model="remember" class="u-checkbox" :class="{ active: remember }" id="rp" type="checkbox"/>
                            <label class="cb-label form-font font-9" for="rp" :class="{ active: remember }">{{ $t('rememberMe') }}</label>
                        </div>
                        <router-link to="/forgetPass" class="form-font font-9 forget-pass" >{{ $t('forgetPass') }}</router-link>
                    </div>
                    <div class="u-item">
                        <button class="login-btn"
                                :class="{ active: form.userId && form.password }"
                                @click="loginIn">{{ $t('login') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { auth } from '@/common/api.js'
import { isTrue, b64_to_utf8 } from '@/common/utils/tool.js'
import { bus } from '@/common/share/bus'
export default {
    created () {
    },
    data() {
        return {
            focusId: '',
            form: {
                userId: localStorage.U,
                password: localStorage.P
            },
            remember: isTrue(localStorage.R),
            loading: false,
        }
    },
    methods: {
        focus (event) {
            const focusId = event.target.attributes['id'].value
            this.focusId = focusId
        },
        blur (event) {
            const blurId = event.target.attributes['id'].value
            this.focusId = ''
        },
        loginIn () {
            if (this.form.userId === '' || this.form.password === '') {
                this.$message({
                    type: 'error',
                    message: '请输入用户名或密码'
                })
                return
            }
            this.loading = true
            this.$axios.post(auth.login, this.form).then(res => {
                if (res.data.state) {
                    // 默认记住用户名
                    localStorage.U = this.form.userId
                    if (this.remember) {
                        // 记住密码
                        localStorage.P = this.form.password
                        localStorage.R = this.remember
                    } else {
                        localStorage.P = ''
                        localStorage.R = false
                    }
                    sessionStorage.token = res.data.data.token
                    // 权限获取成功后再跳转到首页
                    sessionStorage._userFuncs = JSON.stringify(res.data.data.function)
                    this.$message({
                        type: 'success',
                        message: '登录成功'
                    })
                    this.$router.push({
                        path: '/home'
                    })
                    // 解码获取用户信息
                    let token = res.data.data.token.split('.')[1]
                    let token_length = token.length % 4
                    // if (token_length !== 0) {
                    //     while(token_length <= 4) {
                    //         token += '='
                    //         token_length++
                    //     }
                    // }
                    token = token.replace(/_/g, '/').replace(/-/g, '+')
                    var user = b64_to_utf8(token)
                    sessionStorage.user = user.toString()
                } else {
                    this.loading = false
                    this.$message({
                        type: 'error',
                        message: this.$t(res.data.code)
                    })
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 获取用户权限
        listuserfunctions () {
            this.$axios.post(auth.listuserfunctions).then(res => {
                if (res.data.state) {

                } else {
                    this.loading = false
                }
            }).catch(err => {
                this.loading = false
            })
        }
    },
    computed: {
        logo () {
            return this.$store.state.siteLogo
        }
    }
}
</script>

<style scoped lang="less">
@import '../../../styles/variable.less';
.login-page{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    // background-color: #f6f6f6;
    background-image: url('../../../assets/imgs/logo_back.png');
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 2px;
}
.login-wrap{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.img-wrap{
    width: 420px;
    box-sizing: border-box;
    padding: 30px 0 30px 0;;
    background-color: @baseColor;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.logo-img{
    margin: 0 auto;
    display: block;
    width: 160px;
    height: 40px;
    object-fit: contain;
}
.login-form{
    width: 420px;
    // height: 308px;
    margin: 0 auto;
    background: #fff;
    padding: 28px 60px;
    box-sizing: border-box;
    // box-shadow: 0px 2px 3px 1px	#f1f1f1;
    margin-bottom: 100px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.mg-t20{
    margin-top: 20px;
}
.font-9{
    color: #999;
}
.font-6{
    color: #666;
}
.form-font{
    font-size: 12px;
    font-family: 'Microsoft YaHei Light';
}
.border-bottom {
    border-bottom: 1px solid #f1f1f1;
}
.space-between{
    justify-content: space-between;
}
.u-item{
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    transition: all ease-in-out .5s;
    &.active{
        border-bottom: 1px solid @baseColor;
    }
}
.u-icon{
    width: 18px;
    height: 20px;
    margin-right: 16px;
}
.u-input{
    flex-grow: 1;
    .form-font;
    line-height: 22px;
    border: none;
    outline: none;
    &.active{
        color: #333;
        font-family: 'Miscrosoft YaHei';
        font-weight: 600;
        font-size: 16px;
    }
}
.cb-wrap{
    line-height: 13px;
}
.u-checkbox{
    position: relative;
    vertical-align: bottom;
    margin-right: 10px;
    opacity: 0;
    z-index: 100;
    &::before{

    }
    &.active{
        color: @baseColor;
    }
}
.cb-label{
    display: inline-block;
    font-weight: 600;
    .form-font;
    &.active{
        color: @baseColor;
    }
}
.forget-pass{
    font-weight: 600;
}
.forget-pass:hover{
    color: @baseColor;
    cursor: pointer;
}
.login-btn{
    flex-grow: 1;
    height: 40px;
    background-color: #eee;
    color: #999;
    border: none;
    outline: none;
    border-radius: 10px;
    transition: all ease-in-out .3s;
    &.active{
        background-color: @baseColor;
        color: #fff;
    }
    &:hover{
        cursor: pointer;
    }
}
.u-checkbox-img{
    position: absolute;
    width: 16px;
    height: 16px;
}
/*修改input标签自动填充样式*/
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus{
    border: none;
    -webkit-text-fill-color: #000; // 自定义字体的颜色
    box-shadow: 0 0 0px 1000px #fff inset; // 背景色
    font-weight: 500;
    background-color: #fff;
}
/*改变input光标颜色*/
input{
    caret-color: @baseColor;
}
</style>
