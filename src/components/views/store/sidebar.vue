<template>
    <div class="page-wrap">
        <el-collapse v-model="collapse" accordion>
            <el-collapse-item title="多图轮播" name="swipe">
                <draggable :options="dragOptions" @start="isDragging=true" @end="dragEnd">
                    <div class="drag-item"
                        :data-uid="s.uid"
                        v-for="(s, i) in swipeList" :key="i">
                        <flash :num="s.colNumber" :delay="s.showTime" :height="s.height"></flash>
                    </div>
                </draggable>
            </el-collapse-item>
            <el-collapse-item title="魔方导航" name="cube">
                <draggable :options="dragOptions" @start="isDragging=true" @end="dragEnd">
                    <div
                        class="drag-item"
                        :data-uid="s.uid"
                        v-for="(s, i) in cubeList"
                        :key="i">
                        <draw-cube-table :form="s"></draw-cube-table>
                    </div>
                </draggable>
            </el-collapse-item>
            <el-collapse-item title="搜索框" name="search">
                <draggable :options="dragOptions" @start="isDragging=true" @end="dragEnd">
                    <search-input></search-input>
                </draggable>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script type="text/ecmascript-6">
import Draggable from 'vuedraggable'
import Flash from './components/page/flash'
import SearchInput from './components/page/search'
import { shop } from '@/common/api.js'
import DrawCubeTable from './components/page/drawCubeTable'
export default {
    name: 'DragMenu',
    created () {
        this.getDefaultTemplet()
    },
    data() {
        return {
            swipeList: [],
            cubeList: [],
            collapse: '',
            dragOptions: {
                group: {
                    name: 'uzien',
                    pull: 'clone',
                    put: false
                },
                sort: false
            }
        }
    },
    methods: {
        dragEnd (env) {
            this.isDragging = false
        },
        // 获取模板列表
        getDefaultTemplet () {
            this.$axios.post(shop.getDefaultVisibleTemplate).then(res => {
                if (res.data.state) {
                    this.swipeList = res.data.data.FLASH
                    this.cubeList = res.data.data.NAVIGATION
                }
            })
        }
    },
    components: {
        Draggable,
        Flash,
        DrawCubeTable,
        SearchInput
    }
}
</script>

<style scoped lang="less">
.drag-item{
    position: relative;
    box-sizing: border-box;
    float: left;
    width: 50%;
    padding: 4px;
}
.nav-bar{
    margin-top: 10px;
    width: 100%;
    height: 40px;
    position: relative;
}
</style>
