<template>
    <div class="add-page">
        <el-table :data="listPage" :show-header="false" @row-click="rowClcik">
            <el-table-column label="页面标题" prop="pageTitle" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" size="mini" type="text" v-show="_hasPermission('PAGE_EDT')">编辑</el-button>
                    <el-button @click="delPage(scope.row.uid)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="store-add" @click="addPage" v-show="_hasPermission('PAGE_EDT')">
            + 添加页面
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="show" width="40%">
            <el-form label-width="80px" label-position="left" :model="form">
                <el-form-item label="页面名称:">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="页面类型:">
                    <el-radio v-model="form.type" label="HOME">首页</el-radio>
                    <el-radio v-model="form.type" label="CUSTOM">自定义页</el-radio>
                </el-form-item>
                <el-form-item label="终端:">
                    <el-radio v-model="form.platform" label="PC">电脑版</el-radio>
                    <el-radio v-model="form.platform" label="MOBILE">手机版</el-radio>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="show = false">取消</el-button>
                    <el-button @click="savePage" type="primary" :loading="loading">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
// platform: PC/MOBILE,
// type: HOME 首頁/CUSTOM自定義頁
import { shop } from '@/common/api'
export default {
    name: 'AddPage',
    created () {
        this.listPageSlave()
    },
    data() {
        return {
            listPage: [],
            form: {
                platform: 'MOBILE',
                title: '',
                type: 'CUSTOM',
                uid: 0
            },
            show: false,
            loading: false,
            dialogTitle: ''
        }
    },
    methods: {
        rowClcik (row, event, column) {
            this.$store.commit('choosePage', row)
        },
        edit (page) {
            this.dialogTitle = '修改页面'
            this.form.platform = page.platform
            this.form.title = page.pageTitle
            this.form.type = page.type
            this.form.uid = page.uid
            this.show = true
        },
        delPage (uid) {
            this.$axios.post(shop.deletePageSlave, {
                uid: uid
            }).then(res => {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.listPageSlave()
            })
        },
        addPage () {
            this.dialogTitle = '添加页面'
            this.show = true
            this.form = {
                platform: 'MOBILE',
                title: '',
                type: 'CUSTOM',
                uid: 0
            }
        },
        listPageSlave () {
            this.$axios.post(shop.listPageSlave, {
                plat: 'Mobile',
            }).then(res => {
                if (res.data.state) {
                    this.listPage = res.data.data
                }
            })
        },
        savePage () {
            let url = shop.savePage
            if (this.form.uid) {
                // 如果有uid调用编辑接口
                url = shop.updatePage
            }
            this.loading = true
            this.$axios.post(url, this.form).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                    this.listPageSlave()
                    this.show = false
                }
            }).catch(err => {
                this.loading = false
            })
        }
    }
}
</script>

<style lang="less" scoped>

.page-item{
    margin: 5px auto;
    height: 40px;
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f6f6f6;
    .title{
        width: 50%;
    }
}
</style>
