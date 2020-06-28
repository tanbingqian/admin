<template>
    <div class="login-page">
        <div class="login-wrap">
            <div class="img-wrap">
                <img class="logo-img" :src="logo ? _fileHost.SHOP_IMAGE + '/' + logo : require('../../../assets/imgs/logo_uzien_login.png')">
            </div>
            <div class="login-form">
                <div class="u-item border-bottom" :class="{ active: focusId === 'username' }">
                    <img v-show="form.userId === ''" class="u-icon" src="../../../assets/imgs/icon_user_nor.png">
                    <img v-show="form.userId !== ''" class="u-icon" src="../../../assets/imgs/icon_user_pre.png">
                    <input
                        class="u-input"
                        :class="{ active: form.userId !== '' }"
                        autocomplete="false"
                        id="username"
                        v-on:focus="focus"
                        v-on:blur="blur"
                        type="text"
                        v-model="form.userId"
                        :placeholder="$t('userPassPlaceholder')"/>
                </div>
                <div class="u-item border-bottom" :class="{ active: focusId === 'checkCode' }">
                    <img v-show="form.checkCode === ''" class="u-icon" src="../../../assets/imgs/icon_identifyingcode_nor.png">
                    <img v-show="form.checkCode !== ''" class="u-icon" src="../../../assets/imgs/icon_identifyingcode_pre.png">
                    <input
                        class="u-input"
                        :class="{ active: form.checkCode !== '' }"
                        autocomplete="false"
                        id="checkCode"
                        v-on:focus="focus"
                        v-on:blur="blur"
                        v-model="form.checkCode"
                        :placeholder="$t('enterVerifyCode')"/>
                    <span class="form-font font-6 forget-pass ">{{ $t('getVerifyCode') }}</span>
                </div>
                <div class="u-item border-bottom" :class="{ active: focusId === 'password' }">
                    <img v-show="form.password === ''" class="u-icon" src="../../../assets/imgs/icon_password_nor.png">
                    <img v-show="form.password !== ''" class="u-icon" src="../../../assets/imgs/icon_password_pre.png">
                    <input
                        class="u-input"
                        :class="{ active: form.password !== '' }"
                        autocomplete="false"
                        id="password"
                        v-on:focus="focus"
                        v-on:blur="blur"
                        type="password"
                        v-model="form.password"
                        :placeholder="$t('enterNewPass')"/>
                </div>
                <div class="u-item border-bottom" :class="{ active: focusId === 'newPassword' }">
                    <img v-show="form.newPassword === ''" class="u-icon" src="../../../assets/imgs/icon_confirmpassword_nor.png">
                    <img v-show="form.newPassword !== ''" class="u-icon" src="../../../assets/imgs/icon_confirmpassword_pre.png">
                    <input
                        class="u-input"
                        :class="{ active: form.newPassword !== '' }"
                        autocomplete="false"
                        id="newPassword"
                        v-on:focus="focus"
                        v-on:blur="blur"
                        type="password"
                        v-model="form.newPassword"
                        :placeholder="$t('reEnterNewPass')"/>
                </div>
                <div class="u-item">
                    <button class="login-btn"
                            :class="{ active: form.userId && form.password && form.newPassword && form.checkCode }"
                            @click="loginIn">{{ $t('confirm') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { auth } from '@/common/api.js'
export default {
    name: 'ForgetPass',
    data() {
        return {
            focusId: '',
            form: {
                userId: '',
                password: '',
                newPassword: '',
                checkCode: ''
            },
            remember: false
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
    background-color: #f6f6f6;
    background-image: url('../../../assets/imgs/logo_back.png');
    background-repeat: no-repeat;
    background-size: cover;
}
.login-wrap{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.logo-img{
    margin: 0 auto;
    display: block;
    width: 160px;
    height: 40px;
    object-fit: contain;
}
.img-wrap{
    width: 420px;
    box-sizing: border-box;
    padding: 30px 0 30px 0;;
    background-color: @baseColor;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
.login-form{
    width: 420px;
    // height: 308px;
    margin: 0 auto;
    background: #fff;
    padding: 28px 60px;
    box-sizing: border-box;
    // box-shadow: 0px 2px 3px 1px	#ebebeb;
    margin-bottom: 100px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
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
    vertical-align: bottom;
    margin-right: 10px;
    visibility: hidden;
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
    color: @baseColor;
    cursor: pointer;
    font-weight: 600;
    width: 100px;
    text-align: center;
}
.login-btn{
    margin-top: 30px;
    flex-grow: 1;
    height: 40px;
    background-color: #eee;
    color: #999;
    border: none;
    outline: none;
    border-radius: 5px;
    transition: all ease-in-out .3s;
    &.active{
        background-color: @baseColor;
        color: #fff;
    }
}
.u-checkbox-img{
    position: absolute;
    width: 16px;
    height: 16px;
}
/*修改input标签自动填充样式*/
input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus{
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
