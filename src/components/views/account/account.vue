<template>
    <div class="">
        <div class="amount">
            <div class="amount-item">
                <p class="title">可用金额（元）</p>
                <p class="use-price">{{ (account.totalAmount - account.frozenAmount).toFixed(2) }}</p>
                <span class="top-up" @click="showDialog = true">充值</span>
            </div>
            <div class="amount-item">
                <p class="title">账户总金额（元）</p>
                <p class="price">{{ account.totalAmount.toFixed(2) }}</p>
            </div>
            <div class="amount-item">
                <p class="title">冻结金额（元）</p>
                <p class="price">{{ account.frozenAmount.toFixed(2) }}</p>
            </div>
        </div>
        <tab :data="tabData" :value="checkTab" @tabChange="tabChange"></tab>
        <component :is="checkTab"></component>
        <!-- 充值dialog -->
        <el-dialog title="充值" :visible.sync="showDialog" width="30%">
            <el-form label-position="left" label-width="100px" ref="payForm" :model="form" :rules="rules">
                <el-form-item label="账户余额：">{{ account.totalAmount.toFixed(2) }}元</el-form-item>
                <el-form-item label="充值金额：" prop="amount">
                    <el-col :span="6">
                        <el-input v-model.number="form.amount"></el-input>
                    </el-col>
                    <el-col style="width: 40px;margin-left: 10px;">元</el-col>
                </el-form-item>
                <el-form-item label="充值方式：">
                    <el-radio label="ALIPAY" v-model="form.payType">支付宝</el-radio>
                    <el-radio label="WXPAY" v-model="form.payType">微信</el-radio>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="small" @click="charge" :loading="loading">立即充值</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 微信支付二维码 -->
        <el-dialog :visible.sync="weixinPay" title="微信支付" width="40%">
            <img :src="wxPayImg" class="weixin-code">
            <p class="weixin-text">请使用手机微信扫描此二维码完成支付</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="weixinPay = false">取 消</el-button>
                <el-button type="primary" @click="paySuccess">支付完成</el-button>
            </div>
        </el-dialog>
        <!-- 支付宝支付 -->
        <el-dialog :visible.sync="aliPay" title="支付中" width="30%" :show-close="false">
            <div class="pay-tips">
                <img class="loading-img" src="../../../assets/imgs/payLoading.gif">
                <div class="pay-text">
                    <p>支付完成前，请不要关闭此验证窗口</p>
                    <p>支付完成后，请根据您的实际情况点击下面按钮</p>
                </div>
            </div>
            <div class="pay-btns">
                <el-button type="default" size="small" @click="aliPay = false">取消支付</el-button>
                <el-button type="success" size="small" @click="paySuccess">支付完成</el-button>
            </div>
        </el-dialog>
        <!-- <a style="display: none" href='static/aliPay.html' ref="aliPay" target="_blank"></a> -->
    </div>
</template>

<script type="text/ecmascript-6">
// 支付方式 WXPAY, ALIPAY, BANLANCE
import Tab from './tab'
import Flow from './flow'
import Detail from './detail'
import { pay } from '@/common/api'
import { eventHub } from '@/common/share/eventHub'
export default {
    name: 'Account',
    created () {
        this.getAccountInfo()
    },
    data() {
        return {
            tabData: [
                {
                    name: '交易流水',
                    value: 'flow'
                }
            ],
            checkTab: 'flow',
            account: {
                totalAmount: 0,
                frozenAmount: 0
            },
            showDialog: false,
            form: {
                payType: 'WXPAY',
                amount: ''
            },
            loading: false,
            weixinPay: false,
            rules: {
                amount: [
                    { required: true, message: '请填写充值金额', trigger: 'blur' }
                ]
            },
            aliPay: false,
            aliHtml: '',
            wxPayImg: ''
        }
    },
    methods: {
        // 支付完成
        paySuccess () {
            this.weixinPay = false
            this.showDialog = false
            this.aliPay = false
            this.getAccountInfo()
            eventHub.$emit('paySuccess')
        },
        // 充值
        charge () {
            this.$refs['payForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    if (this.form.payType === 'WXPAY') {
                        this.$axios.post(pay.recharge, this.form).then(res => {
                            this.loading = false
                            if (res.data.state) {
                                this.wxPayImg = res.data.data.content
                                this.weixinPay = true
                            }
                        }).catch(err => {
                            this.loading = false
                        })
                    } else if (this.form.payType === 'ALIPAY') {
                        this.showDialog = false
                        this.aliPay = true
                        window.open('/static/aliPay.html?type=recharge&amount=' + this.form.amount, '_blank')
                    }
                }
            })
        },
        // 获取账户信息
        getAccountInfo () {
            this.$axios.post(pay.getaccountinfo).then(res => {
                if (res.data.state) {
                    this.account = res.data.data
                }
            })
        },
        tabChange (tab) {
            this.checkTab = tab.value
        }
    },
    components: {
        Tab,
        Flow,
        Detail
    }
}
</script>

<style scoped lang="less">
@import '../../../styles/variable.less';
.amount{
    overflow: hidden;
    margin-top: 40px;
    border-bottom: 10px solid #f6f6f6;
    .amount-item{
        float: left;
        width: 200px;
        height: 120px;
        text-align: center;
        border-right: 1px solid #ebebeb;
        &:last-child{
            border-right: none;
        }
    }
}
.title{
    margin: 0;
    font-size: 16px;
    color: #333;
}
.top-up{
    width: 80px;
    font-size: 12px;
    display: inline-block;
    color: @baseColor;
    padding: 4px;
    margin: 0 auto;
    border: 1px solid @baseColor;
    border-radius: 5px;
    &:hover{
        cursor: pointer;
    }
}
.use-price{
    font-size: 20px;
    font-weight: bold;
}
.price{
    font-size: 18px;
}
</style>
