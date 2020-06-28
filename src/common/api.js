// api请求地址

const baseUrl = '/wx/api/'
// const baseUrl = '/api/'

// 基础模块
const baseModuleName = 'base/'

// Login模块
const authModuleName = 'auth/'

// 商品模块服务名
const productModuleName = 'product/'

//  订单模块服务名
const orderModuleName = 'order/'

// 分销、经销模块服务名
const resaleModuleName = 'resale/'

// 设备服务名
const deviceModuleName = 'device/'

// 店铺服务名
const shopModuleName = 'shop/'

// 文件模块
const fileModuleName = 'file/'

// 支付模块
const payModuleName = 'pay/'

// 微信模块
const wxModuleName = 'weixin/'

// 用户会员模块
const memberModuleName = 'member/'

// 营销模块
const promotionModuleName = 'promotion/'

// 数据统计模块
const statModuleName = 'stat/'

// 支付相关
const pay = {
    // 获取当前账户信息
    getaccountinfo: payModuleName + 'account/getaccountinfo',
    // 查询当前账户明细
    listaccountdetail: payModuleName + 'account/listaccountdetail',
    // 当前用户充值
    recharge: payModuleName + 'account/recharge',
    // 支付参数设置
    setPayParams: payModuleName + 'param/saveparam',
    // 设置参数状态
    togglestate: payModuleName + 'param/togglestate',
    // 获取设置的参数
    listparams: payModuleName + 'param/listparams'
}

// auth模块
const auth = {
    login: authModuleName + 'user/login',
    changepassword: authModuleName + 'user/changepassword',
    listuserfunctions: authModuleName + 'user/listuserfunctions'
}

// oss文件上传模块
const file = {
    // 获取上传token
    getuploadtoken: fileModuleName + 'storage/getuploadtoken',
    // 获取子目录列表
    listfolder: fileModuleName + 'storage/listfolder',
    // 获取文件列表
    listfile: fileModuleName + 'storage/listfile',
    // 创建目录
    createfolder: fileModuleName + 'storage/createfolder',
    // 删除文件
    deletefile: fileModuleName + 'storage/deletefile',
    // 删除目录
    deletefolder: fileModuleName + 'storage/deletefolder',
    // 移动文件
    movefile: fileModuleName + 'storage/movefile',
    // 移动目录
    movefolder: fileModuleName + 'storage/movefolder',
    // 获取文件服务器列表
    getfilehostlist: fileModuleName + 'storage/getfilehostlist'
}

// 基础模块，多语言，区域
const base = {
    // 获取多语言列表
    listlang: baseModuleName + 'lang/listlang',
    listcity: baseModuleName + 'city/listcity',
    getcity: baseModuleName + 'city/getcity'
}

// 商品接口
const product = {
    // 商品查询
    searchProduct: productModuleName + "product/searchProduct",
    // 授权商品列表
    searchProductApi: productModuleName + "productApi/searchProduct",
    // 商品删除
    deleteProduct: productModuleName + "product/deleteProduct",
    // 商品上下架
    updateProductState: productModuleName + "product/updateProductState",
    // 根据类目编号、语言获取sku，spu列表
    getAttributeLang: productModuleName + "categoryAttribute/getAttributeLang",
    // 添加保存商品
    saveProduct: productModuleName + "product/newsaveProduct",
    // 获取商品信息
    getProduct: productModuleName + "product/newGetProduct",
    // 编辑保存商品
    updateProduct: productModuleName + "product/newUpdateProduct",
    // 删除商品sku
    deleteProductSku: productModuleName + "product/deleteProductSku",
    // 查询商品sku列表
    listProductSkuValueLang:productModuleName + "productApi/listProductSkuValueLang",

    // 类目树形结构
    listAllCategory: productModuleName + "category/listAllCategory",
    // 添加类目
    saveCategory: productModuleName + "category/saveCategory",
    // 删除类目
    removeCategory: productModuleName + "category/removeCategory",
    // 上移
    categoryMoveUp: productModuleName + "category/categoryMoveUp",
    // 下移
    categoryMoveDown: productModuleName + "category/categoryMoveDown",
    //获取单条类目属性
    getCategory: productModuleName + "category/getCategory",
    // 加载类目属性
    listCategoryAttribute:productModuleName + "categoryAttribute/listCategoryAttribute",
    // 保存类目属性
    saveCategoryAttribute:productModuleName + "categoryAttribute/saveCategoryAttribute",
    // 删除类目属性
    removeCategoryAttribute:productModuleName + "categoryAttribute/removeCategoryAttribute",
    // 拖拽排序
    categoryAttributeMove:productModuleName + "categoryAttribute/categoryAttributeMove",
    // 店铺选择产品
    searchProductShop: productModuleName + "productApi/searchProductShop",
    // 查询sku value列表（新）
    ListproductAttributeLang: productModuleName + 'productAttribute/ListproductAttributeLang',
    // 添加单个sku属性值
    saveProductAttribute: productModuleName + 'productAttribute/saveProductAttribute',
    // 查询商品sku value列表（chw新增）
    ListproductSKUByProductUid: productModuleName + 'productAttribute/ListproductSKUByProductUid',
    // 组合商品sku值保存
    saveProductSku: productModuleName + 'productAttribute/saveProductSku',
    // 查询商品组合列表
    listProductSku: productModuleName + 'productAttribute/listProductSku',
    // 修改商品sku 列表
    updateListSku: productModuleName + 'productAttribute/updateListSku',
    // 删除单个sku value值
    deleteProductAttribute: productModuleName + 'productAttribute/deleteProductAttribute',
    // 删除商品的sku
    deleteSingleSku: productModuleName + 'productAttribute/deleteSingleSku',
    // 修改单个sku value的值
    updateProductAttribute: productModuleName + 'productAttribute/updateProductAttribute',
    // 订单添加成品获取sku
    newlistProductSkuValueLang: productModuleName + 'productApi/newlistProductSkuValueLang',
}

// 订单接口
const order = {
    // 订单列表
    listOrders: orderModuleName + 'order/listOrders',
    // 创建订单
    saveOrders: orderModuleName + 'order/saveOrders',
    // 订单详情
    getOrders: orderModuleName + 'order/getOrders',
    // 修改订单收货信息
    updateOrderShipMessage: orderModuleName + 'order/updateOrderShipMessage',
    // 取消订单
    updateOrderState: orderModuleName + 'order/updateOrderState',

    //展示快递公司
    listExpress: orderModuleName + "express/listExpress",
    //保存/编辑快递公司
    saveExpress: orderModuleName + "express/saveExpress",
    //删除快递公司
    deleteExpress: orderModuleName + "express/deleteExpress",
    //删除快递地址
    deleteExpressAddress: orderModuleName + "express/deleteExpressAddress",
    //获取当前运费下的设置的地区
    listExpressCityId: orderModuleName + "express/listExpressCityId",
    //保存快递费用
    saveExpressFee: orderModuleName + "express/saveExpressFee",
    //保存/编辑快递地址
    saveExpressAddress: orderModuleName + "express/saveExpressAddress",
    //根据地区查询该地区的快递方式
    getExpressQueryVOByCityId: orderModuleName + "express/getExpressQueryVOByCityId",
    //发货地址数据
    listExpressAddreeeBySiteUid: orderModuleName + "express/listExpressAddreeeBySiteUid",
    // 运费列表
    listExpressFeeBySiteUid: orderModuleName + 'express/listExpressFeeBySiteUid',
    //删除一条运费
    deleteExpressFee: orderModuleName + 'express/deleteExpressFee',
    // 支付订单
    doPayOrder: orderModuleName + 'order/DoPayOrder'
};

// 经销、分销模块

const resale = {
    // 分销列表查询
    listDistributorBySearch:resaleModuleName + 'distributor/listDistributorBySearch',
    // 分销详情
    getDistributor: resaleModuleName + 'distributor/getDistributor',
    // 保存或编辑分销商
    saveDistributor: resaleModuleName + 'distributor/saveDistributor',

    // 经销商列表查询
    listDealerBySearch: resaleModuleName + 'dealer/listDealerBySearch',
    saveDealer: resaleModuleName + 'dealer/saveDealer',
    // 查询经销商详情
    getOneDealerByUid: resaleModuleName + 'dealer/getOneDealerByUid',
    // 经销商级别列表
    listResellerLevel: resaleModuleName + 'dealer/listResellerLevel',
    // 添加/编辑经销商级别
    saveResellerLevel: resaleModuleName + 'dealer/saveResellerLevel',
    // 删除经销商级别
    removeResellerLevel: resaleModuleName + 'dealer/removeResellerLevel',
    // 根据经销商级别返回 授权类目列表
    listAuthCategory: resaleModuleName + 'dealer/listAuthCategory',

    // 根据经销商级别返回 授权商品列表
    authProductBySearch: resaleModuleName + 'dealer/authProductBySearch',
    // 根据当前用户返回授权类目树
    listAuthCategoryForTree: resaleModuleName + 'dealer/listAuthCategoryForTree',
    // 保存授权类目
    saveAuthCategory: resaleModuleName + 'dealer/saveAuthCategory',
    // 删除授权类目
    removeAuthCategory: resaleModuleName + 'dealer/removeAuthCategory',
    // 获取授权商品sku
    listAuthProduct: resaleModuleName + 'dealer/listAuthProduct',
    // 保存授权商品
    saveAuthProduct: resaleModuleName + 'dealer/saveAuthProduct',
    // 删除授权商品
    removeAuthProduct: resaleModuleName + 'dealer/removeAuthProduct',
    //编辑经销商
    updateDealer: resaleModuleName + 'dealer/updateDealer',
    //编辑分销商
    updateDistributor: resaleModuleName + 'dealer/updateDistributor',
    // 获取商品采购价
    getSaveOrderProductPurchaseprice: resaleModuleName + 'reseller/getSaveOrderProductPurchaseprice'

}

// 设备模块

const device = {
    // 查询设备列表
    listdevice: deviceModuleName + "device/listdevice",
    // 查询设备类型列表
    listdevicetype: deviceModuleName + "device/listdevicetype",
    // 查询设备型号
    listdevicemodel: deviceModuleName + "device/listdevicemodel",
    // 添加设备类型
    savedevicetype: deviceModuleName + "device/savedevicetype",
    // 添加设备型号
    adddevicemodel: deviceModuleName + "device/adddevicemodel",
    // 修改设备型号
    updatedevicemodel: deviceModuleName + 'device/updatedevicemodel',
    // 添加注册设备
    adddevice: deviceModuleName + "device/adddevice",
    // 删除设备
    deletedevice: deviceModuleName + "device/deletedevice",
    // 解绑用户
    binduser: deviceModuleName + 'device/binduser',
    // 删除设备型号
    deletedevicemodel: deviceModuleName + "device/deletedevicemodel",
    // 添加软件版本
    addsoftware: deviceModuleName + 'device/addsoftware',
    // 编辑软件版本信息
    updatesoftware: deviceModuleName + 'device/updatesoftware',
    // 设置设备为内测设备
    setdevicetrial: deviceModuleName + 'device/setdevicetrial',
    // 通过uid获取设备信息
    getdevicebyuid: deviceModuleName + "device/getdevicebyuid",
    // 设置设备状态
    setdevicestate: deviceModuleName + "device/setdevicestate",
    // 查询指定型号的软件版本列表
    listsoftware: deviceModuleName + 'device/listsoftware',
    // 设置软件版本状态
    setsoftwarestate: deviceModuleName + 'device/setsoftwarestate',
    // 查询耗材序列号
    listconsumablessn: deviceModuleName + 'consumables/listconsumablessn',
    // 设置序列号状态
    setconsumablessnstate: deviceModuleName + 'consumables/setconsumablessnstate',
    // 查询耗材序列号信息
    getconsumablessn: deviceModuleName + 'consumables/getconsumablessn',
    // 查询耗材批次列表
    listcomsumablesbatch: deviceModuleName + 'consumables/listcomsumablesbatch',
    // 生成序列号
    generateserialno: deviceModuleName + 'consumables/generateserialno',
    // 查询耗材规格
    listspecification: deviceModuleName + "consumables/listspecification",
    // 添加耗材规格
    addspecification: deviceModuleName + "consumables/addspecification",
    // 删除耗材规格
    deletespecification: deviceModuleName + "consumables/deletespecification",
    // 更新规格信息
    updatespecification: deviceModuleName + "consumables/updatespecification",
    // 设置批次状态
    setcomsumablesbatchstate: deviceModuleName + 'consumables/setcomsumablesbatchstate',
    // 下载条码
    downloadbatchpdf: deviceModuleName + 'consumables/downloadbatchpdf',
    // 设备绑定经销商
    bindreseller: deviceModuleName + 'device/bindreseller'
}

// 权限

const permission = {
    // 查询角色列表
    listrole: authModuleName + "role/listrole",
    // 添加角色
    addrole: authModuleName + "role/addrole",
    // 修改角色信息
    updaterole: authModuleName + "role/updaterole",
    // 删除角色
    deleterole: authModuleName + "role/deleterole",
    // 获取制定角色的所有用户
    listusersofrole: authModuleName + "user/listusersofrole",
    // 将用户与角色解绑
    unbinduserrole: authModuleName + "user/unbinduserrole",
    // 将用户与角色绑定
    binduserrole: authModuleName + 'user/binduserrole',
    // 查询角色已授权的功能项
    listrolefunction: authModuleName + "role/listrolefunction",
    // 设置角色权限功能
    setrolefunction: authModuleName + "role/setrolefunction",

    // 查询用户
    listuser: authModuleName + "user/listuser",
    // 添加用户
    adduser: authModuleName + "user/adduser",
    // 获取用户信息
    getuser: authModuleName + 'user/getuser',
    // 设置用户状态
    setuserstate: authModuleName + 'user/setuserstate',
    // 修改用户信息
    updateuser: authModuleName + 'user/updateuser',
    // 删除用户
    deleteuser: authModuleName + 'user/deleteuser',

    // 查询所有站点
    listsite: authModuleName + "site/listsite",
    // 添加站点
    addsite: authModuleName + "site/addsite",
    // 获取站点信息
    getsite: authModuleName + "site/getsite",
    // 更新站点信息
    updatesite: authModuleName + "site/updatesite",
    // 设置站点状态
    setsitestate: authModuleName + "site/setsitestate",
    // 删除站点
    deletesite: authModuleName + "site/deletesite",
    // 重置密码
    resetadminpassword: authModuleName + "site/resetadminpassword",
    // 更新当前站点信息（用户更新）
    updatecurrentsite: authModuleName + 'site/updatecurrentsite',
    // 当前站点信息
    currentsite: authModuleName + 'site/currentsite',


    // 查询所有服务
    listallservice: authModuleName + "api/listallservice",
    // 从制定服务同步接口信息
    syncapifromservice: authModuleName + "api/syncapifromservice",
    // 查询服务已配置的api
    listapi: authModuleName + "api/listapi",
    // 更新api
    updateapi: authModuleName + "api/updateapi",
    // 获取api信息
    getapi: authModuleName + "api/getapi",
    // 获取用户类型
    getusertype: authModuleName + 'api/getusertype',

    // 添加功能组
    addfunctiongroup: authModuleName + "function/addfunctiongroup",
    // 获取功能组列表
    listfunctiongroup: authModuleName + "function/listfunctiongroup",
    // 添加功能项
    addfunction: authModuleName + "function/addfunction",
    // 获取指定功能组的功能项
    listfunction: authModuleName + "function/listfunction",
    // 删除功能项
    deletefunction: authModuleName + "function/deletefunction",
    // 删除功能组
    deletefunctiongroup: authModuleName + "function/deletefunctiongroup",
    // 更新功能组
    updatefunctiongroup: authModuleName + "function/updatefunctiongroup",
    // 更新功能项
    updatefunction: authModuleName + "function/updatefunction"
}

const shop = {
    // 保存、编辑轮播属性
    saveFlash: shopModuleName + 'template/saveFlash',
    // 获取所有模板列表
    getDefaultTemplet: shopModuleName + 'shop/getDefaultTemplet',
    // 获取模板详情
    getTemplate: shopModuleName + 'template/getTemplate',
    // 删除模板
    deleteTemplate: shopModuleName + 'template/deleteTemplate',
    // 保存其他模板
    saveTemplate: shopModuleName + 'template/saveTemplate',
    // 根据模板ID查询当前模块的小模块
    listTemplateItem: shopModuleName + 'template/listTemplateItem',
    // 获取页面列表
    listPageSlave: shopModuleName + 'pageSlave/listPageSlave',
    // 添加页面
    savePage: shopModuleName + 'pageSlave/savePage',
    // 修改页面
    updatePage: shopModuleName + 'pageSlave/updatePage',
    // 删除页面
    deletePageSlave: shopModuleName + 'pageSlave/deletePageSlave',
    // 拖拽保存
    saveDragPageBlockSalve: shopModuleName + 'pageBlockSlave/saveDragPageBlockSalve',
    // 显示页面的所有模块
    listPageBlockSlave: shopModuleName + 'pageBlockSlave/listPageBlockSlave',
    // 底部导航菜单
    listNavigationSlave: shopModuleName + 'navigationSlave/listNavigationSlave',
    // 删除页面模块
    deletePageBlockSlave: shopModuleName + 'pageBlockSlave/deletePageBlockSlave',
    // 更新轮播模块
    updatePageBlockSlaveCarousel: shopModuleName + 'pageBlockSlave/updatePageBlockSlaveCarousel',
    // 更新单个轮播图
    updatePageBlockItemSlaveCarousel: shopModuleName + 'pageBlockSlave/updatePageBlockItemSlaveCarousel',
    // 删除模块子项
    deletePageBlockItemSlave: shopModuleName + 'pageBlockSlave/deletePageBlockItemSlave',
    // 查询单个子模块信息
    getSinglePageBlockItemSlave: shopModuleName + 'pageBlockSlave/getSinglePageBlockItemSlave',
    // 查询单个模块以及子模块信息
    getBlockSlaveAndListItem: shopModuleName + 'pageBlockSlave/getBlockSlaveAndListItem',
    // 添加单个轮播图
    savePageBlockItemSlaveCarousel: shopModuleName + 'pageBlockSlave/savePageBlockItemSlaveCarousel',
    // 页面模块排序
    setPageBlockItemSlaveDisplayNo: shopModuleName + 'pageBlockSlave/setPageBlockItemSlaveDisplayNo',
    // 添加导航
    saveNavigationSlave: shopModuleName + 'navigationSlave/saveNavigationSlave',
    // 编辑导航标签
    updateSingleNavigationSlave: shopModuleName + 'navigationSlave/updateSingleNavigationSlave',
    // 删除导航
    deleteNavigationSlave: shopModuleName + 'navigationSlave/deleteNavigationSlave',
    // 修改魔方模块模板信息
    updateSinglePageBlockSlave: shopModuleName + 'pageBlockSlave/updateSinglePageBlockSlave',
    // 保存子模块属性
    saveLayoutPageBlockItemSlave: shopModuleName + 'pageBlockSlave/saveLayoutPageBlockItemSlave',
    // 保存子模块内容
    saveSinglePageBlockItemSlave: shopModuleName + 'pageBlockSlave/saveSinglePageBlockItemSlave',
    // 修改单个cell
    updateSinglePageBlockItemSlave: shopModuleName + 'pageBlockSlave/updateSinglePageBlockItemSlave',
    // 发布全部页面
    publishPage: shopModuleName + 'pageBlockSlave/publishPage',
    // 下线
    onOffLine: shopModuleName + 'pageBlockSlave/onOffLine',
    // 撤销单个页面
    cancelSinglePage: shopModuleName + 'pageBlockSlave/cancelSinglePage',
    // 撤销全部页面
    cancelAllPage: shopModuleName + 'pageBlockSlave/cancelAllPage',
    // 拖拽排序
    pageBlockSlaveSort: shopModuleName + 'pageBlockSlave/pageBlockSlaveSort',
    // 添加行列
    addPageBlockItemSlave: shopModuleName + 'pageBlockSlave/addPageBlockItemSlave',
    // 交换两个小模块内容
    changePageBlockItemSlave: shopModuleName + 'pageBlockSlave/changePageBlockItemSlave',
    // 获取主题
    getShopTheme: shopModuleName + 'shop/getShopTheme',
    // 设置主题色
    saveShopTheme: shopModuleName + 'shop/saveShopTheme',
    // 修改页面描述信息
    updatePageInformation: shopModuleName + 'pageSlave/updatePageInformation',
    // 获取显示的模板
    getDefaultVisibleTemplate: shopModuleName + 'shop/getDefaultVisibleTemplate'
}

const wx = {
    // 微信菜单列表
    listWeixinMenu: wxModuleName + 'menu/listWeixinMenu',
    // 子菜单列表
    listChildWeixinMenu: wxModuleName + 'menu/listChildWeixinMenu',
    // 添加微信菜单
    saveWeixinMenu: wxModuleName + 'menu/saveWeixinMenu',
    // 删除微信菜单
    deleteWeixinMenu: wxModuleName + 'menu/deleteWeixinMenu',
    // 修改保存菜单
    updateSaveWeixinMenu: wxModuleName + 'menu/updateSaveWeixinMenu',
    // 自动回复列表
    listWeixinReply: wxModuleName + 'Reply/listWeixinReply',
    // 删除消息
    deleteWeixinReply: wxModuleName + 'Reply/deleteWeixinReply',
    // 添加消息
    saveWeixinReply: wxModuleName + 'Reply/saveWeixinReply',
    // 修改保存
    updateSaveWeixinReply: wxModuleName + 'Reply/updateSaveWeixinReply',
    // 启用禁用自动回复
    setWeixinReplyState: wxModuleName + 'Reply/setWeixinReplyState',
}

const member={
     // 查询会员信息
     listmember: memberModuleName + 'admin/listmember',
     // 修改密码
     changepassword:memberModuleName + 'admin/changepassword',
     // 获取会员信息(查看详情)
     getmemberbyid:memberModuleName + 'admin/getmemberbyid',
     // 获取第三方登录参数
    listparams: memberModuleName + 'param/listparams',
    // 保存参数
    saveparam: memberModuleName + 'param/saveparam',
    // 设置参数状态
    togglestate: memberModuleName + 'param/togglestate',
    // 查询会员等级列表
    listmemberlevel: memberModuleName + '/admin/listmemberlevel'
}

const promotion={
    //添加保存
    savePromotion: promotionModuleName + '/promotion/savePromotion',
    //优惠券列表
    lsitPromotion: promotionModuleName + '/promotion/lsitPromotion',
    //删除优惠卷
    deletePromotionPlan: promotionModuleName + '/promotion/deletePromotionPlan',
    //删除商品
    deletePromotionPlanProduct: promotionModuleName + '/promotion/deletePromotionPlan',
    //优惠券修改保存
    updatePromotionPlanState: promotionModuleName + '/promotion/updatePromotionPlanState',
    //优惠券编辑修改
    getPromotion: promotionModuleName + '/promotion/getPromotion',
    //优惠券修改保存
    saveUpdatePromotion: promotionModuleName + '/promotion/saveUpdatePromotion',
    // 砍价列表
    bargainList: promotionModuleName + 'promotionBargain/lsitPromotionBargainPlan',
    // 添加砍价
    bargainAdd: promotionModuleName + 'promotionBargain/savePromotionBarginPlan',
    // 编辑砍价
    bargainEdit: promotionModuleName + 'promotionBargain/saveUpdatePromotionBargainPlan',
    // 砍价详情
    barginDetail: promotionModuleName + 'promotionBargain/getPromotionBargainPlan',
    // 删除砍价单个商品
    delBargainPro: promotionModuleName + 'promotionBargain/deleteSingleBargainProductCollection',
    // 满赠添加保存
    savePromotionBgfPlan: promotionModuleName + 'promotionBgf/savePromotionBgfPlan',
    // 限时折扣列表
    discountList: promotionModuleName + 'promotionTld/lsitPromotionTldPlan',
    // 限时折扣详情
    discountDetail: promotionModuleName + 'promotionTld/getPromotionTldPlan',
    // 限时折扣添加
    discountAdd: promotionModuleName + 'promotionTld/savePromotionTldPlan',
    // 限时折扣更新
    discountUpdate: promotionModuleName + 'promotionTld/saveUpdatePromotionTldPlan',
    // 设置活动状态
    setState: promotionModuleName + 'promotion/updatePromotionPlanState',

    //满减/买赠--添加保存
    savePromotionBgfPlan: promotionModuleName + 'promotionBgf/savePromotionBgfPlan',
    //满减/买赠--修改保存
    saveUpdatePromotionBgfPlan: promotionModuleName + 'promotionBgf/saveUpdatePromotionBgfPlan',
    //满减/买赠--满减买赠列表
    lsitPromotionBgfPlan: promotionModuleName + 'promotionBgf/lsitPromotionBgfPlan',
    //满减/买赠--修改返回
    getPromotionBgfPlan: promotionModuleName + 'promotionBgf/getPromotionBgfPlan',


    //拼团--添加保存
    savePromotionGrouponPlan: promotionModuleName + 'promotionGroupon/savePromotionGrouponPlan',
    //拼团--拼团列表
    lsitPromotionGrouponPlan: promotionModuleName + 'promotionGroupon/lsitPromotionGrouponPlan',
    //拼团--修改保存
    saveUpdatePromotionGrouponPlan: promotionModuleName + 'promotionGroupon/saveUpdatePromotionGrouponPlan',
    //拼团--修改返回
    getPromotionGrouponPlan: promotionModuleName + 'promotionGroupon/getPromotionGrouponPlan',
    //拼团--删除单个商品
    deleteGroupShopping: promotionModuleName + 'promotionGroupon/deleteSingleGrouponProductCollection',

    // 优惠套餐--删除单个商品
    deleteSingleSuitProductCollection: promotionModuleName + 'promotionSuit/deleteSingleSuitProductCollection',
    // 修改返回
    getPromotionSuitPlan: promotionModuleName + 'promotionSuit/getPromotionSuitPlan',
    // 套餐列表
    lsitPromotionSuitPlan: promotionModuleName + 'promotionSuit/lsitPromotionSuitPlan',
    // 添加保存
    savePromotionSuitPlan: promotionModuleName + 'promotionSuit/savePromotionSuitPlan',
    // 修改保存
    saveUpdatePromotionSuitPlan: promotionModuleName + 'promotionSuit/saveUpdatePromotionSuitPlan',


}

const stat = {
    // 线下设备销量统计
    listdatestat: statModuleName + 'localsale/listdatestat',
    // 查询指定类型，制定时间段汇总数据
    listsunstat: statModuleName + 'localsale/listsumstat',
    // 指定时间段的月份汇总数据
    listmonthsun: statModuleName + 'localsale/listmonthsum'
}


export {
    baseUrl,
    product,
    order,
    auth,
    resale,
    device,
    permission,
    base,
    shop,
    file,
    pay,
    wx,
    member,
    promotion,
    stat
}
