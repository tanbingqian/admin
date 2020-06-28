<template>
    <transition enter-active-class="animated slideInRight">
        <div class="edit-wrap">
            <el-scrollbar wrap-class="scroll-wrap-panel" view-class="view-box" :native="false">
                <div class="edit-cube">
                    <div class="uz-tab">
                        <div class="uz-tab-item" @click="change('content')" :class="{ active: activeTab === 'content' }">模块内容编辑</div>
                        <div class="uz-tab-item" @click="change('layout')" :class="{ active: activeTab === 'layout' }">模块布局设置</div>
                    </div>
                    <component
                        :pageUid="pageUid"
                        :checkCell="checkCell"
                        :moduleUid="moduleUid"
                        :is="formatCom(activeTab)">
                    </component>
                </div>
            </el-scrollbar>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import ModuleLayout from './layout'
import ModuleContent from './content'
export default {
    name: 'EditCube',
    props: ['pageUid', 'moduleUid', 'checkCell'],
    data() {
        return {
            activeTab: 'content'
        }
    },
    methods: {
        change (name) {
            this.activeTab = name
        },
        formatCom (name) {
            if (name === 'layout') {
                return 'ModuleLayout'
            } else if (name === 'content') {
                return 'ModuleContent'
            }
        },
    },
    components: {
        ModuleLayout,
        ModuleContent
    }
}
</script>

<style scoped lang="less">
.edit-cube{
    padding-bottom: 80px;
}
</style>
