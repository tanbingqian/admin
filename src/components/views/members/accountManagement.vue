<template>
    <div class="search-wrap">
        <!-- 搜索区域 -->
        <div class="search-wrap">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="用户帐号">
                    <el-input type="text" v-model="searchsForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input type="text" v-model="searchsForm.phones"></el-input>
                </el-form-item>
                <el-form-item label="主帐号">
                    <el-input type="text" v-model="searchsForm.email"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-checkbox-group v-model="searchsForm.state" :max="1">
                        <el-checkbox :label="1">启用</el-checkbox>
                        <el-checkbox :label="0">禁用</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="center">
                <el-button
                    type="primary"
                    class="el-button-uzien search"
                    @click="queryData(1, pageSize)"
                    size="small">{{$t('search')}}</el-button>
            </div>
        </div>

        <!-- table表格 -->
        <div class="table-wrap" ref="myTable" v-loading="loading" :element-loading-text="$t('loadingText')">
            <el-table
                :data="memberTableData"
                style="width: 100%">
                <el-table-column
                    prop="uid"
                    label="UID"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="signupTime"
                    align="center"
                    label="注册时间"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="score"
                    align="center"
                    label="用户账号">
                </el-table-column>
                <el-table-column
                    prop="nickName"
                    align="center"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="telephone"
                    align="center"
                    label="角色名称">
                </el-table-column>
                <el-table-column
                    prop="email"
                    align="center"
                    label="是否子账号">
                </el-table-column>
                 <el-table-column
                    prop="accountId"
                    align="center"
                    label="主帐号">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.state | userState }}
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="arealName"
                    align="center"
                    label="可用金额">
                </el-table-column>
                <el-table-column
                    width="280"
                    align="center"
                    :label="$t('operation')">
                    <template slot-scope="scope">
                        <el-button type="text" @click="searchDetail(scope.row.uid)">编辑</el-button>
                        <el-button type="text" @click="setSeaechState(scope.row)">{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button>
                        <el-button type="text" @click="changePasswordLink">修改密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑账户dialog -->
        <el-dialog :title="detailsTitle" :visible.sync="detailsDialog" width="30%">
            <el-form label-position="left" label-width="110px" :model="editAccount" :rules="editAccountRules">
                <el-form-item label="用户账户" prop="userAccountEdit">
                    <el-input v-model="editAccount.userAccountEdit"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="userNameEdit">
                    <el-input v-model="editAccount.userNameEdit" placeholder=""></el-input>
                </el-form-item>
                <el-row type="flex" justify="center">
                        <el-button
                            @click="detailsDialog = false"
                            type="primary"
                            size="small"
                            style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                        <el-button type="primary"
                            size="small"
                        @click="detailsDialog = false">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-row>
            </el-form>
        </el-dialog>


     <!-- 修改密码dialog -->
     <el-dialog :title="changePasswordTitle" :visible.sync="changePasswordDialog" width="40%">
            <el-form label-position="left" label-width="110px" :model="changePasswordModel" :rules="changePasswordRules" ref="changePasswordForm">
                <el-form-item label="昵称" prop="nickName">
                    <template>
                        <div>yuanxiaoxia</div>
                    </template>
                </el-form-item>
                <el-form-item label="输入新密码" prop="newPassword">
                    <el-input v-model="changePasswordModel.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="重新输入密码" prop="againPassword">
                    <el-input v-model="changePasswordModel.againPassword"></el-input>
                </el-form-item>
                <el-row type="flex" justify="center">
                    <el-button
                        @click="changePasswordDialog = false"
                        type="primary"
                        size="small"
                        style="margin-right: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button type="primary"
                        size="small"
                        @click="saveChangePassword"
                   >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
            </el-row>
        </el-form>
    </el-dialog>
        
    </div>
</template>

<script>
import Pager from '@/components/common/Pager'
import { member } from '@/common/api.js'
export default {
    name: "accountManagement",
    created () {
        this.queryData(this.currentPage, this.pageSize)
    },
    data() {
        var verifyPass=(rule,value,callback) => {
          if(value === ""){
           callback(new error("请再次输入密码"));
          }else if (value !== this.changePasswordModel.newPassword) {
           callback(new Error('两次输入密码不一致!'));
          }else {
           callback();
          }
        }
        return {
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            readonly:true,
            memberTableData:[
                {
                    "accountId": "100",
                    "address": "string",
                    "arealName": "string",
                    "arealUid": 0,
                    "email": "1729020330@qq.com",
                    "image": "string",
                    "lastSigninIp": "string",
                    "lastSigninTime": "2019-01-04T02:54:04.935Z",
                    "level": 0,
                    "name": "tanbingqian",
                    "nickName": "tanbingqian",
                    "password": "123456",
                    "score": "微信",
                    "secKey": "string",
                    "signupTime": "2019-01-04T02:54:04.935Z",
                    "siteUid": 0,
                    "state": 0,
                    "telephone": "13510465439",
                    "uid": 103062503188688897
                }
            ],
            searchDetailList:{},
            searchsForm: {
                nickname: "",
                telephone: "",
                email: "",
                state:[]
            },
            //详情弹窗
            detailsDialog:false,
            detailsTitle:'编辑账户',
            //修改密码弹窗
            changePasswordDialog:false,
            changePasswordTitle:'修改密码',
            changePasswordRules:{
                newPassword: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' }
                ],
                againPassword: [
                    { required: true, message: '重复新密码不能为空', trigger: 'blur' },
                    { validator: verifyPass, trigger: 'blur' }
                ],
            },
            changePasswordModel:{
                 newPassword: "",
                 password: "",
                 rePassword: "",  
                 uid: 0          
            },
            detailsModel:{},

            //编辑账户
            editAccount:{
                userAccountEdit:"",
                userNameEdit:"",
                uid: 0 
            },
            //编辑账户校验
            editAccountRules:{
                userAccountEdit: [
                    { required: true, message: '用户账户不能为空', trigger: 'blur' }
                ],
                userNameEdit: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ]
            },
             
           
        };
    },
    methods:{
        //详情
        searchDetail(uid){
            this.detailsDialog=true;
            this.$axios.post(member.getmemberbyid, {
                uid:uid
            }).then(res => {
                if (res.data.state) {
                    this.searchDetailList = res.data.data
                } else {
                    this.$message({
                        type: 'error',
                        message: '获取详情失败'
                    })
                }
            })
        },
        getCurrentSize (size) {
            this.queryData(1, size)
        },
        getCurrentPage (num) {
            this.queryData(num, this.pageSize)
        },
        queryData (pageNum, pageSize) {
            this.currentPage = pageNum
            this.pageSize = pageSize
            this.loading = true
            this.$axios.post(member.listmember, {
                email: this.searchsForm.email,
                nick: this.searchsForm.nickName,
                telephone: this.searchsForm.telephone,
                state: this.searchsForm.state.toString(),
                page: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.tableData = res.data.data
                    this.totalCount = res.data.data.totalCount
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$t(res.data.code)
                    })
                }
            }).catch(err => {
                this.loading = false
                this.$message({
                    type: 'error',
                    message: this.$t(err.code)
                })
            })
        },

        //禁用-启用
        setSeaechState (uid) {
            var title = ''
            if (uid.state === 1) {
                title = '确定禁用此设备吗？'
            } else {
                title = '确定启用此设备吗？'
            }
            this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$axios.post(member.getmemberbyid, {
                        uid: row.uid,
                        state: sn.state === 1 ? -1 : 1
                    }).then(res => {
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: '操作成功'
                            })
                            this.fetchData(this.currentPage, this.pageSize)
                        }
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消该操作'
                })
            })
        },

        //修改密码
        changePasswordLink(){
            this.changePasswordDialog=true;
        },
        saveChangePassword(){
            this.$axios.post(member.changepassword,this.changePasswordModel).then(res => {
                this.loading = false
                if (res.data.state) {
                    console.log(res.data.state);
                    // this.tableData = res.data.data
                    // this.totalCount = res.data.data.totalCount
                } else {
                    this.$message({
                        type: 'error',
                        message: this.$t(res.data.code)
                    })
                }
            }).catch(err => {
                this.loading = false
                this.$message({
                    type: 'error',
                    message: this.$t(err.code)
                })
            })
        }
    },
    components: {
        Pager
    }
};
</script>
<style scoped>
    .flex-two{
        display: flex;
        justify-content: space-between;
    }
    .widthtable{
        width:50%;
    }
</style>
