<template>
    <div>
        <div :id="editorId">

        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { getOssToken } from '@/common/utils/tool'
var E = require('../../../../static/js/wangEditor.js')
var editor
export default {
    name: 'WangEditor',
    props: ['lang', 'initHtml', 'repoType', 'fileHost'],
    data() {
        return {
        }
    },
    mounted () {
        var that = this
        editor = new E('#' + this.editorId)
        editor.customConfig.onchange = function (html) {
            // html 即变化之后的内容
            that.$emit('contentChange', html)
        }
        editor.customConfig.onchangeTimeout = 1000
        editor.customConfig.pasteFilterStyle = false
        editor.customConfig.pasteIgnoreImg = true
        // editor.customConfig.uploadImgServer = '/upload'
        editor.customConfig.customUploadImg = function (files, insert) {
            // files 是 input 中选中的文件列表
            // insert 是获取图片 url 后，插入到编辑器的方法
            // 上传代码返回结果之后，将图片插入到编辑器中
            // OSS上传 阿里云
            files.forEach(file => {
                getOssToken({
                    file: file
                }, {
                    repoType: that.repoType,
                    folderUid: 0
                }).then(res => {
                    insert(that.fileHost + res.url)
                })
            })
        }
        editor.create()
        // 设置初始化内容
        editor.txt.html(this.initHtml)
    },
    watch: {
        initHtml: function (newVal, oldVal) {
            editor.txt.html(newVal)
        }
    },
    computed: {
        editorId () {
            return this.$route.meta.editorPre + '_' + this.lang
        }
    }
}
</script>

<style scoped lang="less">
</style>
