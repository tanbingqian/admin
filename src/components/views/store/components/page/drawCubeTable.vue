<template>
    <div class="cube-template"
        :style="{
            paddingTop: form.paddingVer + 'px',
            paddingBottom: form.paddingVer + 'px',
            paddingLeft: form.paddingHor + 'px',
            paddingRight: form.paddingHor + 'px',
            height: '180px'
        }">
        <!-- 根据列数、行高动态生成格子 -->
        <div class="cube-table" >
            <div class="cube-row" v-for="(row, rI) in cubeTable" :key="rI">
                <div class="cube-col"
                    :style="{
                        width: (100 / row.length) + '%'
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
                    :cellForm="{
                        colspan: data.colspan,
                        rowspan: data.rowspan,
                        imgW: '30',
                        imgH: '30',
                        layout: data.layout,
                        showTitle: 1,
                        showSubtitle: 1,
                        image: []
                    }"
                    bgColor="#fff"
                    :imgMargin="form.textSpace"
                    :borderRadius="form.itemRadius"
                    :rowPadding="form.rowPadding"
                    :colPadding="form.colPadding"
                    :show="false">
                </cube-cell>
            </div>
        </div>
    </div>
</template>

<script>
import CubeCell from '../module/cubeCell'
export default {
    name: 'DrawCubeTable',
    props: {
        form: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            cubeTable: [],
            cellData: [],
        }
    },
    mounted () {
        this.initCubeTable(this.form.colNumber)
        const data = this.form.templateVOs
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
                image: []
            })
        }
        // 将数据放入容器中
        this.dropCellinTable()
        // 重新设置单元格高度
        this.resetCellH()
    },
    methods: {
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
                    w: (100 / this.form.colNumber),
                    h: (100 / this.cubeTable.length)
                }
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

<style lang="less" scoped>
@import '../../../../../../static/css/cube-table.css';
</style>


