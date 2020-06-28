<template>
    <div class="welcome">
       <div>
           <p>欢迎使用后台管理系统</p>
       </div>
    </div>
</template>

<script>
import ImgGallery from '@/components/common/upload/imgGallery'
import OssUpload from '@/components/common/upload/upload'
export default {
    data () {
        return {
            fileList: []
        }
    },
    components: {
        ImgGallery,
        OssUpload
    },
    methods: {
        getFileList (fileList) {
            this.fileList = fileList
        }
    }
}
</script>

<style lang="less" scoped>
.icon{
    width: 30px;
}
.welcome{
    padding: 20px;
    font-size: 16px;
}
</style>
