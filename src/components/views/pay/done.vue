<template>
    <div class="page-wrap">
        <div class="pay-back">
            <img src="../../../assets/imgs/icon_logo.png" class="logo-img">
            <div class="tip-wrap">
                <div class="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
                <div class="tip">
                    {{ text }}
                </div>
            </div>
            <div class="btn-link">
                <a class="link fl">返回首页</a>
                <a class="link fr">查看订单</a>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: 'PayDone',
    data() {
        return {
            text: '正在查询订单状态...'
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.fl{
    float: left;
}
.fr{
    float: right;
}
.pay-back .logo-img{
  display: block;
  width: 50px;
  margin: 80px auto 78px auto;
}
.pay-back .tip{
  font-size: 18px;
  color: rgb(102, 102, 102);
  text-align: center;
  margin-top: 30px;
}
.pay-back .btn-link{
  overflow: hidden;
  margin-top: 180px;
  text-align: center;
}
.pay-back .link{
  display: inline-block;
  width: 160px;
  height: 54px;
  line-height: 54px;
  text-align: center;
  border: 1px solid rgb(239,56,122);
  color: rgb(239,56,122);
  border-radius: .133333rem;
}
.tip-wrap{
    text-align: center;
}
.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #ef387a;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
</style>
