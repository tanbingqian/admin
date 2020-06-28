<template>
    <div class="page-wrap">
        <div class="auth-type">
            <div class="type-desc">
                <img class="type-img" :src="wx.img">
                <span class="type-text">微信支付</span>
                <div class="type-switch">
                    <el-switch
                        @change="toggleState(wx)"
                        v-model="wx.state"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </div>
            </div>
            <el-form label-width="80px" label-position="right" v-show="wx.state === 1">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="AppId">
                            <el-input v-model="wx.appId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="API密钥">
                            <el-input v-model="wx.appSeckey"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商户号">
                            <el-input v-model="wx.merchantId"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label=" ">
                            <el-button type="primary" size="small" @click="setWxParams" :loading="wxLoading">保存</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="auth-type">
            <div class="type-desc">
                <img class="type-img" :src="ali.img">
                <span class="type-text">支付宝支付</span>
                <div class="type-switch">
                    <el-switch
                        @change="toggleState(ali)"
                        v-model="ali.state"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </div>
            </div>
            <el-form label-width="80px" label-position="right" v-show="ali.state === 1">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="AppId">
                            <el-input v-model="ali.appId"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="合作伙伴身份(PID)">
                        <el-input v-model="ali.merchantId"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="RSA(SHA256)密钥">
                        <el-input type="textarea" :rows="5" v-model="ali.privateKey"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label=" ">
                            <el-button type="primary" size="small" @click="setAliParams" :loading="aliLoading">保存</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { pay } from '@/common/api'
export default {
    name: 'PaySetting',
    created () {
        this.listparams()
    },
    data() {
        return {
            wxLoading: false,
            wx: {
                text: '微信支付',
                img: require('../../../assets/imgs/icon_WeChatpayment.png'),
                appId: '',
                appSeckey: '',
                merchantId: '',
                payType: 'WXPAY',
                state: 1
            },
            aliLoading: false,
            ali: {
                text: '支付宝支付',
                img: require('../../../assets/imgs/icon_Alipaypayment.png'),
                appId: '',
                privateKey: '',
                payType: 'ALIPAY',
                state: 1,
                merchantId: ''
            }
        }
    },
    methods: {
        listparams () {
            this.$axios.post(pay.listparams).then(res => {
                if (res.data.state) {
                    var arr = res.data.data
                    arr.forEach(el => {
                        if (el.payType === 'WXPAY') {
                            this.wx.appId = el.appId
                            this.wx.appSeckey = el.appSeckey
                            this.wx.merchantId = el.merchantId
                            this.wx.state = el.state
                        } else if (el.payType === 'ALIPAY') {
                            this.ali.appId = el.appId
                            this.ali.privateKey = el.privateKey
                            this.ali.state = el.state
                            this.ali.merchantId = el.merchantId
                        }
                    })
                }
            })
        },
        setWxParams () {
            this.wxLoading = true
            this.$axios.post(pay.setPayParams, {
                appId: this.wx.appId,
                appSeckey: this.wx.appSeckey,
                merchantId: this.wx.merchantId,
                payType: this.wx.payType,
            }).then(res => {
                this.wxLoading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '数据已保存'
                    })
                }
            }).catch(err => {
                this.wxLoading = false
            })
        },
        setAliParams () {
            this.aliLoading = true
            this.$axios.post(pay.setPayParams, {
                appId: this.ali.appId,
                privateKey: this.ali.privateKey,
                payType: this.ali.payType,
            }).then(res => {
                this.aliLoading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '数据已保存'
                    })
                }
            }).catch(err => {
                this.aliLoading = false
            })
        },
        toggleState (item) {
            this.$axios.post(pay.togglestate, {
                payType: item.payType
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
</style>
