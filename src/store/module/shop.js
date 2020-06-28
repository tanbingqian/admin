const shop = {
    state: {
        cubeTableRow: 0, // 魔方行数
        cubeTableCol: 0, // 魔方列数
        currentPage: {}, // 店铺当前装修页面
        themeColor: '', // 店铺主题色
    },
    mutations: {
        // 设置魔方导航行数
        tableRowChange (state, num) {
            state.cubeTableRow = num
        },
        // 设置魔方导航列数
        tableColChange (state, num) {
            state.cubeTableCol = num
        },
        // 选择装修页面
        choosePage (state, obj) {
            state.currentPage = obj
        },
        // 设置店铺主题色
        setShopTheme (state, color) {
            state.themeColor = color
        },
        // 设置页面标题
        setPageTitle (state, title) {
            state.currentPage.pageTitle = title
        }
    }
}
export default shop
