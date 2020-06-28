<template>
    <div class="left-wrapper">
        <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
            <el-menu
                :unique-opened="true"
                :default-openeds="defaultOpens"
                @open="handleOpen"
                @close="handleClose"
                background-color="#212f49"
                text-color="#fff"
                active-text-color="#0070ae">
                <el-submenu index="2">
                    <template slot="title">{{ $t('product') }}</template>
                    <el-menu-item index="2-1" v-show="_hasPermission('PRO_VIEW')">
                        <router-link class="side-link" to="/product?type=FIXED">{{ $t('productSearch') }}</router-link>
                    </el-menu-item>
                    <el-menu-item index="2-2" v-show="_hasPermission('PRO_ADD')">
                        <router-link class="side-link" to="/productCategory">{{ $t('productAdd') }}</router-link>
                    </el-menu-item>
                    <el-menu-item index="2-3" v-show="_hasPermission('CATE_VIEW')">
                        <router-link class="side-link" to="/productTypeAdd">{{ $t('categoryManage') }}</router-link>
                    </el-menu-item>
                    <el-menu-item index="2-4">
                        <router-link class="side-link" to="/font">{{ $t('fontManage') }}</router-link>
                    </el-menu-item>
                    <el-menu-item index="2-5">
                        <router-link class="side-link" to="/customGallery">{{ $t('customGallery') }}</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">{{ $t('order') }}</template>
                    <el-menu-item index="3-1">
                        <router-link class="side-link" to="/saleOrder">销售订单</router-link>
                    </el-menu-item>
                    <el-menu-item index="3-2">
                        <router-link class="side-link" to="/designOrder">设计订单</router-link>
                    </el-menu-item>
                    <el-menu-item index="3-3">
                        <router-link class="side-link" to="/createOrder">创建订单</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">{{ $t('distribution') }}</template>
                    <el-menu-item index="4-1">
                        <router-link class="side-link" to="/sold">经销商查询</router-link>
                    </el-menu-item>
                    <el-menu-item index="4-2">
                        <router-link class="side-link" to="/soldAdd">添加经销商</router-link>
                    </el-menu-item>
                    <el-menu-item index="4-3">
                        <router-link class="side-link" to="/soldLevel">经销商级别定义</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title">{{ $t('sell') }}</template>
                    <el-menu-item index="5-1" v-show="_hasPermission('RESELLER_VIEW')">
                        <router-link class="side-link" to="/distribution">分销商查询</router-link>
                    </el-menu-item>
                    <el-menu-item index="5-1" v-show="_hasPermission('RESELLER_ADD')">
                        <router-link class="side-link" to="/distributionAdd">添加分销商</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu
                    index="13"
                    v-show="_hasPermission('DEVICE_VIEW') || _hasPermission('DEVICE_REG') || _hasPermission('DEVICE_MODEL_VIEW') || _hasPermission('DEV_SOFT_VIEW') || _hasPermission('CON_VIEW') || _hasPermission('CON_SPEC_VIEW')">
                    <template slot="title">{{ $t('device') }}</template>
                    <el-menu-item index="13-1" v-show="_hasPermission('DEVICE_VIEW')">
                        <router-link class="side-link" to="/device">设备查询</router-link>
                    </el-menu-item>
                    <el-menu-item index="13-2" v-show="_hasPermission('DEVICE_REG')">
                        <router-link class="side-link" to="/deviceRegist">设备注册</router-link>
                    </el-menu-item>
                    <el-menu-item index="13-3" v-show="_hasPermission('DEVICE_MODEL_VIEW')">
                        <router-link class="side-link" to="/deviceAdd">型号管理</router-link>
                    </el-menu-item>
                    <el-menu-item index="13-4" v-show="_hasPermission('DEV_SOFT_VIEW')">
                        <router-link class="side-link" to="/software">软件管理</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-1" v-show="_hasPermission('CON_VIEW')">
                        <router-link class="side-link" to="/consumables">耗材查询</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-3" v-show="_hasPermission('CON_SPEC_VIEW')">
                        <router-link class="side-link" to="/consumablesAdd">耗材规格</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="15"
                    v-show="_hasPermission('ROLE_VIEW') || _hasPermission('FUNCTION_VIEW') || _hasPermission('USER_VIEW') || _hasPermission('API_VIEW') || _hasPermission('SITE_VIEW')">
                    <template slot="title">{{ $t('permission') }}</template>
                    <el-menu-item index="15-1" v-show="_hasPermission('ROLE_VIEW')">
                        <router-link class="side-link" to="/role">角色管理</router-link>
                    </el-menu-item>
                    <el-menu-item index="15-5" v-show="_hasPermission('FUNCTION_VIEW')">
                        <router-link class="side-link" to="/function/add">功能项管理</router-link>
                    </el-menu-item>
                    <el-menu-item index="15-2" v-show="_hasPermission('USER_VIEW')">
                        <router-link class="side-link" to="/user">用户管理</router-link>
                    </el-menu-item>
                    <el-menu-item index="15-3" v-show="_hasPermission('API_VIEW')">
                        <router-link class="side-link" to="/interface">接口管理</router-link>
                    </el-menu-item>
                    <el-menu-item index="15-4" v-show="_hasPermission('SITE_VIEW')">
                        <router-link class="side-link" to="/site">站点管理</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="6">
                    <template slot="title">{{ $t('production') }}</template>
                </el-submenu>
                <el-submenu index="7">
                    <template slot="title">{{ $t('logistics') }}</template>
                     <el-menu-item index="7-1">
                        <router-link class="side-link" to="/freightQuery">运费查询</router-link>
                    </el-menu-item>
                     <el-menu-item index="7-2">
                        <router-link class="side-link" to="/expressManagement">快递管理</router-link>
                    </el-menu-item>
                      <el-menu-item index="7-3">
                        <router-link class="side-link" to="/shipAddress">发货地址管理</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="8" v-show="_hasPermission('PAGE_VIEW') && _hasPermission('MODULE_VIEW')">
                    <template slot="title">{{ $t('store') }}</template>
                    <el-menu-item index="9-1" v-show="_hasPermission('PAGE_VIEW')">
                        <router-link class="side-link" to="/store">店铺装修</router-link>
                    </el-menu-item>
                    <el-menu-item index="9-2" v-show="_hasPermission('MODULE_VIEW')">
                        <router-link class="side-link" to="/storeModule">模块管理</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="9">
                    <template slot="title">{{ $t('account') }}</template>
                    <el-menu-item index="9-1">
                        <router-link class="side-link" to="/account">账户管理</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="10">
                    <template slot="title">{{ $t('members') }}</template>
                     <el-menu-item index="10-1">
                        <router-link class="side-link" to="/memberManagement">会员管理</router-link>
                     </el-menu-item>
                     <el-menu-item index="10-1">
                        <router-link class="side-link" to="/accountManagement">账户管理</router-link>
                     </el-menu-item>
                </el-submenu>
                <el-submenu index="11">
                    <template slot="title">{{ $t('data') }}</template>
                    <el-menu-item index="11-1">
                        <router-link class="side-link" to="/saleStatistics">销售统计</router-link>
                    </el-menu-item>
                    <el-menu-item index="11-2">
                        <router-link class="side-link" to="/realtimeStatistics">实时数据统计</router-link>
                    </el-menu-item>
                    <el-menu-item index="11-3">
                        <router-link class="side-link" to="/deviceStatistics">设备统计</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="12">
                    <template slot="title">{{ $t('settings') }}</template>
                    <el-menu-item index="12-0">
                        <router-link class="side-link" to="/siteSetting">站点设置</router-link>
                    </el-menu-item>
                    <el-menu-item index="12-1">
                        <router-link class="side-link" to="/authLogin">第三方授权登录</router-link>
                    </el-menu-item>
                    <el-menu-item index="12-2">
                        <router-link class="side-link" to="/paySetting">支付方式</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="14">
                    <template slot="title">营销</template>
                    <el-menu-item index="14-1">
                        <router-link class="side-link" to="/memberBenefit">会员积分权益</router-link>
                    </el-menu-item>
                     <el-menu-item index="14-2">
                        <router-link class="side-link" to="/coupons">优惠券</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-3">
                        <router-link class="side-link" to="/giftCard">礼品卡</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-4">
                        <router-link class="side-link" to="/limitDiscount">限时折扣</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-5">
                        <router-link class="side-link" to="/discountPackage">优惠套餐</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-6">
                        <router-link class="side-link" to="/buySend">满赠/减</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-7">
                        <router-link class="side-link" to="/groupBooking">拼团</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-8">
                        <router-link class="side-link" to="/bargain">砍价</router-link>
                    </el-menu-item>
                    <el-menu-item index="14-9">
                        <router-link class="side-link" to="/creditsExchange">积分兑换</router-link>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="17">
                    <template slot="title">微信</template>
                    <el-menu-item index="17-1">
                        <router-link class="side-link" to="/wxMenu">自定义菜单</router-link>
                    </el-menu-item>
                    <el-menu-item index="17-1">
                        <router-link class="side-link" to="/wxReply">自动回复</router-link>
                    </el-menu-item>
                </el-submenu>
    </el-menu>
  </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'SideBar',
    methods: {
        handleOpen (key, keyPath) {
            sessionStorage.defaultOpens = key
        },
        handleClose (key, keyPath) {
            sessionStorage.removeItem('defaultOpens')
        }
    },
    computed: {
        defaultOpens () {
            var arr = []
            if (sessionStorage.defaultOpens) {
                arr.push(sessionStorage.defaultOpens)
            }
            return arr
        }
    }
}
</script>

<style lang="less">
@import '../../../styles/variable.less';
/*
select下拉框显示bug
*/
.scroll-wrap-panel{
    height: calc(100%-80px) !important;
}
.scroll-wrap-panel.el-scrollbar__wrap{
    overflow-x: hidden;
    overflow-y: scroll;
}
.el-scrollbar{
    height: 100%;
}

.left-wrapper .el-menu{
    border: none;
}
.el-submenu .el-menu-item{
    position: relative;
    padding: 0;
    min-width: 100px;
}
.side-link{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    text-decoration: none;
    background-color: @sideMenuBg;
    color: #fff;
    transform: translateX(-40px);
    padding-left: 40px;
    box-sizing: border-box;
    transition: all .3s ease-in;
    font-family: "Microsoft YaHei"
}
.side-link.no-child{
    padding-left: 20px;
    transform: translateX(-20px);
}
.side-link:hover{
    background-color: @sideItemHover;
    color: @white;
}
.side-link.router-link-active{
    background-color: @white;
    color: @baseColor;
    font-weight: 600;
}
</style>
