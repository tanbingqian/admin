<template>
    <div class="pager-wrap" :style="styles">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="sizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        sizes: {
            type: Array,
            default: function () {
                return [10, 15, 20, 30]
            }
        },
        styles: {
            type: Object,
            default: function () {
                return null
            }
        },
        pageSize: {
            type: Number,
            default: 50
        },
        currentPage: {
            type: Number,
            default: 1
        },
        total: {
            type: Number,
            default: 0
        },
        layout: {
            type: String,
            default: 'prev, pager, next'
        }
    },
    name: 'Pager',
    data () {
        return {
        }
    },
    methods: {
        handleSizeChange (val) {
            // console.log(val)
            this.$emit('getCurrentSize', val)
        },
        handleCurrentChange (val) {
            // console.log(val)
            this.$emit('getCurrentPage', val)
        }
    }
}
</script>

