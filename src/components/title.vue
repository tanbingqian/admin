<template>
    <div class="page-wrap">
        <table border="1">
            <tr v-for="(row, rI) in arr" :key="rI">
                <td v-for="(col, cI) in row" :key="cI" :rowspan="col.rowspan" :colspan="col.colspan" @click="checkCell(rI, cI)">
                    {{ rI  + '--' + cI }}
                </td>
            </tr>
        </table>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            arr: [
                [
                    {
                        rowspan: 2,
                        colspan: 2,
                        hidden: false
                    },
                    {
                        rowspan: 1,
                        colspan: 1,
                        hidden: false
                    },
                    {
                        rowspan: 1,
                        colspan: 1,
                        hidden: false
                    }
                ],
                [
                    {
                        rowspan: 1,
                        colspan: 1,
                        hidden: false
                    },
                    {
                        rowspan: 1,
                        colspan: 1,
                        hidden: false
                    },
                    {
                        rowspan: 1,
                        colspan: 1,
                        hidden: false
                    }
                ],
                [
                    {
                        rowspan: 1,
                        colspan: 1,
                        hidden: false
                    },
                    {
                        rowspan: 1,
                        colspan: 1,
                        hidden: false
                    },
                    {
                        rowspan: 1,
                        colspan: 1,
                        hidden: false
                    }
                ]
            ]
        }
    },
    methods: {
        checkCell (rI, cI) {

        }
    },
    components: {

    }
}
</script>

<style scoped lang="less">
.table-wrap{
    display: block;
    tr{
        width: 100%;
    }
}
</style>

