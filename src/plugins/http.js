import axios from 'axios'
// 设置请求地址的基础部分
import { bus } from '../common/share/bus'
import { baseUrl } from '../common/api'

export default {
    install: function (Vue, options) {
        const instance = axios.create({
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json"
            }
        })
        // 请求的全局过滤器
        instance.interceptors.request.use(config => {
            // 设置全局token
            config.headers["Authorization"] = "Bearer " + sessionStorage.token
            config.headers["lang"] = localStorage.lang
            return config
        }, err => {
            return Promise.reject(err)
        })
        // 响应的全局过滤器
        instance.interceptors.response.use(res => {
            if (res.data.state) {
                // 响应成功
                // bus.successMsg(res.data.code)
            } else {
                // 响应失败，根据状态码统一处理
                bus.errmsg(res.data.code)
            }
            return res
        }, err => {
            if (err && err.response) {
                switch (err.response.status) {
                    case 400:
                        err.code = 'HTTP_400'
                        bus.errmsg('HTTP_400')
                        break
                    case 404:
                        err.code = 'HTTP_404'
                        bus.errmsg("HTTP_404")
                        break
                    case 500:
                        err.code = 'HTTP_500'
                        break
                }
            }
            return Promise.reject(err)
        })
        Vue.$axios = Vue.prototype.$axios = instance
    }
}
