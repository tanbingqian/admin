<template>
    <div class="cube-cell-container"
        :style="{
            
            paddingBottom: calculatePX(rowPadding) + 'px',
            paddingRight: calculatePX(colPadding) + 'px',
        }">
        <div class="content" :class="cellForm.layout" :style="{ borderRadius: borderRadius + 'px', backgroundColor: bgColor ? bgColor : '#fff', }">
            <div
                class="img-container"
                :style="{
                    marginBottom: calculatePX(imgMargin) + 'px'
                }">
                <img v-if="cellForm.image.length > 0 && cellForm.image[0] !== ''"
                    :width="cellForm.imgW ? calculatePX(cellForm.imgW) : '100%'"
                    :height="cellForm.imgH ? calculatePX(cellForm.imgH) : '100%'"

                    class="cell-img"
                    :src="_fileHost.SHOP_IMAGE + (cellForm.image[0].storageFile || cellForm.image[0])">
                <img v-else
                    :width="cellForm.imgW ? calculatePX(cellForm.imgW) : '100%'"
                    :height="cellForm.imgH ? calculatePX(cellForm.imgH) : '100%'"

                    class="cell-img"
                    src="../../../../../assets/imgs/cell-img.png">
            </div>
            <div class="cell-title-wrap" :style="{ lineHeight: cellForm.lineHeight + 'px' }">
                <p
                    v-if="cellForm.showTitle === 1"
                    :style="{
                        color: cellForm.titleColor,
                        fontSize: calculatePX(cellForm.titleFontSize) + 'px',
                        marginBottom: calculatePX(cellForm.titleSpace) + 'px',
                        textAlign: cellForm.fontAlign
                    }">{{ cellForm.title ? cellForm.title : '标题'  }}</p>
                <p
                    v-if="cellForm.showSubtitle === 1"
                    :style="{
                        color: cellForm.subTitleColor,
                        textAlign: cellForm.fontAlign,
                        fontSize: calculatePX(cellForm.subTitleFontSize) + 'px' }"
                    class="sub-title">{{ cellForm.subTitle ? cellForm.subTitle : '副标题' }}</p>
            </div>
            <!-- 编辑 -->
            <div class="edit" v-if="show">
                <el-button type="primary" icon="el-icon-edit" circle @click="cellClick(cellForm)"></el-button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { eventHub } from '@/common/share/eventHub'
export default {
    name: 'CubeCell',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        cellForm: {
            type: Object
        },
        imgMargin: {
            type: Number,
            default: 0
        },
        borderRadius: {
            type: Number,
            default: 0
        },
        bgColor: {
            type: String
        },
        rowPadding: {
            type: Number,
            default: 0
        },
        colPadding: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {

        }
    },
    methods: {
        // 单击编辑一个单元格
        cellClick (data) {
            // this.$emit('cellEdit', data)
            eventHub.$emit('cellEdit', data)
        },
    }
}
</script>

<style lang="less">
@import "../../../../../../static/css/cube-cell.css";

</style>
