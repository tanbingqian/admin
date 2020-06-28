<template>
    <div class="search-wrap">
        <!-- 搜索区域 -->
        <div class="search-wrap">
            <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="昵称">
                    <el-input type="text" v-model="searchsForm.nick"></el-input>
                </el-form-item>
                <el-form-item label="手机号码">
                    <el-input type="text" v-model="searchsForm.telephone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
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
                    label="来源">
                </el-table-column>
                <el-table-column
                    prop="nickName"
                    align="center"
                    label="昵称">
                </el-table-column>
                <el-table-column
                    prop="telephone"
                    align="center"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="email"
                    align="center"
                    label="邮箱">
                </el-table-column>
                 <el-table-column
                    prop="accountId"
                    align="center"
                    label="余额">
                </el-table-column>
                <el-table-column
                    prop="arealName"
                    align="center"
                    label="购物卷">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        {{ scope.row.state | userState }}
                    </template>
                </el-table-column>
                <el-table-column
                    width="280"
                    align="center"
                    :label="$t('operation')">
                    <template slot-scope="scope">
                        <el-button type="text" @click="searchDetail(scope.row.uid)">详情</el-button>
                        <el-button type="text" @click="changePasswordLink">修改密码</el-button>
                        <el-button type="text" @click="setSeaechState(scope.row)">{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 详情dialog -->
        <el-dialog :title="detailsTitle" :visible.sync="detailsDialog" width="40%">
        <el-form label-position="left" label-width="110px" :model="searchDetailList" :rules="detailsRules" ref="detailsForm">
            <div class="flex-two">
                 <div style="widthtable">
                    <el-form-item label="UID" prop="uid">
                        <el-input v-model="searchDetailList.uid" :disabled="readonly"></el-input>
                        </el-form-item>
                        <el-form-item label="来源" prop="score">
                            <el-input v-model="searchDetailList.score" type="score" :disabled="readonly"></el-input>
                        </el-form-item>
                        <el-form-item label="注册时间" prop="signupTime">
                            <el-input v-model="searchDetailList.signupTime" type="signupTime" :disabled="readonly"></el-input>
                        </el-form-item>
                        <el-form-item label="来源分销商" prop="sourceDistributor">
                            <el-input v-model="searchDetailList.sourceDistributor" :disabled="readonly"></el-input>
                        </el-form-item>
                        <el-form-item label="帐号" prop="account">
                            <el-input v-model="searchDetailList.account"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="telephone">
                            <el-input v-model="searchDetailList.telephone"></el-input>
                        </el-form-item>
                        <el-form-item label="余额" prop="accountId">
                            <el-input v-model="searchDetailList.accountId" :disabled="readonly"></el-input>
                        </el-form-item>
                </div>
                <div class="widthtable">
                        <el-form-item label="状态" prop="state">
                            <el-input v-model="searchDetailList.state" :disabled="readonly"></el-input>
                        </el-form-item>
                        <el-form-item label="最后登陆时间" prop="lastLoginTime">
                            <el-input v-model="searchDetailList.lastLoginTime" :disabled="readonly"></el-input>
                        </el-form-item>
                        <el-form-item label="最后到访分销商" prop="lastDistributionTime">
                            <el-input v-model="searchDetailList.sourceDistributor" :disabled="readonly"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="nickName">
                            <el-input v-model="searchDetailList.nickName"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="searchDetailList.email"></el-input>
                        </el-form-item>
                        <el-form-item label="购物券" prop="arealName">
                            <el-input v-model="searchDetailList.arealName" :disabled="readonly"></el-input>
                        </el-form-item>
                </div>
            </div>
            <div class="adressDiv">
                <div>收货地址</div>
                <table class="shippingAdress" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>小霞</td>
                        <td>15302743659</td>
                        <td>广东省深圳市南山区南山智园7A3楼  云智印</td>
                    </tr>
                    <tr>
                        <td>小霞</td>
                        <td>15302743659</td>
                        <td>广东省深圳市南山区南山智园7A3楼  云智印</td>
                    </tr>
                </table>
            </div>
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
    name: "memberManagement",
    created () {
        this.queryData(this.currentPage, this.pageSize)
    },
    data() {
        var verifyPass=(rule,value,callback)=>{
            if(value === ""){
            callback(new error("请再次输入密码"));
            }else if(value !==this.changePasswordModel.newPassword){
            callback(new Error("两次输入密码不一致!"));
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
            memberTableData:[],
            searchDetailList:{},
            searchsForm: {
                nick: "",
                telephone: "",
                email: "",
                state:[]
            },
            //详情弹窗
            detailsDialog:false,
            detailsTitle:'会员资料详情',
            //修改密码弹窗
            changePasswordDialog:false,
            changePasswordTitle:'修改密码',
            changePasswordModel:{
                 newPassword: "",
                 password: "",
                 rePassword: "",  
                 uid: 0          
            },
            changePasswordRules:{
                newPassword: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' }
                ],
                againPassword: [
                    { required: true, message: '重复新密码不能为空', trigger: 'blur' },
                    { validator: verifyPass, trigger: 'blur' }
                ],
            },
           
            detailsModel:{},
            // searchs: {
            //     nickname: [
            //         {
            //             required: true,
            //             message: "昵称不能为空",
            //             trigger: "blur"
            //         }
            //     ],
            //     phone: [
            //         {
            //             required: true,
            //             message: "手机号不能为空",
            //             trigger: "blur"
            //         }
            //     ],
            //     mailbox: [
            //         {
            //             required: true,
            //             message: "邮箱不能为空",
            //             trigger: "blur"
            //         }
            //     ]
            // }

            detailsRules:{
                nickName: [
                    { required: true, message: '昵称不能为空', trigger: 'blur' }
                ],
                account: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                cellphone: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' }
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
                nick: this.searchsForm.nick,
                telephone: this.searchsForm.telephone,
                state: this.searchsForm.state.toString(),
                page: this.currentPage,
                pageSize: this.pageSize
            }).then(res => {
                
                console.log(res.data.data.dataList)
                this.memberTableData=res.data.data.dataList
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
    .adressDiv{
        margin-top:40px;
    }
    .shippingAdress{
        width:100%;
        margin-top:10px;
        margin-bottom: 40px;
    }
    .shippingAdress td{
        border-bottom: 1px solid #dbdbdb;
        padding-bottom: 10px;
        padding-top: 10px;
    }
</style>
