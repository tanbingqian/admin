// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUi from 'element-ui'
import VCharts from 'v-charts'
import Http from '@/plugins/http.js'
import '@/common/filter/filter.js'
import { bus } from "@/common/share/bus"
// 获取多语言函数
import { fetchLang, calculatePX, hasPermission, fetchFileServer } from "@/common/utils/tool"
import 'normalize.css'
import './styles/index.css'
import 'animate.css'
// 语言包
import VueI18n from "vue-i18n"
import { en } from "./plugins/i18n/lang/en"
import { zh } from "./plugins/i18n/lang/zh"

Vue.use(VueI18n)
Vue.use(Http)
Vue.use(VCharts)
Vue.config.productionTip = false

// 语言定义
const messages = {
    'en-US': en,
    'zh-CN': zh
}
// 需要支持的语言种类
// 中文 zh-CN
// 英文 en-US
// 意大利语 it
// 西班牙语 es
// 俄语 ru
// 德语 de
// 越南语 vi

const start = () => {
    // 获取系统语言列表
    fetchLang().then(res => {
        if (res.data.state) {
            const langArr = res.data.data
            var _defaultLang = langArr.find(lang => {
                return lang.defaultLang = 1
            })
            // 判断用户功能项权限
            Vue.prototype._hasPermission = hasPermission
            // 转换PC端px为移动端px
            Vue.prototype.calculatePX = calculatePX
            // 设置系统语言列表
            Vue.prototype._langArr = langArr
            // 设置默认语言
            Vue.prototype._defaultLang = _defaultLang.langCode
            if (localStorage.lang === undefined) {
                localStorage.lang = _defaultLang.langCode
            }
            bus.i18n = new VueI18n({
                locale: localStorage.lang || _defaultLang.langCode,
                fallbackLocale: _defaultLang.langCode,
                messages
            })
            Vue.use(ElementUi, {
                i18n: (key, value) => bus.i18n.t(key, value)
            })
            
            fetchFileServer().then(res => {
                if (res.data.state) {
                    const data = res.data.data
                    for (let key in data) {
                        data[key] = '//' + data[key] + '/'
                    }
                    Vue.prototype._fileHost = data
                    /* eslint-disable no-new */
                    new Vue({
                        el: "#app",
                        i18n: bus.i18n,
                        router,
                        store,
                        components: { App },
                        template: "<App/>"
                    })
                }
            })

        }
    })
}
// 启动app
start()