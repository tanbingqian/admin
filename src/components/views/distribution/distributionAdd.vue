<template>
    <transition enter-active-class="animated slideInUp">
        <div class="normal-form">
            <el-form label-position="center" label-width="100px" ref="form" :model="form" :rules="rules">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="分销商名称" prop="aliasName">
                            <el-input v-model="form.aliasName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="联系人" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="联系电话" prop="resellerTel">
                            <el-input v-model="form.resellerTel"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="分销商地址">
                            <city @choose="choose"></city>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="" prop="detailedAddress">
                            <el-input placeholder="请输入详细地址" v-model="form.detailedAddress"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="状态">
                            <el-radio v-model="form.state" :label="1">合作</el-radio>
                            <el-radio v-model="form.state" :label="0">停止合作</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="账号" prop="resellerAccount">
                            <el-input v-model="form.resellerAccount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="密码" prop="code">
                            <el-input v-model="form.code"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="域名" prop="shopDomain">
                                <el-input placeholder="请输入域名" v-model="form.shopDomain"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="text-align: center;">
                        <el-button
                            type="primary"
                            @click="saveForm"
                            size="small"
                            :loading="loading"
                            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保 存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </transition>
</template>

<script>
import City from "@/components/common/city/city";
import { resale } from '@/common/api.js'
export default {
    name: 'DistributionAdd',
    data () {
        return {
            form: {
                name: '',
                aliasName: '',
                resellerAccount: '',
                code: '',
                resellerAddress: '',
                resellerTel: '',
                state: 1,
                isDealerOrDistributor: 0, //分销为0
                shopDomain:'', //域名
                detailedAddress:'' //详细地址
            },
            loading: false,
            rules: {
                aliasName: [
                    { required: true, message: '请输入分销商名称', trigger: 'blur' },
                    { min: 3, message: '请至少输入三个字符', trigger: 'blur' }
                ],
                resellerAccount: [
                    { required: true, message: '账号不能为空', trigger: 'blur' },
                    { min: 5, message: '请至少输入5个字符', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, message: '请至少输入5个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '联系人不能为空', trigger: 'blur' },
                ],
                resellerTel: [
                    { required: true, message: '联系电话不能为空', trigger: 'blur' },
                ],
                shopDomain: [
                    { required: true, message: '域名不能为空', trigger: 'blur' },
                ],
                detailedAddress: [
                    { required: true, message: '详细地址不能为空', trigger: 'blur' },
                ]
            },
        }
    },
    methods: {
        choose(val){
           console.log(this.addData)
           this.addData=val
        },
        saveForm () {
            let addA=this.addData;   //省市区
            let addB=this.form.detailedAddress;  //详细地址
            this.form.resellerAddress=addA+'-'+addB; 
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$axios.post(resale.saveDistributor, this.form).then(res => {
                        this.loading = false
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: '保存失败'
                            })
                        }
                    }).catch(err => {
                        this.loading = false
                    })
                }
            })
        }
    },
    components: {
        City
    }
}
</script>

