<template>
    <div class="form-wrap">
        <el-form label-width="100px">
            <el-form-item label="站点ID">{{ siteUid }}</el-form-item>
            <el-form-item label="站点名称">
                <el-col :span="8">
                    <el-input v-model="siteName"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="站点logo">
                <img-gallery :showPreview="true" :imgs="imgs" :fileHost="_fileHost.SHOP_IMAGE" repoType="SHOP_IMAGE"></img-gallery>
            </el-form-item>
            <el-form-item label=" " >
                <el-col :span="8" class="tc">
                    <el-button type="primary" @click="updateSite" :loading="loading">保 存</el-button>
                </el-col>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import ImgGallery from '@/components/common/upload/imgGallery'
import { permission } from '@/common/api.js'
export default {
    name: 'SiteSetting',
    created () {
        this.getSite()
    },
    data () {
        return {
            imgs: [],
            siteName: '',
            loading: false,
            siteUid: ''
        }
    },
    methods: {
        updateSite () {
            this.loading = true
            let logo = ''
            this.imgs.forEach(ele => {
                logo = ele.storageFile || ele
            });
            this.$axios.post(permission.updatecurrentsite, {
                logo: logo,
                siteName: this.siteName
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '站点信息更新成功'
                    })
                    this.$store.commit('setSiteLogo', logo)
                }
            }).catch(err => {
                this.loading = false
            })
        },
        getSite () {
            this.$axios.post(permission.currentsite).then(res => {
                if (res.data.state) {
                    this.siteName = res.data.data.siteName
                    this.siteUid = res.data.data.uid
                    if (res.data.data.logo) {
                        this.imgs.push(res.data.data.logo)
                    }
                }
            })
        }
    },
    components: {
        ImgGallery
    }
}
</script>

