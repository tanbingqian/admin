import Vue from 'vue'
import { bus } from '../share/bus'

// 商品状态
Vue.filter('prodState', (val) => {
    switch (val) {
        case -1:
            return ''
            break
        case 0:
            return bus.i18n.t('offShop')
            break
        case 1:
            return bus.i18n.t('onShop')
            break
        default:
            return ''
    }
})

// 订单状态
Vue.filter('orderState', val => {
    switch (val) {
        case "NEW":
            return bus.i18n.t('newOrder');
            break;
        case "PAID":
            return bus.i18n.t('paidOrder');
            break;
        case "PRODUCING":
            return bus.i18n.t('producingOrder');
            break;
        case "PRODUCED":
            return bus.i18n.t('producedOrder');
            break;
        case "ALLSHIPPED":
            return bus.i18n.t('allShippedOrder');
            break;
        case "PARTSHIPPED":
            return bus.i18n.t('partShippedOrder');
            break;
        case "RECEIVED":
            return bus.i18n.t('receivedOrder');
            break;
        case "CANCELED":
            return bus.i18n.t('cancelOrder');
            break;
        case "DELETED":
            return bus.i18n.t('deletedOrder');
            break;
        default:
            return "";
    }
})

// 设备状态
Vue.filter('deviceState', val => {
    switch (val) {
        case -1:
            return bus.i18n.t('disable');
            break;
        case 1:
            return bus.i18n.t('able');
            break;
        default:
            return "";
    }
})

// 设备是否在线
Vue.filter('isOnline', val => {
    switch (val) {
        case 1:
            return bus.i18n.t('online')
            break
        case 0:
            return bus.i18n.t('offline')
            break
        default:
            break;
    }
})

// 站点状态
Vue.filter("siteState", val => {
    switch (val) {
        case 0:
            return bus.i18n.t('disable')
            break
        case 1:
            return bus.i18n.t('able')
            break
        default:
            return ""
    }
})

// 用户状态
Vue.filter("userState", val => {
    switch (val) {
        case 0:
            return bus.i18n.t('disable')
            break
        case 1:
            return bus.i18n.t('able')
            break
        default:
            return ""
    }
})

// 商品类型
Vue.filter('proType', val => {
    switch (val) {
        case 'FIXED':
            return bus.i18n.t('comProduct1')
            break
        case 'CUSONLINE':
            return bus.i18n.t('onLineMade1')
            break
        case 'CUSOFFLINE':
            return bus.i18n.t('offLineMade1')
            break
        case 'PLOT':
            return bus.i18n.t('cutProduct1')
            break
        default:
            break;
    }
})

// access类型
Vue.filter('accessType', val => {
    switch (val) {
        case "FORBIDDEN":
            return bus.i18n.t('forbidden')
            break
        case "OPEN":
            return bus.i18n.t('open')
            break
        case "PRIVATE":
            return bus.i18n.t('private')
            break
        case "MIXED":
            return bus.i18n.t('mixed')
            break
        default:
            break
    }
})

// 软件版本类型
Vue.filter('versionType', val => {
    switch (val) {
        case 'GA':
            return bus.i18n.t('generalVersion')
            break
        case 'PREVIEW':
            return bus.i18n.t('previewVersion')
            break
        default:
            break;
    }
})

// 软件版本状态
Vue.filter("versionState", val => {
    switch (val) {
        case 0:
            return bus.i18n.t('disable')
            break
        case 1:
            return bus.i18n.t('able')
            break
        default:
            return ""
    }
})

// 耗材序号状态
Vue.filter("consumState", val => {
    switch (val) {
        case 0:
            return bus.i18n.t('disable')
            break
        case 1:
            return bus.i18n.t('able')
            break
        default:
            return ""
    }
})

// 耗材是否使用
Vue.filter("consumUsed", val => {
    switch (val) {
        case 0:
            return bus.i18n.t('unused')
            break
        case 1:
            return bus.i18n.t('used')
            break
        default:
            return ""
    }
})
