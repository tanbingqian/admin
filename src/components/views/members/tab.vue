<template>
    <div>
        <el-date-picker v-model="value1" type="date" placeholder="选择日期"></el-date-picker>

        <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    name: "tab",
    data() {
        return {
            value1: "",
            dialogImageUrl: "",
            dialogVisible: false
        };
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        }
    }
};
</script>

<style scoped>
.icon {
    font-size: 18px;
}
.productTable {
    width: 100%;
    border: 1px solid #ccc;
    border-bottom: none;
}
.productTable th {
    border-bottom: 1px solid #ccc;
    background-color: #f6f6f6;
    height: 30px;
}
.productTable td {
    border-right: 1px solid #ccc;
    text-align: center;
    height: 35px;
    border-bottom: 1px solid #ccc;
}
</style>
