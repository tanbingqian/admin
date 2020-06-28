<template>
    <div class="drag-data-container">
        <div class="drag-container">
            <!-- <div class="page-title">{{ page.pageTitle }}</div> -->
            <div class="mobile-wrap">
                <div class="change-theme">
                    <div class="theme-img"  @click="showTheme = !showTheme">
                        <i class="icon-cloth" :style="{ color: themeColor }"></i>
                        <p class="text">主题</p>
                    </div>
                    <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
                        <div class="theme-color" v-show="showTheme">
                            <i class="icon-cloth" :style="{ color: themeColor }" @click="showTheme = !showTheme"></i>
                            <div
                                class="circle"
                                :style="{ backgroundColor: color }"
                                v-for="color in themeColors"
                                :key="color"
                                @click="setThemeColor(color)">
                            </div>
                        </div>
                    </transition>
                </div>
                <!-- 页面标题栏 -->
                <page-title @editItem="editItem"></page-title>
                <draggable class="drag-area" :options="dragOptions" @add="onAdd" @end="onEnd" v-if="reloadDragData">
                    <div
                        class="clone-item"
                        v-for="(com, i) in moduleList"
                        :key="i"
                        :style="{
                            marginTop: calculatePX(com.marginTop) + 'px',
                            marginBottom: calculatePX(com.marginBottom) + 'px',
                            paddingTop: calculatePX(com.paddingTop) + 'px',
                            paddingBottom: calculatePX(com.paddingBottom) + 'px',
                            paddingLeft: calculatePX(com.paddingLeft) + 'px',
                            paddingRight: calculatePX(com.paddingRight) + 'px'
                        }"
                        @mouseenter="cloneEnter(com)"
                        @mouseleave="cloneOut(com)">
                        <!--  编辑删除  -->
                        <transition name="pull">
                            <div class="func-groups" v-show="com.edit">
                                <el-button type="text" size="mini" icon="el-icon-edit" @click="editItem(com)"></el-button>
                                <el-button type="text" size="mini" icon="el-icon-delete" @click="delItem(com)"></el-button>
                            </div>
                        </transition>
                        <!--  轮播组件  -->
                        <div class="swipe-component" v-if="com.type === 'FLASH'">
                            <swiper
                                :wrap-class="'wrap-' + com.uid"
                                :height="calculatePX(com.height)"
                                :marginTop="calculatePX(com.marginTop)"
                                :marginBottom="calculatePX(com.marginBottom)"
                                :marginLeft="calculatePX(com.marginLeft)"
                                :marginRight="calculatePX(com.marginRight)"
                                :paddingTop="calculatePX(com.paddingTop)"
                                :paddingBottom="calculatePX(com.paddingBottom)"
                                :paddingLeft="calculatePX(com.paddingLeft)"
                                :paddingRight="calculatePX(com.paddingRight)"
                                :itemRadius="calculatePX(com.itemRadius)"
                                :delay="com.showTime"
                                :speed="com.speed"
                                :data="com.listitem">
                            </swiper>
                            <!-- swiper无法拖拽，加一层div -->
                            <div class="drag-div"></div>
                        </div>
                        <!-- 魔方组件 -->
                        <drag-cube-page
                            :pageUid="page.uid"
                            :checkCell="checkCell"
                            v-if="com.type === 'NAVIGATION'"
                            @cellEdit="cellEdit"
                            :form="com">
                        </drag-cube-page>
                        <!-- 添加行 -->
                        <transition name="pull">
                            <div class="add-row" v-show="com.edit && com.type === 'NAVIGATION'">
                                <i class="el-icon-plus cube-icon" @click="addRow(com.uid)"></i>
                                <i class="el-icon-minus cube-icon" @click="minusRow(com.uid)"></i>
                            </div>
                        </transition>
                        <!-- 添加列 -->
                        <transition name="pull">
                            <div class="add-col" v-show="com.edit && com.type === 'NAVIGATION'">
                                <i class="el-icon-plus cube-icon" @click="addCol(com.uid)"></i>
                                <i class="el-icon-minus cube-icon" @click="minusCol(com.uid)"></i>
                            </div>
                        </transition>
                    </div>
                </draggable>
                <!-- 底部导航栏 -->
                <nav-bar @editItem="editItem"></nav-bar>
            </div>
        </div>

        <edit-swipe
            v-if="flag === 'FLASH'"
            :uid="editForm.uid">
        </edit-swipe>
        <!-- 编辑魔方整个模块 -->
        <edit-cube-module
            :moduleUid="editForm.uid"
            v-if="flag === 'NAVIGATION'">
        </edit-cube-module>
        <!-- 编辑单个单元格内容 -->
        <edit-cube
            :pageUid="page.uid"
            :checkCell="checkCell"
            :moduleUid="cellUid"
            v-if="flag === 'CUBE-CELL'">
        </edit-cube>
        <!-- 编辑底部菜单 -->
        <edit-menu v-if="flag === 'NAV-BAR'"></edit-menu>
        <!-- 编辑页面标题 -->
        <edit-page-title v-if="flag === 'PAGE-TITLE'"></edit-page-title>
    </div>
</template>

<script type="text/ecmascript-6">
import _ from 'underscore'
import Draggable from 'vuedraggable'
import Swiper from './components/page/swipe'
import NavBar from './components/page/navbar'
import PageTitle from './components/page/pageTitle'
import DragCubePage from './components/page/dragCubePage'
import EditSwipe from './components/edit/editSwipe'
import EditCube from './components/edit/editCube'
import EditCubeModule from './components/edit/editCubeModule'
import EditMenu from './components/edit/editMenu'
import EditPageTitle from './components/edit/editPageTitle'
import { shop } from '@/common/api'
import { eventHub } from '@/common/share/eventHub'
export default {
    name: 'DragData',
    props: {
        page: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dragOptions: {
                group: {
                    name: 'uzien',
                    pull: true,
                    put: true
                },
                sort: true,
            },
            moduleList: [],
            edit: false,
            reloadDragData: true,
            editForm: {},
            cellUid: '',
            checkCell: {},
            editMenu: false,
            showTheme: false,
            themeColors: ['#EF387A', '#E60012', '#F39700', '#862E9C', '#364FC7', '#0070ae'],
            flag: '' // 编辑哪个模块
        }
    },
    created () {
        eventHub.$on('reloadComponent', this.reloadComponent)
        eventHub.$on('closeEditWrap', this.closeEditWrap)
        eventHub.$on('cellEdit', this.cellEdit)
    },
    watch: {
        page (newVal, oldVal) {
            this.reloadComponent()
        }
        // reloadDragData (newVal, oldVal) {
        //     if (newVal) {
        //         this.listPageBlockSlave(this.page.uid)
        //     }
        // }
    },
    methods: {
        // 设置主题颜色
        setThemeColor (color) {
            this.$store.commit('setShopTheme', color)
            // this.$axios.post(shop.saveShopTheme, {
            //     theme: color
            // }).then(res => {
            //     if (res.data.state) {
            //         this.$message({
            //             type: 'success',
            //             message: '主题色设置成功'
            //         })
            //         this.$store.commit('setShopTheme', color)
            //     }
            // })
        },
        // 添加一行
        addRow (uid) {
            eventHub.$emit('addRow', {
                blockUid: uid
            })
        },
        // 删除最后一行
        minusRow (uid) {
            eventHub.$emit('minusRow', {
                blockUid: uid
            })
        },
        // 添加一列
        addCol (uid) {
            eventHub.$emit('addCol', {
                blockUid: uid
            })
        },
        // 删除最后一列
        minusCol (uid) {
            eventHub.$emit('minusCol', {
                blockUid: uid
            })
        },
        // 单击cell编辑
        cellEdit (obj) {
            this.checkCell = obj
            this.cellUid = obj.uid
            this.flag = 'CUBE-CELL'
        },
        onEnd (ev) {
            if (ev.newIndex !== ev.oldIndex) {
                this.dragSort(ev.oldIndex + 1, ev.newIndex + 1, this.moduleList[ev.oldIndex].uid, this.page.uid)
            }
        },
        // 拖拽排序
        dragSort (fromDisNo, toNo, fromUid, pageUid) {
            this.$axios.post(shop.pageBlockSlaveSort, {
                fromDisNo: fromDisNo,
                toNo: toNo,
                fromUid: fromUid,
                pageUid: pageUid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    eventHub.$emit('reloadComponent')
                }
            })
        },
        onAdd (ev) {
            const moduleUid = ev.item.getAttribute('data-uid')
            if (!this.page.uid) {
                // 如果没有选择页面，请先选择页面
                this.$message({
                    type: 'error',
                    message: '请先选择需要装修的页面'
                })
                ev.item.remove()
                return
            }
            ev.item.remove()
            // 已经选择了页面，将拖拽的模块保存到页面中
            this.saveDragPageBlockSalve(this.page.uid, moduleUid)
        },
        // 拖拽保存模块
        saveDragPageBlockSalve (pageUid, moduleUid) {
            this.$axios.post(shop.saveDragPageBlockSalve, {
                pageUid: pageUid,
                blockUid: moduleUid
            }).then(res => {
                if (res.data.state) {
                    this.reloadComponent()
                }
            })
        },
        // 查询页面所有模块
        listPageBlockSlave (pageUid) {
            this.$axios.post(shop.listPageBlockSlave, {
                uid: pageUid
            }).then(res => {
                if (res.data.state) {
                    this.moduleList = res.data.data
                }
            })
        },
        cloneEnter (item) {
            this.$set(item, 'edit', true)

        },
        cloneOut (item) {
            item.edit = false
        },
        clickSwipe () {
            console.log('swipe');
        },
        delItem (item) {
            const index = this.moduleList.findIndex(ele => ele.uid === item.uid)
            this.$axios.post(shop.deletePageBlockSlave, {
                pageUid: this.page.uid,
                uid: item.uid
            }).then(res => {
                if (res.data.state) {
                    this.moduleList.splice(index, 1)
                    this.reloadComponent()
                }
            })
        },
        // 编辑不同区域内容
        editItem (item) {
            this.flag = item.type
            this.editForm = item
            // 点击编辑时，获取不同魔方导航的行、列数据
            eventHub.$emit('getTableRowCol', item.uid)
        },
        clickButton (item) {
            console.log(item.name);
        },
        // 重新加载拖拽组件列表
        reloadComponent (flag) {
            // flag为false时，关闭右侧编辑表单
            console.log('reload  component..')
            this.reloadDragData = false
            this.$nextTick(function () {
                this.reloadDragData = true
                // 重新获取页面数据
                this.listPageBlockSlave(this.page.uid)
            })
            if (!flag) {
                // this.editForm = {}
                // this.cellUid = ''
                // this.checkCell = {}
                this.flag = ''
            }
        },
        // 关闭右侧编辑窗口
        closeEditWrap (refresh) {
            this.flag = ''
            if (refresh) {
                // 是否需要重新加载数据
                this.reloadComponent()
            }
        }
    },
    beforeDestroy () {
        eventHub.$off('reloadComponent')
        eventHub.$off('closeEditWrap')
    },
    components: {
        Draggable,
        Swiper,
        NavBar,
        PageTitle,
        DragCubePage,
        EditSwipe,
        EditCube,
        EditCubeModule,
        EditMenu,
        EditPageTitle
    },
    computed: {
        themeColor () {
            return this.$store.state.shop.themeColor
        }
    }
}
</script>

<style lang="less">
.drag-data-container{
    position: relative;
    overflow: hidden;
    height: 100%;
}
.edit-wrap{
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    bottom: 0;
    overflow: hidden;
    padding: 4px 0;
    background-color: #fff;
}
.drag-container{
    position: relative;
    flex-grow: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 100px;
    width: 50%;
}
.mobile-wrap{
    position: relative;
    width: 320px;
    height: 568px;
    box-sizing: border-box;
    padding: 44px 0;
    background-color: #fff;
}
.drag-area{
    height: 100%;
    // overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 20px;
    box-sizing: border-box;
}
.clone-item{
    position: relative;
    z-index: 3;
    box-sizing: border-box;
}
.clone-item:hover{
    border: 1px dashed #0070ae;
}
.func-groups{
    position: absolute;
    left: 0;
    width: 50px;
    top: 0;
    height: 28px;
    text-align: right;
    z-index: 5;
    background-color: #fff;
    border-radius: 5px;
    text-align: center;
}
.del-func{
    display: inline-block;
    padding: 5px;
}
.edit-func{
    display: inline-block;
    padding: 5px;
}
.page-title{
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
}
.swipe-component{
    position: relative;
    .drag-div{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
    }
}
.add-row{
    position: absolute;
    bottom: 1px;
    left: 1px;
    width: 50px;
    height: 28px;
    line-height: 28px;
    background-color: #fff;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    .cube-icon{
        color: #0070ae;
        font-size: 14px;
    }
}
.add-col{
    position: absolute;
    top: 1px;
    right: 1px;
    width: 50px;
    height: 28px;
    line-height: 28px;
    background-color: #fff;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    .cube-icon{
        color: #0070ae;
        font-size: 14px;
    }
}
.change-theme{
    position: absolute;
    right: -45px;
    bottom: 100px;
    cursor: pointer;
}
.theme-img{
    width: 40px;
    text-align: center;
    .text{
        font-size: 12px;
        color: #333;
        margin: 5px 0;
    }
}
.theme-color{
    position: absolute;
    left: 5px;
    top: -10px;
    width: 40px;
    background-color: #fff;
    text-align: center;
    padding: 10px 0;
    box-shadow: 3px 3px 6px #666;
    .circle{
        margin: 8px auto 0 auto;
        width: 18px;
        height: 18px;
        border-radius: 50%;
    }
}
.icon-cloth{
    font-size: 24px;
}
</style>
