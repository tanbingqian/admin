<template>
    <div class="swipe-setting">
        <div class="setting-title">
            <span class="title">多图轮播设置</span>
            <el-button type="text" @click="addSlide">+新增轮播</el-button>
        </div>
        <div
            class="slide-container"
            :style="{
                marginTop: calculatePX(form.marginTop) + 'px',
                marginBottom: calculatePX(form.marginBottom) + 'px',
                marginLeft: calculatePX(form.marginLeft) + 'px',
                marginRight: calculatePX(form.marginRight) + 'px',
                paddingTop: calculatePX(form.paddingTop) + 'px',
                paddingBottom: calculatePX(form.paddingBottom) + 'px',
                paddingLeft: calculatePX(form.paddingLeft) + 'px',
                paddingRight: calculatePX(form.paddingRight) + 'px'
            }"
            v-if="form.uid">
            <swipe
                :data="swipeList"
                wrap-class="swipesetting"
                :height="calculatePX(form.height)"
                :delay="form.showTime"
                :speed="form.speed">
            </swipe>
        </div>
        <el-form label-width="80px" :model="form" ref="swipeForm" :rules="rules">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="模板名称" prop="templateName">
                        <el-input v-model="form.templateName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="轮播张数" prop="colNumber">
                        <el-input v-model.number="form.colNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="模块高度" prop="height">
                        <el-input v-model.number="form.height" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-form-item label="展示时间" prop="showTime">
                        <el-input v-model.number="form.showTime" placeholder="毫秒"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="切换速度" prop="speed">
                        <el-input v-model.number="form.speed" placeholder="毫秒"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-form-item label="外边距(上)" prop="marginTop">
                        <el-input v-model.number="form.marginTop" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="外边距(下)" prop="marginBottom">
                        <el-input v-model.number="form.marginBottom" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-form-item label="外边距(左)" prop="marginLeft">
                        <el-input v-model.number="form.marginLeft" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="外边距(右)" prop="marginRight">
                        <el-input v-model.number="form.marginRight" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-form-item label="内边距(上)" prop="paddingTop">
                        <el-input v-model.number="form.paddingTop" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="内边距(下)" prop="paddingBottom">
                        <el-input v-model.number="form.paddingBottom" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="10">
                    <el-form-item label="内边距(左)" prop="paddingLeft">
                        <el-input v-model.number="form.paddingLeft" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="内边距(右)" prop="paddingRight">
                        <el-input v-model.number="form.paddingRight" placeholder="px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col>
                    <el-form-item label="是否显示" prop="state">
                        <el-radio v-model="form.state" :label="1">是</el-radio>
                        <el-radio v-model="form.state" :label="0">否</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col>
                    <el-form-item label=" ">
                        <el-button type="primary" @click="delSwipe" v-show="uid">删除</el-button>
                        <el-button type="primary" @click="save" :loading="loading">保存</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
import { shop } from '@/common/api.js'
import Swipe from '../page/swipe'
import { checkNumber, checkCount } from '@/common/utils/validate.js'
export default {
    name: 'SwipeSetting',
    props: {
        uid: {
            type: String
        }
    },
    data() {
        return {
            loading: false,
            form: {
                colNumber: 0,
                height: 0,
                marginBottom: 0,
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                showTime: '',
                showTitle: 1,
                speed: '',
                type: 'FLASH',
                templateName: '',
                templateItemVOs: [],
                state: 1
            },
            rules: {
                colNumber: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ],
                templateName: [
                    { required: true, message: '模板名称不能为空', trigger: 'blur' }
                ],
                height: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ],
                marginTop: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                marginBottom: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                marginLeft: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                marginRight: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                paddingTop: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                paddingBottom: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                paddingLeft: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                paddingRight: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ],
                showTime: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ],
                speed: [
                    { required: true, validator: checkCount, trigger: 'blur' }
                ],
                state: [
                    { required: true, validator: checkNumber, trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        uid (newVal, oldVal) {
            if (newVal) {
                this.fetchModule(newVal)
            }
        },
    },
    methods: {
        delSwipe () {
            // 删除
            this.$axios.post(shop.deleteTemplate, {
                state: 0,
                uid: this.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.$emit('eventDel')
                    this.initForm()
                }
            })
        },
        // 如果存在uid，获取模板属性
        fetchModule (uid) {
            this.$axios.post(shop.getTemplate, {
                uid: uid
            }).then(res => {
                if (res.data.state) {
                    this.form = res.data.data
                }
            })
        },
        initForm () {
            this.form = {
                colNumber: 0,
                height: 0,
                marginHor: 0,
                marginVer: 0,
                paddingHor: 0,
                paddingVer: 0,
                showTime: '',
                showTitle: 1,
                speed: '',
                type: 'FLASH',
                templateName: '',
                templateItemVOs: [],
                state: 1
            }
        },
        addSlide () {
            // 重置表单数据
            this.initForm()
            this.$emit('eventAdd')
        },
        save () {
            this.$refs['swipeForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$axios.post(shop.saveFlash, this.form).then(res => {
                        if (res.data.state) {
                            this.loading = false
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            })
                            this.$emit('event-success', true)
                        } else {
                            this.loading = false
                        }
                    }).catch(err => {
                        this.loading = false
                    })
                }
            })
        }
    },
    components: {
        Swipe
    },
    computed: {
        swipeList () {
            const arr = []
            for(let i = 0; i < this.form.colNumber; i++) {
                arr.push({
                    image: []
                })
            }
            return arr
        }
    }
}
</script>

<style scoped lang="less">
.swipe-setting{
    padding: 0 10px;
}
.slide-container{
    width: 40%;
    display: inline-block;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid #ccc;
}
</style>
