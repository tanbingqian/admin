<template>
  <div class>
    <div class="topNav pagers-wrap">
      <div class="tit">
        <div class="tit-text">
          运送快递公司
          <span class="add-item" @click="addCourier=true">+添加快递公司</span>
        </div>
      </div>
      <div>
        <el-tag
          :key="drugs.expressName"
          v-for="drugs in drugs"
          closable
          :disable-transitions="false"
          @close="handleClose(drugs.expressUid)"
        >{{drugs.expressName}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
      </div>
    </div>
    <!--运费设置-->
    <div class="freightSet pagers-wrap">
      <div class="tit">
        <div class="tit-text">
          运费设置
          <span class="add-item" @click="newAddEait">+添加运费设置</span>
        </div>
      </div>
      <el-table :data="expressFeeList" style="width:100%">
        <el-table-column prop="feeName" label="名称" width="180"></el-table-column>
        <el-table-column label="试用地区" width="180">
          <template slot-scope="scope">
            <span v-if = "scope.row.cityListInfos.length <= 1">{{scope.row.cityListInfos[0].fullName}}</span>
            <span v-if = "scope.row.cityListInfos.length > 1">
              <em v-for="(items,index) in scope.row.cityListInfos" :key="index" style="font-style:normal">
                {{items.fullName}}
                <span style="padding:5px;" v-if="index==scope.row.cityListInfos.length-1"></span>
                <span style="padding:5px;" v-else>,</span>
              </em>
            </span>
         </template>
        </el-table-column>
        <el-table-column label="快递公司" prop="expressUid">
          <template slot-scope="scope">
             <div>
                 {{scope.row.courierName}}
             </div>
          </template>
        </el-table-column>
        <el-table-column prop="unitType" label="计费广式">
          <template slot-scope="scope">
            <div v-if="scope.row.unitType=='WEIGHT'">按重量</div>
            <div v-else>按订单</div>
          </template>
        </el-table-column>
        <el-table-column label="运费">
          <template slot-scope="scope">
            <span prop="fee">{{scope.row.fee}}</span>
            <span v-if="scope.row.unitType=='WEIGHT'">+</span>
            <span v-if="scope.row.unitType=='WEIGHT'" prop="extfee">{{scope.row.extfee}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="freighteditLink(scope.row)">编辑</el-button>
            <el-button type="text" @click="removeLink(scope.row.uid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加快递公司-->
    <el-dialog :visible.sync="addCourier" :title="roleTitle" width="40%">
      <el-form ref="addExpressForm" :rules="rules2" :model="form" label-width="120px">
        <el-form-item label="快递公司名称" prop="expressName">
          <el-input v-model="form.expressName"></el-input>
        </el-form-item>
        <el-form-item label="快递公司代码" prop="expressCode">
          <el-input v-model="form.expressCode"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            size="small"
            @click="cancel"
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
          <el-button
            type="primary"
            size="small"
            @click="saveAdd"
            :loading="saveLoading"
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--添加运费设置-->
    <el-dialog :visible.sync="addFreightSet" :title="FreightSetTitle" width="60%">
      <el-button type="text" class="addspecified" @click="addspecified">+为指定地区设置运费</el-button>
      <table class="form-table" border="0" cellspacing="0" cellpadding="0" :model="itemTable">
        <thead class="th-line">
          <th>名称</th>
          <th>适用地区</th>
          <th>快递公司</th>
          <th>计算费方式</th>
          <th>运费</th>
          <th>操作</th>
        </thead>
        <tr v-for="(item,index) in itemTable" :key="index">
          <td>
            <input type="text" placeholder="地区名称" class="input-add" v-model="item.feeName">
          </td>
          <td>
            <div class="addes">
              <div><div v-for="(items,index) in item.cityInfoVOs" :key="index">
                {{items.cityName}}</div></div>
              <div @click="editAddLink(item, index)" class="editCss">编辑</div>
            </div>
          </td>
          <td>
            <el-select v-model="item.expressUid" placeholder="请选择" @click="selectchange">
              <el-option
                v-for="drugs in drugs"
                :key="drugs.expressCode"
                :label="drugs.expressName"
                :value="drugs.expressUid"
              ></el-option>
            </el-select>
          </td>
          <td width="20%">
            <el-radio label="WEIGHT" v-model="item.unitType">按重量</el-radio>
            <el-radio label="ORDER" v-model="item.unitType">按订单</el-radio>
          </td>
          <td width="15%">
            <input type="text" placeholder="元" class="input-money" v-model="item.fee">
            <span v-if="item.unitType=='WEIGHT'">+</span>
            <input v-if="item.unitType=='WEIGHT'" type="text" placeholder="元" class="input-money" v-model="item.extfee">
          </td>
          <td>
            <div>
              <el-button type="text" @click="delExpress(index)">删除</el-button>
            </div>
          </td>
        </tr>
      </table>

      <div class="button-div">
        <div
          @click="addFreightSet=false"
          class="el-button el-button--primary el-button--small"
          type="button"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div
          @click="addSettings"
          class="el-button el-button--primary el-button--small"
          type="button"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
      </div>
    </el-dialog>


    <!--编辑运费设置弹窗-->
    <el-dialog :visible.sync="editAdd" :title="editAddTitle" width="40%">
      <div class="cityflex">
       <div v-for="(allCity,index) in allCity" :key="index">
          <input
            class="checkItem"
            type="checkbox"
            v-bind:value="allCity.cityId"
            v-bind:cityName="allCity.cityName"
            v-model="checkList_adders"
            @change="selectNames(allCity.cityId,allCity.cityName)"
          >
          <span @click="choose(allCity.cityId)">{{allCity.cityName}}</span>
        </div>
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          @click="editAddClose"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        <el-button
          type="primary"
          size="small"
          @click="saveData"
        >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import City from "@/components/common/city/city";
import { order } from "@/common/api.js";
import { base } from "@/common/api.js";
import _ from "underscore";
export default {
  name: "expressManagement",
  created() {
    // this.listExpressCom()
    //选择快递
    this.selectchange();
    this.listExpressFeeBySiteUid()
  },
  data() {
    return {
      //选择的地址列表
      adderes_list_:"",
      adderes_list:[],
      checkList_adders: [],
      //城市数量
      num_city: 1,
      //省
      parentCityId_bj:"",
      //市
      cityId_bj:"",
      //区
      cityName_bj:"",
      loading: false,
      saveLoading: false,
      drugs: [],
      inputVisible: false,
      inputValue: "",
      tableData: [],
      //添加快递公司弹窗
      addCourier: false,
      roleTitle: "添加快递公司",
      form: {
        expressName: "",
        expressCode: ""
      },
      flag: "",
      rules2: {
        expressName: [
          {
            required: true,
            message: "快递名称不能为空",
            trigger: "blur"
          }
        ],
        expressCode: [
          {
            required: true,
            message: "快递公司代码",
            trigger: "blur"
          }
        ]
      },
      //添加运费设置弹窗
      addFreightSet: false,
      FreightSetTitle: "添加运费设置",
      //编辑运费设置弹窗
      editAdd: false,
      editAddTitle: "为指定地区设置运费",
      radio:'1',
    
      selectAddData: "",
      addshow: "",
      itemTable: [{
            cityInfoVOs:[],
            feeName:"",
            unitType:"WEIGHT",
            expressUid:"",
            fee:"",
            extfee:""
	    }],
      checkList: [],
      allCity: [],
      addData:"",
       //保存勾选的中文值
      expressForm: {
            cityInfoVOs:[],
            feeName:"",
            unitType:"",
            expressUid:"",
            fee:"",
            extfee:"",
            uid: 0
      },
      flagNewAddEait:'',
      flagFreighteditLink:'',

      expressFeeList: [],
      arra:[]
    };
  },
  methods: {
  //删除
  removeLink(uid){
    this.$confirm('确定删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$axios.post(order.deleteExpressFee, {
                uid:uid
            }).then(res => {
              this.listExpressFeeBySiteUid();
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.listExpressCom()
                }
            })
        })
  },

	//新增运费设置
	newAddEait(){
		this.addFreightSet=true
		this.flagNewAddEait="newAddEait"
		this.itemTable=[{
      cityInfoVOs:[],
      feeName:"",
      unitType:"WEIGHT",
      expressUid:"",
			fee:"",
			extfee:""
     }]
  },
	//编辑运费设置弹窗
	freighteditLink(row){
		this.addFreightSet=true
    this.flagFreighteditLink="freighteditLink";
    // var aa=row.cityName.split(",");
    // //var bb=row.cityIds.split(",");
    // console.log(aa)
    // row.cityInfoVOs=[];
    // for(var i=0;i<aa.length;i++){
    //    row.cityInfoVOs.push({
    //      "cityName":aa[i],
    //     // uid:bb[i]
    //    })
    // }
    //cityInfoVOs
    //row.cityInfoVOs
    var _cityInfoVOs=[];
    for(var i=0;i<row.cityListInfos.length;i++){
      _cityInfoVOs[i]={"cityName":row.cityListInfos[i].fullName,"uid":row.cityListInfos[i].uid}
    }

    this.itemTable=[{
      cityInfoVOs:_cityInfoVOs,
      feeName:row.feeName,
      unitType:row.unitType,
      expressUid:row.expressUid,
			fee:row.fee,
      extfee:row.extfee,
      uid:row.uid
     }]
    this.adderes_list[this.currentItemIndex]=_cityInfoVOs;
    
    this.itemTable.forEach(row=>{
      if(this.drugs.length>0){
          this.drugs.forEach(kit=>{
             if(kit.expressUid===row.expressUid){
                  this.itemTable[0].expressUid=kit.expressUid
              }
         })
      }
    })
	},
	//选择快递
	listExpressCom () {
		this.$axios.post(order.listExpress).then(res => {
				this.loading = false;
				if (res.data.state) {
        this.drugs = res.data.data;
				}
			})
			.catch(err => {
				this.loading = false;
			});
	},
	selectNames:function(item,name_){
		//item.state = !item.state;
		//console.log(this.checkList_adders.indexOf(item));
		// if(this.checkList_adders.indexOf(item)==-1){
	  // 	this.adderes_list.splice(this.adderes_list.indexOf(name_), 1)
		// }else{
	  // 	this.adderes_list.push(name_)
    // }
    if(!this.adderes_list[this.currentItemIndex]){
      this.adderes_list[this.currentItemIndex]=new Array();
    }
    if(this.checkList_adders.indexOf(item)==-1){
	  	this.adderes_list[this.currentItemIndex].splice(this.adderes_list[this.currentItemIndex].indexOf(name_), 1)
		}else{
    this.adderes_list[this.currentItemIndex].push({
        cityName:name_,
        uid:item
      })
    }
    console.log(this.adderes_list)
	},
	// 查询运费列表
	listExpressFeeBySiteUid () {
		this.$axios.post(order.listExpressFeeBySiteUid).then(res => {
      this.expressFeeList = res.data.data
      var arra=this.expressFeeList
      //对比快递单号ID赋中文值
      if(this.drugs.length>0){
        this.drugs.forEach(kit => {
          arra.forEach(row => {
              if(row.expressUid === kit.expressUid){
                  row.courierName = kit.expressName
              }
          })
        })
      }
      // console.log('qq',this.expressFeeList);
      // console.log('qssssq',this.expressFeeList[0].cityListInfos[0].fullName);
		})
	},
	delExpress (index) {
		this.itemTable.splice(index, 1)
	},
    // 点击新增角色按钮
    add() {
      this.addDialog = true;
      this.flag = "add";
        expressName: "",
        this.form = {
        expressCode: ""
      };
    },
   
    //保存地址
    saveAdd() {
      this.$axios
        .post(order.saveExpress, this.form).then(res => {
          this.saveLoading = false;
          //console.log(res);
          if (res.data.state) {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.addCourier = false;
            this.listExpressCom();
            // this.dynamicTags.push(this.form.expressName)
          } else {
            this.$message({
              type: "error",
              message: "保存失败"
            });
          }
        })
        .catch(err => {
          this.saveLoading = false;
        });
    },
    //删除快递公司
    handleClose(tag) {
      this.$confirm(
        "该删除会导致与该快递公司有关的所有信息都会删除，主要包括已添加的所有运费设置，您确认还要继续删除吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$axios.post(order.deleteExpress, { expressUid: tag })
          .then(res => {
            this.listExpressCom();
            if (res.data.state) {
              this.drugs = res.data.data;
              console.log(this.drugs);
            }
          })
          .catch(err => {
            this.loading = false;
          });
      });

      // this.drugs.splice(this.drugs.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //关闭
    cancel() {
      this.addCourier = false;
    },

    //快递列表
    selectchange: function() {
      this.$axios.post(order.listExpress).then(res => {
        this.drugs = res.data.data;
        // console.log(this.drugs.expressName);
      });
    },

    //为指定地区设置运费
    editAddLink(item, index) {
    this.num_city=1;
		this.checkList_adders = [];
    this.checkList = [];
    //this.adderes_list=[];
    
    this.currentItemIndex = index;
    this.adderes_list[this.currentItemIndex]=[];
        this.editAdd = true;
        this.$axios
        .post(base.listcity, {
          parentUid: this.checkList.length <= 0 ? 0 : this.checkList
        })
        .then(res => {
          console.log(res.data.state);
          this.allCity = res.data.data;
          console.log(this.allCity);
        });
    },
    //筛选城市获取值
    choose(val) {
      if ((this.num_city < 3)) {
          if(this.num_city==1){
              this.parentCityId_bj=val; 
          }else if(this.num_city==2){
              this.cityId_bj=val;
          }else if(this.num_city==3){
              this.cityName_bj=val;
          }
        this.num_city++;
        this.editAdd = true;
        this.$axios.post(base.listcity, {
            parentUid: val
          }).then(res => {
            console.log(res.data.state);
            this.allCity = res.data.data;
			      console.log(this.allCity);
          });
      }else{
          console.log(this.parentCityId_bj + "_"+this.cityId_bj + "_"+this.cityName_bj);
          console.log(this.checkList_adders)
      }
    },
    //关闭选择地址弹窗
    editAddClose(){
        this.editAdd=false
        this.num_city=1
    },
    //保存运费设置编辑地区
    saveData() {
	   this.editAdd = false;
    //  this.itemTable[this.currentItemIndex].cityName = this.adderes_list.join(",")
    // this.itemTable[this.currentItemIndex].cityInfoVOs.cityName = this.adderes_list.join(",")
    // var names=[];
    //  for(var i=0;i<this.adderes_list[this.currentItemIndex].length;i++){
    //    //names.push(this.adderes_list[this.currentItemIndex][i].cityName)
       
    //  }
    this.itemTable[this.currentItemIndex].cityInfoVOs= this.adderes_list[this.currentItemIndex]
    //  this.itemTable[this.currentItemIndex].cityUids = this.checkList_adders
     

    },
    //点击添加一行
    addspecified() {
      this.itemTable.push({
            cityInfoVOs:[],
            feeName:"",
            unitType:"WEIGHT",
            expressUid:"",
            fee:"",
            extfee:""
	   });
    },
    //保存添加运费设置
    addSettings(){
    //   console.log(this.allCity)
    //    for(var i=0;i<this.itemTable.length;i++){
    //       for(var i=0;i<this.allCity.length;i++){
    //       for(var j=0;j<this.adderes_list.length;j++){
    //       if(this.allCity[i].cityName==this.adderes_list[j]){
    //         this.itemTable[0].cityInfoVOs.push({
    //             cityName:this.allCity[i].cityName,
    //             uid:this.allCity[i].cityId
    //           })
    //       }
    //      }
    //     }
    //   }
    //  console.log(this.itemTable[0].cityInfoVOs)
    //  console.log(this.itemTable[0])
       for(var i=0;i<this.adderes_list.length;i++){
         this.itemTable[i].cityInfoVOs=this.adderes_list[i]
         console.log(this.adderes_list[i])
       }
       this.$axios.post(order.saveExpressFee,
            this.itemTable
        ).then(res => {
		  	this.saveLoading = false;
        this.addFreightSet = false
        this.listExpressFeeBySiteUid();
       console.log(res.data.data.state)
		     if (res.data.data.state==1) {
            this.$message({
            type: "success",
            message: "保存成功"
				});
        } else if(res.data.data.state==3) {
          this.$message({
          type: "error",
          message: "只有已存在的,没有新增的,返回存在的区域名称"
          });
        }else if(res.data.data.state==4) {
          this.$message({
          type: "error",
          message: "未选中任何城市区域"
          });
        }else if(res.data.data.state==5) {
          this.$message({
          type: "error",
          message: "运费名称已存在"
          });
        }else if(res.data.data.state==6) {
          this.$message({
          type: "error",
          message: "用户名没填写"
          });
        }
        else if(res.data.data.state==2) {
          this.$message({
          type: "error",
          message: "返回存在的区域名称,新增的保存成功"
          });
        }else if(res.data.data.state==0) {
          this.$message({
          type: "error",
          message: "保存失败"
          });
        }
        })
        .catch(err => {
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
.tit {
  margin-bottom: 20px;
}
.tit .tit-text {
  font-size: 18px;
  color: #000;
}
.tit .add-item {
  margin-left: 10px;
  color: #0070ae;
  font-size: 12px;
}
.freightSet {
  border-top: 10px solid #ebebeb;
}
.el-tag {
  margin-top: 40px;
  background-color: #fff;
  padding: 0 10px;
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  color: #666;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
  border: none;
  margin-right: 20px;
}
.el-tag:hover {
  background-color: #f2f2f2;
  padding: 0 10px;
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  color: #333;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
  border: none;
}
.addes {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.addes ul li {
  list-style: none;
}
.input-money {
  width: 20%;
  border: 1px solid #ccc;
  padding: 10px;
}
.input-add {
  border: 1px solid #ccc;
  padding: 10px;
}
.editCss {
  color: #0070ae;
  width: 50px;
  padding: 0 10px;
}
.button-div {
  text-align: center;
  margin: 0 auto;
  margin-top: 40px;
}
/*添加运费设置*/
.form-table {
  width: 100%;
  border: 1px solid #ccc;
  border-bottom: none;
}
.form-table th {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}
.form-table td {
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}
.addspecified {
  float: left;
  position: absolute;
  top: 14px;
  left: 150px;
  color: #0070ae;
  font-size: 12px;
}

/*城市列表*/
.cityflex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.cityflex > div {
  margin: 10px;
}
</style>
