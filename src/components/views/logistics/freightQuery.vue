<template>
    <div class="page-wrap">
        <!--快递-->
        <el-form label-width="100px">
            <el-form-item label="发货仓库仓库：">云智印仓库</el-form-item>
            <!-- <el-form-item label="快递">
                <el-select placeholder="请选择快递类型" v-model="choosedata" @change="selectchange">
                    <el-option
                        v-for="drugs in drugs"
                        :key="drugs.expressCode"
                        :label="drugs.expressName"
                        :value="drugs.expressUid"
                    ></el-option>
                </el-select>
            </el-form-item> -->

            <!--收货地址-->
            <el-form-item label="收货地址">
                <city @choose="choose"></city>
            </el-form-item>
            <div v-if="dataSearch">
               <el-form-item label v-if="dataSearch.ExpressQueryVO">快递公司 :{{dataSearch.ExpressQueryVO.expressName}} </el-form-item>
               <el-form-item label>
                   <div v-if="dataSearch.ExpressQueryVO && dataSearch.ExpressQueryVO.unitType=='WEIGHT'">
                        <div class="weight">按重量计算 : </div>
                         首重<span>{{dataSearch.ExpressQueryVO.extfee}}</span>元，续重<span>{{dataSearch.ExpressQueryVO.fee}}</span>元
                   </div>
                   <div v-else-if="dataSearch.ExpressQueryVO && dataSearch.ExpressQueryVO.unitType=='ORDER'">
                         <div class="weight">按订单计算 : </div>
                         运费<span>{{dataSearch.ExpressQueryVO.extfee}}</span>元
                   </div>
                </el-form-item>
            </div>
           
        </el-form>
        <div class="search-div">
            <el-button type="primary" class="el-button-uzien search" size="small" @click="searchLink">{{$t('search')}}</el-button>
        </div>
    </div>
</template>

<script>
import City from "@/components/common/city/city";
import { order }from '@/common/api.js'
export default {
    name: "freightQuery",
    data() {
        return {
            drugs: [],
            choosedata: "",
            city: [],
            addData:{},
            dataSearch:''
        };
    },
    created () {
        this.selectchange([0])
    },
    methods: {
        //筛选城市获取值
        choose(val){
           this.addData=val
        },
        //快递列表
        selectchange: function() {
            this.$axios.post(order.listExpress).then(res => {
                    this.drugs=res.data.data
            });
        },
        //查询
        searchLink(){
            this.$axios.post(order.getExpressQueryVOByCityId, {"cityUidDTOs":this.addData}).then(res => {if (res.data.state) {
                    this.$message({
                        type: "success",
                        message: "查询成功"
                    });
                    if (res.data.data.state=="error") {
                        this.addCourier = false;
                        this.dataSearch=res.data.data
                    } else if(res.data.data.state=="null") {
                        this.$message({
                            type: "error",
                            message: "查询数据为空！"
                        });
                    }
                    this.addCourier = false;
                    this.dataSearch=res.data.data
                } else {
                    this.$message({
                        type: "error",
                        message: "保存失败"
                    });
                }
            }).catch(err => {
                this.saveLoading = false;
            });
        }
        
    },
    components: {
        City
    }
};
</script>

<style scoped>
.search-div {
    margin-left: 100px;
}
.weight{
    float:left;
}
</style>
