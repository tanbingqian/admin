<template>
    <div class="page-wrap">
        <div class="auth-type">
            <div class="type-desc">
                <img class="type-img" :src="wx.img">
                <span class="type-text">{{ wx.text }}</span>
                <div class="type-switch">
                    <el-switch
                        v-model="wx.state"
                        :active-value="1"
                        :inactive-value="0"
                        @change="toggleState(wx)"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </div>
            </div>
            <el-form label-width="80px" label-position="right" v-show="wx.state === 1">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="appId">
                            <el-input v-model="wx.appId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="API密钥">
                            <el-input v-model="wx.appSeckey"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: center;">
                    <el-button type="primary" size="small" @click="saveparam(wx)">保存</el-button>
                </el-row>
            </el-form>
        </div>
        <div class="auth-type">
            <div class="type-desc">
                <img class="type-img" :src="qq.img">
                <span class="type-text">{{ qq.text }}</span>
                <div class="type-switch">
                    <el-switch
                        v-model="qq.state"
                        :active-value="1"
                        :inactive-value="0"
                        @change="toggleState(qq)"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </div>
            </div>
            <el-form label-width="80px" label-position="right" v-show="qq.state === 1">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="appId">
                            <el-input v-model="qq.appId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="API密钥">
                            <el-input v-model="qq.appSeckey"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: center;">
                    <el-button type="primary" size="small" @click="saveparam(qq)">保存</el-button>
                </el-row>
            </el-form>
        </div>
        <div class="auth-type">
            <div class="type-desc">
                <img class="type-img" :src="wb.img">
                <span class="type-text">{{ wb.text }}</span>
                <div class="type-switch">
                    <el-switch
                        v-model="wb.state"
                        :active-value="1"
                        :inactive-value="0"
                        @change="toggleState(wb)"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </div>
            </div>
            <el-form label-width="80px" label-position="right" v-show="wb.state === 1">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="appId">
                            <el-input v-model="wb.appId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="API密钥">
                            <el-input v-model="wb.appSeckey"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="text-align: center;">
                    <el-button type="primary" size="small" @click="saveparam(wb)">保存</el-button>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { member } from '@/common/api'
export default {
    name: 'AuthLogin',
    created () {
        this.listparams()
    },
    data() {
        return {
            wx: {
                state: 1,
                appId: '',
                appSeckey: '',
                text: '微信登录',
                img: require('../../../assets/imgs/icon_wechat.png'),
                partnerCode: 'WECHAT'
            },
            qq: {
                state: 1,
                appId: '',
                appSeckey: '',
                text: 'QQ登录',
                img: require('../../../assets/imgs/icon_QQ.png'),
                partnerCode: 'QQ'
            },
            wb: {
                state: 1,
                appId: '',
                appSeckey: '',
                text: '新浪微博登录',
                img: require('../../../assets/imgs/icon_weibo.png'),
                partnerCode: 'WEIBO'
            },
            fb: {
                state: 1,
                appId: '',
                appSeckey: '',
                text: 'facebook',
                img: require('../../../assets/imgs/icon_weibo.png'),
                partnerCode: 'FACEBOOK'
            },
            go: {
                state: 1,
                appId: '',
                appSeckey: '',
                text: '谷歌',
                img: require('../../../assets/imgs/icon_weibo.png'),
                partnerCode: 'GOOGLE'
            }
        }
    },
    methods: {
        toggleState (item) {
            this.$axios.post(member.togglestate, {
                partner: item.partnerCode
            }).then(res => {
                if (res.data.state) {
                    item.state = res.data.data.state
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                }
            })
        },
        listparams () {
            this.$axios.post(member.listparams).then(res => {
                if (res.data.state) {
                    this.list = res.data.data
                    this.list.forEach(el => {
                        if (el.partnerCode === 'WECHAT') {
                            this.wx.appId = el.appId
                            this.wx.appSeckey = el.appSeckey
                            this.wx.state = el.state
                        } else if (el.partnerCode === 'QQ') {
                            this.qq.appId = el.appId
                            this.qq.appSeckey = el.appSeckey
                            this.qq.state = el.state
                        } else if (el.partnerCode === 'WEIBO') {
                            this.wb.appId = el.appId
                            this.wb.appSeckey = el.appSeckey
                            this.wb.state = el.state
                        }
                    })
                }
            })
        },
        saveparam (item) {
            this.$axios.post(member.saveparam, {
                appId: item.appId,
                appSeckey: item.appSeckey,
                partner: item.partnerCode
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
</style>
