<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="photo">
            <!-- 左侧导航菜单 -->
            <div class="left-menu">
                <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                    <ul>
                        <li class="top-item" @click="addMenu">添加组</li>
                        <li class="top-item" @click="delMenu">删除组</li>
                    </ul>
                    <draggable v-model="menus" @start="isDragging=true" @end="dragEnd">
                        <transition-group name="flip-list" tag="ul">
                            <li class="menu-item"
                                :class="{ active: activeTab === item.id }"
                                v-for="item in menus"
                                :key="item.id"
                                @dblclick="doubleClick(item)"
                                @click="menuClick(item)">
                                <span class="label">{{ item.label }}</span>
                                <transition name="edit-slide">
                                    <div class="edit-area" v-show="item.isEdit">
                                        <input class="my-input" v-model="item.label" placeholder="请输入名称" @keyup.enter="updateLable(item)"/>
                                        <i class="el-icon-check sure-icon" @click="updateLable(item)"></i>
                                    </div>
                                </transition>
                            </li>
                        </transition-group>
                    </draggable>
                </el-scrollbar>
            </div>
            <!-- 右侧导航菜单 -->
            <div class="right-content">
                <div class="top-buttons">
                    <div class="button-groups">
                        <span
                            class="button-item"
                            v-for="item in buttons"
                            :key="item.id"
                            @click="activeBtn = item.value"
                            :class="{ active: activeBtn === item.value }">{{ item.label }}</span>
                    </div>
                    <div class="right-buttons">
                        <el-upload action="">
                            <span class="upload-img">+上传图片</span>
                        </el-upload>
                    </div>
                    <span class="auth-btn">合作商授权</span>
                </div>
                <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                    <div class="photo-list" v-loading="loading" :element-loading-text="$t('loadingText')">
                        <draggable v-model="items" @start="isDragging=true" @end="dragEnd">
                            <transition-group name="flip-list" tag="div">
                                <div class="photo-wrap" v-for="item in items" :key="item">
                                    <img class="img-item" src="../../../../assets/imgs/test.jpg">
                                    <div class="operation-wrap">
                                        <img src="../../../../assets/imgs/icon_download.png">
                                        <img src="../../../../assets/imgs/icon_delete.png" @click="delphoto">
                                        <img src="../../../../assets/imgs/icon_save-as.png">
                                    </div>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                    <pager :styles="{'text-align': 'center', background: '#fff'}" :total="100"></pager>
                </el-scrollbar>
            </div>
        </div>
    </transition>
</template>

<script>
import Draggable from 'vuedraggable'
import Pager from '../../../common/Pager'
let id = 1000
let items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
export default {
    name: 'Photo',
    created () {
    },
    data () {
        return {
            loading: false,
            activeTab: 1,
            activeBtn: 'all',
            items: items,
            menus: [
                {
                    id: 1,
                    label: '人物自拍',
                    isEdit: false
                },
                {
                    id: 2,
                    label: '动物世界',
                    isEdit: false
                }
            ],
            buttons: [
                {
                    id: 1,
                    label: '全部',
                    value: 'all'
                },
                {
                    id: 2,
                    label: '开放',
                    value: 'open'
                },
                {
                    id: 3,
                    label: '私有',
                    value: 'private'
                }
            ]
        }
    },
    methods: {
        delphoto () {
            console.log('click');

        },
        dragEnd (env) {
            this.isDragging = false
        },
        menuClick (item) {
            this.activeTab = item.id
        },
        // 双击编辑类目
        doubleClick (data) {
            data.isEdit = true
        },
        // 保存类目名称
        updateLable (data) {
            console.log('update label')
            data.isEdit = false
        },
        // 添加类目
        addMenu () {
            this.menus.push({
                id: id++,
                label: '',
                isEdit: true
            })
        },
        // 删除类目
        delMenu () {
            const index = this.menus.findIndex(d => d.id === this.activeTab)
            this.menus.splice(index, 1)
        }
    },
    components: {
        Draggable,
        Pager
    }
}
</script>

<style lang="less" scoped>
@import '../../../../styles/variable.less';
@menuHeight: 60px;
.photo{
    position: absolute;
    top: 40px;
    left: 0;
    bottom: 0;
    right: 0;
}
.left-menu{
    position: absolute;
    top: 0;
    left: 12px;
    width: 160px;
    bottom: 0;
    padding-bottom: @menuHeight;
    font-size: 12px;
    padding-top: 20px;
    padding-bottom: 80px;
    font-family: @fontFamily;
    overflow: hidden;
}
.right-content{
    position: absolute;
    top: 0;
    left: 160px;
    bottom: 0;
    right: 0;
    padding-bottom: 80px;
}
.top-buttons{
    padding-top: 20px;
    position: relative;
    border-left: 1px solid #fff;
    margin-bottom: 40px;
}
.button-groups{
    display: inline-block;
    font-size: 12px;
    font-family: @fontFamily;
    .button-item{
        display: inline-block;
        text-align: center;
        width: 100px;
        .c-height;
        border: 1px solid #f6f6f6;
        cursor: pointer;
        box-sizing: border-box;
        transition: all .3s ease-out;
        &.active{
            background-color: #999;
            color: #fff;
        }
    }
}
.c-height{
    height: 30px;
    line-height: 30px;
}
.right-buttons{
    position: absolute;
    right: 200px;
    top: 22px;
    .upload-img{
        display: inline-block;
        padding: 6px 8px;
        background-color: #169BD5;
        color: #fff;
        font-size: 10px;
        font-family: @fontFamily;
        border-radius: 2px;
    }
}
.auth-btn{
    position: absolute;
    right: 90px;
    top: 21px;
    text-align: center;
    display: inline-block;
    background-color: #fff;
    padding: 6px 8px;
    font-size: 10px;
    font-family: @fontFamily;
    box-sizing: border-box;
    border: 1px solid #f2f2f2;
    border-radius: 2px;
    &:hover{
        cursor: pointer;
    }
}
.photo-list{
    overflow: hidden;
    .photo-wrap{
        position: relative;
        float: left;
        width: 100px;
        padding: 10px 20px 50px 20px;
        .img-item{
            display: block;
            margin: 0 auto;
            height: 96px;
            width: 72px;
        }
        .operation-wrap{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            padding: 100px 24px 0 24px;
            opacity: 0;
            height: 14px;
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
            img{
                display: inline-block;
                width: 10px;
                height: 10px;
                padding: 10px;
            }
            &:hover{
                opacity: 1;
                cursor: pointer;
            }
        }
    }
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
.top-item{
    color: @baseColor;
}
.menu-item{
    &.active{
        background-color: #fff;
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
    width: 100px;
    outline: none;
    border: 1px solid #ebebee;
}
.sure-icon{
    padding: 5px;
}
</style>


