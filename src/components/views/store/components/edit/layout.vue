<template>
    <div class="layout">
        <!-- <div class="line">
            <el-checkbox>所有模块使用此布局</el-checkbox>
        </div> -->
        <el-form label-width="60px" label-position="left">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="行占比">
                        <el-input @keyup.native="cellRowChange" v-model.number="form.rowspan"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="列占比">
                        <el-input @keyup.native="cellColChange" v-model.number="form.colspan"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="布局">
                <div
                    class="cube-cell-wrap"
                    @click="chooseLayout(item)"
                    :class="{ active: item === checkCell.layout }"
                    v-for="(item, i) in cellClass"
                    :key="i">
                    <cube-cell
                        bgColor="#ebebeb"
                        :cellForm="{
                            layout: item,
                            showSubtitle: 1,
                            showTitle: 1,
                            imgW: 40,
                            imgH: 40,
                            titleFontSize: 10,
                            subTitleFontSize: 10,
                            lineHeight: 14 ,
                            image: []
                        }">
                    </cube-cell>
                </div>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="图片宽度">
                        <el-input v-model.number="checkCell.imgW"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="图片高度">
                        <el-input v-model.number="checkCell.imgH"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="标题间隔">
                <el-input v-model.number="checkCell.titleSpace"></el-input>
            </el-form-item>
            <el-form-item label="文字对齐方式">
                <el-radio v-model="checkCell.fontAlign" label="left">左对齐</el-radio>
                <el-radio v-model="checkCell.fontAlign" label="center">居中</el-radio>
                <el-radio v-model="checkCell.fontAlign" label="right">右对齐</el-radio>
            </el-form-item>
            <el-form-item label=" ">
                <el-button size="small">取消</el-button>
                <el-button size="small" type="primary" @click="save" :loading="loading">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
import { shop } from '@/common/api.js'
import { cellClass } from '@/common/state.js'
import CubeCell from '../module/cubeCell'
import _ from 'underscore'
import { eventHub } from '@/common/share/eventHub'
export default {
    name: 'EditCubeLayout',
    props: ['pageUid', 'moduleUid', 'checkCell'],
    data() {
        return {
            cellClass: cellClass,
            layout: {},
            loading: false,
            form: {
                rowspan: 1,
                colspan: 1,
                layout: 'cube-cell-one',
                imgW: '',
                imgH: '',
                titleSpace: '',
                fontAlign: ''
            }
        }
    },
    created () {
        eventHub.$on('updateCellSuccess', this.updateCellSuccess)
    },
    mounted () {
        this.form.rowspan = this.checkCell.rowspan
        this.form.colspan = this.checkCell.colspan
        // this.form.layout = this.checkCell.layout
        // this.form.imgW = this.checkCell.imgW
        // this.form.imgH = this.checkCell.imgH
        // this.form.titleSpace = this.checkCell.titleSpace
        // this.form.fontAlign = this.checkCell.fontAlign
    },
    watch: {
        checkCell (newVal, oldVal) {
            this.form.rowspan = newVal.rowspan
            this.form.colspan = newVal.colspan
            // this.form.layout = newVal.layout
            // this.form.imgW = newVal.imgW
            // this.form.imgH = newVal.imgH
            // this.form.titleSpace = newVal.titleSpace
            // this.form.fontAlign = newVal.fontAlign
        }
    },
    methods: {
        cellColChange: _.debounce(function (e) {
            eventHub.$emit('cellColChange', {
                newVal: e.target.value,
                oldVal: this.checkCell.colspan,
                blockUid: this.checkCell.blockUid
            })
        }, 500),
        cellRowChange: _.debounce(function (e) {
            eventHub.$emit('cellRowChange', {
                newVal: e.target.value,
                oldVal: this.checkCell.rowspan,
                blockUid: this.checkCell.blockUid
            })
        }, 500),
        chooseLayout (item) {
            this.checkCell.layout = item
        },
        // 保存布局
        save () {
            this.loading = true
            eventHub.$emit('updateCell', {
                blockUid: this.checkCell.blockUid
            })
        },
        updateCellSuccess () {
            this.loading = false
        }
    },
    components: {
        CubeCell
    },
    beforeDestroy () {
        eventHub.$off('updateCellSuccess')
    }
}
</script>

<style scoped lang="less">
.cube-cell-wrap{
    float: left;
    width: 70px;
    height: 70px;
    margin-right: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
    &:hover{
        border: 1px solid #409EFF;
        cursor: pointer;
    }
    &.active{
        border: 1px solid #409EFF;
    }
}
.line{
    line-height: 32px;
}
.layout{
    padding: 5px;
}
</style>
