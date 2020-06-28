<template>
    <div class="img-gallery-wrap">
        <slot name="preview">
            <!-- 预览 -->
        </slot>
        <!-- 默认预览样式 -->
        <div class="preview-img" v-if="showPreview">
            <div class="preview-list" v-for="(img, index) in checkedQueue" :key="index">
                <img v-if="img !== ''" :src="fileHost + (img.storageFile || img) + '?x-oss-process=image/resize,l_100'">
                <img v-else src="../../../assets/imgs/cell-img.png">
                <div class="del-img">
                    <i class="el-icon-delete" @click="delImg(img)"></i>
                </div>
            </div>
        </div>
        <!-- <slot name="preview"></slot> -->
        <div :style="btnStyle" v-show="checkedQueue.length < limit">
            <el-button type="primary" size="small" @click="chooseFile = !chooseFile">选择图片</el-button>
        </div>
        <div class="my-dialog-wrapper" v-if="chooseFile">
            <div class="my-dialog" style="width: 60%">
                <i class="el-icon-close close-btn" @click="chooseFile = false"></i>
                <p class="title">选择文件</p>
                <div class="img-gallery">
                    <div class="tool-bar">
                        <div class="upload-wrap">
                            <oss-upload :showFileList="false" :folder="{repoType: last.repoType, folderUid: last.uid}">
                                <el-button type="primary" size="small">上传文件</el-button>
                            </oss-upload>
                        </div>
                        <el-button type="plain" class="el-icon-plus" size="small" @click="newFolder">新建目录</el-button>
                    </div>
                    <div class="check-wrap">
                        <div class="file-path height-28">
                            <a class="folder-link active" v-show="folderQueue.length > 1" @click="backLast">返回上一级 | </a>
                            <a class="folder-link active"
                                v-for="(item, index) in filterQueue(folderQueue)"
                                @click="gotoPath(item)"
                                :key="index">
                                {{ item.folderName }} >
                            </a>
                            <span class="">{{ last.folderName }}</span>
                        </div>
                        <div class="height-28">
                            <!-- <el-checkbox>全选</el-checkbox> -->
                            <div class="check-queue-length">已选中 {{ checkedQueue.length }} 个文件</div>
                        </div>
                    </div>
                    <div class="file-wrap">
                        <div class="file-list">
                            <div
                                class="file-item"
                                v-for="(item, index) in fullList" :key="index"
                                @click="enterFolder(item)"
                                :class="{ checked: item.checked }">
                                <div class="file-img-wrap">
                                    <img v-if="item.folderName === undefined" class="file-img" :src="fileHost + item.storageFile + '?x-oss-process=image/resize,l_100'">
                                    <img v-else class="folder-img" src="../../../assets/imgs/folder.png">
                                </div>
                                <p class="file-name" v-if="item.uid">{{ item.folderName || item.filename }}</p>
                                <div v-else class="gallery-edit-wrap">
                                    <input class="name-input"
                                        onfocus="this.select()"
                                        type="text"
                                        @keyup.enter="confirm(item)"
                                        v-model="item.folderName">
                                    <i class="el-icon-check" @click.stop="confirm(item)"></i>
                                    <i class="el-icon-close" @click.stop="cancel"></i>
                                </div>
                                <!-- 选中icon -->
                                <i class="el-icon-success check-icon" @click.stop="checkItem(item)"></i>
                                <!-- 删除 -->
                                <i class="el-icon-error del-icon" @click.stop="deleteItem(item)"></i>
                                <!-- 移动 -->
                                <i class="icon-move move-icon" @click.stop="moveItem(item)"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="my-footer">
                    <el-button @click="chooseFile = false" size="small" type="primary">确 定</el-button>
                </div>
            </div>
        </div>
        <!-- 移动文件到某个目录 -->
        <div class="my-dialog-wrapper" v-if="showTree">
            <div class="my-dialog" width="30%">
                <p class="title">请选择一个目录</p>
                <div class="tree-wrap">
                    <el-tree :props="treeProps" :load="loadFolder" lazy @node-click="nodeClick"></el-tree>
                </div>
                <div class="my-footer">
                    <el-button @click="showTree = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="moveConfirm" :loading="loading" size="small">确 定</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
const REPO_TYPE = ['PRODUCT_IMAGE', 'SHOP_IMAGE', 'DIY_GALLERY', 'UPDATE_FILE']
import { eventHub } from '@/common/share/eventHub'
import { file } from '@/common/api'
import OssUpload from '@/components/common/upload/upload'
export default {
    name: 'ImgGallery',
    model: {
        prop: 'imgs',
        event: 'choose'
    },
    props: {
        fileHost: {
            type: String,
            required: true
        },
        repoType: {
            type: String,
            required: true
        },
        imgs: {
            type: Array,
            default: () => {
                return []
            }
        },
        limit: {
            type: Number,
            default: 1
        },
        showPreview: {
            type: Boolean,
            default: false
        },
        btnStyle: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    created () {
        eventHub.$on('uploadSuccess', this.listFile)
    },
    data() {
        return {
            chooseFile: false,
            operation: '',
            fileList: [], // 文件列表
            folderList: [], // 子目录列表
            folderQueue: [
                {
                    uid: 0,
                    parentFolderUid: 0,
                    folderName: '全部文件',
                    repoType: this.repoType
                }
            ], // 记录当前所在目录
            checkedQueue: this.imgs, // 选中的文件或目录
            treeProps: {
                label: 'folderName',
                children: 'children',
                isLeaf: 'leaf'
            },
            treeFolderList: [],
            showTree: false,
            checkFolder: null, // 需要移入的目录
            moveData: null, // 移动的数据,
            loading: false
        }
    },
    watch: {
        chooseFile (newVal, oldVal) {
            if (newVal) {
                this.listFolder()
                this.listFile()
            }
        },
        checkedQueue (val) {
            this.$emit('choose', val)
        }
    },
    methods: {
        // 移动确认
        moveConfirm () {
            this.loading = true
            let url = ''
            let params = ''
            if (this.moveData.folderName) {
                url = file.movefolder
                params = {
                    folderUid: this.moveData.uid,
                    parentFolderUid: this.checkFolder.uid
                }
            } else {
                url = file.movefile
                params = {
                    fileUid: this.moveData.uid,
                    folderUid: this.checkFolder.uid
                }
            }
            this.$axios.post(url, params).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    this.showTree = false
                    if (this.moveData.folderName) {
                        this.listFolder()
                    } else {
                        this.listFile()
                    }
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 移动目录或文件
        moveItem (item) {
            this.moveData = item
            this.showTree = true
        },
        // 点击目录节点
        nodeClick (data) {
            this.checkFolder = data
        },
        // 加载目录子目录
        loadFolder (node, resolve) {
            if (node.level === 0) {
                return resolve([{ folderName: '全部文件', uid: 0 }])
            }
            this.$axios.post(file.listfolder, {
                folderUid: node.data.uid,
                open: true,
                repoType: this.repoType
            }).then(res => {
                if (res.data.state) {
                    resolve(res.data.data)
                } else {
                    resolve([])
                }
            })
        },
        // 重新加载当前目录的数据
        reloadData () {
            this.clearData()
            this.listFolder()
            this.listFile()
        },
        // 跳转到指定目录
        gotoPath (item) {
            const index = this.folderQueue.findIndex(ele => ele.uid === item.uid)
            this.folderQueue.splice(index + 1, this.folderQueue.length - index - 1)
            this.reloadData()
        },
        // 返回上一级
        backLast () {
            this.folderQueue.pop()
            this.reloadData()
        },
        // 清空数据
        clearData () {
            this.fileList = []
            this.folderList = []
        },
        // 进入当前目录
        enterFolder (item) {
            if (this.checkEdit() || !item.folderName) return
            this.folderQueue.push(item)
            this.reloadData()
        },
        // 删除目录
        deleteItem (item) {
            if (this.checkEdit()) return
            let url = ''
            if (item.folderName) {
                url = file.deletefolder
            } else {
                url = file.deletefile
            }
            this.$axios.post(url, {
                uid: item.uid
            }).then(res => {
                if (res.data.state) {
                    if (item.folderName) {
                        this.listFolder()
                    } else {
                        this.listFile()
                    }
                }
            })
        },
        // 删除图片
        delImg (item) {
            if (item.checked) {
                item.checked = !item.checked
            }
            const index = this.checkedQueue.findIndex(ele => ele === item)
            this.checkedQueue.splice(index, 1)

        },
        // 选中某一项
        checkItem (item) {
            if (this.checkEdit() || item.folderName) return
            // 判断个数限制
            if (!item.checked && this.checkedQueue.length >= this.limit) {
                this.$message({
                    type: 'error',
                    message: '最多选择' + this.limit + '个文件',
                })
                return
            }
            if (item.checked === undefined) {
                this.$set(item, 'checked', true)
            } else {
                item.checked = !item.checked
            }
            if (item.checked) {
                this.checkedQueue.push(item)
            } else {
                const index = this.checkedQueue.findIndex(ele => ele.uid === item.uid)
                this.checkedQueue.splice(index, 1)
            }
        },
        // 确认保存目录
        confirm (item) {
            this.$axios.post(file.createfolder, {
                folderName: item.folderName,
                open: item.open,
                parentFolderUid: item.parentFolderUid,
                repoType: item.repoType
            }).then(res => {
                if (res.data.state) {
                    this.listFolder()
                }
            })
        },
        // 取消保存目录
        cancel (item) {
            this.folderList.shift()
        },
        // 新建目录
        newFolder () {
            if (this.checkEdit()) return
            this.folderList.unshift({
                folderName: '新建文件夹',
                repoType: this.repoType,
                parentFolderUid: this.last.uid,
                open: true
            })
        },
        // 获取子目录列表
        listFolder () {
            this.$axios.post(file.listfolder, {
                folderUid: this.last.uid,
                open: true,
                repoType: this.last.repoType
            }).then(res => {
                if (res.data.state) {
                    this.folderList = res.data.data
                }
            })
        },
        // 获取文件列表
        listFile () {
            this.$axios.post(file.listfile, {
                folderUid: this.last.uid,
                open: true,
                repoType: this.last.repoType
            }).then(res => {
                if (res.data.state) {
                    this.fileList = res.data.data
                    // 设置已经选中的文件状态
                    this.fileList.forEach(item => {
                        if (this.isInCheckQueue(item)) {
                            this.$set(item, 'checked', true)
                        }
                    })
                }
            })
        },
        // 判断一个文件是否已经被选中
        isInCheckQueue (ele) {
            const index = this.imgs.findIndex(item => item.uid === ele.uid)
            return index > -1
        },
        // 过滤目录列表
        filterQueue (arr) {
            return arr.filter((v, i) => {
                return i < arr.length - 1
            })
        },
        // 如果是有一个元素正在编辑，则不允许其他任何操作
        checkEdit () {
            if (this.isEdit) {
                return true
            }
            return false
        }
    },
    computed: {
        // folderQueue最后一个元素
        last () {
            return this.folderQueue[this.folderQueue.length - 1]
        },
        // 当前目录的所有子目录和文件
        fullList () {
            return this.folderList.concat(this.fileList)
        },
        // 判断第一个目录是否是新增/编辑状态，如果是则不允许任何操作
        isEdit () {
            let folder = this.folderList[0]
            if (folder && !folder.uid) {
                return true // 新增状态
            }
            return false
        }
    },
    components: {
        OssUpload
    },
    beforeDestroy () {
        eventHub.$off('uploadSuccess')
    }
}
</script>

<style scoped lang="less">
.img-gallery-wrap{
    text-align: left;
}
.img-gallery{
    padding: 20px;
}
.file-wrap{
    height: 400px;
    overflow-x: hidden;
    overflow-y: scroll;
}
.file-list{
    overflow: hidden;
    padding-top: 4px;
    border-top: 1px solid #f6f6f6;
}
.file-item{
    position: relative;
    float: left;
    width: 120px;
    height: 137px;
    margin: 4px 0 0 6px;
    cursor: pointer;
    border-radius: 6px;
    box-sizing: border-box;
    &:hover{
        background-color: #f6f6f6;
    }
    &:hover .check-icon{
        opacity: 1;
    }
    &:hover .del-icon{
        opacity: 1;
    }
    &:hover .move-icon{
        opacity: 1;
    }
}
.file-item.checked{
    border: 1px solid #91BFEF;
    background-color: #f6f6f6;
    color: #0070ae;
    &:hover{
        background-color: #f6f6f6;
    }
    .check-icon{
        opacity: 1;
        color: #0070ae;
    }
}
.check-icon{
    position: absolute;
    top: 8px;
    left: 8px;
    color: #91BFEF;
    opacity: 0;
    font-size: 14px;
}
.del-icon{
    position: absolute;
    top: 8px;
    right: 8px;
    color: #91BFEF;
    opacity: 0;
    font-size: 14px;
}
.move-icon{
    position: absolute;
    top: 8px;
    right: 50%;
    color: #91BFEF;
    opacity: 0;
    font-size: 14px;
    margin-right: -7px;
}
.file-img-wrap{
    width: 94px;
    height: 94px;
    padding: 20px 10px 0 10px;
    box-sizing: border-box;
    margin: 9px auto 0;
    .file-img{
        width: 100%;
        height: 100%;
        border-radius: 8px;
    }
    .folder-img{
        width: 100%;
        height: 100%;
    }
}
.file-name{
    display: block;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 8px 5px;
    font-size: 12px;
    line-height: 16px;
    &:hover{
        color: #0070ae;
    }
}
.check-wrap{
   line-height: 28px;
}
.file-path{
    font-size: 12px;
    padding: 10px 0;
    .folder-link{
        cursor: pointer;
        color: #666;
        &.active{
            color: #0070ae;
        }
        &:hover{
            text-decoration: underline;
        }
    }
}
.gallery-edit-wrap{
    width: 100%;
    .name-input{
        display: inline-block;
        width: 70px;
        height: 14px;
        line-height: 14px;
        font-size: 12px;
    }
    i{
        font-weight: 600;
        font-size: 10px;
        padding: 2px;
        border: 1px solid #0070ae;
        color: #0070ae;
    }
}
.upload-wrap{
    display: inline-block;
}
.tree-wrap{
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: scroll;
}
.my-dialog-wrapper{
    z-index: 99;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.4);
}
.my-dialog{
    z-index: 3001;
    position: relative;
    margin: 0 auto 50px;
    background: #fff;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 30%;
    margin-top: 15vh;
    .title{
        font-size: 16px;
        font-weight: 600;
        margin: 0;
        padding: 20px;
    }
    .tree-wrap{
        padding: 0 20px 20px 20px;
    }
    .my-footer{
        padding: 0 0 20px 0;
        text-align: center;
    }
    .close-btn{
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 18px;
        padding: 5px;
    }
}
.my-dialog-shadow{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background: #000;
    z-index: 3000;
}

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

.preview-list:hover .del-img{
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.5)
}
.height-28{
    height: 28px;
    line-height: 28px;
}
</style>
