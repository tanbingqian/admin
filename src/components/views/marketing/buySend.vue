<template>
    <div class="page-wrap">
         <p>
            <el-button type="text" @click="addLink">+新增买赠</el-button>
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
                    label="优惠方式"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    align="center"
                    label="活动时间">
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
                        <!-- <el-button type="primary" size="small" icon="el-icon-edit"  @click="editbuySend(scope.row)"></el-button>
                        <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteLink(scope.row.uid)"></el-button> -->

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
                    <el-col :span="8">
                        <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" type="datetime" v-model="sendBuyform.startTime"></el-date-picker>
                    </el-col>
                    <el-col :span="2" style="text-align: center;">至</el-col>
                    <el-col :span="8">
                        <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" type="datetime" v-model="sendBuyform.endTime"></el-date-picker>
                    </el-col>
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

                <el-form-item label="满">
                    <el-input v-model="sendBuyform.minOrderAmount" style="width:185px;" class="mr20"></el-input>元
                </el-form-item>

                <el-form-item label="优惠方式">
                    <div class="preferentialWay">
                             <el-checkbox :true-label="1" :false-label="0" v-model="sendBuyform.exceptShipfee">包邮</el-checkbox>
                             <el-form-item>
                                <el-checkbox :true-label="1" :false-label="0" v-model="sendBuyform.superpostion">是否叠加</el-checkbox>
                             </el-form-item>
                             <div class="flex">
                                <el-checkbox class="mb20" v-model="checkedAmount">
                                    减&nbsp;<el-input v-model="sendBuyform.amount" placeholder="请输入内容" style="width:100px;"></el-input>&nbsp;元
                                    <el-radio v-model="sendBuyform.loop_gf" :label="1" class="mb20">循环满减</el-radio>
                                </el-checkbox>
                             </div>
                            <el-checkbox class="mb20" v-model="checkedScore">
                                 送&nbsp;<el-input v-model="sendBuyform.score" placeholder="请输入内容" style="width:100px;"></el-input>&nbsp;积分
                            </el-checkbox>
                            <el-checkbox :label="3" style="margin-left: 0;" v-model="checkedGive">
                                 送&nbsp;<el-input v-model="sendBuyform.giveProductCollection" placeholder="请选择商品" style="width:200px;"></el-input>  
                                 <el-button type="text" @click="chooseProduct()">+添加商品1</el-button>
                            </el-checkbox>
                            <el-table :data="result">
                                <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
                                <el-table-column align="center" label="SKU" prop="skuValueUidText"></el-table-column>
                                <el-table-column align="center" label="操作">
                                    <template slot-scope="scope">
                                        <el-button size="small" icon="el-icon-delete" @click="deleteResult(scope.row.uid, scope.row.index)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                    </div>
                </el-form-item>

                <el-form-item label="适用范围">
                    <el-radio v-model="sendBuyform.productCollection" :label="0" class="mr20">全店商品</el-radio>
                    <el-radio v-model="sendBuyform.productCollection" :label="1" class="mr20">指定商品</el-radio>
                    <el-radio v-model="sendBuyform.productCollection" :label="2">指定商品不可用</el-radio>

                    <el-table :data="resultTwo" v-show="sendBuyform.productCollection==1 || sendBuyform.productCollection==2">
                        <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                  <el-button size="small" icon="el-icon-delete" @click="deleteResultTwo(scope.row.uid, scope.row.index)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="text" @click="chooseProductNoSku()" v-show="sendBuyform.productCollection==1 || sendBuyform.productCollection==2">+添加商品2</el-button>
                </el-form-item>
              
               
                <div style="text-align: center;">
                    <el-button type="primary" size="small" @click="addSendBuy=false">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    <el-button type="primary" size="small" @click="saveLink">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </el-form>
        </el-dialog>

          <!-- 选择商品 -->
            <el-dialog :visible.sync="proDialog" title="添加商品" width="60%">
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
                    <el-table-column align="center" v-if="showRentPrise">
                        <template slot-scope="scope">
                            <el-checkbox @change="handleCheck(scope.row)" v-model="scope.row.isCheck"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" v-else>
                        <template slot-scope="scope">
                            <el-checkbox @change="handleCheckTwo(scope.row)" v-model="scope.row.isCheck"></el-checkbox>
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
                    <el-table-column align="center" label="操作" v-if="showRentPrise">
                        <template slot-scope="scope">
                            <el-button v-show="scope.row.productType === 'FIXED'" type="text" @click="chooseSku(scope.row)">选择sku</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页组件 -->
                <pager
                    :style="{'background-color': '#fff'}"
                    :total="total"
                    layout="prev, pager, next"
                    :currentPage="page"
                    :pageSize="size"
                    @getCurrentSize="getProCurrentSize"
                    @getCurrentPage="getProCurrentPage"
                ></pager>
                <el-row style="text-align: center;" v-if="showRentPrise">
                    <el-button type="primary" size="small" @click="confirmAdd">&nbsp;&nbsp;确认添加&nbsp;&nbsp;</el-button>
                </el-row>
                <el-row style="text-align: center;" v-else>
                    <el-button type="primary" size="small" @click="confirmAddTwo">&nbsp;&nbsp;确认添加&nbsp;&nbsp;</el-button>
                </el-row>
            </el-dialog>
            <!-- sku选择 -->
            <el-dialog
                :visible.sync="checkSkuDialog"
                title="选择sku"
                width="30%"
                >
                <el-row type="flex" v-for="sku in skuValue" :key="sku.uid" style="padding: 10px 0;">
                    <el-col style="padding-right: 20px; padding-left: 20px; width: 40px; text-align: center;">
                    <el-checkbox v-model="sku.isCheck" @change="handleSkuCheck(sku)"></el-checkbox>
                    </el-col>
                    <el-col class="col-body-l">{{ sku.skuValueUidText }}</el-col>
                </el-row>
                <el-row style="padding-top: 30px; text-align:center;">
                    <!-- <el-button type="primary" size="small" @click="checkSkuDialog = false">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button> -->
                    <el-button
                    type="primary"
                    size="small"
                    @click="confirmSku"
                    >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;确定&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </el-row>
            </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import Pager from '@/components/common/Pager'
    import { promotion, product, member} from '@/common/api.js'
    import BScroll from 'better-scroll'
    import _ from 'underscore'
    export default {
        name: "buySend",
        props: ['uid'],
        data(){
          return{
            checkedAmount:false,
            checkedScore:false,
            checkedGive:false,
            showRentPrise:false,
            loading: true,
            addSendBuy:false,
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
                //满减
                minOrderAmount:'',
                //适用范围
                productCollection:0,
                //会员等级
                listLevelUid:[],
                //0为所有会员,会员等级设置编号
                memberLevelCollection:0,
                //循环满减
                loop_gf:'',
                //满
                amount:'',
                //积分
                score:'',
                //勾选商品SKU
                giveProductCollection:'',
                //包邮
                exceptShipfee:'',
                //没有SKU商品
                listProductSku:[],
                //有sku商品
                listGiveProductSku:[],
                //是否叠加
                superpostion:''
            },
            memberList:[],
            //活动类型
            promotionType:'BUY_GET_FREE',
            
            proDialog:false,
            page: 1, //选择商品列表分页
            size: 10,
            total: 0,
            checkSkuDialog: false,
            skuValue: [],
            currentGood: null,
            result: [], // 满减满赠商品
            resultTwo:[],//满减满赠商品
            tempList: [], // 临时存储即将添加到满减/满赠商品的sku数据
            flag:'add'
          }
        },
        created () {
           this.selectchangeMember();
           this.fetchData(this.currentPage, this.pageSize)
           this.selectchangeMember();
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
                this.sendBuyform.listGiveProductSku=this.result; //有SKU的商品列表
                this.sendBuyform.listProductSku=this.resultTwo; //没有SKU的商品列表
                let url=''
                if(this.flag==='add'){
                     url=promotion.savePromotionBgfPlan
                }else{
                     url=promotion.saveUpdatePromotionBgfPlan
                }

                //在提交表单里面添加promotionType类型
                this.sendBuyform.promotionType=this.promotionType

                //商品限制方式：1表示包含，-1表示不包含
                if(this.sendBuyform.productCollection=='0'){
                     this.sendBuyform.productCollectionType='1'
                }else if(this.sendBuyform.productCollection=='1'){
                     this.sendBuyform.productCollectionType='1'
                }else{
                    this.sendBuyform.productCollectionType='-1'
                }
                this.$axios.post(url,this.sendBuyform).then(res => {
                     this.fetchData(1, this.pageSize);
                     this.dialogTitle=false;
                     console.log(res)
                })
            },
            //新增
            addLink(){
                this.flag='add';
                this.dialogTitle="新增满赠/满减套餐设置"
                this.addSendBuy=true;

                //用户名
                this.sendBuyform.name='',
                 //活动时间
                this.sendBuyform.startTime='',
                this.sendBuyform.endTime='',
                //满减
                this.sendBuyform.minOrderAmount='',
                //适用范围
                this.sendBuyform.productCollection=0,
                //会员等级
                this.sendBuyform.listLevelUid=[],
                //0为所有会员,会员等级设置编号
                this.sendBuyform.memberLevelCollection=0,
                //循环满减
                this.sendBuyform.loop_gf='',
                //满
                this.sendBuyform.amount=0,
                //积分
                this.sendBuyform.score=0,
                //勾选商品SKU
                this.sendBuyform.giveProductCollection=0,
                //包邮
                this.sendBuyform.exceptShipfee='',
                //没有SKU商品
                this.sendBuyform.listProductSku=[],
                //有sku商品
                this.sendBuyform.listGiveProductSku=[],
                //是否叠加
                this.sendBuyform.superpostion=''
            },
            //编辑
            editbuySend(item){
                this.flag='edit'
                // this.sendBuyform=row;
                this.dialogTitle="编辑满赠/满减套餐设置"
                this.addSendBuy=true;
                this.result.splice(0)
                this.editGoLink(item.uid)
            },
            //修改返回
            editGoLink(uid){
                this.$axios.post(promotion.getPromotionBgfPlan, {
                    uid: uid,
                    lang: localStorage.lang
                }).then(res => {
                    if (res.data.state) {
                        //用户名
                        this.sendBuyform.name=res.data.data.name
                        //活动时间
                        this.sendBuyform.startTime=res.data.data.startTime
                        this.sendBuyform.endTime=res.data.data.endTime
                        //满减
                        this.sendBuyform.minOrderAmount=res.data.data.minOrderAmount
                        //适用范围
                        this.sendBuyform.productCollection=res.data.data.productCollection
                        //会员等级
                        this.sendBuyform.listLevelUid=res.data.data.listLevelUid
                        //0为所有会员,会员等级设置编号
                        this.sendBuyform.memberLevelCollection=res.data.data.memberLevelCollection
                        //循环满减
                        this.sendBuyform.loop_gf=res.data.data.loop_gf
                        //满
                        this.sendBuyform.amount=res.data.data.amount
                        //积分
                        this.sendBuyform.score=res.data.data.score
                        //勾选商品SKU
                        this.sendBuyform.giveProductCollection=res.data.data.giveProductCollection
                        //包邮
                        this.sendBuyform.exceptShipfee=res.data.data.exceptShipfee,
                        //没有SKU商品
                        this.sendBuyform.listProductSku=res.data.data.listProductSku
                        //是否叠加
                        this.sendBuyform.superpostion=res.data.data.superpostion
                        //返回-没有SKU商品
                        let listTwo=res.data.data.listProduct
                        //有sku商品
                        let list=res.data.data.listGiveProduct
                        if (list) {
                            list.forEach(tmp => {
                                this.result.push({
                                    name: tmp.productTitle,
                                    productUid: tmp.productUid,
                                    skuUid: tmp.skuUid,
                                    skuValueUidText: tmp.skuValue,
                                    price: tmp.price, // 团购价格
                                    number: tmp.number, //库存
                                    promotionUid: tmp.promotionUid,
                                    skuUid: tmp.uid
                                })
                            })
                        }
                        //没有SKU商品
                        if (listTwo) {
                            listTwo.forEach(tmp => {
                                this.resultTwo.push({
                                    name: tmp.productTitle,
                                    productUid: tmp.productUid,
                                    skuUid: tmp.skuUid,
                                    skuValueUidText: tmp.skuValue,
                                    price: tmp.price, // 团购价格
                                    number: tmp.number, //库存
                                    promotionUid: tmp.promotionUid,
                                    uid: tmp.uid
                                })
                            })
                        }
                        //判断满减大于零回显是勾选
                        if(this.sendBuyform.amount>0){
                             this.checkedAmount=true;
                        }
                        if(this.sendBuyform.score>0){
                             this.checkedScore=true;
                        }
                        if(this.sendBuyform.giveProductCollection>0){
                             this.checkedGive=true;
                        }
                    }
                })
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

        //没有SKU的
        chooseProductNoSku(){
            this.showRentPrise=false;
            this.searchProduct(1, this.size)
            this.proDialog = true
            // 将result数据添加到tempList中
            this.resultTwo.forEach(item => {
                this.tempList.push(item)
            })
        },
        //有SKU的
        chooseProduct () {
            this.showRentPrise=true;
            this.searchProduct(1, this.size)
            this.proDialog = true
            // 将result数据添加到tempList中
            this.result.forEach(item => {
                this.tempList.push(item)
            })
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
            this.$axios.post(promotion.lsitPromotionBgfPlan, {
                lang: localStorage.lang,
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
                }
            }).catch(err => {
                this.loading = false
                this.$message({
                    type: 'error',
                    message: '获取数据失败'
                })
            })
        },
        //选择商品列表分页
        getProCurrentSize (size) {
            this.searchProduct(1, size)
        },
        getProCurrentPage (num) {
            this.searchProduct(num, this.size)
        },
        // 判断临时列表tempLsit商品是否已经添加到砍价列表
        isAlreadyInBargain (item, arr) {
            if (item.skuUid === 0) {
                // 非成品，没有sku
                const index = arr.findIndex(ele => ele.productUid === item.productUid)
                return index > -1
            } else {
                // 成品商品，存在sku
                const index = arr.findIndex(ele => ele.skuUid === item.skuUid)
                return index > -1
            }
        },
        // 判断商品是否已在临时列表中
        proIsAlreadyInTemp (pro, arr) {
            const index = arr.findIndex(tmp => pro.uid === tmp.productUid)
            return index > -1
        },
        // 判断sku是否已在临时列表中
        skuIsAlreadyInTemp (item, arr) {
            const index = arr.findIndex(tmp => item.uid === tmp.skuUid)
            return index > -1
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
                    // 设置商品的勾选状态
                    this.proList.forEach(p => {
                        if (this.proIsAlreadyInTemp(p, this.tempList)) {
                            this.$set(p, 'isCheck', true)
                        } else {
                            this.$set(p, 'isCheck', false)
                        }
                    })
                    // 判断数据是否已在tempList中
                    this.total = res.data.data.totalCount
                }
            })
        },
        // 选择sku按钮
        chooseSku (item) {
            item.isCheck = true
            this.handleCheck(item)
        },
        //有SKU的勾选商品
        handleCheck (item) {
            // 判断商品类型，添加到勾选列表
            if (item.productType === 'FIXED') {
                this.$axios.post(product.listProductSkuValueLang, {
                    lang: localStorage.lang,
                    uid: item.uid
                }).then(res => {
                    if (item.isCheck) {
                        // 选中时，判断是否存在sku
                        if (res.data.data.length > 0) {
                            // 有sku，显示sku列表选择
                            this.checkSkuDialog = true
                            this.skuValue = res.data.data
                            // 设置sku的选中状态
                            this.skuValue.forEach(item => {
                                if (this.skuIsAlreadyInTemp(item, this.tempList)) {
                                    this.$set(item, 'isCheck', true)
                                } else {
                                    this.$set(item, 'isCheck', false)
                                }
                            })
                            this.currentGood = item
                        } else {
                            this.$message({
                                type: 'error',
                                message: '该成品商品没有sku，无法添加'
                            })
                        }
                    } else {
                        // 取消选中，tempList移除该商品所有的sku数据
                        this.tempList.forEach((tmp, index) => {
                            if (tmp.productUid === item.uid) {
                                this.tempList.splice(index, 1)
                            }
                        })
                    }
                })
            } else {
                // 不是成品商品，不存在sku
                if (item.isCheck) {
                    // 没有sku的数据，勾选后直接添加到临时列表tempList中
                    if (!this.proIsAlreadyInTemp(item, this.tempList)) {
                        this.tempList.push({
                            name: item.langtitle,
                            productUid: item.uid,
                            skuUid: 0,
                            skuValueUidText: '',
                            price: 0, // 底价
                            number: 0, //库存
                            promotionUid: 0,
                            uid: 0
                        })
                    }
                } else {
                    // 取消直接在临时列表删除该数据
                    const index = this.tempList.findIndex(tmp => tmp.uid === item.uid)
                    if (index > -1) this.tempList.splice(index, 1)
                }
            }
        },

        //没用SKU的可以直接选的商品
        handleCheckTwo(item){
            this.$axios.post(product.listProductSkuValueLang, {
                    lang: localStorage.lang,
                    uid: item.uid
                }).then(res => {
                    if (item.isCheck) {
                         // 没有sku的数据，勾选后直接添加到临时列表tempList中
                        if (!this.proIsAlreadyInTemp(item, this.tempList)) {
                            this.tempList.push({
                                name: item.langtitle,
                                productUid: item.uid,
                                skuUid: 0,
                                skuValueUidText: '',
                                price: 0, // 底价
                                number: 0, //库存
                                promotionUid: 0,
                                uid: 0
                            })
                        }
                    } else {
                        // 取消选中，tempList移除该商品所有的sku数据
                        this.tempList.forEach((tmp, index) => {
                            if (tmp.productUid === item.uid) {
                                this.tempList.splice(index, 1)
                            }
                        })
                    }
                })
        },
        // 删除满赠/满减商品
        deleteResult (uid, index) {
            if (uid === 0) {
                this.result.splice(index, 1)
            } else {
                this.$axios.post(promotion.delBargainPro, {
                    uid: uid,
                    lang: localStorage.lang
                }).then(res => {
                    if (res.data.state) {
                        this.result.splice(index, 1)
                    }
                })
            }
        },
        // 删掉满赠/满减没有SKU商品
        deleteResultTwo (uid, index) {
            if (uid === 0) {
                this.resultTwo.splice(index, 1)
            } else {
                this.$axios.post(promotion.delBargainPro, {
                    uid: uid,
                    lang: localStorage.lang
                }).then(res => {
                    if (res.data.state) {
                        this.resultTwo.splice(index, 1)
                    }
                })
            }
        },
        // 选择取消sku
        handleSkuCheck (sku) {},
        // 确认sku，添加
        confirmSku () {
            this.skuValue.forEach(item => {
                if (item.isCheck && !this.skuIsAlreadyInTemp(item, this.tempList)) {
                    this.tempList.push({
                        name: this.currentGood.langtitle,
                        productUid: this.currentGood.uid,
                        skuUid: item.uid,
                        skuValueUidText: item.skuValueUidText,
                        price: 0, // 底价
                        number: 0, //库存
                        promotionUid: 0,
                        uid: 0
                    })
                }
            })
            this.checkSkuDialog = false
        },
        // 有sku确认添加
        confirmAdd () {
            // 判断临时列表tempList数据是否已在满减/满赠列表中
            this.tempList.forEach(tmp => {
                if (!this.isAlreadyInBargain(tmp, this.result)) {
                    this.result.push({
                        name: tmp.name,
                        productUid: tmp.productUid,
                        skuUid: tmp.skuUid,
                        skuValueUidText: tmp.skuValueUidText,
                        price: tmp.price, // 底价
                        number: tmp.number, //库存
                        promotionUid: tmp.promotionUid,
                        uid: tmp.uid
                    })
                }
            })
            this.proDialog = false
            // 清空临时列表tempList
            this.tempList.splice(0)
        },
        // 没有SKU和定制确认添加
        confirmAddTwo () {
            // 判断临时列表tempList数据是否已在满减/满赠列表中
            this.tempList.forEach(tmp => {
                if (!this.isAlreadyInBargain(tmp, this.resultTwo)) {
                    this.resultTwo.push({
                        name: tmp.name,
                        productUid: tmp.productUid,
                        skuUid: tmp.skuUid,
                        skuValueUidText: tmp.skuValueUidText,
                        price: tmp.price, // 底价
                        number: tmp.number, //库存
                        promotionUid: tmp.promotionUid,
                        uid: tmp.uid
                    })
                }
            })
            this.proDialog = false
            // 清空临时列表tempList
            this.tempList.splice(0)
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
        }
           
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
.preferentialWay{
   display: flex;flex-flow: column;
}
.mb20{
   margin-bottom: 10px;
}
.mr20{
    margin-right: 20px;
}
</style>
