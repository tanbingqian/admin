import axios from 'axios'
import { base, baseUrl, file } from "../api"

/**
 * base64字符串解码
 * @param {String} str
 */
 const decodeBase64 = (str) => {
    return window.atob(str)
 }

 /**
  * 对字符串进行base64编码
  * @param {String} str
  */
 const encodeBase64 = (str) => {
     return window.btoa(str)
 }

 /**
  * 将Unicode转为utf-8
  * @param {String} str
  */
const b64_to_utf8 = (str) => {
    return decodeURIComponent(escape(window.atob(str)))
}

/**
 * Unicode字符编码
 * @param {String} str
 */
const utf8_to_b64 = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
}

 /**
  * 解析JWT编码token, 获取用户名
  * @param {String} token
  */
 const decodeJWTToken = (token) => {
     // eJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiSmVmZmVyIExpIiwidWlkIjoxMDIzODIwODE1Nzk4NTE3NzcsImV4cCI6MTUzOTQ5MjA2OH0.3oPxiHHI1XFmJRsKXaPpM47Yku6mBSDj3Of2IpUIXXg
    let payload = token.split('.')[1]
    return JSON.parse(decodeBase64(payload))
 }

/**
 * 判断是否为真
 * @param {String} str
 */
 const isTrue = (str) => {
     if (str === '' || str === undefined || str === 'undefined' || str === 'false') {
         return false
     }
     return true
 }

 /**
  * 获取多语言列表
  */
 const fetchLang = () => {
    return new Promise((resolve, reject) => {
        axios
            .post(baseUrl + base.listlang)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
            })
    })
 }

 /**
  * 获取文件服务域名
  */
 const fetchFileServer = () => {
     return new Promise((resolve, reject) => {
         axios
            .post(baseUrl + file.getfilehostlist)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                resolve(err)
            })
     })
 }

/**
 * 生成UUID
 */
const generateUUID = () => {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16)
    })
    return uuid
}

/**
 * base64转成blob数据
 * @param {*} b64Data
 * @param {*} contentType
 * @param {*} sliceSize
 */
const b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || ''
    sliceSize = sliceSize || 512

    var byteCharacters = atob(b64Data)
    var byteArrays = []

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)

        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
        }

        var byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
    }

    var blob = new Blob(byteArrays, { type: contentType })
    return blob
}

/**
 * 将PC设置的宽高适配手机(手机切图采用的是750px * 1334px)
 * @param {Number} pc // pc端设置的长度或者宽度
 */
const calculatePX = (px) => {
    const pcWidth = 320
    const mobileWidth = 750
    return Number((px * 32 / 75).toFixed(8))
}

/**
 * 获取上传至阿里云的access
 * @param {Blob} uFile // 上传的文件对象
 * @param { Object } folder // 文件目录类型
 */
const getOssToken = (uFile, folder) => {
    let eUid = uFile.file.uid // 记录element-ui生成的uid，删除时用到
    const fileObj = {}
    let uid = generateUUID() // 生成随机uid
    let type = uFile.file.name.split(".")[1] // 获取文件扩展名
    let uidName = uid + '.' + type
    fileObj[uidName] = uFile.file.name
    return new Promise((resolve, reject) => {
        axios
            .post(baseUrl + file.getuploadtoken, {
                fileList: fileObj,
                folderUid: folder.folderUid,
                open: true,
                repoType: folder.repoType
            }, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.token
                }
            })
            .then(res => {
                if (res.data.state) {
                    let obj = res.data.data
                    let data = new FormData()
                    let picName = obj['dir'] + '/' + uidName
                    data.append('policy', obj.policy)
                    data.append('OSSAccessKeyId', obj.accessid)
                    data.append('success_action_status', 200)
                    data.append('callback', obj.callback)
                    data.append('signature', obj.signature)
                    data.append('key', picName)
                    data.append("file", uFile.file)
                    // ajax上传文件
                    axios.post(obj['host'], data).then(res => {
                        resolve({
                            url: picName
                        })
                    }).catch(err => {
                        reject('上传失败')
                    })
                } else {
                    reject("获取上传token失败")
                }
            })
    })
}

/**
 * 判断用户权限
 * @param {Array} pList
 * @param {String} pCode
 */
const hasPermission = (pCode) => {
    let userFuncs = sessionStorage._userFuncs
    if (!userFuncs) return false

    return JSON.parse(sessionStorage._userFuncs).indexOf(pCode) > -1
}

/**
 * 获取站点logo
 */

 const getSite = () => {
     return new Promise((resolve, reject) => {
         axios.post(baseUrl + '/auth/site/currentsite').then(res => {
             if (res.data.state) {
                 resolve(res)
             } else {
                 reject(res)
             }
         }).catch(err => {
             reject(err)
         })
     })
 }

export {
    decodeJWTToken,
    isTrue,
    fetchLang,
    fetchFileServer,
    generateUUID,
    calculatePX,
    getOssToken,
    b64_to_utf8,
    utf8_to_b64,
    hasPermission,
    getSite
}
