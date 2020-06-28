<template>
    <div class="page-wrap">
         <p>
            <el-button type="text" @click="addLink">+新增优惠卷</el-button>
        </p>
        <!-- table表格 -->
        <div class="table-wrap" ref="myTable" :element-loading-text="$t('loadingText')">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="活动名称"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="description"
                    align="center"
                    label="使用条件"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align="center"
                    label="使用时间">
                </el-table-column>
                <el-table-column
                    prop="numberPerMember"
                    align="center"
                    label="领取限制">
                </el-table-column>
                <el-table-column
                    prop="promotionType"
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        {{scope.row.state === 1 ? '生效':'失效'}}
                    </template>
                </el-table-column>
                <el-table-column
                    width="280"
                    align="center"
                    :label="$t('operation')">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editbuySend(scope.row)">编辑</el-button>
                        <el-button type="text" @click="deleteLink(scope.row.uid)">删除</el-button>
                        <el-button type="text" @click="setState(scope.row.uid)">{{ scope.row.state === 1 ? '禁用' : '启用' }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--弹窗-->
        <el-dialog :visible.sync="addSendBuy" :title="dialogTitle" width="40%">
            <el-form label-position="left" label-width="70px" ref="sendBuyform">
                <el-form-item label="活动名称">
                    <el-input v-model="sendBuyform.name" style="width:185px;"></el-input>
                </el-form-item>
                <el-form-item label="活动时间">
                    <!-- <el-date-picker v-model="sendBuyform.startTime" type="datetime" value-format="yyyy-mm-DD HH:mm:ss"></el-date-picker>--
                    <el-date-picker type="datetime" v-model="sendBuyform.endTime" value-format="yyyy-mm-DD HH:mm:ss"></el-date-picker> -->
                    <el-col :span="8">
                        <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" type="datetime" v-model="sendBuyform.startTime"></el-date-picker>
                    </el-col>
                    <el-col :span="2" style="text-align: center;">至</el-col>
                    <el-col :span="8">
                        <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" type="datetime" v-model="sendBuyform.endTime"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="优惠形式">
                    <el-radio v-model="sendBuyform.discountType" :label="'RATE'">
                        指定金额&nbsp;&nbsp;&nbsp;面值：
                        <el-input v-model="RATE" :disabled="sendBuyform.discountType=='AMOUNT'" placeholder="请输入内容" style="width:100px;"></el-input>
                    </el-radio>
                    <el-radio v-model="sendBuyform.discountType" :label="'AMOUNT'">
                        折扣&nbsp;&nbsp;<el-input v-model="AMOUNT" :disabled="sendBuyform.discountType=='RATE'" placeholder="选择商品" style="width:100px;"></el-input>&nbsp;折
                    </el-radio>
                </el-form-item>
                <el-form-item label="使用门槛">
                    <el-radio v-model="sendBuyform.usingThreshold" :label="0">
                        不限制&nbsp;&nbsp;&nbsp;
                    </el-radio>
                    <el-radio v-model="sendBuyform.usingThreshold" :label="1">
                        满&nbsp;&nbsp;<el-input v-model="sendBuyform.minOrderAmount" placeholder="请输入内容" style="width:100px;"></el-input>&nbsp;元可以使用
                    </el-radio>
                </el-form-item>
                <el-form-item label="是否叠加">
                    <el-checkbox :true-label="1" :false-label="0" v-model="sendBuyform.superpostion">叠加</el-checkbox>
                </el-form-item>
                <el-form-item label="发送方式">
                    <el-radio v-model="sendBuyform.receiveType" label="MEMBER">手动领取</el-radio>
                    <el-radio v-model="sendBuyform.receiveType" label="AUTO">自动发送至会员帐户</el-radio>
                </el-form-item>
                 <el-form-item label="会员等级">
                    <el-select v-model="sendBuyform.listLevelUid" multiple placeholder="请选择" @change="selectchangeMember" style="width:253px;">
                        <el-option
                        v-for="item in memberList"
                        :key="item.uid"
                        :label="item.levelName"
                        :value="item.uid">
                        </el-option>
                    </el-select>
                 </el-form-item> 
                <div class="flex-t">
                    <el-form-item label="每人限领">
                        <el-input v-model="sendBuyform.numberPerMember" placeholder="请输入内容" style="width:150px;"></el-input>
                    </el-form-item> 

                    <el-form-item label="发行卷数" class="issuance-left">
                        <el-input v-model="sendBuyform.totalNumber" placeholder="请输入内容" style="width:150px;"></el-input>
                    </el-form-item> 
                </div>

                <el-form-item label="使用说明">
                    <textarea rows="5" cols="30" placeholder="填写活动的详细说明" v-model="sendBuyform.description" style="width:395px;border: 1px solid #dcdfe6;"></textarea>
                </el-form-item> 

                <el-form-item label="适用范围">
                    <el-radio v-model="sendBuyform.productCollection" :label="0">全店商品</el-radio>
                    <el-radio v-model="sendBuyform.productCollection" :label="1">指定商品</el-radio>
                    <el-radio v-model="sendBuyform.productCollection" :label="2">指定商品不可用</el-radio>
                    <el-table :data="result">
                        <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
                        <el-table-column align="center"  label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" icon="el-icon-delete"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="text" @click="chooseProduct">+添加商品</el-button>
                </el-form-item>
             
                <!-- <div v-show="sendBuyform.productCollection==1 || sendBuyform.productCollection==2">
                    <div class="table-wrap" ref="myTable">
                        <el-table
                            :data="skuBox"
                            style="width: 100%">
                            <el-table-column
                                prop="title"
                                label="商品名称"
                                align="center"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                width="280"
                                align="center"
                                :label="$t('operation')">
                                <template slot-scope="scope">
                                    <i class="el-icon-delete icon" @click="delbuySends(scope.row.uid)"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <el-button type="text" @click="chooseProduct">+添加商品</el-button>
                </div> -->
              
               
                <div style="text-align: center;">
                    <el-button type="primary" size="small" @click="addSendBuy=false">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button type="primary" size="small" @click="saveLink">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </el-form>
        </el-dialog>

         <!-- 选择商品 -->
        <el-dialog :visible.sync="proDialog" title="添加成品商品" width="60%">
            <el-form label-width="80px" label-position="right">
                <el-row>
                <el-col :span="8">
                    <el-form-item label="商品编码">
                    <el-input v-model="params.procode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品名称">
                    <el-input v-model="params.protitle"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商品类目">
                    <el-cascader
                        :clearable="true"
                        :show-all-levels="false"
                        :options="categorys"
                        :props="{ label: 'categoryName', value: 'uid' }"
                        change-on-select
                        v-model="params.categoryUid"
                        expand-trigger="hover"
                    ></el-cascader>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row style="text-align: center; margin-bottom: 22px;">
                <el-button
                    type="primary"
                    size="small"
                    @click="searchProduct(1, pageSize)"
                >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;查 询&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-row>
            </el-form>
            <el-table :data="proList" max-height="400">
                <el-table-column align="center">
                <template slot-scope="scope">
                    <el-checkbox @change="handleCheck(scope.row)" v-model="scope.row.isCheck"></el-checkbox>
                </template>
                </el-table-column>
                <el-table-column align="center" label="ID" prop="uid"></el-table-column>
                <el-table-column align="center" label="商品编码" prop="productCode"></el-table-column>
                <el-table-column align="center" label="商品名称">
                <template
                    slot-scope="scope"
                >{{ scope.row.langtitle ? scope.row.langtitle : scope.row.cntitle }}</template>
                </el-table-column>
                <el-table-column align="center" label="供应商" prop="supplierUid"></el-table-column>
                <el-table-column align="center" label="价格" prop="price"></el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <pager
                :style="{'background-color': '#fff'}"
                :total="total"
                layout="prev, pager, next"
                :currentPage="page"
                :pageSize="size"
                @getCurrentSize="getCurrentSize"
                @getCurrentPage="getCurrentPage"
            ></pager>
            <el-row style="text-align: center;">
                <el-button type="primary" size="small" @click="confirmAdd">&nbsp;&nbsp;确认添加&nbsp;&nbsp;</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import Pager from '@/components/common/Pager'
    import { promotion, product } from '@/common/api.js'
    import { member } from '@/common/api.js'
    import BScroll from 'better-scroll'
    import _ from 'underscore'
    export default {
        name: "coupons",
        props: ['uid'],
        data(){
          return{
            loading: true,
            addSendBuy:false,
            proDialog: false,
            currentPage: 1,
            pageSize: 50,
            totalCount: 0,
            loading: true,
            dialogTitle:'',
            params: {
                categoryUid: [],
                procode: '',
                protitle: ''
            },
            proList: [],
            categorys: [],
            //列表
            tableData:[],
            page: 1, //选择商品列表分页
            size: 20,
            total: 0,
            sendBuyform:{
                //活动名称
                name:'',
                //活动时间
                startTime:'',
                endTime:'',
                //优惠形式
                discountType:0,
                discountValue:'',
                //发送方式
                receiveType:0,
                //每人领取
                numberPerMember:'',
                //总发行卷数
                totalNumber:'',
                //适用范围
                productCollection:0,
                //使用门槛
                usingThreshold:0,
                minOrderAmount:'',
                //使用说明
                description:'',
                //会员等级
                listLevelUid:[],
                //0为所有会员,会员等级设置编号
                memberLevelCollection:1,
                //是否叠加
                superpostion:1
            },
            skuBox:[],
            skuBoxs:[],
            memberList:[],
            RATE:'',
            AMOUNT:'',
            //活动类型
            promotionType:'COUPON',
            flag:'add',
            result:[]
          }
        },
        created () {
           this.selectchangeMember();
           this.fetchData(this.currentPage, this.pageSize)
        },
        methods:{
            // 设置状态
            setState (uid) {
                this.$axios.post(promotion.setState, {
                    uid: uid,
                    lang: localStorage.lang
                }).then(res => {
                    if (res.data.state) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        })
                        this.fetchData(1, this.pageSize)
                    }
                })
            },
            //会员等级列表
            selectchangeMember(){
                this.$axios.post(member.listmemberlevel).then(res => {
                    this.memberList=res.data.data;
                })
            },
            //保存
            saveLink(){
                let url = ''
                if (this.flag === 'add') {
                    url = promotion.savePromotion
                    this.sendBuyform.memberLevelCollection=0
                } else {
                    url = promotion.saveUpdatePromotion
                    this.sendBuyform.memberLevelCollection=1
                }
                //判断拆扣类型
                if(this.sendBuyform.usingThreshold=='0'){
                     this.sendBuyform.minOrderAmount="0"
                }
				//判断优惠形式类型
                if(this.sendBuyform.discountType=='RATE'){
                     this.sendBuyform.discountValue=this.RATE
                }else{
                     this.sendBuyform.discountValue=this.AMOUNT
                }

                //在提交表单里面添加promotionType类型
                this.sendBuyform.promotionType=this.promotionType

                //商品限制方式：1表示包含，-1表示不包含
				console.log(this.sendBuyform.productCollection)
                if(this.sendBuyform.productCollection==0){
                     this.sendBuyform.productCollectionType=0
                }else if(this.sendBuyform.productCollection==1){
                     this.sendBuyform.productCollectionType=1
                }else{
                     this.sendBuyform.productCollectionType=1
                }

                //在提交表单里面添加listProductSku
                this.listProductSku=this.skuBox
                this.sendBuyform.listProductSku = this.listProductSku
                console.log("sku",this.sendBuyform.listProductSku)

                // var newListLevelUid = this.sendBuyform.listLevelUid
                // newListLevelUid = newListLevelUid.join(','); 
                // newListLevelUid = newListLevelUid.split(',');
                // this.sendBuyform.listLevelUid=newListLevelUid
                // console.log('c',newListLevelUid)

                this.$axios.post(url,this.sendBuyform).then(res => {
                    console.log(res)
                    this.addSendBuy=false;
                    this.fetchData(this.currentPage, this.pageSize)
                })
            },
            //新增
            addLink(){
                this.flag='add',
                this.dialogTitle="新增优惠卷使用,领取规则"
                this.addSendBuy=true;
               
                //活动名称
                this.sendBuyform.name='',
                //活动时间
                this.sendBuyform.startTime='',
                this.sendBuyform.endTime='',
                //优惠形式
                this.sendBuyform.discountType= 0,
                this.sendBuyform.discountValue='',
                //发送方式
                this.sendBuyform.receiveType= 0,
                //每人领取
                this.sendBuyform.numberPerMember='',
                //总发行卷数
                this.sendBuyform.totalNumber='',
                //适用范围
                this.sendBuyform.productCollection= 0,
                //使用门槛
                this.sendBuyform.usingThreshold= 0,
                this.sendBuyform.minOrderAmount='',
                //使用说明
                this.sendBuyform.description='',
                //会员等级
                this.sendBuyform.listLevelUid=[],
                //0为所有会员,会员等级设置编号
                this.sendBuyform.memberLevelCollection= 1,
                //是否叠加
                this.sendBuyform.superpostion= 1
            },
            //编辑
            editbuySend(row){
                this.flag='edit',
                this.sendBuyform=row;
                this.dialogTitle="编辑优惠卷使用,领取规则"
                this.addSendBuy=true;
                this.$axios.post(promotion.getPromotion,
                         {
                            lang: localStorage.lang,
                            uid:row.uid
                         }).then(res => {
                            this.sendBuyform=res.data.data

                            // var newListLevelUid = res.data.data.listLevelUid
                            // newListLevelUid = newListLevelUid.join(','); 
                            // newListLevelUid = newListLevelUid.split(',');
                            // console.log('b',newListLevelUid)

                            this.fetchData(this.currentPage, this.pageSize)
                            //判断使用门槛回显值
                            if(this.sendBuyform.minOrderAmount==0){
                                    this.sendBuyform.usingThreshold=0
                            }else{
                                    this.sendBuyform.usingThreshold=1
                            }
                            //判断适用范围
                            if(this.sendBuyform.productCollection==0){
                                    this.sendBuyform.productCollection=0
                            }else{
                                    this.sendBuyform.productCollection=1
                                    this.sendBuyform.productCollection=2
                            }
                            //产品列表
                            // this.skuBox=this.sendBuyform.listProduct
                            // console.log(this.skuBox)

                            if(res.data.discountType=='RATE'){
                                this.RATE=res.data.discountValue
                            }else{
                                this.AMOUNT=res.data.discountValue
                            }
                })
                this.sendBuyform={
                    //活动名称
                    name:row.name,
                    //活动时间
                    startTime:row.startTime,
                    endTime:row.endTime,
                    //优惠形式
                    discountType:row.discountType,
                    discountValue:row.discountValue,
                    //发送方式
                    receiveType:row.receiveType,
                    //发行卷数
                    minOrderAmount:row.minOrderAmount,
                    //每人领取
                    numberPerMember:row.numberPerMember,
                    //总发行卷数
                    totalNumber:row.totalNumber,
                    //适用范围
                    productCollection:row.productCollection,
                    //使用门槛
                    usingThreshold:row.usingThreshold,
                    minOrderAmount:row.minOrderAmount,
                    //使用说明
                    description:row.description,
                    //会员等级
                    listLevelUid:row.listLevelUid,
                    //0为所有会员,会员等级设置编号
                    memberLevelCollection:row.memberLevelCollection
                }
            },


            //删数商品
            delbuySends(uid){
               alert("d")
            },
            //删除数据
            deleteLink(uid){
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post(promotion.deletePromotionPlan, {
                        uid:uid
                    }).then(res => {
                        if (res.data.state) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                            this.fetchData(this.currentPage, this.pageSize)
                        }
                    })
                })
            },
            
            fetchCategory() {
                this.$axios
                    .post(product.listAllCategory, {
                        language: localStorage.lang
                    })
                    .then(res => {
                    if (res.data.state) {
                        this.categorys = res.data.data
                    }
                });
            },
            getCurrentSize (size) {
                this.fetchData(1, size)
            },
            getCurrentPage (num) {
                this.fetchData(num, this.pageSize)
            },
            fetchData (pageNum, pageSize) {
                this.currentPage = pageNum
                this.pageSize = pageSize
                this.loading = true
                this.$axios.post(promotion.lsitPromotion, {
                    pageSize: this.pageSize,
                    page: this.currentPage
                }).then(res => {
                    this.loading = false
                    if (res.data.state) {
                        if (res.data.data) {
                            this.tableData = res.data.data.dataList
                            this.totalCount = res.data.data.totalCount
                        } else {
                            this.tableData = []
                            this.totalCount = 0
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: '请求失败'
                        })
                    }
                }).catch(err => {
                    this.loading = false
                    this.$message({
                        type: 'error',
                        message: '服务器错误'
                    })
                })
            },
            chooseProduct () {
                this.searchProduct(1, 20)
                this.proDialog = true
            },
            //选择商品列表分页
            getProCurrentSize (size) {
                this.searchProduct(1, size)
            },
            getProCurrentPage (num) {
                this.searchProduct(num, this.pageSize)
            },
            //获取商品列表
            searchProduct (page, size) {
                this.$axios.post(product.searchProductApi, {
                    page: page,
                    pageSize: size,
                    procode: this.params.procode,
                    protitle: this.params.protitle,
                    language: this._defaultLang,
                    state: 1,
                    protype: '',
                    categoryuid: this.params.categoryUid.length > 0 ? this.params.categoryUid[this.params.categoryUid.length - 1] : 0
                }).then(res => {
                    if (res.data.state) {
                        this.proList = res.data.data.dataList
                        this.total = res.data.data.totalCount
                    }
                })
            },
            //勾选商品
            handleCheck (item) {
                var arr={};
                
                arr.productUid=item.uid;
                arr.skuUid=0;
                arr.title=item.cntitle;
                this.skuBox.push(arr);
            },
            // 确认添加
            confirmAdd () {
                //getSelectedValue是勾选的值   skuBox是赋值到表格的数据
                this.proDialog=false;
                // 清空临时列表tempList
                this.tempList = []
            },
      },
      components: {
        Pager
      }
    }
</script>

<style scoped>
  .icon{
    font-size: 18px;
  }
  .productTable{
      width:100%;
      border:1px solid #ccc;
      border-bottom:none;
  }
  .productTable th{
      border-bottom:1px solid #ccc;
      background-color: #f6f6f6;
      height:30px;
  }
  .productTable td{
      border-right:1px solid #ccc;
      text-align: center;
      height:35px;
      border-bottom:1px solid #ccc;
  }
  .content{
    margin: 0;
    padding: 0;
  }
  .radio-item{
    display: block;
    height: 32px;
    line-height: 32px;
    list-style-type: none;
}
.product-wrap{
    height: 300px;
    overflow: hidden;
    padding: 20px;
    margin: 10px 0;
    border: 1px solid #ebebeb;
}
.flex-t{
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 65%;
}
.issuance-left{
    margin-left:30px;
}
</style>
