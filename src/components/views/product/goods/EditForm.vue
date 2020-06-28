<template>
    <transition enter-active-class="animated fadeInLeft">
        <div class="">
            <div class="form-wrap">
                <el-form label-position="right" label-width="80px" :model="form" :rules="rules" ref="ruleForm">
                    <el-row>
                        <el-col :span="8" class="form-col">
                            <el-form-item :label="$t('pCode')" prop="productCode">
                                <el-input v-model="form.productCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" class="form-col">
                            <el-form-item v-if="!form.uid" :label="$t('pType')" prop="categoryUid">
                                <!-- 新增状态显示 -->
                                <el-cascader
                                    :clearable="true"
                                    :show-all-levels="false"
                                    :options="categorys"
                                    :props="{ label: 'categoryName', value: 'uid' }"
                                    @change="handleCategory"
                                    change-on-select
                                    v-model="form.categoryUid"
                                    expand-trigger="click">
                                </el-cascader>
                            </el-form-item>
                            <el-form-item :label="$t('pType')" v-else>
                                <span>{{ form.categoryName }}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8" v-if="$route.params.type === 'PLOT'" class="form-col">
                            <el-form-item :label="$t('file')">
                                <a ref="downloadPlt" class="download-file" @click="download">{{ $t('downloadFile') }}</a>
                                <el-upload
                                    action=""
                                    :auto-upload="false"
                                    :file-list="fileList"
                                    :on-change="handleChange"
                                    :limit="1">
                                    <span class="download-file">{{ $t('uploadFile') }}</span>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="$route.params.type === 'FIXED' || $route.params.type === 'CUSONLINE'" class="form-col">
                            <el-form-item :label="$t('weight')" prop="weight">
                                <el-input v-model.number="form.weight"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item :label="$t('isOnShop')">
                                <el-radio v-model="form.state" :label="1">{{ $t('putaway') }}</el-radio>
                                <el-radio v-model="form.state" :label="0">{{ $t('theShelves') }}</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="$route.params.type !== 'FIXED'">
                        <el-col :span="8">
                            <el-form-item label="价格" prop="price">
                                <el-input v-model.number="form.price"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 成品商品才有sku，spu -->
                    <el-row v-if="$route.params.type === 'FIXED'">
                        <el-col class="form-col" :span="8" v-for="(spu, index) in form.spuList" :key="spu.uid">
                            <el-form-item
                                :label="spu.attributeName" :prop="'spuList.' + index + '.text'"
                                :rules="{validator: spu.valueType === 'NUM' ? checkNumber : checkText, trigger: 'blur'}">
                                <el-input v-model="spu.text"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="$t('pImage')">
                                <img-gallery repoType="PRODUCT_IMAGE" :fileHost="_fileHost.PRODUCT_IMAGE" v-model="form.imgs" :limit="8" :showPreview="true">
                                </img-gallery>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="$t('pName')" prop="productTitle">
                                <el-input v-model="form.productTitle"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item :label="$t('subtitle')">
                                <el-input v-model="form.subTitle"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="$route.params.type === 'FIXED' || $route.params.type === 'CUSONLINE'">
                        <el-col>
                            <el-form-item :label="$t('pDescription')">
                                <text-editor
                                    :lang="lang"
                                    :initHtml="form.description"
                                    @contentChange="contentChange"
                                    :fileHost="_fileHost.PRODUCT_IMAGE"
                                    repoType="PRODUCT_IMAGE"></text-editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="">
                                <el-button @click="cancelRoute">{{ $t('cancel') }}</el-button>
                                <el-button type="primary"
                                    @click="validateForm('ruleForm')"
                                    :loading="loading">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('save') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="sku-form-wrap"
                v-if="form.uid && $route.params.type === 'FIXED'">
                <h4>设置sku属性</h4>
                <el-form label-width="100px">
                    <el-form-item label="SKU属性" onselectstart="return false">
                        <div class="sku-row" v-for="(label, index) in skuForm.skuList" :key="index">
                            <div class="sku-col">
                                {{ label.attributeName }}
                            </div>
                            <div
                                class="sku-col sku-value"
                                :class="{ active: val.checked }"
                                v-for="val in label.list"
                                :key="val.uid + '-ui'"
                                @click.stop="chooseSkuValue(val)"
                                >
                                <i class="el-icon-error del-btn" @click.stop="delSkuValue(val)"></i>
                                <span @dblclick.stop="editSkuValue(val)"  v-if="!val.isEdit">{{ val.cntitle }}</span>
                                <el-input v-else
                                    class="sku-input"
                                    v-model="val.cntitle"
                                    @keyup.enter.native="updateSkuVal(val)"
                                    ></el-input>
                            </div>
                            <div class="sku-col" v-show="label.showInput">
                                <el-input class="sku-input" v-model="label.text" @keyup.enter.native="saveSingleSkuValue(label)"></el-input>
                            </div>
                            <div class="sku-col">
                                <el-button type="text" @click="addNewValue(label)">+新增属性</el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <div class="save-groups">
                        <el-button
                        type="primary"
                        size="small"
                        :loading="skuLoading"
                        @click="addSku">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                    </div>
                </el-form>
                <div class="sku-list">
                    <div class="list-row">
                        <div class="list-col">序号</div>
                        <div class="list-col" :style="{ width: '160px' }">ID</div>
                        <div class="list-col">图片</div>
                        <div class="list-col">库存</div>
                        <div class="list-col">价格</div>
                        <div class="list-col">启用</div>
                        <div class="list-col" v-for="label in skuForm.skuList" :key="label.uid">
                            {{ label.attributeName }}
                        </div>
                        <div class="list-col">
                            操作
                        </div>
                    </div>
                    <div class="list-row vertical" v-for="(item, index) in skuForm.skuItems" :key="item.uid">
                        <div class="list-col">{{ index + 1 }}</div>
                        <div class="list-col" :style="{ width: '160px' }">{{ item.uid }}</div>
                        <div class="list-col">
                            <div class="item-img-wrap" v-for="(img, index) in item.imgs" :key="index">
                                <img class="sku-img" :src="_fileHost.PRODUCT_IMAGE + img.storageFile">
                                <div class="del-img">
                                    <i class="el-icon-delete" @click="delImg(item)"></i>
                                </div>
                            </div>
                            <img-gallery repoType="PRODUCT_IMAGE" :fileHost="_fileHost.PRODUCT_IMAGE" v-model="item.imgs" :limit="1" :btnStyle="{ textAlign: 'center'}"></img-gallery>
                        </div>
                        <div class="list-col">
                            <el-input v-model.number="item.stock" @keypress.native="validateStock($event)"></el-input>
                        </div>
                        <div class="list-col">
                            <el-input v-model.number="item.price"></el-input>
                        </div>
                        <div class="list-col">
                            <el-checkbox v-model="item.state" :true-label="0" :false-label="1">不启用</el-checkbox>
                        </div>
                        <div class="list-col" v-for="(el, index) in item.result" :key="index">
                            {{ el.text || el.cntext }}
                        </div>
                        <div class="list-col">
                            <el-button type="danger" size="mini" @click="delSkuItem(item)">删除</el-button>
                        </div>
                    </div>
                </div>
                <div class="save-groups">
                    <el-button
                        type="primary"
                        :loading="stockLoading"
                        @click="saveSkuList"
                        size="small">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;保存&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
// import TextEditor from '@/components/common/editor/UMeditor'
import TextEditor from '@/components/common/editor/WangEditor'
import ImgGallery from '@/components/common/upload/imgGallery'
import { product } from '@/common/api.js'
import { treeFilter, exchangeArrWH, exchangeArrHW } from '@/common/utils/array.js'
import { checkNumber } from '@/common/utils/validate'
export default {
    name: 'EditProdForm',
    props: {
        lang: {
            type: String
        },
        pUid: {
            type: String,
            default: ''
        }
    },
    created () {
        // 放置页面滚动到顶部
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        this.fetchCategory()
        if (this.pUid) {
            this.getProduct()
        }
    },
    data () {
        return {
            form: {
                imgs: [],
                imageList: [],
                categoryUid: [],
                description: '',
                images: 'images',
                plotimage: 'images', // 上传模切文件
                lang: this.lang,
                productCode: '', // 3-15位，- _ 数字 字母
                productTitle: '',
                productType: this.$route.params.type,
                state: 1,
                stockNumber: 0,
                subTitle: '',
                supplierUid: 0,
                weight: 0,
                uid: 0,
                categoryName: '',
                price: 0,
                spuList: [], // 根据商品类目查询出spu
                spuValues: [] // 商品的spu数组
            },
            fileList: [],
            categorys: [],
            loading: false,
            skuLoading: false,
            stockLoading: false,
            skuForm: {
                skuList: [], // 根据商品类目查询出sku
                skuValues: [], // sku的属性值
                skuItems: [], // 组合的sku值列表
            },
            timer: null,
            resultSku: [],
            rules: {
                productCode: [
                    { required: true, message: '商品编码不能为空', trigger: 'blur' }
                ],
                categoryUid: [
                    { required: true, validator: this.checkCategory, trigger: 'blur' }
                ],
                weight: [
                    { required: true, validator: this.checkWeight, trigger: 'blur' }
                ],
                price: [
                    { required: true, validator: this.checkPrice, trigger: 'blur' }
                ],
                productTitle: [
                    { required: true, message: '商品名称不能为空', trigger: 'blur' }
                ]
            },
            checkNumber: checkNumber,
        }
    },
    methods: {
        // 下载模切文件
        download () {
            var blob  = new Blob([this.form.plotimage])
            this.$refs['downloadPlt'].href = URL.createObjectURL(blob)
            this.$refs['downloadPlt'].download = 'plot.plt'
        },
        // 模切文件
        handleChange (file, fileList) {
            var that = this
            var fr = new FileReader()
            fr.onload = function (e) {
                that.form.plotimage = e.target.result
            }
            fr.readAsText(file.raw)
        },
        // 删除商品图片
        delImg (item) {
            item.imgs.shift()
        },
        validateStock (ev) {
        },
        // 编辑修改sku value的值
        updateSkuVal (item) {
            this.$axios.post(product.updateProductAttribute, {
                langCode: this.lang,
                productAttrUid: item.uid,
                valueText: item.cntitle,
                productUid: this.pUid
            }).then(res => {
                if (res.data.state) {
                    this.getAttributeLang(this.form.categoryUid, this.lang)
                }
            })
        },
        // 双击编辑sku value
        editSkuValue (item) {
            this.$set(item, 'isEdit', true)
        },
        // 保存sku组合列表（库存，等信息）
        saveSkuList () {
            this.stockLoading = true
            let arr = []
            this.skuForm.skuItems.forEach(item => {
                item.imageList = []
                item.imgs.forEach(img => {
                    item.imageList.push(img.storageFile)
                })
                arr.push({
                    imageList: item.imageList,
                    price: item.price,
                    productUid: item.productUid,
                    skuCode: item.skuCode,
                    state: item.state,
                    stock: item.stock,
                    uid: item.uid
                })
            })
            this.$axios.post(product.updateListSku, arr).then(res => {
                this.stockLoading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    })
                }
            }).catch(err => {
                this.stockLoading = false
            })
        },
        // 组合添加sku值保存
        addSku () {
            this.skuLoading = true
            let arr = []
            this.skuForm.skuList.forEach(item => {
                item.list.forEach(sku => {
                    if (sku.checked) {
                        arr.push({
                            proattUid: sku.uid,
                            productUid: sku.productUid
                        })
                    }
                })
            })
            // 组合添加sku
            this.$axios.post(product.saveProductSku, arr).then(res => {
                this.skuLoading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                    // 成功后清空之前的选中状态
                    this.skuForm.skuList.forEach(sku => {
                        if (sku.list) {
                            this.clearSkuCheckStatus(sku.list)
                        }
                    })
                    // 重新获取组合sku列表
                    this.listProductSku()
                }
            }).catch(err => {
                this.skuLoading = false
            })
        },
        // 获取商品的组合的sku列表
        listProductSku () {
            this.$axios.post(product.listProductSku, {
                productUid: this.pUid,
                lang: this.lang
            }).then(res => {
                if (res.data.state) {
                    // 组合的sku item项
                    this.skuForm.skuItems = res.data.data
                    this.skuForm.skuList.forEach(sku => {
                        this.$set(sku, 'skuItems', [])
                        // 处理后端返回的组合sku值
                        this.skuForm.skuItems.forEach(item => {
                            let imgs = []
                            item.imageList.forEach(img => {
                                imgs.push({
                                    storageFile: img
                                })
                            })
                            // 添加图片数组
                            this.$set(item, 'imgs', imgs)
                            // 如果存在sku组合值，将列表的值与类目属性顺序一致
                            if (item.skulist) {
                                item.skulist.forEach(list => {
                                    if (list.categoryAttributeUid === sku.attributeUid) {
                                        sku.skuItems.push(list)
                                    }
                                })
                            }
                        })
                    })
                    // 将类目属性与相对应的sku取出
                    const tempArr = []
                    this.skuForm.skuList.forEach(item => {
                        if (item.skuItems) {
                            tempArr.push(item.skuItems)
                        }
                    })
                    this.resultSku = exchangeArrWH(tempArr)
                    this.skuForm.skuItems.forEach(item => {
                        this.$set(item, 'result', [])
                        this.resultSku.forEach(el => {
                            if (Array.isArray(el)) {
                                el.forEach(val => {
                                    if (val.skuUid === item.uid) {
                                        item.result.push(val)
                                    }
                                })
                            }
                        })
                    })
                }
            })
        },
        // 获取商品sku属性值
        getProSkuValues () {
            this.$axios.post(product.ListproductAttributeLang, {
                lang: this.lang,
                uid: this.form.uid
            }).then(res => {
                if (res.data.state) {
                    // 取出商品所有的sku值
                    this.skuForm.skuValues = res.data.data
                    // 根据属性uid对应上相关的类目
                    this.skuForm.skuList.forEach(item => {
                        // 循环skuValues
                        this.skuForm.skuValues.forEach(val => {
                            if (item.attributeUid === val.cattributeUid) {
                                // 如果找到了，将所有值添加到item上
                                item.list = val.list
                            }
                        })
                    })
                }
            })
        },
        // 选择sku属性值
        chooseSkuValue (item) {
            this.skuForm.skuList.forEach(sku => {
                if (sku.attributeUid === item.attributeUid) {
                    this.clearSkuCheckStatus(sku.list)
                }
            })
            // 选中当前选中的元素
            this.$set(item, 'checked', true)
        },
        // 将sku value状态全置空
        clearSkuCheckStatus (arr) {
            arr.forEach(item => {
                if (item.checked) {
                    item.checked = false
                }
            })
        },
        // 删除单个sku属性值
        delSkuValue (item) {
            this.$axios.post(product.deleteProductAttribute, {
                productUid: item.productUid,
                uid: item.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.getAttributeLang(this.form.categoryUid, this.lang)
                }
            })
        },
        // 删除单个sku
        delSkuItem (item) {
            this.$axios.post(product.deleteSingleSku, {
                language: this.lang,
                uid: item.uid
            }).then(res => {
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    })
                    this.listProductSku()
                }
            })
        },
        // 添加单个sku
        addNewValue (label) {
            label.showInput = true
        },
        // 保存单个sku属性值
        saveSingleSkuValue (label) {
            this.$axios.post(product.saveProductAttribute, {
                attributeUid: label.attributeUid,
                lang: this.lang,
                productUid: this.form.uid,
                text: label.text
            }).then(res => {
                if (res.data.state) {
                    // 重新获取列表数据
                    this.getProSkuValues()
                    // 初始化状态
                    label.text = ''
                    // 关闭input
                    label.showInput = false
                }
            })
        },
        checkText (rule, value, callback)  {
            callback()
        },
        checkCategory (rule, value, callback)  {
            if (value.length === 0) {
                callback(new Error('请选择商品类目'))
            } else {
                callback();
            }
        },
        checkWeight (rule, value, callback)  {
            if (typeof value !== 'number') {
                callback(new Error('请输入数字'))
            } else if (value <= 0) {
                callback(new Error('请输入大于0的数字'))
            } else {
                callback()
            }
        },
        checkPrice (rule, value, callback)  {
            if (typeof value !== 'number') {
                callback(new Error('请输入数字'))
            }   else if (value < 0) {
                callback(new Error('请输入不小0的数字'))
            } else {
                callback()
            }
        },
        cancelRoute () {
            this.$router.go('-1')
        },
        // 根据uid获取商品详情
        getProduct () {
            this.$axios.post(product.getProduct, {
                lang: this.lang,
                uid: this.pUid
            }).then(res => {
                if (res.data.state) {
                    // 组装成页面绑定的数据格式
                    this.form.categoryName = res.data.data.categoryname
                    this.form.productCode = res.data.data.productCode
                    this.form.description = res.data.data.description
                    this.form.images = res.data.data.images
                    this.form.productTitle = res.data.data.productTitle
                    this.form.productType = res.data.data.productType
                    this.form.stockNumber = res.data.data.stockNumber
                    this.form.subTitle = res.data.data.subTitle
                    this.form.weight = res.data.data.weight
                    this.form.supplierUid = res.data.data.supplierUid
                    this.form.price = res.data.data.price
                    this.form.state = res.data.data.state
                    this.form.categoryUid = res.data.data.categoryUid
                    this.form.uid = res.data.data.uid
                    this.form.imageList = res.data.data.imageList
                    if (this.form.plotimage) {
                        this.fileList.push({
                            name: 'plot.plt'
                        })
                    }
                    // 根据uid获取类目
                    this.getAttributeLang(res.data.data.categoryUid, this.lang)
                    // 定制商品才会返回spu
                    if (res.data.data.spu) {
                        // 商品保存的spu值数组
                        this.form.spuValues = res.data.data.spu
                    }
                    // 设置图片列表
                    this.form.imageList.forEach(item => {
                        this.form.imgs.push({
                            storageFile: item
                        })
                    })
                }
            })
        },
        // 获取商品类目列表
        fetchCategory () {
            this.$axios.post(product.listAllCategory, {
                language: this.lang
            }).then(res => {
                if (res.data.state) {
                    this.categorys = treeFilter('state', 0, res.data.data)
                }
            })
        },
        // 选择不同分类
        handleCategory (val) {
            this.getAttributeLang(val[val.length - 1], this.lang)
        },
        // 获取商品类目的sku，spu属性种类
        getAttributeLang (uid, lang) {
            this.$axios.post(product.getAttributeLang, {
                uid: uid,
                lang: lang
            }).then(res => {
                if (res.data.state) {
                    // 根据返回的spu的属性值
                    if (res.data.data.spu) {
                        // 获取spu属性种类
                        this.form.spuList = res.data.data.spu
                        this.form.spuList.forEach(item => {
                            const index = this.form.spuValues.findIndex(val => {
                                return item.attributeUid === val.attributeUid
                            })
                            // 填写spu之后才会返回spu
                            if (index > -1) {
                                this.$set(item, 'text', this.form.spuValues[index].text)
                                this.$set(item, 'uid', this.form.spuValues[index].uid)
                            } else {
                                this.$set(item, 'text', '')
                                this.$set(item, 'uid', 0)
                            }
                        })
                    }
                    // 获取sku属性种类
                    if (res.data.data.sku) {
                        this.skuForm.skuList = res.data.data.sku
                        // 给skuList每项添加showInput属性
                        this.skuForm.skuList.forEach(item => {
                            this.$set(item, 'showInput', false)
                            this.$set(item, 'text', '')
                            this.$set(item, 'list', [])
                        })
                        // 获取商品sku value值
                        this.getProSkuValues(uid, lang)
                        // 根据商品uid查询所有组合的sku列表
                        this.listProductSku()
                    }
                }
            })
        },
        // 删除图片
        handleRemove(file, fileList) {
        },
        // 预览图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        // 图文详情
        contentChange (val) {
            this.form.description = val
        },
        // 校验商品基本信息
        validateForm (formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.saveProductInfo()
                }
            })
        },
        // 保存商品基本信息
        saveProductInfo () {
            var subUrl = product.updateProduct
            // 线下定制和模切商品将weight字段设置为》0
            if (this.$route.params.type === 'CUSOFFLINE' || this.$route.params.type === 'PLOT') {
                this.form.weight = 1
            }
            // 重新设置提交的图片
            this.form.imageList = []
            this.form.imgs.forEach(img => {
                this.form.imageList.push(img.storageFile)
            })
            this.loading = true
            this.$axios.post(subUrl, {
                categoryUid: this.form.categoryUid,
                description: this.form.description,
                images: 'qqq',
                imageList: this.form.imageList,
                plotimage: this.form.plotimage, // 上传模切文件
                lang: this.lang,
                productCode: this.form.productCode, // 3-15位，- _ 数字 字母
                productTitle: this.form.productTitle,
                productType: this.form.productType,
                spu: this.form.spuList,
                state: this.form.state,
                stockNumber: this.form.stockNumber,
                subTitle: this.form.subTitle,
                supplierUid: this.form.supplierUid,
                weight: this.form.weight,
                uid: this.form.uid,
                price: this.form.price,
                siteUid: 0
            }).then(res => {
                this.loading = false
                if (res.data.state) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    })
                    // 成功之后返回商品uid
                    this.form.uid = res.data.data.uid
                }
            }).catch(err => {
                this.loading = false
            })
        },
    },
    components: {
        TextEditor,
        ImgGallery
    }
}
</script>

<style lang="less" scoped>
</style>


