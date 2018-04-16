<template>
    <div>
		<el-card class="box-card" >
			<el-form  label-width="25%">
				<el-form-item label="款式:" align="left">
					<el-select v-model="styleId" placeholder="请选择" @change="selectStyle" :disabled="fittingBag.id && size.id">
						<el-option
							v-for="item in styleList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
							>
						</el-option>
					</el-select>
                </el-form-item>
				<el-form-item label="颜色:" align="left">
					<el-select v-model="colorId" placeholder="请选择" :disabled="fittingBag.id && size.id">
						<el-option
							v-for="item in colorList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
							>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="下胸围:" align="left" v-show="!size.id">
					<el-input-number v-model="bodyMeasure.underchest" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="上胸围-托高:" align="left" v-show="!size.id">
					<el-input-number v-model="bodyMeasure.onchestLift" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="左乳宽:" align="left" v-show="!size.id">
					<el-input-number v-model="bodyMeasure.nipplewidthLeft" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="右乳宽:" align="left" v-show="!size.id">
					<el-input-number v-model="bodyMeasure.nipplewidthRight" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="松紧度:" align="left" v-show="!size.id">
					<el-radio v-model="bodyMeasure.tightNess" label="1">稍松</el-radio>
  					<el-radio v-model="bodyMeasure.tightNess" label="2">一般</el-radio>
					<el-radio v-model="bodyMeasure.tightNess" label="3">稍紧</el-radio>
					<el-radio v-model="bodyMeasure.tightNess" label="4">超紧</el-radio>
				</el-form-item>
				<el-form-item label="腰部:" align="left" v-show="!size.id">
					<el-radio v-model="bodyMeasure.waist" label="2">直筒腰</el-radio>
  					<el-radio v-model="bodyMeasure.waist" label="1">细腰</el-radio>
					<el-radio v-model="bodyMeasure.waist" label="3">粗腰</el-radio>
					<el-radio v-model="bodyMeasure.waist" label="4">粗腰</el-radio>
				</el-form-item>
			</el-form>
			<el-button type="primary" @click="sizeCalculate()" size="small" v-show="!size.id">确定</el-button>
		</el-card>
		<el-card class="box-card" v-show="fittingBag.id && size.id">
			<el-form label-width="25%">
				<el-form-item label="试衣包编码:" align="left">
					{{fittingBag.code}}
				</el-form-item>
				<el-form-item label="试衣包名称" align="left">
					{{fittingBag.name}}
				</el-form-item>
				<el-form-item :label="item.name+':'" align="left" v-for="item in storeAdjustmentItemList">
					<el-input-number v-model="item.adjustValue" :min="0" v-if="1 == item.adjustMode" ></el-input-number>
					<el-radio v-model="item.storeAdjustmentItemOption" :label="option" v-for="option in item.options" v-if="2 == item.adjustMode">{{option}}</el-radio>
				</el-form-item>
			</el-form>
			<el-button type="primary" @click="submitStoreAdjustment()" size="small" v-show="fittingBag.id && size.id">确定</el-button>
		</el-card>
    </div>
</template>

<script>
	import {styleFind,styleColorListByStyleId,storeAdjustmentItemFind,sizeCalculate,fittingBagFind,submitStoreAdjustment} from '../../api/api';
    export default {
        data() {
            return {
				styleList:[],
				styleId:'',
				colorList:[],
				colorId:'',
				storeAdjustmentItemList:[],
				bodyMeasure:{
					//款式id
					styleId:'',
					//下胸围
					underchest:'',
					//上胸围-托高
					onchestLift:'',
					//左乳宽
					nipplewidthLeft:'',
					//右乳宽
					nipplewidthRight:'',
					//松紧度 1:松软 2:其他
					tightNess:'',
					//腰部 1:细腰  2:其他
					waist:''
				},
				size:{},
				fittingBag:{},
            };
        },
        mounted(){
			this.initStyleList();
			this.initStoreAdjustmentItemList();
        },
        methods:{
			clearData() {
				this.styleList = [];
				this.styleId = '';
				this.colorList = [];
				this.colorId = '';
				this.storeAdjustmentItemList = [];
				this.bodyMeasure = {
					//款式id
					styleId:'',
					//下胸围
					underchest:'',
					//上胸围-托高
					onchestLift:'',
					//左乳宽
					nipplewidthLeft:'',
					//右乳宽
					nipplewidthRight:'',
					//松紧度 1:松软 2:其他
					tightNess:'',
					//腰部 1:细腰  2:其他
					waist:''
				};
				this.size = {};
				this.fittingBag = {};
				this.initStyleList();
				this.initStoreAdjustmentItemList();
			},
			submitStoreAdjustment() {
				var storeAdjustment = [];
				for(var i in this.storeAdjustmentItemList) {
					var item = this.storeAdjustmentItemList[i];
					if(1 == item.adjustMode) {
						if(!item.adjustValue) {
							this.$message({message: "请输入"+item.name,type: 'error'});
							return;
						}
					}
					if(2 == item.adjustMode) {
						if(!item.storeAdjustmentItemOption) {
							this.$message({message: "请选择"+item.name,type: 'error'});
							return;
						}
					}
					var obj = {};
					obj.storeAdjustmentItemId = item.id;
					if(item.adjustValue) {
						obj.adjustValue = ""+item.adjustValue;
					}
					if(item.storeAdjustmentItemOption) {
						obj.storeAdjustmentItemOption = item.storeAdjustmentItemOption;
					}
					storeAdjustment.push(obj);
				}
				var param = {
					//测试数据
					orderNo:'orderNo',
					goodsCode:'goodsCode',
					goodsColor:'goodsColor',
					goodsSn:'goodsSn',
					customerId:'customerId',
					customerCardNo:'customerCardNo',
					customerName:'customerName',
					// -- 
					fittingBagId:this.fittingBag.id,
					bodyMeasure:JSON.stringify(this.bodyMeasure),
					storeAdjustment:JSON.stringify(storeAdjustment),
					operatorId:JSON.parse(sessionStorage.getItem("user")).accountId,
                    remark:'',
				}
				submitStoreAdjustment(param).then(res => {
                    if ('200' == res.returnCode) {
                        this.$message({message: '操作成功',type: 'success'});
                    } else {
                        this.$message({message: res.returnMsg,type: 'error'});
					}
					this.clearData();
                }) .catch(err => {
                    console.log(err);
                });
			},
			initStyleList(){
                var params = {
                };
                styleFind(params).then(res => {
					if('200' == res.returnCode) {
						this.styleList = res.returnData;
                    }
				}) .catch(err => {
					console.log(err);
				});
			},
			selectStyle(){
				var params = {
					styleId:this.styleId
                };
                styleColorListByStyleId(params).then(res => {
					if('200' == res.returnCode) {
						var list = [];
						for(var i in res.returnData) {
							list.push(res.returnData[i].color);
						}
						this.colorList = list;
                    }
				}) .catch(err => {
					console.log(err);
				});
			},
			initStoreAdjustmentItemList() {
                var params = {
                }
                storeAdjustmentItemFind(params).then(res => {
					if('200' == res.returnCode) {
                        if(res.returnData && res.returnData.length > 0) {
                            for(var i in res.returnData) {
                                var item = res.returnData[i];
                                if(item.options) {
                                    item.options = JSON.parse(item.options);
								}
							}
							this.storeAdjustmentItemList = res.returnData;
                        }
                    }
				}) .catch(err => {
					console.log(err);
				});
			},
			sizeCalculate() {
				if(!this.styleId) {
                    this.$message({message: "请选择款式",type: 'error'});
                    return;
				}
				if(!this.colorId) {
                    this.$message({message: "请选择颜色",type: 'error'});
                    return;
				}
				if(!this.bodyMeasure.underchest || this.bodyMeasure.underchest <= 0) {
                    this.$message({message: "请输入下胸围",type: 'error'});
                    return;
				}
				if(!this.bodyMeasure.onchestLift || this.bodyMeasure.onchestLift <= 0) {
                    this.$message({message: "请输入上胸围-托高",type: 'error'});
                    return;
				}
				if(!this.bodyMeasure.nipplewidthLeft  || this.bodyMeasure.nipplewidthLeft <= 0) {
                    this.$message({message: "请输入左乳宽",type: 'error'});
                    return;
				}
				if(!this.bodyMeasure.nipplewidthRight  || this.bodyMeasure.nipplewidthRight <= 0) {
                    this.$message({message: "请输入右乳宽",type: 'error'});
                    return;
				}
				if(!this.bodyMeasure.tightNess) {
                    this.$message({message: "请选择松紧度",type: 'error'});
                    return;
				}
				if(!this.bodyMeasure.waist) {
                    this.$message({message: "请选择腰部",type: 'error'});
                    return;
				}
				this.bodyMeasure.styleId = this.styleId;
                sizeCalculate(this.bodyMeasure).then(res => {
					if('200' == res.returnCode) {
						this.size = res.returnData;
						var param = {
							styleId:this.styleId,
							colorId:this.colorId,
							sizeId:this.size.id
						}
						fittingBagFind(param).then(res => {
							if('200' == res.returnCode) {
								if(res.returnData && res.returnData.length > 0 ) {
									this.fittingBag = res.returnData[0];
								}else{
									this.$message({message: "未匹配到试衣包",type: 'error'});
								}
							}
						}) .catch(err => {
							console.log(err);
						});
                    }else{
						this.$message({message: res.returnMsg,type: 'error'});
					}
				}) .catch(err => {
					console.log(err);
				});
			}
        }
    }
</script>

<style scoped>
.box-card {
	width: 40%;
	margin-left: 30%;
	margin-top: 20px;
}
</style>