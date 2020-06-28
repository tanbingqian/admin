<!-- 文件上传 -->
<template>
    <el-upload
        ref="ossUpload"
        multiple
        action=""
        :list-type="listType"
        :http-request="ossUpload"
        :file-list="fileList"
        :show-file-list="showFileList"
        >
        <slot></slot>
    </el-upload>
</template>

<script type="text/ecmascript-6">
import { getOssToken } from '@/common/utils/tool'
import { eventHub } from '@/common/share/eventHub'
export default {
    name: 'OssUpload',
    props: {
        folder: {
            type: Object,
            default: () => {
                return {}
            }
        },
        listType: {
            type: String,
            default: 'text'
        },
        limit: {
            type: Number,
            default: 2
        },
        showFileList: {
            type: Boolean,
            default: false
        }
    },
    mounted () {
        eventHub.$on('delImg', this.delImg)
    },
    data() {
        return {
            fileList: [] // 存储上传成功的文件信息
        }
    },
    methods: {
        // 自定义上传方法
        ossUpload (options) {
            getOssToken(options, this.folder).then(res => {
                options.onSuccess()
                eventHub.$emit('uploadSuccess')
            }).catch(err => {
                options.onError()
            })
        }
    }
}
</script>

<style scoped lang="less">
</style>
