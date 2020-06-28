<template>
    <el-select filterable remote :remote-method="listuser" v-model="userUid" clearable>
        <el-option v-for="(u, i) in userList" :key="i" :label="u.name" :value="u.uid"></el-option>
    </el-select>
</template>

<script type="text/ecmascript-6">
import { permission } from '@/common/api.js'
import _ from 'underscore'
export default {
    data() {
        return {
            userUid: '',
            userList: []
        }
    },
    watch: {
        userUid (newVal, oldVal) {
            this.$emit('choose', newVal)
        }
    },
    methods: {
        listuser: _.debounce(function (val) {
            this.$axios.post(permission.listuser, {
                name: val
            }).then(res => {
                if (res.data.state) {
                    this.userList = res.data.data
                } else {
                    this.userList = []
                }
            })
        }, 100)
    }
}
</script>

<style scoped lang="less">
</style>
