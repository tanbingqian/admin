<template>
    <div>
        <p class="type-title">{{ $route.query.typeName + '  ' + $route.query.modelName }}</p>
        <ul class="list-wrap">
            <li class="list-header">
                <span class="col">{{ $t('displayNo') }}</span>
                <span class="col">SN</span>
                <span class="col">{{ $t('state') }}</span>
            </li>
            <li class="list-item" v-for="(sn, index) in snList" :key="index">
                <span class="col">{{ index }}</span>
                <input id="sn-input" class="col" v-if="!sn.sn" @keyup.enter="regist(sn)" :autofocus="true" v-model="sn.key"/>
                <span class="col" v-else>{{ sn.sn }}</span>
                <span class="col active-text">
                    {{ sn.text }}
                </span>
            </li>
        </ul>
        <div class="btn-back">
            <el-button type="primary" @click="$router.go('-1')" size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('back') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import _ from 'underscore'
import { device } from '@/common/api.js'
export default {
    name: 'DeviceRegistSN',
    props: ['model'],
    created () {
        this.fetchList()
    },
    data() {
        return {
            snList: []
        }
    },
    methods: {
        focusFunc () {
            var input = document.getElementById('sn-input')
            input.focus()
        },
        fetchList () {
            this.snList.push({
                sn: '',
                key: '',
                text: ''
            })
            this.$nextTick(function () {
                this.focusFunc()
            })
        },
        regist: _.debounce(function (sn) {
            sn.text = this.$t('registing')
            this.$axios.post(device.adddevice, {
                key: sn.key,
                sn: sn.sn,
                modelUid: this.model
            }).then(res => {
                if (res.data.state) {
                    sn.sn = res.data.data.sn
                    sn.text = this.$t('registSuccess')
                    this.fetchList()
                } else {
                    sn.text = this.$t('registFail')
                }
            })
        }, 300)
    }
}
</script>

<style scoped lang="less">
@import '../../../styles/variable.less';
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
            display: inline-block;
            box-sizing: border-box;
        }
    }
}
.btn-back{
    margin-top: 40px;
    text-align: center;
}
</style>
