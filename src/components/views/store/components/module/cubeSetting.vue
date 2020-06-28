<template>
    <div class="cube-setting">
        <div class="left">
            <div class="setting-title">
                <span class="title">魔方导航设置</span>
                <el-button type="text" @click="addCube" v-show="_hasPermission('MODULE_ADD')">+新增导航样式</el-button>
            </div>
            <div class="cube-template"
                :style="{
                    paddingTop: calculatePX(form.paddingTop) + 'px',
                    paddingBottom: calculatePX(form.paddingBottom) + 'px',
                    paddingLeft: calculatePX(form.paddingLeft) + 'px',
                    paddingRight: calculatePX(form.paddingRight) + 'px',
                    marginTop: calculatePX(form.marginTop) + 'px',
                    marginBottom: calculatePX(form.marginBottom) + 'px',
                    marginLeft: calculatePX(form.marginLeft) + 'px',
                    marginRight: calculatePX(form.marginRight) + 'px'
                }">
                <!-- 根据列数、行高动态生成格子 -->
                <div class="cube-table">
                    <div class="cube-row" v-for="(row, rI) in cubeTable" :key="rI">
                        <div class="cube-col"
                            :style="{
                                height: calculatePX(form.height) + 'px',
                                width: (100 / row.length) + '%'
                            }"
                            v-for="(col, cI) in row" :key="JSON.stringify(col) + cI"
                        >
                        </div>
                    </div>
                    <!-- 绝对定位放置每个单元格 -->
                    <div v-for="(data) in cellData" :key="JSON.stringify(data)"
                        class="cell-wrap"
                        :class="{active: checkCell.displayNo === data.displayNo}"
                        :style="{
                            top: data.top,
                            left: data.left,
                            width: data.width,
                            height: data.height,
                            position: 'absolute',
                        }">
                        <cube-cell
                            @cellEdit="cellEdit"
                            :cellForm="data"
                            bgColor="#fff"
                            :imgMargin="form.textSpace"
                            :borderRadius="form.itemRadius"
                            :rowPadding="form.rowPadding"
                            :colPadding="form.colPadding"
                            :show="checkCell.displayNo !== data.displayNo">
                        </cube-cell>
                    </div>
                </div>
            </div>
            <el-form label-width="120px" :model="form" ref="cubeForm" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="模板名称" prop="templateName">
                            <el-input v-model="form.templateName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="列" prop="colNumber">
                            <el-input v-model.number="form.colNumber" @keyup.native="colsChange"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="行高" prop="height">
                            <el-input v-model.number="form.height"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="外边距(上)" prop="marginTop">
                            <el-input v-model.number="form.marginTop"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外边距(下)" prop="marginBottom">
                            <el-input v-model.number="form.marginBottom"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="外边距(左)" prop="marginLeft">
                            <el-input v-model.number="form.marginLeft"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="外边距(右)" prop="marginRight">
                            <el-input v-model.number="form.marginRight"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="内边距(上)" prop="paddingTop">
                            <el-input v-model.number="form.paddingTop"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="内边距(下)" prop="paddingBottom">
                            <el-input v-model.number="form.paddingBottom"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="内边距(左)" prop="paddingLeft">
                            <el-input v-model.number="form.paddingLeft"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="内边距(右)" prop="paddingRight">
                            <el-input v-model.number="form.paddingRight"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="行间距" prop="rowPadding">
                            <el-input v-model.number="form.rowPadding"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="列间距" prop="colPadding">
                            <el-input v-model.number="form.colPadding"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="模板圆角" prop="itemRadius">
                            <el-input v-model.number="form.itemRadius"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="间距" prop="textSpace">
                            <el-input v-model.number="form.textSpace"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col>
                        <el-form-item label="是否显示" prop="state">
                            <el-radio v-model="form.state" :label="1">是</el-radio>
                            <el-radio v-model="form.state" :label="0">否</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col>
                        <el-form-item label=" ">
                            <el-button v-show="_hasPermission('MODULE_DEL')" type="primary" @click="delCube">删除</el-button>
                            <el-button
                                type="primary"
                                @click="saveTemplate"
                                v-show="_hasPermission('MODULE_EDT')"
                                :loading="loading">保存</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="right">
            <div class="setting-title">
                <span class="title">单个魔方导航设置</span>
                <span class="tip">默认编辑全部模块，选中时编辑单个模块</span>
            </div>
            <div class="single-template">
                <el-form label-width="100px" :model="cellForm" :rules="cellRules">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="行占比" prop="rowspan">
                                <el-input
                                    @keyup.native="cellRowChange"
                                    :disabled="checkCell.displayNo === undefined"
                                    placeholder="行"
                                    v-model.number="cellForm.rowspan"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="列占比" prop="colspan">
                                <el-input
                                    @keyup.native="cellColChange"
                                    :disabled="checkCell.displayNo === undefined"
                                    placeholder="列"
                                    v-model.number="cellForm.colspan"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="布局">
                        <div class="cube-cell-wrap" :class="{ active: cellForm.layout === item }" @click="setCubeTable('layout', item)" v-for="(item, i) in cellClass" :key="i">
                            <cube-cell
                                bgColor="#fff"
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
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="图片宽度">
                                <el-input v-model.number="cellForm.imgW"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="图片高度">
                                <el-input v-model.number="cellForm.imgH"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
/**
 *  行数减少时，如果减少的行全部是一个格子，就删除整行(待完成)
 */
import _ from 'underscore'
import { shop } from '@/common/api.js'
import { checkNumber, checkCount } from '@/common/utils/validate.js'
import CubeCell from './cubeCell'
import { cellClass } from '@/common/state'
export default {
    name: 'CubeSetting',
    props: ['uid'],
    data() {
        return {
            cubeTable: [],
            loading: false,
            checkCell: {},
            currentLayout: '',
            cellData: [],

            flag: 'add',
            form: {
                colNumber: '',
                height: 0,
                displayNo: 0,
                colPadding: 0,
                itemRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                rowPadding: 0,
                showtitle: 0,
                state: 1,
                type: 'NAVIGATION',
                templateName: '',
                textSpace: 0,
                templateVOs: []
            },
            cellForm: {
                layout: 'cube-cell-one',
                colspan: 1,
                rowspan: 1,
                imgW: '',
                imgH: '',
            },
            cellClass: cellClass,
            rules: {
                templateName: [
                    { required: true, message: '模板名称不能为空', triggger: 'blur' }
                ],
                height: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ],
                colNumber: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ],
                colPadding: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                height: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ],
                itemRadius: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                marginTop: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                marginBottom: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                marginLeft: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                marginRight: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                paddingTop: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                paddingBottom: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                paddingLeft: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                paddingRight: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                rowPadding: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                textSpace: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ]
            },
            cellRules: {
                rowspan: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ],
                colspan: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        uid (newVal, oldVal) {
            if (newVal) {
                // 点击uid进行编辑
                this.fetchModule(newVal)
            }
        },
        'cellForm.imgW' (newVal, oldVal) {
            this.setCubeTable('imgW', newVal)
        },
        'cellForm.imgH' (newVal, oldVal) {
            this.setCubeTable('imgH', newVal)
        }
    },
    methods: {
        cellRowChange: _.debounce(function (e) {
            const oldVal = this.checkCell.rowspan
            const newVal = Number(e.target.value)
            // 当前选中的data在容器中起始位置的索引
            let cp = this.checkCell.cp
            let rp = this.checkCell.rp
            // 容器原始行数
            const oldRow = this.cubeTable.length
            // 容器列数
            const oldCol = this.form.colNumber
            if (newVal > 0) {
                // 判断行数是增加还是减少
                if (newVal > oldVal) {
                    // 行数增加
                    // 需要增加的行数
                    const plusRowNum = this.checkCell.rp + newVal - this.cubeTable.length
                    if (plusRowNum > 0) {
                        // 需要增加行数（默认单元格empty为空）
                        this.addTableRow(oldRow, oldCol, plusRowNum)
                        // 行数改变时需要重新设置单元格高度
                        this.resetCellH()
                        // 将跨行的单元格所占的格子empty属性置为false
                        for (let i = 0; i < this.checkCell.rowspan; i++) {
                            for (let j = 0; j < this.checkCell.colspan; j++) {
                                this.cubeTable[rp + i][cp + j].empty = false
                            }
                        }
                        // 根据容器中空白的格子数生成cellData
                        this.generateCell()
                        // 将剩余的空白的格子填满默认样式的单元格
                        this.fillEmptyCell()
                        /**
                         * 判断是否允许跨行
                         */
                        let flag = true
                        flag = (() => {
                            for (let i = 0; i < newVal - oldVal; i++) {
                                for (let j = 0; j < this.checkCell.colspan; j++) {
                                    let drp = rp + i + oldVal
                                    let dcp = cp + j
                                    const index = this.findCellDataIndex(drp, dcp, this.cellData)
                                    if (index < 0 || this.cellData[index].rowspan > 1 || this.cellData[index].colspan > 1) {
                                        return false
                                    }
                                }
                            }
                            return true
                        })()
                        if (flag) {
                            // 单元格高度
                            const height = this.getCellWH().h
                            // 将单元格的行数设置为填写的值
                            this.checkCell.rowspan = this.cellForm.rowspan
                            this.checkCell.height = height * this.checkCell.rowspan + '%'
                            // 跨行格子需要删除多行多列格子，根据rp=，cp=找到对应的数据删除
                            for (let i = 0; i < newVal - oldVal; i++) {
                                for (let j = 0; j < this.checkCell.colspan; j++) {
                                    let drp = rp + i + oldVal
                                    let dcp = cp + j
                                    const index = this.findCellDataIndex(drp, dcp, this.cellData)
                                    if (index > 0) {
                                        this.cellData.splice(index, 1)
                                    }
                                }
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: '只能占用1行1列的格子'
                            })
                            this.cellForm.rowspan = oldVal
                        }
                    } else {
                        // 行数够了，不需要在增加行数
                        console.log('row行数够了');
                        /**
                         * 判断是否允许跨行
                         */
                        let flag = true
                        flag = (() => {
                            for (let i = 0; i < newVal - oldVal; i++) {
                                for (let j = 0; j < this.checkCell.colspan; j++) {
                                    let drp = rp + i + oldVal
                                    let dcp = cp + j
                                    const index = this.findCellDataIndex(drp, dcp, this.cellData)
                                    if (index < 0 || this.cellData[index].rowspan > 1 || this.cellData[index].colspan > 1) {
                                        return false
                                    }
                                }
                            }
                            return true
                        })()
                        if (flag) {
                            const height = this.getCellWH().h
                            // 将单元格的行数设置为填写的值
                            this.checkCell.rowspan = this.cellForm.rowspan
                            this.checkCell.height = height * this.checkCell.rowspan + '%'
                            // 跨行格子需要删除多行多列格子，根据rp=，cp=找到对应的数据删除
                            for (let i = 0; i < newVal - oldVal; i++) {
                                for (let j = 0; j < this.checkCell.colspan; j++) {
                                    let drp = rp + i + oldVal
                                    let dcp = cp + j
                                    const index = this.findCellDataIndex(drp, dcp, this.cellData)
                                    if (index > 0) {
                                        this.cellData.splice(index, 1)
                                    }
                                }
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: '只能占用1行1列的格子'
                            })
                            this.cellForm.rowspan = oldVal
                        }
                    }
                } else {
                    // 行数减少(判断是否需要把多余的空行删掉)
                    console.log('行数减少');
                    if (newVal < 1) {
                        this.$message({
                            type: 'error',
                            message: '行数不能小于1'
                        })
                    } else {
                        // 减少的行数
                        const cutNum = oldVal - newVal
                        const height = this.getCellWH().h
                        this.checkCell.rowspan = this.cellForm.rowspan
                        this.checkCell.height = height * this.cellForm.rowspan + '%'
                        // 释放之前占用的格子
                        for (let i = 0; i < cutNum; i++) {
                            for (let j = 0; j < this.checkCell.colspan; j++) {
                                this.cubeTable[rp + this.checkCell.rowspan + i][cp + j].empty = true
                            }
                        }
                        // 根据容器中空白格子数，生成数据
                        this.generateCell()
                        // 将空白格子填满初始数据
                        this.fillEmptyCell()
                    }

                }
                // 重置cellData中index索引
                this.initCellIndex()
            } else {
                this.$message({
                    type: 'error',
                    message: '请输入大于的正整数'
                })
            }
        }, 500),
        cellColChange: _.debounce(function (e) {
            // 修改当前选中cell的列数时才处理，如果切换到其他单元格时则不处理
            const oldVal = this.checkCell.colspan
            const newVal = Number(e.target.value)

            if (newVal > 0) {
                // 获取当前data放在容器的行列起始索引
                let rp = this.checkCell.rp
                let cp = this.checkCell.cp
                if (newVal > oldVal) {
                    // 如果列数增加
                    if (this.form.colNumber < cp + this.cellForm.colspan) {
                        this.$message({
                            type: 'error',
                            message: '没有足够的列数'
                        })
                    } else {
                        // 当且仅当跨行的格子全部都在cellData中可以找到，并且rowspan，colspan都为1才能进行跨列操作
                        let flag = true
                        flag = (() => {
                            for (let i = 0; i < this.checkCell.rowspan; i++) {
                                for (let j = 0; j < newVal - oldVal; j++) {
                                    let drp = rp + i
                                    let dcp = cp + oldVal + j
                                    const index = this.findCellDataIndex(drp, dcp, this.cellData)
                                    if (index < 0 || this.cellData[index].rowspan > 1 || this.cellData[index].colspan > 1) {
                                        return false
                                    }
                                }
                            }
                            return true
                        })()

                        if (flag) {
                            console.log('ready to expand')
                            // 列数增加
                            const CW = this.getCellWH().w
                            this.checkCell.colspan = this.cellForm.colspan
                            this.checkCell.width = CW * this.checkCell.colspan + '%'
                            for (let i = 0; i < this.checkCell.rowspan; i++) {
                                for (let j = 0; j < newVal - oldVal; j++) {
                                    let drp = rp + i
                                    let dcp = cp + oldVal + j
                                    const index = this.findCellDataIndex(drp, dcp, this.cellData)
                                    if (index > 0) {
                                        this.cellData.splice(index, 1)
                                    }
                                }
                            }
                        } else {
                            this.cellForm.colspan = oldVal
                            this.$message({
                                type: 'error',
                                message: '只能占用1行1列的单元格'
                            })
                        }
                    }
                } else {
                    // 减少需要还原
                    if (newVal < 1) {
                        this.$message({
                            type: 'error',
                            message: '列数不能小于1'
                        })
                    } else {
                        const minusLength = oldVal - newVal
                        const CW = this.getCellWH().w
                        this.checkCell.colspan = this.cellForm.colspan
                        this.checkCell.width = CW * this.checkCell.colspan + '%'
                        // 将空余的格子empty属性置为空
                        for (let r = 0; r < this.checkCell.rowspan; r++) {
                            for (let i = 0; i < minusLength; i++) {
                                this.cubeTable[rp + r][cp + this.checkCell.colspan + i].empty = true
                            }
                        }
                        // 根据容器中空白格子数，生成数据
                        this.generateCell()
                        // 将空白格子填满初始数据
                        this.fillEmptyCell()
                    }
                }
                // 重置cellData中index索引
                this.initCellIndex()
            }
        }, 500),
        // 在cellData数据中根据cp，rp查找元素位置
        findCellDataIndex (rp, cp, arr) {
            const index = arr.findIndex(item => {
                return item.rp === rp && item.cp === cp
            })
            return index
        },
        // 容器添加行数
        addTableRow (oldRow, oldCol, plusNum) {
            for (let i = 0; i < plusNum; i++) {
                this.cubeTable.push([])
                for (let j = 0; j < oldCol; j++) {
                    this.cubeTable[oldRow + i].push({
                        empty: true
                    })
                }
            }
        },
        // 获取容器单元格宽度
        getCellWH () {
            if (this.cubeTable.length > 0) {
                return {
                    w: (100 / this.form.colNumber),
                    h: (100 / this.cubeTable.length)
                }
            }
        },
        // 初始化右侧单元格表单
        initCellForm () {
            this.cellForm.layout = 'cube-cell-one'
            this.cellForm.cellCol = 1
            this.cellForm.cellRow = 1
            this.cellForm.imgW = ''
            this.cellForm.imgH = ''
        },
        // 初始化选中单元格数据
        initCheckCell () {
            this.checkCell = {}
        },
        // 修复index属性值可能与实际元素在cellData中的位置不一致，手动调整index
        initCellIndex () {
            for (let i = 0; i < this.cellData.length; i++) {
                this.cellData[i].displayNo = i
            }
        },
        // 根据容器中空白格子数，生成数据
        generateCell () {
            const width = this.getCellWH().w
            const height = this.getCellWH().h
            for (let r = 0; r <this.cubeTable.length; r++) {
                for (let i = 0; i < this.cubeTable[r].length; i++) {
                    if (this.cubeTable[r][i].empty) {
                        this.cellData.push({
                            displayNo: i,
                            top: 0,
                            left: 0,
                            height: height + '%',
                            width: width + '%',
                            colspan: 1,
                            rowspan: 1,
                            layout: 'cube-cell-one',
                            imgW: 40,
                            imgH: 40,
                            showTitle: 1,
                            showSubtitle: 1,
                            image: []
                        })
                    }
                }
            }
        },
        // 将所有的空白格子填满初始化数据
        fillEmptyCell () {
            const width = this.getCellWH().w
            const height = this.getCellWH().h

            // 容器几行几列
            const tRow = this.cubeTable.length
            const rCol = this.form.colNumber

            let cp = 0
            let rp = 0
            for (let c = 0; c <this.cellData.length; c++) {
                // 判断这条数据是否已经放入到容器中
                while (rp < tRow && this.cellData[c].cp === undefined) {
                    if (this.cubeTable[rp][cp].empty) {
                        // 如果该容器是空的
                        this.cellData[c].top = rp * height + '%'
                        this.cellData[c].left = cp * width + '%'
                        this.cellData[c].width = width * this.cellData[c].colspan + '%'
                        this.cellData[c].height = height * this.cellData[c].rowspan + '%'
                        this.cellData[c].rp = rp
                        this.cellData[c].cp = cp
                        this.cubeTable[rp][cp].empty = false
                    }
                    if (cp >= rCol - 1) {
                        rp++
                        cp = 0
                    } else {
                        cp++
                    }
                }

            }
            // 对cellData数组进行排序
            this.bubbleSort()
            // 重置元素index属性值
            this.initCellIndex()
        },
        exchangIndex (i, j, arr) {
            let temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        },
        // 根据rp，cp对cellData进行排序
        bubbleSort () {
            for (var i = 0; i < this.cellData.length; i++) {
                for (var j = 0; j < this.cellData.length - i - 1; j++) {
                    if (this.cellData[j].rp > this.cellData[j + 1].rp) {
                        this.exchangIndex(j, j + 1, this.cellData)
                    } else if (this.cellData[j].rp === this.cellData[j + 1].rp) {
                        if (this.cellData[j].cp > this.cellData[j + 1].cp) {
                            this.exchangIndex(j, j + 1, this.cellData)
                        }
                    }
                }
            }
        },
        // 列数、改变需要重新改变cellTable
        colsChange: _.debounce(function (e) {
            const colNum = Number(e.target.value)
            // 根据列数和行高生成放置单元格的布局
            this.resetModule(colNum)
            const width = this.getCellWH().w
            // 生成对应数量的单元格
            this.generateCell()
            // 初始化指针指向二位表格（0,0）位置
            this.fillEmptyCell()
        }, 500),
        // 点击单个单元格进行编辑
        cellEdit (data) {
            this.checkCell = data
            this.cellForm.rowspan = data.rowspan
            this.cellForm.colspan = data.colspan
            this.cellForm.layout = data.layout
            this.cellForm.imgW = data.imgW
            this.cellForm.imgH = data.imgH
        },
        // 设置编辑单元格方法
        setCubeTable (key, value) {
            if (key === 'layout') {
                // 如果选中的是单元格布局
                this.cellForm.layout = value
            }
            if (this.checkCell.displayNo !== undefined) {
                // 如果有选中的单个单元格，该变这一个格子的样式
                this.cellData[this.checkCell.displayNo][key] = value
            } else {
                // 该变所有单元格样式
                for (let row of this.cellData) {
                    row[key] = value
                }
            }
        },
        // 列数改变时需要重置表单
        resetModule (colNum) {
            this.cubeTable = []
            this.cellData = []
            this.initCellForm()
            this.initCheckCell()
            this.cubeTable.push([])
            for (let i = 0; i < colNum; i++) {
                this.cubeTable[0].push({
                    empty: true
                })
            }
        },
        // 行数改变时，重新设置单元格格子的高度，top值
        resetCellH () {
            const height = this.getCellWH().h
            for (let cell of this.cellData) {
                cell.height = cell.rowspan * height + '%'
                cell.top = cell.rp * height + '%'
            }
        },
        // 初始化表单
        initForm () {
            this.form = {
                colNumber: '',
                height: 0,
                displayNo: 0,
                colPadding: 0,
                itemRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                rowPadding: 0,
                showtitle: 0,
                state: 1,
                type: 'NAVIGATION',
                templateName: '',
                textSpace: 0,
                templateVOs: []
            }
        },
        delCube () {
            // 删除
            this.$axios.post(shop.deleteTemplate, {
                state: 0,
                uid: this.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.$emit('eventDel')
                    this.initForm()
                }
            })
        },
        addCube () {
            // 重置表单数据
            this.resetModule(0)
            this.initForm()
            this.$emit('eventAdd')
        },
        saveTemplate () {
            // 根据col、row动态生成表格
            this.form.templateVOs = []
            for (let cell of this.cellData) {
                this.form.templateVOs.push({
                    cols: cell.colspan,
                    imageHeight: cell.imgH,
                    imageWidth: cell.imgW,
                    rows: cell.rowspan,
                    textAlign: cell.layout,
                    displayNo: cell.displayNo + 1,
                    uid: cell.uid,
                })
            }
            this.$refs['cubeForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$axios.post(shop.saveTemplate, this.form).then(res => {
                        this.loading = false
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            })
                            this.$emit('event-success', true)
                            // 清空当前数据
                            this.addCube()
                        }
                    }).catch(err => {
                        this.loading = false
                    })
                }
            })
        },
        // 如果存在uid，获取模板属性
        fetchModule (uid) {
            this.$axios.post(shop.getTemplate, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.form = res.data.data
                    this.fetchModuleItem(uid)
                }
            })
        },
        fetchModuleItem (uid) {
            this.$axios.post(shop.listTemplateItem, {uid: uid}).then(res => {
                if (res.data.state) {
                    // 重置表单
                    this.resetModule(this.form.colNumber)
                    const data = res.data.data
                    for (var i = 0; i < data.length; i++) {
                        this.cellData.push({
                            displayNo: i,
                            top: 0,
                            left: 0,
                            height: '',
                            width: '',
                            colspan: data[i].cols,
                            rowspan: data[i].rows,
                            layout: data[i].textAlign,
                            imgW: data[i].imageWidth,
                            imgH: data[i].imageHeight,
                            uid: data[i].uid,
                            showTitle: data[i].showTitle,
                            showSubtitle: data[i].showSubtitle,
                            image: []
                        })
                    }
                    // 将数据放入容器中
                    this.dropCellinTable()
                    // 重新设置每个单元格的height
                    this.resetCellH()
                }
            })
        },
        // 将数据逐个放入到容器中
        dropCellinTable () {
            // 容器的列数、行数
            var cols = this.form.colNumber
            // 单元格的width, height
            var width = this.getCellWH().w
            var height = this.getCellWH().h
            // 初始化指针
            var rp = 0
            var cp = 0
            for (let i = 0; i < this.cellData.length; i++) {
                // 判断容器行数够不够
                if (this.cubeTable.length < rp + 1) {
                    let rows = this.cubeTable.length
                    let plusRowNum = rp + this.cellData[i].rowspan - rows
                    this.addTableRow(rows, cols, plusRowNum)
                }
                // 寻找下一个空的容器格子
                while(!this.cubeTable[rp][cp].empty) {
                    cp++
                    if (cp > cols - 1) {
                        rp++
                        cp = 0
                    }
                }
                if (this.cubeTable[rp][cp].empty) {
                    // 获取容器的行数
                    let rows = this.cubeTable.length
                    // 需要增加的容器的行数
                    let plusRowNum = rp + this.cellData[i].rowspan - rows
                    if (plusRowNum > 0) {
                        // 容器行数不够，需要增加行数
                        this.addTableRow(rows, cols, plusRowNum)
                    }
                    // 将该cell所需占用的容器格子empty置为false
                    for (let r = 0; r < this.cellData[i].rowspan; r++) {
                        for (let c = 0; c < this.cellData[i].colspan; c++) {
                            this.cubeTable[rp + r][cp + c].empty = false
                        }
                    }
                    // 设置需要放置的位置
                    this.cellData[i].top = height * rp + '%'
                    this.cellData[i].left = width * cp + '%'
                    this.cellData[i].width = width * this.cellData[i].colspan + '%'
                    this.cellData[i].height = height * this.cellData[i].rowspan + '%'
                    this.cellData[i].cp = cp
                    this.cellData[i].rp = rp
                    cp += this.cellData[i].colspan
                    if (cp > cols - 1) {
                        rp++
                        cp = 0
                    }
                }
            }
        },
    },
    components: {
        CubeCell
    }
}
</script>

<style scoped lang="less">
@import "../../../../../../static/css/cube-table.css";
.cube-setting{
    height: 100%;
    .left{
        float: left;
        padding: 10px;
        height: 100%;
        width: 60%;
        overflow-x: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        background-color: #f9f9f9;
    }
    .right{
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        padding: 10px;
        background-color: #f3f3f3;
    }
}
.setting-title{
    margin: 10px;
}
.title{
    font-size: 16px;
}
.tip{
    color: red;
}
.single-template{
    margin: 10px;
}
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
</style>
