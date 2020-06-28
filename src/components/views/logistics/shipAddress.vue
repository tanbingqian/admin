<template>
    <div class="page-wrap">
        <!--发货地址-->
        <div class="tit">
            <div class="tit-text">
                发货地址
                <el-button type="text" class="add-item" @click="addressNew">+添加新地址</el-button>
            </div>
             <!--发货地址列表-->
             <el-table :data="data" class="listtake">
                <el-table-column prop="name" label="仓库名称" width="180"></el-table-column>
                <el-table-column prop="telephone" label="联系电话" width="180"></el-table-column>
                <el-table-column prop="address" label="发货地址"></el-table-column>
                <el-table-column prop="operation" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editAddress(scope.row)">编辑</el-button>
                        <el-button type="text" @click="deleteAddres(scope.row.uid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <!--添加新地址-->
        <el-dialog :visible.sync="addressNewForm" :title="addressNewTitle" width="40%">
            <el-form ref="addExpressForm" :rules="addressNewRules" :model="form" label-width="120px">
                <div class="flex">
                    <el-form-item label="仓库名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="telephone">
                        <el-input v-model="form.telephone"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="发货地址" prop="address">
                    <el-input v-model="form.address" style="width:81%;"></el-input>
                </el-form-item>
                 <el-form-item label="默认快递" prop="expressUid">
                    <el-select placeholder="请选择快递类型" v-model="form.expressUid" @change="selectchange">
                    <el-option
                        v-for="druges in drugs"
                        :key="druges.expressCode"
                        :label="druges.expressName"
                        :value="druges.expressUid"
                    ></el-option>
                </el-select>
                </el-form-item>
              
                <el-form-item label=" ">
                    <el-button
                        type="primary"
                        size="small"
                        @click="addressNewForm=false"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button
                        type="primary"
                        size="small"
                        :loading="saveLoading"
                        @click="saveAddressNew"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { order }from '@/common/api.js'
import _ from 'underscore'
export default {
    name: "shipAddress",
    created () {
        this.selectchange([0])
        this.fetchData()
    },
    data() {
        return {
            data: [],
            drugs: [],
            saveLoading: false,
            addressNewForm:false,
            addressNewTitle:'添加新地址',
            siteUid:'',
            form: {
                name: "",
                telephone: "",
                address:'',
                expressUid:'',
                isAddOrUpdate:'0'
            },
            flag: "",
            flagedit:'',
            addressNewRules: {
                name: [
                    {
                        required: true,
                        message: "仓库名称不能为空",
                        trigger: "blur"
                    }
                ],
                telephone: [
                    {
                        required: true,
                        message: "联系电话不能为空",
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "发货地址不能为空",
                        trigger: "blur"
                    }
                ]
            },
        };
    },
    methods: {
       //新增地址
        addressNew(){
            this.form={
                name: "",
                telephone: "",
                address:'',
                expressUid:'',
                isAddOrUpdate:'0'
            },
            this.flag = 'addressNew'
            this.addressNewForm=true
        },
        //编辑地址
        editAddress(row){
            this.form = row
            this.form.isAddOrUpdate = 1;
            this.addressNewTitle = '编辑地址',
            this.flagedit="editAddress"
            this.addressNewForm = true
        },
        //快递列表
        selectchange: function() {
            this.$axios.post(order.listExpress).then(res => {
                    this.drugs=res.data.data
            });
        },
        //显示地址数据
        fetchData () {
            this.$axios.post(order.listExpressAddreeeBySiteUid).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.data = res.data.data
                }
            }).catch(err => {
                this.loading = false
            })
        },
        //保存新地址
        saveAddressNew(){
            this.$refs['addExpressForm'].validate(valid => {
                if(valid){
                    //判断新增和编辑点击
                  if(this.flag === 'addressNew'){
                    }else if(this.flagedit === 'editAddress'){
                    }
                    this.$axios.post(order.saveExpressAddress, this.form).then(res => {
                        this.saveLoading = false;
                            this.$message({
                                type: "success",
                                message: "保存成功"
                            });
                            this.addressNewForm = false;
                            this.fetchData()
                        })
                    .catch(err => {
                        this.saveLoading = false;
                    });
               }
           });
        },

        //删除
        deleteAddres (uid) {
            this.$confirm('确定删除该地址吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post(order.deleteExpressAddress, {
                    uid: uid
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.fetchData()
                    }
                })
            })
        },


    }
};
</script>

<style scoped>
.search-div {
    margin-left: 100px;
}
.tit {
    margin-bottom: 20px;
}
.tit .tit-text {
    font-size: 18px;
    color: #000;
}
.tit .add-item {
    margin-left: 10px;
    color: #0070ae;
    font-size: 12px;
}
.listtake{
    margin-top:30px;
}
.flex{
    display: flex;
}
</style>
