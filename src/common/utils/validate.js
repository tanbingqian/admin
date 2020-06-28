var regp = /(^[1-9]\d*\.\d+)|(0\.\d+)|\d+|(\\s)/;

// 0-100比例

const checkRate = (rule, value, callback) =>  {
    if (value.split('.').length <= 2) {
        if (!regp.test(value)) {
            callback(new Error('请输入数字'))
        } else if (value < 0 || value > 100) {
            callback(new Error('请输入0-100之间的数字'))
        } else {
            callback()
        }
    } else {
        callback(new Error("请输入0-100之间的数字"));
    }
}

const checkNumber = (rule, value, callback) => {
    if (value === '') {
        callback()
    } else {
        if (value.toString().split('.').length <= 2) {
            if (!regp.test(value)) {
                callback(new Error('请输入数字'))
            } else if (value < 0) {
                callback(new Error('请输入不小于0的数字'))
            } else {
                callback()
            }
        } else {
            callback(new Error("请输入不小于0的数字"));
        }
    }
}

// 校验数量
const checkCount = (rule, value, callback) => {
    if (typeof value !== 'number') {
        callback(new Error('请输入数字'))
    } else {
        if (value > 0) {
            callback()
        } else {
            callback(new Error('请输入大于0的数字'))
        }
    }
}


// 验证账户
const checkAccount = (rule, vlaue, callback) => {
    callback()
}

export { checkRate, checkNumber, checkAccount, checkCount }
