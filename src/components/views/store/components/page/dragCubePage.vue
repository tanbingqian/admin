<template>
    <div class="cube-template"
        :style="{
            paddingTop: calculatePX(form.paddingTop) + 'px',
            paddingBottom: calculatePX(form.paddingBottom) + 'px',
            paddingLeft: calculatePX(form.paddingLeft) + 'px',
            paddingRight: calculatePX(form.paddingRight) + 'px',
            backgroundColor: form.background
        }">
        <div class="cube-title-wrap" v-show="form.showTitle === 1">
            <div class="module-title">{{ form.title }}</div>
            <div class="see-more">更多></div>
        </div>
        <!-- 根据列数、行高动态生成格子 -->
        <div class="cube-table" >
            <div class="cube-row" :style="{ height: calculatePX(form.height) + 'px' }" v-for="(row, rI) in cubeTable" :key="rI">
                <div class="cube-col"
                    :style="{
                        width: (100 / row.length) + '%',
                    }"
                    v-for="(col, cI) in row" :key="JSON.stringify(col) + cI"
                >
                </div>
            </div>
            <!-- 绝对定位放置每个单元格 -->
            <div v-for="(data) in cellData" :key="JSON.stringify(data)"
                class="cell-wrap"
                :style="{
                    top: data.top,
                    left: data.left,
                    width: data.width,
                    height: data.height,
                    position: 'absolute',
                }">
                <cube-cell
                    :cellForm="data"
                    :bgColor="data.background"
                    @cellEdit="cellEdit"
                    :imgMargin="form.textSpace"
                    :borderRadius="form.itemRadius"
                    :rowPadding="form.rowPadding"
                    :colPadding="form.colPadding"
                    :show="true">
                </cube-cell>
            </div>
        </div>
    </div>
</template>

<script>
import CubeCell from '../module/cubeCell'
import { eventHub } from '@/common/share/eventHub'
import { shop } from '@/common/api'
export default {
    name: 'DragCubePage',
    props: {
        form: {
            type: Object,
            required: true
        },
        checkCell: {
            type: Object
        },
        pageUid: {
            type: String
        }
    },
    created () {
        // 监听列数改变
        eventHub.$on('cellColChange', this.cellColChange)
        // 监听行数改变
        eventHub.$on('cellRowChange', this.cellRowChange)
        // 监听保存修改单元格
        eventHub.$on('updateCell', this.updateCell)
        // 监听添加行
        eventHub.$on('addRow', this.eventAddRow)
        // 监听删除行
        eventHub.$on('minusRow', this.eventMinusRow)
        // 监听添加列
        eventHub.$on('addCol', this.eventAddCol)
        // 监听删除列
        eventHub.$on('minusCol', this.eventMinusCol)
        // 监听获取行列数据
        eventHub.$on('getTableRowCol', this.getTableRowCol)
    },
    data () {
        return {
            cubeTable: [],
            cellData: [],
        }
    },
    watch: {
        form (newVal, oldVal) {
            this.cellData = []
            this.cubeTable = []
            this.initCubeTable(this.form.colNumber)
            this.generateCellData()
            // 将数据放入容器中
            this.dropCellinTable()
            // 重新设置单元格高度
            this.resetCellH()
        }
    },
    mounted () {
        this.initCubeTable(this.form.colNumber)
        this.generateCellData()
        // 将数据放入容器中
        this.dropCellinTable()
        // 重新设置单元格高度
        this.resetCellH()
    },
    methods: {
        // 添加行列，提交到后端
        submitCellData () {
            let list = []
            for (let cell of this.cellData) {
                list.push({
                    background: cell.background,
                    backgroundType: cell.backgroundType,
                    blockUid: cell.blockUid,
                    cols: cell.colspan,
                    displayNo: cell.displayNo,
                    fontAlign: cell.fontAlign,
                    imageHeight: cell.imgH,
                    imageUrl: cell.imageUrl,
                    imageWidth: cell.imgW,
                    linkTarget: cell.linkTarget,
                    linkType: cell.linkType,
                    linkUrl: cell.linkUrl,
                    rows: cell.rowspan,
                    showSubtitle: cell.showSubtitle,
                    showTitle: cell.showTitle,
                    subTitle: cell.subTitle,
                    subTitleColor: cell.subTitleColor,
                    subTitleFontSize: cell.subTitleFontSize,
                    subTitleRows: cell.subTitleRows,
                    textAlign: cell.layout,
                    title: cell.title,
                    titleColor: cell.titleColor,
                    titleFontSize: cell.titleFontSize,
                    titleRows: cell.titleRows,
                    titleSpace: cell.titleSpace,
                    uid: cell.uid,
                    image: cell.image
                })
            }
            this.$axios.post(shop.addPageBlockItemSlave, {
                blockUid: this.form.uid,
                pageUid: this.pageUid,
                list: list,
                colNumber: this.cubeTable[0].length
            }).then(res => {
                eventHub.$emit('reloadComponent', true)
                eventHub.$emit('refreshData')
                if (res.data.state) {
                    this.submitRowCol()
                }
            })
        },
        // 添加一行
        eventAddRow (obj) {
            if (obj.blockUid !== this.form.uid) {
                return
            }
            this.addTableRow(this.cubeTable.length, this.cubeTable[0].length, 1)
            this.generateEmptyCell()
            this.fillEmptyCell()
            this.resetCellH()
            // 保存到服务端
            this.submitCellData()
        },
        // 减少一行(删除最后一行)
        eventMinusRow (obj) {
            if (obj.blockUid !== this.form.uid) {
                return
            }
            if (this.cubeTable.length <= 1) {
                this.$message({
                    type: 'error',
                    message: '最少保留一行数据'
                })
                return
            }
            // 最后一行横坐标
            const rp = this.cubeTable.length - 1
            this.cubeTable.splice(this.cubeTable.length - 1, 1)
            for (let i = 0; i < this.cubeTable[0].length; i++) {
                let index = this.findCellDataIndex(rp, i, this.cellData)
                if (index > -1) {
                    // 如果在cellData中能找到，直接删除该数据
                    this.cellData.splice(index, 1)
                } else {
                    // 如果cellData中找不到，就向上查找最近的一个跨多行的，将其rowspan减1
                    for (let r = rp - 1; r > -1; r--) {
                        let rI = this.findCellDataIndex(r, i, this.cellData)
                        if (rI > -1 && this.cellData[rI].rowspan > 1 && this.cellData[rI].rowspan + this.cellData[rI].rp === rp + 1) {
                            // 找到跨行的单元格将其rowspan减1
                            this.cellData[rI].rowspan--
                            break
                        }
                    }
                }
            }
            // 重新设置高度
            this.resetCellH()
            // 重新设置displayNo
            this.initCellIndex()
            // 保存到服务端
            this.submitCellData()
        },
        // 添加一列
        eventAddCol (obj) {
            if (obj.blockUid !== this.form.uid) {
                return
            }
            this.addTableCol(1)
            this.generateEmptyCell()
            this.fillEmptyCell()
            // 重置表格宽度
            this.resetCellW()
            // 保存到服务端
            this.submitCellData()
        },
        // 减少一列(删除最后一列)
        eventMinusCol (obj) {
            if (obj.blockUid !== this.form.uid) {
                return
            }
            if (this.cubeTable[0].length <= 1) {
                this.$message({
                    type: 'error',
                    message: '至少保留一列数据'
                })
                return
            }
            const cp = this.cubeTable[0].length - 1
            // 删除容器最后一列
            for (let i = 0; i < this.cubeTable.length; i++) {
                this.cubeTable[i].splice(cp, 1)
            }
            for (let i = 0; i < this.cubeTable.length; i++) {
                let index = this.findCellDataIndex(i, cp, this.cellData)
                if (index > -1) {
                    // 如果找到了，删除该元素
                    this.cellData.splice(index, 1)
                } else {
                    // 如果cellData中找不到，就向左查找最近的一个跨多列的，将其colspan减1
                    for (let c = cp - 1; c > -1; c++) {
                        let cI = this.findCellDataIndex(i, c, this.cellData)
                        if (cI > -1 && this.cellData[cI].colspan > 1 && this.cellData[cI].colspan + this.cellData[cI].cp === cp + 1) {
                            // 找到跨列的单元格将其colspan减1
                            this.cellData[cI].colspan--
                            break
                        }
                    }
                }
            }
            // 重置表格宽度
            this.resetCellW()
            // 重新设置displayNo
            this.initCellIndex()
            // 保存到服务端
            this.submitCellData()
        },
        // 保存修改后的数据
        updateCell (obj) {
            if (obj.blockUid !== this.form.uid) {
                return
            }
            let list = []
            for (let cell of this.cellData) {
                list.push(Object.assign({
                    rows: cell.rowspan,
                    cols: cell.colspan,
                    textAlign: cell.layout,
                    imageWidth: cell.imgW,
                    imageHeight: cell.imgH
                }, cell))
            }
            this.$axios.post(shop.updateSinglePageBlockItemSlave, {
                blockUid: this.form.uid,
                list: list,
                pageUid: this.pageUid,
                colNumber: this.form.colNumber
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                    eventHub.$emit('reloadComponent')
                    eventHub.$emit('updateCellSuccess')
                }
            })
        },
        // 在cellData数据中根据cp，rp查找元素位置
        findCellDataIndex (rp, cp, arr) {
            const index = arr.findIndex(item => {
                return item.rp === rp && item.cp === cp
            })
            return index
        },
        // 根据容器中空白格子数，生成数据
        generateEmptyCell () {
            const width = this.getCellWH().w
            const height = this.getCellWH().h
            for (let r = 0; r <this.cubeTable.length; r++) {
                for (let i = 0; i < this.cubeTable[r].length; i++) {
                    if (this.cubeTable[r][i].empty) {
                        this.cellData.push({
                            displayNo: i,
                            top: 0,
                            left: 0,
                            height: '',
                            width: '',
                            colspan: 1,
                            rowspan: 1,
                            layout: 'cube-cell-one',
                            imgW: 20,
                            imgH: 20,
                            uid: 0,
                            fontAlign: 'left',
                            blockUid: this.form.uid,
                            titleSpace: 0,
                            title: '',
                            showTitle: 1,
                            titleFontSize: 12,
                            titleRows: 1,
                            subTitle: '',
                            showSubtitle: 1,
                            subTitleFontSize: 12,
                            subTitleRows: 1,
                            linkType: '',
                            linkUrl: '',
                            background: '',
                            subTitleColor: '',
                            titleColor: '',
                            image: [] // 图片数组
                        })
                    }
                }
            }
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
        // 将所有的空白格子填满初始化数据
        fillEmptyCell () {
            const width = this.getCellWH().w
            const height = this.getCellWH().h

            // 容器几行几列
            const tRow = this.cubeTable.length
            const rCol = this.cubeTable[0].length

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
        // 单个cell跨行
        cellRowChange (obj) {
            if (obj.blockUid !== this.form.uid) {
                return
            }
            const oldVal = Number(obj.oldVal)
            const newVal = Number(obj.newVal)
            // 当前选中的data在容器中起始位置的索引
            let cp = this.checkCell.cp
            let rp = this.checkCell.rp
            // 容器原始行数
            const oldRow = this.cubeTable.length
            // 容器列数
            const oldCol = this.cubeTable[0].length
            if (newVal > oldVal) {
                // 行数增加
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
                    this.generateEmptyCell()
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
                        this.checkCell.rowspan = newVal
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
                        this.checkCell.rowspan = newVal
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
                    this.checkCell.rowspan = newVal
                    this.checkCell.height = height * this.checkCell.rowspan + '%'
                    // 释放之前占用的格子
                    for (let i = 0; i < cutNum; i++) {
                        for (let j = 0; j < this.checkCell.colspan; j++) {
                            this.cubeTable[rp + this.checkCell.rowspan + i][cp + j].empty = true
                        }
                    }
                    // 根据容器中空白格子数，生成数据
                    this.generateEmptyCell()
                    // 将空白格子填满初始数据
                    this.fillEmptyCell()
                }
            }
        },
        // 单个cell跨列
        cellColChange (obj) {
            if (obj.blockUid !== this.form.uid) {
                return
            }
            const newVal = Number(obj.newVal)
            const oldVal = obj.oldVal
            // cell在容器索引
            let rp = this.checkCell.rp
            let cp = this.checkCell.cp
            if (newVal > oldVal) {
                // 列数增加
                if (cp + newVal > this.cubeTable[0].length) {
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
                        this.checkCell.colspan = newVal
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
                    this.checkCell.colspan = Number(newVal)
                    this.checkCell.width = CW * this.checkCell.colspan + '%'
                    // 将空余的格子empty属性置为空
                    for (let r = 0; r < this.checkCell.rowspan; r++) {
                        for (let i = 0; i < minusLength; i++) {
                            this.cubeTable[rp + r][cp + this.checkCell.colspan + i].empty = true
                        }
                    }
                    // 根据容器中空白格子数，生成数据
                    this.generateEmptyCell()
                    // 将空白格子填满初始数据
                    this.fillEmptyCell()
                }
            }
        },
        // 生成表格
        generateCellData () {
            const data = this.form.listitem
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
                    fontAlign: data[i].fontAlign,
                    blockUid: data[i].blockUid,
                    titleSpace: data[i].titleSpace,
                    title: data[i].title,
                    showTitle: data[i].showTitle,
                    titleFontSize: data[i].titleFontSize,
                    titleRows: data[i].titleRows,
                    subTitle: data[i].subTitle,
                    showSubtitle: data[i].showSubtitle,
                    subTitleFontSize: data[i].subTitleFontSize,
                    subTitleRows: data[i].subTitleRows,
                    linkType: data[i].linkType,
                    linkUrl: data[i].linkUrl,
                    background: data[i].background,
                    subTitleColor: data[i].subTitleColor,
                    titleColor: data[i].subTitleColor,
                    image: data[i].image
                })
            }
        },
        // 监听单机单个cell编辑
        cellEdit (obj) {
            this.$emit('cellEdit', obj)
        },
        // 初始化容器
        initCubeTable (colNum) {
            this.cubeTable.push([])
            for (let i = 0; i < colNum; i++) {
                this.cubeTable[0].push({
                    empty: true
                })
            }
        },
        // 获取容器单元格宽度
        getCellWH () {
            if (this.cubeTable.length > 0) {
                return {
                    w: (100 / this.cubeTable[0].length),
                    h: (100 / this.cubeTable.length)
                }
            }
        },
        // 列数改变时，重新设置单元格格子的宽度
        resetCellW () {
            // 列数
            const width = this.getCellWH().w
            for (let cell of this.cellData) {
                cell.width = cell.colspan * width + '%'
                cell.left = cell.cp * width + '%'
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
        // 容器增加列数
        addTableCol (plusNum) {
            for (let i = 0; i < this.cubeTable.length; i++) {
                this.cubeTable[i].push({
                    empty: true
                })
            }
        },
        // 修复index属性值可能与实际元素在cellData中的位置不一致，手动调整index
        initCellIndex () {
            for (let i = 0; i < this.cellData.length; i++) {
                this.cellData[i].displayNo = i
            }
        },
        // 将数据逐个放入到容器中
        dropCellinTable () {
            // 容器的列数、行数
            var cols = this.cubeTable[0].length
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
        // 获取当前table的行列
        getTableRowCol (uid) {
            if (uid === this.form.uid) {
                console.log('获取table的行列')
                this.submitRowCol()
            }
        },
        // 提交行列数据
        submitRowCol () {
            this.$store.commit('tableRowChange', this.cubeTable.length)
            this.$store.commit('tableColChange', this.cubeTable[0].length)
        }
    },
    beforeDestroy () {
        eventHub.$off('cellColChange')
        eventHub.$off('cellRowChange')
        eventHub.$off('updateCell')
        eventHub.$off('addRow')
        eventHub.$off('minusRow')
        eventHub.$off('addCol')
        eventHub.$off('minusCol')
        eventHub.$off('getTableRowCol')
    },
    components: {
        CubeCell
    }
}
</script>

<style lang="less" scoped>
@import '../../../../../../static/css/cube-table.css';
</style>


