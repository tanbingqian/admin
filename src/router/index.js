import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
import '../styles/nprogress.css'
import { bus } from '@/common/share/bus'

const accessPath = ['/login', '/forgetPass']

const Home = () => import('@/components/Home')

// 登录
const Login = () => import('@/components/views/login/login')
const ForgetPass = () => import("@/components/views/login/forgetPass");


/**
 * 商品
 */
// 商品模块
const Product = () => import('@/components/views/product/Tabs')
const ProductDetail = () => import('@/components/views/product/Detail')
const ProductCategory = () => import('@/components/views/product/ProductCategory')
const ProductAdd = () => import('@/components/views/product/ProductAdd')
const ProductEdit = () => import('@/components/views/product/ProductEdit')
//商品类目
const ProductTypeAdd = () => import('@/components/views/product/type/TypeAdd')

// 字体
const Font = () => import('@/components/views/product/font/Font')

// 定制图库
const CustomGallery = () => import('@/components/views/product/photo/CustomGallery')

/**
 * 分销、经销
 */

// 分销
const Distribution = () => import('@/components/views/distribution/distribution')
const DistributionAdd = () => import('@/components/views/distribution/distributionAdd')

// 经销
const Sold = () => import('@/components/views/sold/sold')
const SoldAdd = () => import('@/components/views/sold/soldAdd')
const SoldLevel = () => import("@/components/views/sold/soldLevel");


/**
 * 订单
 */
// 销售订单
const SaleOrder = () => import('@/components/views/order/saleOrder')
const SaleOrderDetail = () => import("@/components/views/order/saleOrderDetail")

//  设计订单
const DesignOrder = () => import("@/components/views/order/designTabs")

// 创建订单
const CreateOrder = () => import("@/components/views/order/createOrder")


/**
 * 设备
 */
const Device = () => import('@/components/views/device/device')
const DeviceRegist = () => import('@/components/views/device/deviceRegist')
const DeviceRegistSN = () => import('@/components/views/device/deviceRegistSN')
const DeviceAdd = () => import('@/components/views/device/deviceAdd')
const Software = () => import('@/components/views/device/software')

/**
 * 耗材
 */
const Consumables = () => import('@/components/views/consumables/consumabeTab')
const ConsumablesAdd = () => import('@/components/views/consumables/consumablesAdd')
const GenerateCode = () => import('@/components/views/consumables/generateCode')

/**
 * 数据
 */
// 设备统计
const DeviceStatistics = () => import('@/components/views/data/deviceStatistics')
const SaleStatistics = () => import('@/components/views/data/saleStatistics')
const RealtimeStatistics = () => import('@/components/views/data/realtimeStatistics')

/**
 * 权限
 */
const Role = () => import('@/components/views/permission/role/role')
const User = () => import('@/components/views/permission/user/user')
const Site = () => import('@/components/views/permission/site/site')
const Interface = () => import('@/components/views/permission/interface/interface')

/**
 * 功能组
 */

 const Function = () => import('@/components/views/permission/function/function')

 /**
  * 账户
  */
 const Account = () => import('@/components/views/account/account')

/**
 * 店铺
 */
// 店铺装修
const Store = () => import('@/components/views/store/store')
// 模块管理
const StoreModule = () => import('@/components/views/store/module')


/**
 * 物流
 */
const FreightQuery = () => import('@/components/views/logistics/freightQuery')
const ExpressManagement = () => import('@/components/views/logistics/expressManagement')
const ShipAddress = () => import('@/components/views/logistics/shipAddress')

/**
 * 微信
 */
const WXMenu = () => import('@/components/views/wx/wxMenu')
const WXReply = () => import('@/components/views/wx/wxReply')

/**
 * 用户
 */
const MemberManagement = () => import('@/components/views/members/memberManagement')
const AccountManagement = () => import('@/components/views/members/accountManagement')

/**
 * 营销
 */
//买赠/减
const BuySend = () => import('@/components/views/marketing/buySend')
//拼团
const GroupBooking = () => import('@/components/views/marketing/groupBooking')
//优惠卷
const Coupons = () => import('@/components/views/marketing/coupons')
// 礼品卡
const GiftCard = () => import('@/components/views/marketing/gift')
// 会员权益
const MemberBenefit = () => import('@/components/views/marketing/memberBenefits')
// 砍价
const Bargain = () => import('@/components/views/marketing/bargain')
// 限时折扣
const LimitDiscount = () => import('@/components/views/marketing/limitDiscount')
// 优惠套餐
const DiscountPackage = () => import('@/components/views/marketing/discountPackage')
//积分兑换
const CreditsExchange = () => import('@/components/views/marketing/creditsExchange')

/**
 * 修改密码
 */
const UpdatePass = () => import('@/components/common/page/updatePass')

/**
 * 设置
 */
const AuthLogin = () => import('@/components/views/setting/authLogin')
const paySetting = () => import("@/components/views/setting/paySetting")
const SiteSetting = () => import('@/components/views/setting/siteSetting')

/**
 * 支付完成回调地址
 */
const PayDone = () => import('@/components/views/pay/done')

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: "/",
            redirect: "/login",
            meta: {
                hidden: true
            }
        },
        {
            path: "/forgetPass",
            component: ForgetPass,
            meta: {
                hidden: true
            }
        },
        {
            path: "/home",
            component: Home
        },
        {
            path: "/login",
            component: Login,
            meta: {
                hidden: true
            }
        },
        {
            path: "/product",
            component: Product
        },
        {
            path: "/productCategory",
            component: ProductCategory
        },
        {
            path: "/productAdd/:type",
            component: ProductAdd,
            props: true
        },
        {
            path: "/productEdit/:pUid/:type",
            component: ProductEdit,
            meta: {
                editorPre: "product"
            },
            props: true
        },
        {
            path: "/productDetail/:pid",
            component: ProductDetail
        },
        {
            path: "/productTypeAdd",
            component: ProductTypeAdd
        },
        {
            path: "/font",
            component: Font
        },
        {
            path: "/customGallery",
            component: CustomGallery
        },
        {
            path: "/distribution",
            component: Distribution
        },
        {
            path: "/distributionAdd",
            component: DistributionAdd
        },
        {
            path: "/sold",
            component: Sold
        },
        {
            path: "/soldAdd",
            component: SoldAdd
        },
        {
            path: "/soldLevel",
            component: SoldLevel
        },
        {
            path: "/saleOrder",
            component: SaleOrder
        },
        {
            path: "/designOrder",
            component: DesignOrder
        },
        {
            path: "/saleOrderDetail/:uid",
            component: SaleOrderDetail,
            props: true
        },
        {
            path: "/createOrder",
            component: CreateOrder
        },
        {
            path: "/device",
            component: Device
        },
        {
            path: "/deviceRegist",
            component: DeviceRegist
        },
        {
            path: "/deviceRegistSN/:type/:model",
            component: DeviceRegistSN,
            props: true
        },
        {
            path: "/deviceAdd",
            component: DeviceAdd
        },
        {
            path: "/software",
            component: Software
        },
        {
            path: "/deviceStatistics",
            component: DeviceStatistics
        },
        {
            path: "/consumables",
            component: Consumables
        },
        {
            path: "/consumablesAdd",
            component: ConsumablesAdd
        },
        {
            path: "/generateCode",
            component: GenerateCode
        },
        {
            path: "/role",
            component: Role
        },
        {
            path: "/function/:random",
            component: Function
        },
        {
            path: "/user",
            component: User
        },
        {
            path: "/Site",
            component: Site
        },
        {
            path: "/interface",
            component: Interface
        },
        {
            path: "/account",
            component: Account
        },
        {
            path: "/store",
            component: Store
        },
        {
            path: "/storeModule",
            component: StoreModule
        },
        {
            path: "/freightQuery",
            component: FreightQuery
        },
        {
            path: "/expressManagement",
            component: ExpressManagement
        },
        {
            path: "/shipAddress",
            component: ShipAddress
        },
        {
            path: "/wxMenu",
            component: WXMenu
        },
        {
            path: "/wxReply",
            component: WXReply
        },
        {
            path: "/memberManagement",
            component: MemberManagement
        },
        {
            path: "/accountManagement",
            component: AccountManagement
        },
        {
            path: "/buySend",
            component: BuySend
        },
        {
            path: "/groupBooking",
            component: GroupBooking
        },
        {
            path: "/coupons",
            component:Coupons
        },
        {
            path: "/updatePass",
            component: UpdatePass
        },
        {
            path: "/authLogin",
            component: AuthLogin
        },
        {
            path: "/paySetting",
            component: paySetting
        },
        {
            path: "/payDone",
            component: PayDone
        },
        {
            path: '/siteSetting',
            component: SiteSetting
        },
        {
            path: '/giftCard',
            component: GiftCard
        },
        {
            path: '/memberBenefit',
            component: MemberBenefit
        },
        {
            path: '/bargain',
            component: Bargain
        },
        {
            path: '/saleStatistics',
            component: SaleStatistics
        },
        {
            path: '/realtimeStatistics',
            component: RealtimeStatistics
        },
        {
            path: '/limitDiscount',
            component: LimitDiscount
        },
        {
            path: '/discountPackage',
            component: DiscountPackage
        },
        {
            path: '/creditsExchange',
            component: CreditsExchange
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

// 如果没有登录跳转到登录页面
router.beforeEach((to, from, next) => {
    if (accessPath.indexOf(to.fullPath) < 0 && sessionStorage.token === undefined) {
        next({
            path: '/login'
        })
    } else {
        NProgress.start()
        next()
    }
})

router.afterEach((to, from) => {
    NProgress.done()
})

export default router
