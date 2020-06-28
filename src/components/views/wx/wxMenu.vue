<template>
    <div class="page-wrap">
        <p>
            <span class="wx-title">自定义菜单</span>
            <el-button type="text" @click="addParent">+添加主菜单</el-button>
        </p>
        <div class="menu-list">
            <el-row class="menu-header">
                <el-col :span="4">
                    名称
                </el-col>
                <el-col :span="4">
                    排序
                </el-col>
                <el-col :span="4">
                    类型
                </el-col>
                <el-col :span="6">
                    关键字/链接
                </el-col>
                <el-col :span="4">
                    操作
                </el-col>
            </el-row>
            <el-row class="menu-item bor-b" v-for="(wx, index) in wxList" :key="index">
                <div>
                    <el-col class="item-col" :span="4">
                        <i class="el-icon-caret-right icon" :class="{ rotate: wx.expand }" @click="listChildWeixinMenu(wx, index)"></i>
                        {{ wx.name }}
                    </el-col>
                    <el-col class="item-col flex" :span="4">
                        <i class="el-icon-caret-top icon" :class="{ disabled: index === 0 }"></i>
                        <i class="el-icon-caret-bottom icon" :class="{ disabled: index === wxList.length - 1 }"></i>
                    </el-col>
                    <el-col class="item-col" :span="4">
                        {{ wx.eventType }}
                    </el-col>
                    <el-col class="item-col" :span="6">
                        {{ wx.eventValue }}
                    </el-col>
                    <el-col class="item-col" :span="4">
                        <i class="el-icon-edit icon" @click="editMenu(wx)"></i>
                        <i class="el-icon-plus icon" @click="addChildMenu(wx)"></i>
                        <i class="el-icon-delete icon" @click="delMenu(wx)"></i>
                    </el-col>
                </div>
                <div class="menu-item" v-show="wx.expand" v-for="(child, index) in wx.child" :key="index">
                    <el-col class="item-col right" :span="4">
                        {{ child.name }}
                    </el-col>
                    <el-col class="item-col flex" :span="4">
                        <i class="el-icon-caret-top icon" :class="{ disabled: index === 0 }"></i>
                        <i class="el-icon-caret-bottom icon" :class="{ disabled: index === wx.child.length - 1 }"></i>
                    </el-col>
                    <el-col class="item-col" :span="4">
                        {{ child.eventType }}
                    </el-col>
                    <el-col class="item-col" :span="6">
                        {{ child.eventValue }}
                    </el-col>
                    <el-col class="item-col" :span="4">
                        <i class="el-icon-edit" @click="editMenu(child)"></i>
                        <i class="el-icon-delete" @click="delMenu(child)"></i>
                    </el-col>
                </div>
            </el-row>
        </div>
        <el-dialog :visible.sync="addParentMenu" :title="dialogTitle" width="40%">
            <el-form label-position="left" label-width="100px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio v-model="form.eventType" label="link">链接</el-radio>
                    <el-radio v-model="form.eventType" label="view">多媒体信息</el-radio>
                    <el-radio v-model="form.eventType" label="click">事件</el-radio>
                </el-form-item>
                <el-form-item label="关键字/链接">
                    <el-input v-model="form.eventValue"></el-input>
                </el-form-item>
                <div style="text-align: center;">
                    <el-button type="primary" size="small" @click="saveWeixinMenu" :loading="loading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
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
            wxList: [],
            addParentMenu: false,
            form: {
                displayNo: 0,
                eventType: '',
                eventValue: '',
                name: '',
                parentUid: 0,
                uid: 0
            },
            loading: false,
            dialogTitle: ''
        }
    },
    created () {
        this.listWeixinMenu()
    },
    methods: {
        // 初始化表单
        initForm () {
            this.form.displayNo = 0
            this.form.eventType = ''
            this.form.eventValue = ''
            this.form.name = ''
            this.form.parentUid = 0
            this.form.uid = 0
        },
        // 修改菜单
        editMenu (item) {
            this.form.displayNo = item.displayNo
            this.form.eventType = item.eventType
            this.form.eventValue = item.eventValue
            this.form.name = item.name
            this.form.parentUid = item.parentUid
            this.form.uid = item.uid

            this.dialogTitle = '编辑菜单'
            this.addParentMenu = true
        },
        // 添加主菜单
        addParent () {
            this.initForm()
            this.dialogTitle = '添加主菜单'
            this.addParentMenu = true
        },
        // 添加子菜单
        addChildMenu (item) {
            this.initForm()
            this.form.parentUid = item.uid
            this.dialogTitle = '添加子菜单'
            this.addParentMenu = true
        },
        // 保存添加菜单
        saveWeixinMenu () {
            this.loading = true
            var url = ''
            if (this.form.uid) {
                url = wx.updateSaveWeixinMenu
            } else {
                url = wx.saveWeixinMenu
            }
            this.$axios.post(url, this.form).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    this.listWeixinMenu()
                    this.addParentMenu = false
                }
            }).catch(err => {
                this.loading = false
            })
        },
        // 微信菜单
        listWeixinMenu () {
            this.$axios.post(wx.listChildWeixinMenu, {
                uid: 0
            }).then(res => {
                if (res.data.state) {
                    this.wxList = res.data.data
                    this.wxList.forEach(item => {
                        this.$set(item, 'expand', false)
                    })
                }
            })
        },
        // 微信子菜单列表
        listChildWeixinMenu (item, index) {
            item.expand = !item.expand
            if (item.child === undefined) {
                this.$axios.post(wx.listChildWeixinMenu, {
                    uid: item.uid
                }).then(res => {
                    if (res.data.state) {
                        const child = res.data.data
                        if (child.length > 0) {
                            this.$set(item, 'child', child)
                        }
                    }
                })
            }
        },
        // 删除菜单
        delMenu (item) {
            this.$axios.post(wx.deleteWeixinMenu, {
                uid: item.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.listWeixinMenu()
                }
            })
        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.wx-title{
    font-size: 16px;
    color: #333;
}
.menu-header{
    font-size: 12px;
    color: #000;
    font-weight: 600;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-top: 1px solid #f6f6f6;
    border-bottom: 1px solid #f6f6f6;
}
.menu-item{
    font-size: 12px;
    color: #000;
    text-align: center;
}
.item-col{
    height: 36px;
    line-height: 36px;
}
.bor-b{
    border-bottom: 1px solid #f6f6f6;
}
.icon{
    font-size: 16px;
}
.el-icon-caret-right{
        transition: all ease-in-out .5s;
}
.rotate{
    transform: rotate(90deg);
}
.disabled{
    color: #ebebeb;
}
.flex{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.right{
    text-align: right;
}
</style>
