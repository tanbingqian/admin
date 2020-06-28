<template>
    <transition enter-active-class="animated fadeInLeft">
        <div>
            <div style="text-align: center; margin-bottom: 20px;">
                <!-- <el-button type="text">添加SN</el-button> -->
            </div>
            <ul class="list-wrap">
                <li class="list-header">
                    <span class="col">{{ $t('displayNo') }}</span>
                    <span class="col">SN</span>
                    <span class="col">{{ $t('state') }}</span>
                </li>
                <li class="list-item" v-for="(sn, index) in snList" :key="index">
                    <span class="col">{{ index }}</span>
                    <input id="sn-input" class="col" v-if="!sn.trail" @keyup.enter="regist(sn)" :autofocus="true" v-model="sn.sn"/>
                    <span class="col" v-else>{{ sn.sn }}</span>
                    <span class="col active-text">
                        {{ sn.text }}
                    </span>
                </li>
            </ul>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import _ from 'underscore'
import { device } from '@/common/api.js'
export default {
    name: 'DeviceRegistSN',
    props: ['uid'],
    created () {
        if (this.uid) {
            this.listdevice()
        } else {
            this.$message({
                type: 'error',
                message: this.$t('chooseDeviceModel')
            })
        }
    },
    data() {
        return {
            snList: []
        }
    },
    watch: {
        uid (newVal, oldVal) {
            if (newVal) {
                this.listdevice()
            } else {
                this.snList = []
            }
        }
    },
    methods: {
        // 获取指定型号内测设备
        listdevice () {
            this.$axios.post(device.listdevice, {
                modelUid: this.uid,
                trail: 0,
                page: 1,
                pageSize: 50
            }).then(res => {
                if (res.data.state) {
                    this.snList = []
                    const arr = res.data.data.dataList
                    arr.forEach(item => {
                        this.snList.push({
                            sn: item.sn,
                            trail: true,
                            text: '成功'
                        })
                    })
                    this.fetchList()
                }
            })
        },
        focusFunc () {
            var input = document.getElementById('sn-input')
            input.focus()
        },
        fetchList () {
            this.snList.push({
                sn: '',
                text: '',
                trail: false
            })
            this.$nextTick(function () {
                this.focusFunc()
            })
        },
        regist: _.debounce(function (sn) {
            sn.text = '正在处理...'
            this.$axios.post(device.setdevicetrial, {
                sn: sn.sn,
                trial: true
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '设置成功'
                    })
                    sn.text = '成功'
                    sn.trail = true
                    this.fetchList()
                } else {
                    sn.text = '失败'
                }
            })
        }, 300)
    }
}
</script>

<style scoped lang="less">
@import '../../../../styles/variable.less';
.type-title{
    font-size: 16px;
    color: #000;
    text-align: center;
    padding: 40px 0;
}
.list-wrap{
    display: block;
    margin: 0 auto;
    padding: 0;
    width: 50%;
    list-style-type: none;
    .list-header{
        color: #000;
        font-size: 0;
        padding-bottom: 10px;
        border-bottom: 1px solid #f6f6f6;
        .col{
            font-size: 14px;
            display: inline-block;
            width: 33.33333333%;
            text-align: center;
        }
    }
    .list-item{
        font-size: 0;
        color: #333;
        padding: 10px;
        border-bottom: 1px solid #f6f6f6;
        .col{
            font-size: 12px;
            display: inline-block;
            width: 33.33333333%;
            text-align: center;
        }
        .active-text{
            color: @baseColor;
        }
        input{
            line-height: 24px;
            box-sizing: border-box;
        }
    }
}
.btn-back{
    margin-top: 40px;
    text-align: center;
}
</style>
