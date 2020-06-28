<template>
    <transition enter-active-class="animated slideInRight">
        <div class="edit-wrap">
            <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                <div class="page-wrap">
                    <h3>页面标题栏</h3>
                    <el-form label-width="80px" label-position="left">
                        <el-form-item label="页面名称">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        <el-form-item label="页面描述">
                            <el-input v-model="form.description" type="textarea" :rows="2" placeholder="用户通过微信分享给好友时，会自动显示的页面描述"></el-input>
                        </el-form-item>
                        <el-form-item label="关键字">
                            <el-input v-model="form.keyword" type="textarea" :rows="2" placeholder="给页面设定的以便用户通过搜索引擎能搜到本网页的词汇"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" @click="closeSelf">取消</el-button>
                            <el-button type="primary" size="small" @click="save" :loading="loading">保存</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { shop } from '@/common/api'
import { eventHub } from '@/common/share/eventHub'
export default {
    name: 'EditPageTitle',
    data() {
        return {
            form: {
                title: this.$store.state.shop.currentPage.pageTitle,
                description: this.$store.state.shop.currentPage.discription,
                keyword: this.$store.state.shop.currentPage.keyWord,
                uid: this.$store.state.shop.currentPage.uid
            },
            loading: false
        }
    },
    methods: {
        // 关闭编辑窗
        closeSelf () {
            eventHub.$emit('closeEditWrap')
        },
        save () {
            this.loading = true
            this.$axios.post(shop.updatePageInformation, {
                discription: this.form.description,
                keyWord: this.form.keyword,
                title: this.form.title,
                uid: this.form.uid
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                }
                this.$store.commit('setPageTitle', this.form.title)
                // eventHub.$emit('refreshPageTitle')
            })
        }
    }
}
</script>

<style scoped lang="less">
</style>
