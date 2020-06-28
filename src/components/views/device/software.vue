<template>
    <div class="page-wrap">
        <div class="search-wrap">
            <el-form label-width="80px" label-position="left">
                <el-form-item :label="$t('deviceModel')">
                    <device-model @choose="choose"></device-model>
                </el-form-item>
            </el-form>
        </div>
        <div class="tabs">
            <span
                class="tab-item"
                @click="tabClick('Version')"
                v-show="_hasPermission('DEV_SOFT_VIEW')"
                :class="{ active: this.authTab === 'Version' }">{{ $t('softwareVersion') }}</span>
            <span
                class="tab-item"
                @click="tabClick('device')"
                v-show="_hasPermission('DEV_TRIAL_MNG')"
                :class="{ active: this.authTab === 'device' }">{{ $t('innerTestDevice') }}</span>
        </div>
        <div class="component">
            <component v-bind:is="currentCom" :uid="softUid"></component>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { device } from '@/common/api.js'
import Device from './software/device'
import Version from './software/version'
import DeviceModel from '@/components/common/page/deviceModel.vue'
export default {
    created () {
    },
    data() {
        return {
            authTab: 'Version',
            modelUid: [],
            typeList: []
        }
    },
    components: {
        Device,
        Version,
        DeviceModel
    },
    methods: {
        choose (val) {
            this.modelUid = val
        },
        tabClick (val) {
            this.authTab = val
        }
    },
    computed: {
        currentCom () {
            return this.authTab
        },
        softUid () {
            if (this.modelUid.length === 0 || this.modelUid.length === 1) {
                return ''
            } else {
                return this.modelUid[this.modelUid.length - 1]
            }
        }
    }
}
</script>

<style scoped lang="less">
.component{
    padding: 20px;
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
</style>
