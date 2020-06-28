<template>
    <div ref="chooseImg">
        <div class="preview-img" v-if="showPreview">
            <div class="preview-list" v-for="(img, index) in fileList" :key="index">
                <img :src="img.url">
                <div class="del-img">
                    <i class="el-icon-delete" @click="delImg(img)"></i>
                </div>
                <label class="success-icon">
                    <i class="el-icon-check"></i>
                </label>
            </div>
        </div>
        <div class="choose-img">
            <div class="upload-label" @click="show = !show">{{ show ? '取消选择' : '选择图片' }}</div>
            <div class="upload-list" :style="{ visibility: show ? 'visible' : 'hidden' }">
                <div class="upload-item" @click="uploadItem('gallery')">
                    <img src="../../../assets/imgs/gallery.png" class="local-img">
                    <span class="item-text">图库选择</span>
                </div>
                <div class="upload-item" @click="uploadItem">
                    <uzien-upload :limit="limit" @getFileList="localUploadList" :repoType="repoType" :showFileList="false" :successFileList="this.fileList">
                        <div>
                            <img src="../../../assets/imgs/local.png" class="local-img">
                            <span class="item-text">本地上传</span>
                        </div>
                    </uzien-upload>
                </div>
            </div>
        </div>
        <el-dialog :visible.sync="showGallery" title="图库选择">
            <div class="gallery-list" style="z-index: 99999;">
                <div class="img-gallery">
                    <div class="img-cell" v-for="item in [1,2,3,4,5,6,7,8,9,0,11,22,33,44,55,66,77,88,99,52]" :key="item">
                        <img src="../../../assets/imgs/test2.jpeg"  >
                        <el-checkbox class="img-check"></el-checkbox>
                    </div>
                </div>
                <div class="pager">
                    <pager :total="50" :page-size="20"></pager>
                </div>
                <div class="btn-groups">
                    <el-button type="default" size="small" @click="showGallery = false">取消</el-button>
                    <el-button type="primary" size="small">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<!-- 限制上传个数 -->
<script type="text/ecmascript-6">
import UzienUpload from './upload'
import { eventHub } from '@/common/share/eventHub'
import Pager from '@/components/common/Pager'
export default {
    name: 'ChooseImg',
    props: {
        showPreview: {
            type: Boolean,
            default: true
        },
        repoType: {
            type: String,
            default: '',
            required: true
        },
        limit: {
            type: Number
        }
    },
    data() {
        return {
            show: false, // 显示上传图片选择项
            fileList: [], // 上传成功图片列表
            showGallery: false, // 显示图库
        }
    },
    watch: {
        fileList (newVal, oldVal) {
            this.$emit('newFileList', newVal)
        }
    },
    methods: {
        localUploadList (fileList) {
            // 过滤掉重复的图片
            fileList.forEach(file => {
                if (this.isAlreayIn(file) < 0) {
                    this.fileList.push(file)
                }
            })
            // this.show = false
        },
        // 判断文件是否已存在上传成功文件列表
        isAlreayIn (file) {
            return this.fileList.findIndex(item => file.uid === item.uid)
        },
        // 删除某张图片
        delImg (img) {
            const index = this.fileList.findIndex(item => item.uid === img.uid)
            this.fileList.splice(index, 1)
            eventHub.$emit('delImg', img)

        },
        // 选择图库还是本地上传
        uploadItem (type) {
            if (type === 'gallery') {
                this.showGallery = true
            }
            this.show = false
        }
    },
    components: {
        UzienUpload,
        Pager
    }
}
</script>

<style scoped lang="less">
.success-icon{
    position: absolute;
    top: -6px;
    right: -17px;
    height: 26px;
    width: 46px;
    text-align: center;
    background-color: #67C23A;
    transform: rotate(45deg);
    .el-icon-check{
        color: #fff;
        transform: rotate(-45deg)
    }
}
.preview-img{
    overflow: hidden;
}
.preview-list{
    position: relative;
    float: left;
    width: 100px;
    height: 100px;
    border-radius: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
    overflow: hidden;
    // background-color: #ccc;
    img{
        display: block;
        width: 100%;
        height: 100%;
    }
}
.del-img{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    transition: all ease-in-out .3s;
    text-align: center;
    i{
        font-size: 20px;
        color: #fff;
    }
}
.preview-list:hover .del-img{
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5)
}
.choose-img{
    position: relative;
    display: inline-block;
    cursor: pointer;
    .upload-label{
        outline: none;
        border: none;
        display: inline-block;
        background-color: #0070ae;
        color: #fff;
        padding: 2px 10px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        border-radius: 2px;
    }
}
.upload-list{
    position: absolute;
    top: 100%;
    width: 120px;
    height: 64px;
    z-index: 1;
    background-color: #fff;
    border: 1px solid #f6f6f6;
    box-sizing: border-box;
}
.local-img{
    display: inline-block;
    width: 20px;
    vertical-align: middle;
    margin-right: 5px;
}
.item-text{
    display: inline-block;
    vertical-align: middle;
}
.upload-item{
    padding: 0 10px;
}
.upload-item:hover{
    background-color: #f6f6f6;
}
.img-gallery{
    overflow: hidden;
}
.img-cell{
    position: relative;
    float: left;
    width: 90px;
    height: 120px;
    overflow: hidden;
    border: 1px solid #ebebeb;
    padding: 4px;
    margin-right: 10px;
    margin-bottom: 10px;
    img{
        width: 100%;
        height: 100%;
    }
}
.img-check{
    position: absolute;
    top: 4px;
    right: 4px;
    line-height: 16px;
}
.btn-groups{
    text-align: center;
}
</style>
