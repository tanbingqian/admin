<template>
    <div>
        <div class="bread-wrap">
            <el-breadcrumb separator=">">
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="page-wrap">
            <el-form label-position="left" label-width="120px" ref="passForm" :model="form" :rules="rules">
                <el-row>
                    <el-col :span="10">
                        <el-form-item required label="请输入旧密码：" prop="password">
                            <el-input v-model="form.password" type="password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item required label="请输入新密码：" prop="newPassword">
                            <el-input v-model="form.newPassword" type="password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <el-form-item required label="请重复密码：" prop="rePassword">
                            <el-input v-model="form.rePassword" type="password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="default" size="small">取消</el-button>
                    <el-button type="primary" size="small" @click="updatePass" :loading="loading">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { auth } from '@/common/api'
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'));
            } else if (value !== this.form.newPassword) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        }
        return {
            form: {
                newPassword: '',
                password: '',
                rePassword: '',
                // uid: JSON.parse(sessionStorage.user).uid
            },
            loading: false,
            rules: {
                password: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                rePassword: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        updatePass () {
            this.$refs['passForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$axios.post(auth.changepassword, this.form)
                        .then(res => {
                            this.loading = false
                            this.$message({
                                type: 'success',
                                message: '密码修改成功'
                            })
                            this.$router.push({
                                path: '/login'
                            })
                        })
                        .catch(err => {
                            this.loading = false
                        })
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
</style>
