<template>
    <div class="page-wrap">
        <p>
            <span class="wx-title">自动回复</span>
            <el-button type="text" @click="addParent">+添加</el-button>
        </p>
        <el-table :data="replyList">
            <el-table-column label="关键字" prop="keyword"></el-table-column>
            <el-table-column label="类型" prop="msgType"></el-table-column>
            <el-table-column label="消息类容" prop="content"></el-table-column>
            <el-table-column label="状态" prop="state">
                <template slot-scope="scope">
                    {{ scope.row.state === 1 ? '已启用' : '未启用' }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="editReply(scope.row)">编辑</el-button>
                    <el-button type="text" @click="delReply(scope.row)">删除</el-button>
                    <el-button type="text" @click="setState(scope.row)">{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="addReply" :title="dialogTitle">
            <el-form label-position="left" label-width="80px">
                <el-form-item label="关键字">
                    <el-input v-model="form.keyword"></el-input>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-radio :label="1" v-model="form.state">启用</el-radio>
                    <el-radio :label="0" v-model="form.state">不启用</el-radio>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio label="text" v-model="form.msgType">文本消息</el-radio>
                    <el-radio label="video" v-model="form.msgType">多媒体消息</el-radio>
                </el-form-item>
                <el-form-item label="消息内容">
                    <el-input type="textarea" :rows="5" v-model="form.content"></el-input>
                </el-form-item>
                <div class="tc">
                    <el-button type="primary" size="small" :loading="loading" @click="saveReply">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
import { wx } from '@/common/api'
export default {
    data() {
        return {
            replyList: [],
            addReply: false,
            dialogTitle: '',
            form: {
                content: '',
                keyword: '',
                msgType: '',
                state: 1,
                uid: 0
            },
            loading: false
        }
    },
    created () {
        this.listData()
    },
    methods: {
        // 初始化表单
        initForm () {
            this.form.content = ''
            this.form.keyword = ''
            this.form.msgType = ''
            this.form.state = 1
            this.form.uid = 0
        },
        // 启用禁用消息
        setState (item) {
            this.$axios.post(wx.setWeixinReplyState, {
                uid: item.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    this.listData()
                }
            })
        },
        // 修改消息
        editReply (item) {
            this.form.content = item.content
            this.form.keyword = item.keyword
            this.form.msgType = item.msgType
            this.form.state = item.state
            this.form.uid = item.uid

            this.dialogTitle = '编辑自动回复'
            this.addReply = true
        },
        // 添加消息
        addParent () {
            this.initForm()
            this.dialogTitle = '添加自动回复'
            this.addReply = true
        },
        // 保存消息
        saveReply () {
            this.loading = true
            var url = ''
            if (this.form.uid) {
                url = wx.updateSaveWeixinReply
            } else {
                url = wx.saveWeixinReply
            }
            this.$axios.post(url, this.form).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.listData()
                    this.addReply = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 自动回复消息列表
        listData () {
            this.$axios.post(wx.listWeixinReply).then(res => {
                if (res.data.state) {
                    this.replyList = res.data.data
                }
            })
        },
        // 删除消息
        delReply (item) {
            this.$axios.post(wx.deleteWeixinReply, {
                uid: item.uid
            }).then(res => {
                if (res.data.state) {
                    this.listData()
                }
            })
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
</style>
