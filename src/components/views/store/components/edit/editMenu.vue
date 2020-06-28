<template>
<transition enter-active-class="animated slideInRight">
        <div class="edit-wrap">
            <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                <div class="edit-menu">
                    <p>标签栏设置</p>
                    <el-table :data="menu">
                        <el-table-column label="图标(选中)">
                            <template slot-scope="scope">
                                <img class="thumb-img" v-if="scope.row.imageActive.length === 0" src="../../../../../assets/imgs/cell-img.png"/>
                                <img class="thumb-img" v-else :src="_fileHost.SHOP_IMAGE + scope.row.imageActive[0]">
                            </template>
                        </el-table-column>
                        <el-table-column label="图标(默认)">
                            <template slot-scope="scope">
                                <img class="thumb-img" v-if="scope.row.imageDef.length === 0" src="../../../../../assets/imgs/cell-img.png"/>
                                <img class="thumb-img" v-else :src="_fileHost.SHOP_IMAGE + scope.row.imageDef[0]">
                            </template>
                        </el-table-column>
                        <el-table-column label="导航名称" prop="text"></el-table-column>
                        <el-table-column label="导航链接" prop="link"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button class="el-icon-edit" size="mini" type="primary" @click="edit(scope.row)"></el-button>
                                <el-button
                                    class="el-icon-delete"
                                    size="mini" type="danger" @click="deleteNav(scope.row)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="store-add" @click="add" v-show="menu.length === 4">
                        + 添加导航
                    </div>
                    <el-row style="text-align: center; marginTop: 20px;">
                        <el-button size="small" @click="closeSelf">取消</el-button>
                        <el-button size="small" type="primary" @click="saveAll">保存</el-button>
                    </el-row>
                    <el-dialog :visible.sync="addDialog" width="40%" :title="dialogTitle">
                        <el-form label-width="80px">
                            <el-form-item label="图标(选中)">
                                <img-gallery v-if="addDialog" :fileHost="_fileHost.SHOP_IMAGE" v-model="form.imageActive" repoType="SHOP_IMAGE" :limit="1" :showPreview="true"></img-gallery>
                            </el-form-item>
                            <el-form-item label="图标(默认)">
                                <img-gallery v-if="addDialog" :fileHost="_fileHost.SHOP_IMAGE" v-model="form.imageDef" repoType="SHOP_IMAGE" :limit="1" :showPreview="true"></img-gallery>
                            </el-form-item>
                            <el-form-item label="导航名称">
                                <el-input v-model="form.text"></el-input>
                            </el-form-item>
                            <el-form-item label="导航链接">
                                <el-input v-model="form.link"></el-input>
                            </el-form-item>
                            <el-form-item label="导航类型">
                                <el-input :disabled="true" v-model="form.type"></el-input>
                            </el-form-item>
                            <el-form-item label=" ">
                                <el-button size="small" @click="addDialog = false">取消</el-button>
                                <el-button size="small" type="primary" @click="save" :loading="loading">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
            </el-scrollbar>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { shop } from '@/common/api.js'
import { eventHub } from '@/common/share/eventHub'
import ImgGallery from '@/components/common/upload/imgGallery'
export default {
    name: 'EditMenu',
    data() {
        return {
            menu: [],
            addDialog: false,
            loading: false,
            form: {
                link: '',
                picUrl: '',
                text: '',
                type: 'CUSTOM',
                image:[],
                imageActive: [],
                imageDef:[]
            },
            flag: '',
            dialogTitle: ''
        }
    },
    created () {
        this.listNavigationSlave()
    },
    methods: {
        // 关闭编辑窗
        closeSelf () {
            eventHub.$emit('closeEditWrap')
        },
        initForm () {
            this.form.link = ''
            this.form.picUrl = ''
            this.form.text = ''
            this.form.type = 'CUSTOM'
            this.form.imageActive = [],
            this.form.imageDef = []
        },
        edit (item) {
            this.dialogTitle = '修改导航'
            this.flag = 'edit'
            this.form = item
            this.addDialog = true
        },
        add () {
            this.initForm()
            this.dialogTitle = '添加导航'
            this.addDialog = true
            this.flag = 'add'
        },
        // 获取底部导航菜单
        listNavigationSlave () {
            this.$axios.post(shop.listNavigationSlave).then(res => {
                if (res.data.state) {
                    this.menu = res.data.data
                }
            })
        },
        save () {
            this.loading = true
            let arr = []
            let imgs = []
            let imgs2 = []
            this.form.imageActive.forEach(item => {
                imgs.push(item.storageFile)
            })
            this.form.imageActive = imgs

            this.form.imageDef.forEach(item => {
                imgs2.push(item.storageFile)
            })
            this.form.imageDef = imgs2
            if (this.flag === 'add') {
                arr.push(this.form.item)
            }
            // console.log(this.form)
            this.$axios.post(shop.updateSingleNavigationSlave, {
                // updateNavigationSlaveVO: this.form
                imageActive:this.form.imageActive,
                imageDef:this.form.imageDef,
                link:this.form.link,
                picUrl:this.form.picUrl,
                siteUid:this.form.siteUid,
                state:1,
                text: this.form.text,
                type: this.form.type
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    this.addDialog = false
                    this.listNavigationSlave()
                    eventHub.$emit('reloadNav')
                }
            }).catch(err => {
                this.loading = false
            })
        },

        //保存全部
        saveAll(){
            this.loading = true
            let arr = []
            let imgs = []
             let imgs2 = []
            this.form.imageActive.forEach(item => {
                imgs.push(item.storageFile)
            })
            this.form.imageActive = imgs
            if (this.flag === 'add') {
                arr.push(this.form)
            }
            this.form.imageDef.forEach(item => {
                imgs2.push(item.storageFile)
            })
            this.form.imageDef = imgs2
            if (this.flag === 'add') {
                arr.push(this.form)
            }
            this.$axios.post(shop.saveNavigationSlave, {
                navigationSlaveVOs: this.menu.concat(arr)
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    this.addDialog = false
                    this.listNavigationSlave()
                    eventHub.$emit('reloadNav')
                }
            }).catch(err => {
                this.loading = false
            })
        },
        deleteNav (item) {
            this.$axios.post(shop.deleteNavigationSlave, {
                type: item.type,
                siteUid: item.siteUid
            }).then(res => {
                if (res.data.state) {
                    this.listNavigationSlave()
                    eventHub.$emit('reloadNav')
                }
            })
        }
    },
    components: {
        ImgGallery
    }
}
</script>

<style scoped lang="less">
.thumb-img{
    width: 60px;
    height: 40px;
}
</style>
