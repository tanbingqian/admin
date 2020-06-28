<template>
  <div class="normal-form">
    <p class="title">
      <span class="strong-text">商品清单</span>
      <el-button type="primary" size="small" @click="addGoodsTitle(1)">添加成品商品</el-button>
      <el-button type="primary" size="small" @click="addGoodsTitle(2)">添加定制商品</el-button>
    </p>
    <el-row>
      <el-col>
        <el-table :data="shopCart">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column align="center" label="设计单号/商品ID" prop="uid"></el-table-column>
          <el-table-column align="center" label="商品图片">
            <template slot-scope="scope">
              <img
                v-if="scope.row.skuImage"
                width="60"
                height="40"
                :src="_fileHost.PRODUCT_IMAGE + scope.row.skuImage + '?x-oss-process=image/resize,l_100'"
              >
              <img
                v-else
                v-for="img in scope.row.imageList"
                :key="img"
                width="60"
                height="40"
                :src="_fileHost.PRODUCT_IMAGE + img + '?x-oss-process=image/resize,l_100'"
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称" prop="productTitle">
            <template
              slot-scope="scope"
            >{{ scope.row.skuvalue ? (scope.row.langtitle || scope.row.cntitle) + scope.row.skuvalue : (scope.row.langtitle || scope.row.cntitle) }}</template>
          </el-table-column>
          <el-table-column align="center" label="商品类型" prop="productType">
            <template slot-scope="scope">{{ scope.row.productType | proType }}</template>
          </el-table-column>
          <el-table-column align="center" label="零售价" prop="price"></el-table-column>
          <!-- 经销商账户才显示经销价 -->
          <el-table-column align="center" label="经销价" prop="purchansePrice"></el-table-column>
          <el-table-column align="center" label="数量">
            <template slot-scope="scope">
              <el-input placeholder="请输入购买数量" v-model="scope.row.count"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span @click="delShopCart(scope.row)">
                <i style="color: red; padding: 5px; cursor: pointer;" class="icon el-icon-delete"></i>
              </span>
              <!-- <el-button icon="el-icon-delete" type="danger" size="mini"></el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <p class="title">
      <span class="strong-text">收货信息</span>
    </p>
    <el-form ref="orderForm" label-width="80px" label-position="right" :model="form" :rules="rules">
      <el-row style="margin-bottom: 22px;">
        <el-col :span="12">
          <el-input type="textarea" :rows="3" placeholder="粘贴收货信息，自动识别姓名、号码、地址"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="6">
          <el-form-item label="收货人" prop="receivername">
            <el-input v-model="form.receivername"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系电话" prop="tel">
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="选择地区">
            <city v-model="city"></city>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
                <el-col :span="6">
                    <el-form-item label="会员名称" prop="buyername">
                        <el-input v-model="form.buyername"></el-input>
                    </el-form-item>
                </el-col>
      </el-row>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="买家留言">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              maxlength="50"
              placeholder="最多不超过50个字"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>共{{ shopCart.length }}件商品，运费 ¥13，合计实付金额 ¥13</el-row>
      <el-row>
        <el-col :span="12" style="text-align: center; margin-top: 22px;">
          <el-button type="primary" size="medium" @click="createOrder" :loading="loading">提交订单</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 添加成品商品弹窗 -->
    <el-dialog :visible.sync="fixDialog" title="添加成品商品" width="60%">
      <el-form label-width="80px" label-position="right">
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品编码">
              <el-input v-model="params.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称">
              <el-input v-model="params.name"></el-input>
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
                v-model="params.category"
                expand-trigger="hover"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center; margin-bottom: 22px;">
          <el-button
            type="primary"
            size="small"
            @click="fetchData(1, pageSize)"
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;查 询&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        </el-row>
      </el-form>
      <el-table :data="tableData" max-height="400">
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
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="addShopCart(scope.row)">添加商品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <pager
        :style="{'background-color': '#fff'}"
        :total="totalCount"
        layout="prev, pager, next"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @getCurrentSize="getCurrentSize"
        @getCurrentPage="getCurrentPage"
      ></pager>
      <el-row style="text-align: center;">
        <el-button type="primary" size="small" @click="confirmAdd">&nbsp;&nbsp;确认添加&nbsp;&nbsp;</el-button>
      </el-row>
    </el-dialog>
    <!-- 添加定制商品弹窗 -->
    <el-dialog :visible.sync="conDialog" title="添加定制商品" width="60%">
      <el-form label-width="80px" label-position="right">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设计单号">
              <el-input v-model="params.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品名称">
              <el-input v-model="params.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center; margin-bottom: 22px;">
          <el-button
            type="primary"
            size="small"
            @click="fetchData(1, pageSize)"
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;查 询&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        </el-row>
      </el-form>
      <el-row type="flex" class="row-header">
        <el-col style="padding-right: 20px; padding-left: 20px; width: 40px;">&nbsp;</el-col>
        <el-col class="col-header">设计单号</el-col>
        <el-col class="col-header">商品图片</el-col>
        <el-col class="col-header">商品名称</el-col>
        <el-col class="col-header">供应商</el-col>
        <el-col class="col-header">价格</el-col>
        <el-col class="col-header">操作</el-col>
      </el-row>
      <el-row type="flex" class="row-body" v-for="(data, index) in tableData" :key="index">
        <el-col style="padding-right: 20px; padding-left: 20px; width: 40px; text-align: center;">
          <el-checkbox @change="handleCheck(data)" v-model="data.isCheck"></el-checkbox>
        </el-col>
        <el-col class="col-body-c">{{ data.uid }}</el-col>
        <el-col class="col-body-c">
          <img
            class="custom-img"
            v-for="(img, index) in data.imageList"
            :key="index"
            :src="_fileHost.PRODUCT_IMAGE + img"
            width="60"
            height="40"
          >
        </el-col>
        <el-col class="col-body-c">{{ data.langtitle ? data.langtitle : data.cntitle }}</el-col>
        <el-col class="col-body-c">{{ data.supplierUid }}</el-col>
        <el-col class="col-body-c">{{ data.price }}</el-col>
        <el-col class="col-body-c">
          <el-button type="text" size="small" @click="addShopCart(data)">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 分页组件 -->
      <pager
        :total="totalCount"
        :style="{'background-color': '#fff'}"
        layout="prev, pager, next"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @getCurrentSize="getCurrentSize"
        @getCurrentPage="getCurrentPage"
      ></pager>
      <el-row style="text-align: center;">
        <el-button type="primary" size="small" @click="confirmAdd">&nbsp;&nbsp;确认添加&nbsp;&nbsp;</el-button>
      </el-row>
    </el-dialog>
    <!-- 选择sku弹窗 -->
    <el-dialog
      :visible.sync="checkSkuDialog"
      :title="'选择 ' + currentGood.cntitle + '   的SKU'"
      width="30%"
    >
      <el-row type="flex" v-for="sku in skuValue" :key="sku.uid" style="padding: 10px 0;">
        <el-col style="padding-right: 20px; padding-left: 20px; width: 40px; text-align: center;">
          <el-checkbox v-model="sku.isCheck" @change="handleSkuCheck(sku)"></el-checkbox>
        </el-col>
        <el-col class="col-body-l">{{ sku.skuTitle }}</el-col>
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
import Pager from "@/components/common/Pager";
import { product, order, resale } from "@/common/api.js";
import City from "@/components/common/city/city";
import { treeFilter } from "@/common/utils/array";
export default {
  name: "CreateOrder",
  created() {
    this.fetchCategory();
  },
  data() {
    return {
      fixDialog: false, // 成品
      conDialog: false, // 定制
      checkSkuDialog: false, // sku选择框
      showDialogTitle: "",
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      loading: false,
      params: {
        code: "",
        name: "",
        category: [],
        state: [],
        protype: "FIXED"
      },
      tableData: [],
      categorys: [],
      selectData: [], // 暂存勾选数据
      shopCart: [], // 购物车
      flag: "add", // 判断是直接添加sku进入购物车，还是勾选checkbox将sku将入selectData中
      form: {
        address: "",
        areaname: "",
        areauid: 0,
        // buyername: '',
        listproduct: [],
        receivername: "",
        remark: "",
        tel: ""
      },
      city: [],
      skuValue: [],
      currentGood: {},
      confirmSkuLoading: false, // 设置查询sku采购价按钮状态
      rules: {
        address: [
          { required: true, message: "收货地址不能为空", trigger: "blur" }
        ],
        // buyername: [
        //     { required: true, message: '会员名称不能为空', trigger: 'blur' }
        // ],
        receivername: [
          { required: true, message: "收货人不能为空", trigger: "blur" }
        ],
        tel: [{ required: true, message: "联系电话不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    conDialog(newVal, oldVal) {
      if (newVal) {
        // 打开
        // 将购物车数据添加到selectdata中
        this.shopCart.forEach(row => {
          this.selectData.push(row);
        });
      } else {
        // 关闭
        // 清空selectData
        this.selectData = [];
        // 清空查询条件
        this.params.name = "";
        this.params.procode = "";
        this.params.categoryuid = [];
      }
    },
    fixDialog(newVal, oldVal) {
      if (newVal) {
        // 打开
        // 将购物车数据添加到selectdata中
        this.shopCart.forEach(row => {
          this.selectData.push(row);
        });
      } else {
        // 关闭
        // 清空selectData
        this.selectData = [];
        // 清空查询条件
        this.params.name = "";
        this.params.procode = "";
        this.params.categoryuid = [];
      }
    }
  },
  methods: {
    // 判断数组中是否已有该商品
    isAlreayAddToCart(data, arr) {
      if (data.skuuid) {
        // 成品商品判断uid和skuuid是否都相等
        const index = arr.findIndex(
          row => row.uid === data.uid && row.skuuid === data.skuuid
        );
        return index > -1;
      } else {
        // 没有sku的商品
        const index = arr.findIndex(row => row.uid === data.uid);
        return index > -1;
      }
    },
    // 判断sku属性是否已经选中
    isAlreayCheckSku(data, arr) {
      const index = arr.findIndex(row => row.skuuid === data.uid);
      return index > -1;
    },
    // 勾选商品，添加到临时的selectData中
    handleCheck(data) {
      this.flag = "check"; // 勾选checkbox
      if (data.productType === "FIXED") {
        this.$axios
          .post(product.listProductSkuValueLang, {
            lang: localStorage.lang,
            uid: data.uid
          })
          .then(res => {
            if (res.data.state) {
              // 获取商品的sku值
              this.skuValue = res.data.data;
              if (data.isCheck) {
                // 勾选选中
                if (this.skuValue.length <= 0) {
                  // 如果没有sku属性
                  // this.addFunc(data)
                  this.$message({
                    type: "error",
                    message: "该商品没有添加sku属性，无法购买"
                  });
                } else {
                  // 弹出sku选择框选择需要的sku
                  this.currentGood = data; // 设置sku弹窗标题
                  this.skuValue.forEach(item => {
                    this.$set(item, "isCheck", false);
                    this.$set(item, "skuTitle", item.skuValueUidText);
                  });
                  this.checkSkuDialog = true; // 显示sku选择弹框
                }
              } else {
                // 勾选取消, 取消商品的所有的sku
                this.selectData.forEach((row, index) => {
                  if (row.uid === data.uid) {
                    this.selectData.splice(index, 1);
                  }
                });
              }
            }
          });
      } else {
        // 勾选定制商品
        // 查询商品的采购价
        this.$axios
          .post(resale.getSaveOrderProductPurchaseprice, {
            levelUid: 0,
            productUid: data.uid,
            skuUid: 0
          })
          .then(res => {
            if (res.data.state) {
              // 计算商品采购价
              let type = res.data.data.purtype;
              let radio = res.data.data.purchasePrice;
              let purchansePrice = "";
              switch (type) {
                case "SITERESELLER":
                  // 采购价 0
                  purchansePrice = 0;
                  break;
                case "PRODUCT":
                  // 采购价等于商品价
                  purchansePrice = data.price;
                  break;
                case "SUCCESSNULL":
                  // 采购价等于商品价格 * 比例
                  purchansePrice = data.price
                  break;
                case "CATEGORY":
                  // 采购价等于商品价格 * 比例
                  purchansePrice = (
                    (radio * data.price) /
                    100
                  ).toFixed(2);
                  break;
              }
              this.$set(data, 'purchansePrice', purchansePrice)
              this.$nextTick(function () {
                  if (data.isCheck) {
                    // 选中该商品
                    if (!this.isAlreayAddToCart(data, this.selectData)) {
                    this.selectData.push(data);
                    }
                } else {
                    // 取消选中该商品
                    const index = this.selectData.findIndex(row => {
                    row.uid === data.uid;
                    });
                    this.selectData.splice(index, 1);
                }
              })
            }
          });
      }
    },
    // 否选sku列表前面的checkbox
    handleSkuCheck(sku) {
      // 判断是否已有采购价字段
      if (sku.purchansePrice === undefined) {
        // 查询不同sku的商品的采购价
        this.$axios
          .post(resale.getSaveOrderProductPurchaseprice, {
            levelUid: 0,
            productUid: this.currentGood.uid,
            skuUid: sku.skuuid
          })
          .then(res => {
            if (res.data.state) {
              // 计算商品采购价
              let type = res.data.data.purtype;
              let radio = res.data.data.purchasePrice;
              let purchansePrice = "";
              switch (type) {
                case "SITERESELLER":
                  // 采购价 0
                  purchansePrice = 0;
                  break;
                case "PRODUCT":
                  // 采购价等于商品价
                  purchansePrice = this.currentGood.price;
                  break;
                case "SUCCESSNULL":
                  // 采购价等于商品价格 * 比例
                  purchansePrice = this.currentGood.price
                  break;
                case "CATEGORY":
                  // 采购价等于商品价格 * 比例
                  purchansePrice = (
                    (radio * this.currentGood.price) /
                    100
                  ).toFixed(2);
                  break;
              }
              if (sku.isCheck) {
                // 选中该sku
                if (!this.isAlreayCheckSku(sku, this.selectData)) {
                  this.selectData.push(
                    Object.assign(
                      {
                        skuuid: sku.uid,
                        skuvalue: sku.skuTitle,
                        skuImage: sku.image,
                        purchansePrice: purchansePrice
                      },
                      this.currentGood
                    )
                  );
                }
              } else {
                // 取消该sku
                const index = this.selectData.findIndex(
                  row => row.skuuid === sku.uid
                );
                this.selectData.splice(index, 1);
              }
            }
          });
      } else {
        // 已经查询过采购价
        if (sku.isCheck) {
          // 选中该sku
          if (!this.isAlreayCheckSku(sku, this.selectData)) {
            this.selectData.push(
              Object.assign(
                {
                  skuuid: sku.uid,
                  skuvalue: sku.skuTitle,
                  skuImage: sku.image,
                  purchansePrice: sku.purchansePrice
                },
                this.currentGood
              )
            );
          }
        } else {
          // 取消该sku
          const index = this.selectData.findIndex(
            row => row.skuuid === sku.uid
          );
          this.selectData.splice(index, 1);
        }
      }
    },
    // 确认添加到商品清单
    confirmAdd() {
      // 将选中的数据都加入购物车
      this.shopCart = this.selectData;
      // 关闭定制弹窗
      this.conDialog = false;
      // 关闭成品弹窗
      this.fixDialog = false;
    },
    // 确认添加sku
    confirmSku() {
      var checkArr = [];
      // 获取选中的sku商品
      this.skuValue.forEach(sku => {
        if (sku.isCheck) {
          checkArr.push(
            Object.assign(
              {
                skuuid: sku.uid,
                skuvalue: sku.skuTitle,
                skuImage: sku.image
              },
              this.currentGood
            )
          );
        }
      });
      if (this.flag === "add") {
        // 直接加入购物车,需要查询sku采购价
        let plen = checkArr.length;
        checkArr.forEach(item => {
          // 查询不同sku的商品的采购价
          this.$axios
            .post(resale.getSaveOrderProductPurchaseprice, {
              levelUid: 0,
              productUid: this.currentGood.uid,
              skuUid: item.skuuid
            })
            .then(res => {
              if (res.data.state) {
                // 计算商品采购价
                let type = res.data.data.purtype;
                let radio = res.data.data.purchasePrice;
                switch (type) {
                  case "SITERESELLER":
                    // 采购价 0
                    this.$set(item, "purchansePrice", 0);
                    break;
                  case "PRODUCT":
                    // 采购价等于商品价
                    this.$set(item, "purchansePrice", this.currentGood.price);
                    break;
                  case "SUCCESSNULL":
                    // 采购价等于商品价格 * 比例
                    this.$set(
                      item,
                      "purchansePrice",
                      this.currentGood.price
                    );
                    break;
                  case "CATEGORY":
                    // 采购价等于商品价格 * 比例
                    this.$set(
                      item,
                      "purchansePrice",
                      ((radio * this.currentGood.price) / 100).toFixed(2)
                    );
                    break;
                }
                plen--;
                if (plen <= 0) {
                  checkArr.forEach(ch => {
                    if (!this.isAlreayAddToCart(ch, this.shopCart)) {
                      this.shopCart.push(ch);
                      this.fixDialog = false;
                      this.checkSkuDialog = false;
                    } else {
                      this.fixDialog = false;
                      this.checkSkuDialog = false;
                    }
                  });
                  if (checkArr.length > 0) {
                    this.currentGood.isCheck = true;
                  } else {
                    this.currentGood.isCheck = false;
                  }
                }
              }
            });
        });
      } else if (this.flag === "check") {
        // 加入到selectData中
        this.checkSkuDialog = false;
        if (checkArr.length > 0) {
          this.currentGood.isCheck = true;
        } else {
          this.currentGood.isCheck = false;
        }
      }
    },
    // 将添加商品的方法公共部分提取出来
    addFunc(data) {
      // 先选中该数据
      data.isCheck = true;
      // 将该商品加入购物车shopCart中
      if (!this.isAlreayAddToCart(data, this.shopCart)) {
        // 如果购物车没有该商品，就直接加入购物车
        this.shopCart.push(data);
        // 关闭定制商品弹窗
        this.conDialog = false;
        // 关闭成品商品弹窗
        this.fixDialog = false;
      } else {
        this.$message({
          type: "info",
          message: "商品清单中已存在该商品"
        });
      }
    },
    // 直接加入购物车
    addShopCart(data) {
      this.flag = "add"; // 直接加入购物车
      if (data.productType === "FIXED") {
        // 获取成品商品的填写的sku的值
        this.$axios
          .post(product.listProductSkuValueLang, {
            lang: localStorage.lang,
            uid: data.uid
          })
          .then(res => {
            if (res.data.state) {
              // 获取商品的sku值
              this.skuValue = res.data.data;
              if (this.skuValue.length <= 0) {
                // 如果没有sku属性
                // this.addFunc(data)
                this.$message({
                  type: "error",
                  message: "该商品没有添加sku属性，无法购买"
                });
              } else {
                // 弹出sku选择框选择需要的sku
                this.currentGood = data; // 设置sku弹窗标题
                this.skuValue.forEach(item => {
                  // 选中商品中已经存在的sku
                  if (this.isAlreayCheckSku(item, this.selectData)) {
                    this.$set(item, "isCheck", true);
                  } else {
                    this.$set(item, "isCheck", false);
                  }
                  this.$set(item, "skuTitle", item.skuValueUidText);
                });
                this.checkSkuDialog = true; // 显示sku选择弹框
              }
            }
          });
      } else {
        // 定制商品,查询商品采购价
        this.$axios
          .post(resale.getSaveOrderProductPurchaseprice, {
            levelUid: 0,
            productUid: data.uid,
            skuUid: 0
          })
          .then(res => {
            if (res.data.state) {
              // 计算商品采购价
              let type = res.data.data.purtype;
              let radio = res.data.data.purchasePrice;
              let purchansePrice = "";
              switch (type) {
                case "SITERESELLER":
                  // 采购价 0
                  purchansePrice = 0;
                  break;
                case "PRODUCT":
                  // 采购价等于商品价
                  purchansePrice = data.price;
                  break;
                case "SUCCESSNULL":
                  // 采购价等于商品价格 * 比例
                  purchansePrice = data.price
                  break;
                case "CATEGORY":
                  // 采购价等于商品价格 * 比例
                  purchansePrice = (
                    (radio * data.price) /
                    100
                  ).toFixed(2);
                  break;
              }
              this.$set(data, 'purchansePrice', purchansePrice)
              this.$nextTick(function () {
                  this.addFunc(data);
              })
            }
          });
      }
    },
    // 删除购物车商品
    delShopCart(data) {
      const index = this.shopCart.findIndex(row => row.uid === data.uid);
      this.shopCart.splice(index, 1);
    },
    addGoodsTitle(val) {
      this.currentPage = 1;
      if (val === 1) {
        this.showDialogTitle = "添加成品商品";
        this.fixDialog = true;
        this.params.protype = "FIXED";
        this.fetchData(this.currentPage, this.pageSize);
      } else {
        this.conDialog = true;
        this.showDialogTitle = "添加定制商品";
        this.params.protype = "CUSONLINE";
        this.fetchData(this.currentPage, this.pageSize);
      }
    },
    getCurrentSize(size) {
      this.fetchData(1, size);
    },
    getCurrentPage(num) {
      this.fetchData(num, this.pageSize);
      // 切换页码，需要保存
    },
    fetchData(pageNum, pageSize) {
      this.currentPage = pageNum;
      this.pageSize = pageSize;
      this.$axios
        .post(product.searchProductApi, {
          categoryuid:
            this.params.category.length > 0
              ? this.params.category[this.params.category.length - 1]
              : 0,
          page: pageNum,
          pageSize: pageSize,
          procode: this.params.code,
          protitle: this.params.name,
          protype: this.params.protype,
          state: 1
        })
        .then(res => {
          if (res.data.state) {
            this.tableData = res.data.data.dataList;
            // 给tableData添加isCheck属性
            this.tableData.forEach(row => {
              this.$set(row, "isCheck", false);
              this.$set(row, "count", 1);
            });
            // 如果购物车已存在该商品，将该商品置为选中状态
            this.tableData.forEach(row => {
              if (this.isAlreayAddToCart(row, this.selectData)) {
                row.isCheck = true;
              }
            });
            this.totalCount = res.data.data.totalCount;
          } else {
          }
        })
        .catch(err => {});
    },
    fetchCategory() {
      this.$axios
        .post(product.listAllCategory, {
          language: localStorage.lang
        })
        .then(res => {
          if (res.data.state) {
            this.categorys = treeFilter("state", 0, res.data.data);
          }
        });
    },
    // 创建订单
    createOrder() {
      this.$refs["orderForm"].validate(valid => {
        if (valid) {
          const listproduct = [];
          this.shopCart.forEach(data => {
            listproduct.push({
              imageList: data.imageList,
              number: data.count,
              price: data.price,
              productuid: data.uid,
              purchaseprice: 0,
              skuuid: data.skuuid ? data.skuuid : 0,
              skuvalue: data.skuvalue ? data.skuvalue : "",
              title: data.langtitle || data.cntitle,
              type: data.productType,
              weight: 1
            });
          });
          if (this.city.length > 0) {
            this.form.areauid = this.city[this.city.length - 1];
          }
          this.form.listproduct = listproduct;
          this.loading = true;
          this.$axios
            .post(order.saveOrders, this.form)
            .then(res => {
              this.loading = false;
              if (res.data.state) {
                this.$message({
                  type: "success",
                  message: "订单创建成功"
                });
              }
            })
            .catch(err => {
              this.loading = false;
              this.$message({
                type: "error",
                message: "订单创建失败"
              });
            });
        }
      });
    }
  },
  components: {
    Pager,
    City
  }
};
</script>

<style scoped lang="less">
.title {
  line-height: 32px;
}
.strong-text {
  font-size: 18px;
  color: #000;
  margin-right: 20px;
}
.row-header {
  height: 28px;
  line-height: 28px;
  .col-header {
    font-size: 12px;
    color: #000;
    font-weight: bold;
    text-align: center;
  }
}
.row-body {
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #f6f6f6;
  &:hover {
    background-color: #f6f6f6;
  }
  .col-body-c {
    line-height: 50px;
    text-align: center;
  }
  .col-body-l {
    line-height: 50px;
    text-align: left;
  }
}
.custom-img {
  vertical-align: middle;
}
</style>
