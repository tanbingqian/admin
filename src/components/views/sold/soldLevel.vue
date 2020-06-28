<template>
    <transition enter-active-class="animated slideInUp">
        <div class="my-page">
            <div class="panel-page">
                <!-- 左侧导航菜单 -->
                <div class="left-menu">
                    <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                        <ul>
                            <li class="top-item" @click="addMenu">{{ $t('addResellerLevel') }}</li>
                        </ul>
                        <ul>
                            <li class="menu-item"
                                :class="{ active: activeTab.uid === item.uid }"
                                v-for="item in menus"
                                :key="item.uid"
                                @click="menuClick(item)">
                                <span class="label">{{ item.name }}</span>
                                <transition name="edit-slide">
                                    <div class="edit-area" v-show="item.isEdit">
                                        <input class="my-input" v-model="item.name" :placeholder="$t('enterName')" @keyup.enter="saveLevel(item)"/>
                                        <i class="el-icon-check sure-icon" @click="saveLevel(item)"></i>
                                    </div>
                                </transition>
                            </li>
                        </ul>
                    </el-scrollbar>
                </div>
            </div>
            <!-- 有选中的级别才显示 -->
            <div class="right-content" v-show="activeTab.uid">
                <div class="my-form">
                    <el-form label-width="80px" label-position="right">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item :label="$t('resellerId') + '：'">
                                    {{ activeTab.uid }}
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('nick') + '：'">
                                    <el-input v-model="activeTab.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :label="$t('explain') + '：'">
                                    <el-input v-model="activeTab.description"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="text-align: center;">
                            <el-button
                                type="primary"
                                @click="delLevel"
                                size="small">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('delete') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </el-button>
                            <el-button
                                type="primary"
                                @click="updateLevel"
                                size="small">
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </el-button>
                        </el-row>
                    </el-form>
                </div>
                <div class="tabs">
                    <span class="tab-item" @click="tabClick('type')" :class="{ active: this.authTab === 'type' }">{{ $t('categoryAuth') }}</span>
                    <span class="tab-item" @click="tabClick('goods')" :class="{ active: this.authTab === 'goods' }">{{ $t('goodsAuth') }}</span>
                </div>
                <div class="component">
                    <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                        <component :is="currentComponent" :levelUid="activeTab.uid" :levelName="activeTab.name"></component>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { resale } from '@/common/api.js'
import TypeAuth from './typeAuth'
import GoodsAuth from './goodsAuth'
let id = 1000
export default {
    name: 'SoldLevel',
    created () {
        this.fetchLevel()
    },
    data() {
        return {
            activeTab: {},
            authTab: 'type',
            menus: [],
        }
    },
    computed: {
        currentComponent () {
            if (this.authTab === 'type') {
                return 'type-auth'
            } else {
                return 'goods-auth'
            }
        }
    },
    methods: {
        tabClick (val) {
            this.authTab = val
        },
        menuClick (item) {
            this.activeTab = item
        },
        // 编辑保存级别
        updateLevel () {
            if (!this.activeTab.uid) {
                return
            }
            this.$axios.post(resale.saveResellerLevel, {
                name: this.activeTab.name,
                resellerUid: this.activeTab.resellerUid,
                description: this.activeTab.description,
                uid: this.activeTab.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('saveSuccess')
                    })
                }
            })
        },
        // 添加级别
        addMenu () {
            this.menus.push({
                name: '',
                resellerUid: '',
                description: '',
                isEdit: true
            })
        },
        saveLevel (data) {
            this.$axios.post(resale.saveResellerLevel, {
                name: data.name
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: this.$t('saveSuccess')
                    })
                    this.activeTab = {}
                    this.fetchLevel()
                }
            })
        },
        // 删除级别
        delLevel () {
            this.$axios.post(resale.removeResellerLevel, {
                uid: this.activeTab.uid,
                state: -1
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                       type: 'success',
                       message: this.$t('delSuccess')
                    })
                    this.fetchLevel()
                    this.activeTab = {}
                }
            }).catch(err => {
            })

        },
        // 获取经销商级别
        fetchLevel () {
            this.$axios.post(resale.listResellerLevel).then(res => {
                if (res.data.state) {
                    this.menus = res.data.data
                }
            })
        }
    },
    components: {
        'type-auth': TypeAuth,
        'goods-auth': GoodsAuth
    }
}
</script>

<style scoped lang="less">
@import '../../../styles/variable.less';
@menuHeight: 60px;
.top-item{
    color: @baseColor;
}
.left-menu{
    position: absolute;
    top: 0;
    left: 0;
    width: 160px;
    bottom: 0;
    padding-bottom: @menuHeight;
    font-size: 12px;
    padding-top: 20px;
    padding-bottom: 80px;
    font-family: @fontFamily;
    overflow: hidden;
    background-color: #ebebeb;
}
ul{
    list-style-type: none;
    margin: 0;
    padding: 0;
    li{
        position: relative;
        display: block;
        height: @menuHeight;
        line-height: @menuHeight;
        text-align: center;
        &:hover{
            cursor: pointer;
        }
    }
}
.my-form{
    padding: 20px;
}
.right-content{
    position: absolute;
    top: 0;
    left: 160px;
    bottom: 0;
    right: 0;
    padding-bottom: 40px;
}
.menu-item{
    &.active{
        background-color: #f6f6f6;
        color: @baseColor;
    }
    &:hover{
        color: @baseColor;
    }
    .label{
        display: block;
    }
}
.edit-area{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
}
.my-input{
    display: inline-block;
    text-align: center;
    height: 30px;
    line-height: 30px;
    width: 100px;
    outline: none;
    border: 1px solid #ebebee;
}
.sure-icon{
    padding: 5px;
}
.tabs{
    background-color: #f6f6f6;
    font-size: 0;
}
.tab-item{
    display: inline-block;
    width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #ebebeb;
    font-size: 14px;
    box-sizing: border-box;
}
.tab-item.active{
    background-color: #fff;
    border-bottom: none;
}
.tab-item:hover{
    cursor: pointer;
}
.component{
    padding: 12px;
    height: calc(100% - 180px);
}
</style>
