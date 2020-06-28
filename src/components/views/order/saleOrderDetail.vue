<template>
    <div class="list-page">
        <div class="bread-wrap">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item to="/saleOrder">销售订单</el-breadcrumb-item>
                <el-breadcrumb-item>订单详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="normal-form" v-if="form">
            <el-form label-width="100px" label-position="right">
                <el-row :gutter="20">
                    <el-col>
                        <el-form-item label="订单编号：">
                            {{ form.orders.uid }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="收货人">
                            <el-input v-model="form.orders.recevierName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系电话">
                            <el-input v-model="form.orders.telephone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="详细地址">
                            <city v-model="city" :placeholder="cityName"></city>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item>
                            <el-input v-model="form.orders.address"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="会员名称：">
                            {{ form.orders.buyerName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单状态：">
                            {{ form.orders.orderState | orderState }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商品金额：">
                            ¥{{ form.orders.goodsPrice }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="运费：">
                            ¥{{ form.orders.shipFee }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="折扣：">
                            ¥{{ form.orders.discount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="订单总金额：">
                            ¥{{ form.orders.totalAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="实付金额：">
                            ¥{{ form.orders.payAmount }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="付款时间：">
                            {{ form.orders.payTime }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="发货时间：">
                            {{ form.orders.shipTime }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="买家留言：">
                            {{ form.orders.buyerRemark }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <el-input type="textarea" :rows="3"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="child-order" v-for="(item, index) in form.listOrder" :key="index">
                <el-row style="line-height: 32px; border-bottom: 1px solid #ebeef5;">
                    <span style="color: red;">子订单：{{ item.uid }}</span>
                    <span style="color: blue;">顺丰速运：{{ item.expressNo }}</span>
                </el-row>
                <el-table :data="item.orderItem">
                    <el-table-column label="ID" prop="uid"></el-table-column>
                    <el-table-column label="设计单号/商品ID" prop="productUid"></el-table-column>
                    <el-table-column label="商品图片">
                        <template slot-scope="scope">
                            <img width="60" height="40" :src="_fileHost.PRODUCT_IMAGE + scope.row.productImage">
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" prop="productTitle"></el-table-column>
                    <el-table-column label="商品类型">
                        <template slot-scope="scope">
                            {{ scope.row.productType | proType }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单价" prop="price"></el-table-column>
                    <el-table-column label="采购价" prop="purchasePrice"></el-table-column>
                    <el-table-column label="数量" prop="number"></el-table-column>
                    <el-table-column label="金额">
                        <template slot-scope="scope">
                            {{ (scope.row.price * scope.row.number).toFixed(2) }}
                        </template>
                    </el-table-column>
                </el-table>
                <p style="line-height: 32px; margin: 0;">共计 {{ item.calCount }} 件商品，合计实付金额  ¥{{ item.calPrice }}</p>
            </div>
            <div style="text-align: center;">
                <el-button size="medium" type="primary" :loading="loading" @click="updateOrderShipMessage">保存收货信息</el-button>
                <el-button size="medium" type="primary" v-show="form.orders.orderState === 'NEW'" @click="updateOrderState">取消订单</el-button>
                <el-button size="medium" type="danger" v-show="form.orders.orderState === 'NEW'" @click="choosePay = !choosePay">支付订单</el-button>
            </div>
            <div style="color: #999;">
                <p>操作记录</p>
                <p>UNZIN  创建订单  2018-13-02 12:12:12</p>
                <p>UNZIN  创建订单  2018-13-02 12:12:12</p>
                <p>UNZIN  创建订单  2018-13-02 12:12:12</p>
                <p>UNZIN  创建订单  2018-13-02 12:12:12</p>
            </div>
        </div>
        <!-- 支付方式 -->
        <el-dialog :visible.sync="choosePay" title="请选择支付方式" width="40%">
            <el-form label-width="100px">
                <el-form-item label="支付方式">
                    <el-radio v-model="payType" label="WXPAY">微信</el-radio>
                    <el-radio v-model="payType" label="ALIPAY">支付宝</el-radio>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="default" size="small" @click="choosePay = !choosePay">取消</el-button>
                    <el-button type="primary" size="small" @click="doOrderPay" :loading="doLoading">确定</el-button>
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
    </div>
</template>

<script type="text/ecmascript-6">
import { order, base } from '@/common/api.js'
import City from '@/components/common/city/city'
export default {
    name: 'SaleOrderDetail',
    props: ['uid'],
    created () {
        this.fetchData()
    },
    data() {
        return {
            form: null,
            loading: false,
            city: [],
            choosePay: false,
            payType: 'WXPAY',
            cityName: '',
            wxPayImg: '', // 微信支付二维码
            weixinPay: false,
            doLoading: false,
            aliPay: false,
            aliHtml: ''
        }
    },
    methods: {
        paySuccess () {
            this.weixinPay = false
            this.choosePay = false
            this.aliPay = false
            this.fetchData()
        },
        // 支付订单
        doOrderPay () {
            if (this.payType === 'WXPAY') {
                this.$axios.post(order.doPayOrder, {
                    orderNo: this.form.orders.uid,
                    payType: this.payType,
                    returnUrl: ' '
                }).then(res => {
                    if (res.data.state) {
                        let content = res.data.data.content
                        this.wxPayImg = content
                        this.weixinPay = true
                    }
                })
            } else if (this.payType === 'ALIPAY') {
                // 解决浏览器拦截第三方窗口
                this.choosePay = false
                this.aliPay = true
                window.open('/static/aliPay.html?type=order&orderNo=' + this.form.orders.uid, '_blank')
            }
            
        },
        // 获取城市信息
        getCity (cityId) {
            this.$axios.post(base.getcity, {
                cityId: cityId
            }).then(res => {
                if (res.data.state) {
                    this.cityName = res.data.data.fullName
                }
            })
        },
        fetchData () {
            this.$axios.post(order.getOrders, {
                uid: this.uid
            }).then(res => {
                if (res.data.state) {
                    this.form = res.data.data
                    this.form.listOrder.forEach(item => {
                        let calCount = 0
                        let calPrice = 0
                        item.orderItem.forEach(o => {
                            calCount += o.number
                            calPrice += o.number * o.price
                        })
                        this.$set(item, 'calCount', calCount)
                        this.$set(item, 'calPrice', calPrice.toFixed(2))
                        // 获取城市信息
                        this.getCity(res.data.data.orders.areaUid)
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: '请求失败'
                    })
                }
            })
        },
        // 保存收货信息
        updateOrderShipMessage () {
            this.loading = true
            // 判断是否有修改城市
            if (this.city.length > 0) {
                this.form.areauid = this.city[this.city.length - 1]
            }
            this.$axios.post(order.updateOrderShipMessage, {
                address: this.form.orders.address,
                areaname: 'xxx',
                areauid: this.form.areauid,
                orderuid: this.form.orders.uid,
                receivername: this.form.orders.recevierName,
                remark: '',
                tel: this.form.orders.telephone
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                   this.$message({
                       type: 'success',
                       message: '保存成功'
                   })
                } else {
                   this.$message({
                       type: 'error',
                       message: '保存失败'
                    })
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 取消订单
        updateOrderState () {
            this.$axios.post(order.updateOrderState, {
                uid: this.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '订单已取消'
                    })
                }
            })
        }
    },
    components: {
        City
    }
}
</script>

<style scoped lang="less">
.child-order{
    border-bottom: 1px dashed #f6f6f6;
    padding-bottom: 10px;
    padding-top: 10px;
}
</style>
