<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="list-page">
            <!-- 字体列表 -->
            <el-row class="my-row" v-show="_hasPermission('FONT_ADD')">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">添加字体</el-button>
            </el-row>
            <div class="table-wrap" v-loading="loading" :element-loading-text="$t('loadingText')">
                <el-table class="pd-lg" :data="tableData">
                    <el-table-column label="序号" prop="id" align="center"></el-table-column>
                    <el-table-column label="效果预览" prop="name" align="center"></el-table-column>
                    <el-table-column label="字体名称" prop="name" align="center"></el-table-column>
                    <el-table-column label="状态" prop="status" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" v-show="_hasPermission('FONT_STATE')">停用</el-button>
                            <el-button type="text" @click="delFont(scope.row.id)" v-show="_hasPermission('FONT_DEL')">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加字体弹框 -->
            <el-dialog :visible.sync="showDialog" title="添加字体" width="30%">
                <el-row style="text-align: center;">
                    <el-upload
                        class="upload-demo"
                        drag
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">请上传字体文件</div>
                    </el-upload>
                </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showDialog = false">取 消</el-button>
                    <el-button type="primary" @click="showDialog = false">保 存</el-button>
                </span>
            </el-dialog>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'FontLsit',
    props: ['lang'],
    created () {
        setTimeout(() => {
            this.loading = false
        }, 2000)
    },
    data () {
        return {
            loading: true,
            showDialog: false,
            tableData: [
                {
                    id: 1,
                    name: '雅黑',
                    status: '启用'
                },
                {
                    id: 1,
                    name: '雅黑',
                    status: '启用'
                },
                {
                    id: 1,
                    name: '雅黑',
                    status: '启用'
                }
            ]
        }
    },
    methods: {
        delFont (id) {
            this.$confirm('确定删除该字体吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message('删除成功')
            }).catch(() => {
                this.$message('已取消删除')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.my-row{
    padding: 20px;
    text-align: center;
}
</style>

