<template>
    <transition enter-active-class="animated slideInUp">
        <div class="normal-form">
            <el-form label-position="center" label-width="120px" ref="form" :model="form" :rules="rules">
                <el-row>
                    <el-col :span="6">
                        <el-form-item :label="$t('resellerName')" prop="aliasName">
                            <el-input v-model="form.aliasName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item :label="$t('contactPerson')" prop="name">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('contactPhone')" prop="resellerTel">
                            <el-input v-model="form.resellerTel"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item :label="$t('resellerAddress')">
                             <city @choose="choose"></city>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="" prop="detailedAddress">
                            <el-input :placeholder="$t('enterDetailAddress')" v-model="form.detailedAddress"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item :label="$t('resellerLevel')" prop="levelUid">
                            <el-select v-model="form.levelUid">
                                <el-option v-for="d in levelList" :key="d.uid" :label="d.name" :value="d.uid"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('allowToHaveChildLevel')">
                            <el-radio :label="1" v-model="form.resellerAllowed">{{ $t('allowed') }}</el-radio>
                            <el-radio :label="0" v-model="form.resellerAllowed">{{ $t('notAllowed') }}</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item :label="$t('state')">
                            <el-radio :label="1" v-model="form.state">{{ $t('cooperation') }}</el-radio>
                            <el-radio :label="0" v-model="form.state">{{ $t('unCooperation') }}</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item :label="$t('account')" prop="resellerAccount">
                            <el-input v-model="form.resellerAccount"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item :label="$t('password')" prop="code">
                            <el-input v-model="form.code"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item :label="$t('domain')" prop="shopDomain">
                                <el-input :placeholder="$t('enterDomain')" v-model="form.shopDomain"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="text-align: center;">
                        <el-button
                            type="primary"
                            @click="saveForm"
                            size="small"
                            :loading="loading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </transition>
</template>

<script>
import City from "@/components/common/city/city";
import { resale } from '@/common/api.js'
import { checkAccount } from '@/common/utils/validate.js'
export default {
    name: 'SoldAdd',
    created () {
        this.fetchLevel()
    },
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
                levelUid: '',
                resellerAllowed: 1,
                isDealerOrDistributor: 1, //分销为0, 经销1
                shopDomain:"", //域名
                detailedAddress:'' //详细地址
            },
            loading: false,
            levelList: [],
            rules: {
                aliasName: [
                    { required: true, message: this.$t('enterResellerName'), trigger: 'blur' },
                    { min: 3, message: this.$t('atLeastThreeWord'), trigger: 'blur' }
                ],
                resellerAccount: [
                    { required: true, message: this.$t('accountNotNull'), trigger: 'blur' },
                    { validator: checkAccount, trigger: 'blur' }
                ],
                code: [
                    { required: true, message: this.$t('enterPassword'), trigger: 'blur' },
                    { min: 5, message: this.$t('atLeastFiveWord'), trigger: 'blur' }
                ],
                levelUid: [
                    { required: true, message: this.$t('resellerLevelNotNull'), trigger: 'blur' },
                ],
                name: [
                    { required: true, message: this.$t('contactPersonNotNull'), trigger: 'blur' },
                ],
                resellerTel: [
                    { required: true, message: this.$t('contactPhoneNotNull'), trigger: 'blur' },
                ],
                shopDomain: [
                    { required: true, message: this.$t('domainNotNull'), trigger: 'blur' },
                ],
                detailedAddress: [
                    { required: true, message: this.$t('detailAddressNotNull'), trigger: 'blur' },
                ]
            }
        }
    },
    methods: {
        //筛选城市获取值
        choose(val){
           console.log(this.addData)
           this.addData=val
        },
        saveForm () {
            this.addA=this.addData;   //省市区
            // let addB=this.form.resellerAddress;  //详细地址
            this.form.resellerAddress=this.addA+'-'+this.form.detailedAddress; 
            
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$axios.post(resale.saveDealer, this.form).then(res => {
                        this.loading = false
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: this.$t('saveSuccess')
                            })
                        }
                    }).catch(err => {
                        this.loading = false
                    })
                }
            })
        },
        // 经销商级别
        fetchLevel () {
            this.$axios.post(resale.listResellerLevel).then(res => {
                if (res.data.state) {
                    this.levelList = res.data.data
                }
            })
        }
    },
    components: {
        City
    }
}
</script>

