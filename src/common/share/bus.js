import { Message } from 'element-ui'
class Bus {
    constructor () {
        this.i18n = ''
    }
    errmsg (msg) {
        Message({
            type: 'error',
            message: this.i18n.t(msg)
        })
    }
    successMsg (msg) {
        Message({
            type: 'success',
            message: this.i18n.t(msg)
        })
    }
}

// 导出全局访问的对象实例
const bus = new Bus()

export { bus }
