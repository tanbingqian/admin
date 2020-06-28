<template>
    <div class="module-container">
        <div class="left-menu">
            <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item name="slide" title="轮播图">
                        <div class="model-label" v-for="(s, i) in module.FLASH" :key="i" @click="setting(s.uid)">
                            <span class="text">{{ s.templateName }}</span>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item name="cube" title="魔方导航">
                        <div class="model-label" v-for="(s, i) in module.NAVIGATION" :key="i" @click="setting(s.uid)">
                            <span class="text">{{ s.templateName }}</span>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-scrollbar>
        </div>
        <div class="right-content">
            <component
                :is="current"
                :uid="moduleUid"
                @eventAdd="eventAdd"
                @eventDel="eventDel"
                @event-success="successEvent">
            </component>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import SwipeSetting from './components/module/swipeSetting'
import CubeSetting from './components/module/cubeSetting'
import { shop } from '@/common/api.js'
export default {
    name: 'StoreModule',
    created () {
        this.getDefaultTemplet()
    },
    data () {
        return {
            activeName: '',
            module: {},
            moduleUid: ''
        }
    },
    watch: {
        activeName (newVal) {
            if (newVal) {
                this.moduleUid = ''
            }
        }
    },
    methods: {
        setting (uid) {
            this.moduleUid = uid
        },
        getDefaultTemplet () {
            this.$axios.post(shop.getDefaultTemplet).then(res => {
                if (res.data.state) {
                    this.module = res.data.data
                }
            })
        },
        successEvent (val) {
            if (val) {
                this.getDefaultTemplet()
            }
        },
        eventDel () {
            this.getDefaultTemplet()
            this.moduleUid = ''
        },
        eventAdd () {
            this.moduleUid = ''
        }
    },
    computed: {
        current () {
            switch (this.activeName) {
                case 'slide':
                    return 'SwipeSetting'
                    break
                case 'cube':
                    return 'CubeSetting'
                    break
                default:
                    break;
            }
        }
    },
    components: {
        SwipeSetting,
        CubeSetting
    }
}
</script>

<style lang="less">
.module-container{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .left-menu{
        float: left;
        width: 25%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
        background-color: #f6f6f6;
        overflow: hidden;
        .el-collapse-item__header{
            background-color: #f6f6f6;
        }
        .el-collapse-item__wrap{
            background-color: #f6f6f6;
        }
    }
    .right-content{
        height: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: scroll;
    }
}
.model-label{
    display: inline-block;
    width: 50%;
    box-sizing: border-box;
    padding: 5px 10px;
    text-align: center;
    cursor: pointer;
    .text{
        width: 100%;
        display: inline-block;
        background-color: #fff;
        padding: 5px;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 500;
        border: 1px solid #ebebeb;
        &:hover{
            border-color: #409EFF;
            color: #409EFF;
        }
    }
}
</style>
