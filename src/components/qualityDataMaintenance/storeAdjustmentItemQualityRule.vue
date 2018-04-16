<template>
    <div style="padding: 20px;">
        <el-row>
            <h3 style="margin-left: 2%;margin-top: 0;">门店可调项-质检规则</h3>
        </el-row>
        <el-row class="toolbar search-toolbar">
            <el-col :span="24">
                <el-form :inline="true" :model="searchDto"  class="form-search" label-width="150px">
                    <el-form-item label="试衣包:" style="margin-bottom: 10px;">
                        <el-select
                            v-model="searchDto.fittingBagId"
                            filterable
                            remote
                            placeholder="请选择试衣包"
                            :remote-method="remoteSearchFittingBagMethod"
                            >
                                <el-option
                                    v-for="item in searchFittingBagData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="门店可调整项:" style="margin-bottom: 10px;">
                        <el-select v-model="searchDto.storeAdjustmentItemId" placeholder="请选择">
                            <el-option
                                v-for="item in storeAdjustmentItemList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="质检部位:" style="margin-bottom: 10px;">
                        <el-select v-model="searchDto.qualityCheckingPositionId" placeholder="请选择">
                            <el-option
                                v-for="item in qualityCheckingPositionList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom: 10px;">
                        <el-button type="primary" @click="clearSearchDto()" size="small">重置</el-button>
                        <el-button type="primary" @click="search()" size="small">查询</el-button>
                        <el-button type="primary" @click="add()" size="small">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-table
                :data="tableData"
                border
            >
            <el-table-column
                prop="fittingBag.name"
                label="试衣包名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="storeAdjustmentItem.name"
                label="门店可调整项名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="storeAdjustmentItem.adjustModeName"
                label="门店可调整项调整方式"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="qualityCheckingPosition.name"
                label="质检部位名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="adjustValue"
                label="调整值"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="unit"
                label="计量单位"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="statusName"
                label="状态"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="修改时间"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注"
                align="center"
            >
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="100"
                align="center"
            >
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total,pager"
            :total="total"
        >
        </el-pagination>
        <el-dialog
                    @close="hiddenDialog"
                    :title="submitFormData.id?'修改':'添加'"
                    :visible.sync="dialogVisible"
                >
            <el-form :model="submitFormData" label-width="25%" ref="submitFormData">
                <el-form-item label="试衣包:" align="left">
                    <el-select
                        v-model="submitFormData.fittingBagId"
                        filterable
                        remote
                        placeholder="请选择试衣包"
                        :remote-method="remoteFormFittingBagMethod"
                        >
                            <el-option
                                v-for="item in formFittingBagData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                
                                >
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="门店可调整项:" align="left">
                    <el-select v-model="submitFormData.storeAdjustmentItemId" placeholder="请选择" @change="changeStoreAdjustmentItem">
                        <el-option
                            v-for="item in storeAdjustmentItemList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="步进值:" align="left" v-show="selectStoreAdjustmentItem&&(1 == selectStoreAdjustmentItem.adjustMode)">
                    {{selectStoreAdjustmentItem.stepValue}}
                </el-form-item>
                <el-form-item label="计量单位:" align="left" v-show="selectStoreAdjustmentItem&&(1 == selectStoreAdjustmentItem.adjustMode)">
                    {{selectStoreAdjustmentItem.unit}}
                </el-form-item>
                <el-form-item label="选项内容:" align="left" v-show="selectStoreAdjustmentItem&&(2 == selectStoreAdjustmentItem.adjustMode)">
                    <el-radio-group v-model="submitFormData.storeAdjustmentItemOption">
                        <el-radio :label="option" v-for="option in selectStoreAdjustmentItem.options">{{option}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="质检部位:" align="left">
                    <el-select v-model="submitFormData.qualityCheckingPositionId" placeholder="请选择">
                        <el-option
                            v-for="item in qualityCheckingPositionList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="质检调整值" align="left">
                    <el-input-number v-model="submitFormData.adjustValue" ></el-input-number>
                </el-form-item>
                <el-form-item label="质检计量单位" align="left">
                    <el-input v-model="submitFormData.unit" style="width:50%"></el-input>
                </el-form-item>
                <el-form-item label="备注" align="left">
                    <el-input type="textarea" :rows="2" v-model="submitFormData.remark" style="width:50%"></el-input>
                </el-form-item>
                <el-form-item label="是否生效" align="left" v-show="submitFormData.id">
                    <el-radio-group v-model="submitFormData.status">
                        <el-radio label="1">生效</el-radio>
                        <el-radio label="2">失效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button  type="primary" @click="submitForm()">{{submitFormData.id?"修改":"添加"}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {storeAdjustmentItemFind,ruleQualityCheckingAdd,ruleQualityCheckingEdit,ruleQualityCheckingList,qualityCheckingPositionFind,fittingBagFind,fittingBagList} from '../../api/api';
    export default {
        data() {
            return {
                searchDto:{
                    fittingBagId:'',
                    storeAdjustmentItemId:'',
                    qualityCheckingPositionId:'',
                },
                searchFittingBagData:[],
                currentPage:1,
                total:0,
                pageSize:10,
                tableData:[],
                dialogVisible:false,
                submitFormData:{
                    id:'',
	                fittingBagId:'',
	                storeAdjustmentItemId:'',
	                storeAdjustmentItemOption:'',
	                qualityCheckingPositionId:'',
	                adjustValue:'',
	                unit:'',
	                operatorId:JSON.parse(sessionStorage.getItem("user")).accountId,
                    remark:'',
                    status:''
                },
                formFittingBagData:[],
                storeAdjustmentItemList:[],
                selectStoreAdjustmentItem:{},
                qualityCheckingPositionList:[],
            };
        },
        mounted(){
            this.remoteSearchFittingBagMethod('');
            this.initStoreAdjustmentItemList();
            this.initQualityCheckingPositionList();
            this.search();
        },
        methods:{
            //试衣包查询
            remoteSearchFittingBagMethod(queryStr) {
                this.queryFittingBag(1,queryStr);
            },
            remoteFormFittingBagMethod(queryStr) {
                this.queryFittingBag(2,queryStr);
            },
            queryFittingBag(type,queryStr){
                if(queryStr !== '') {
                    var params = {
                        name:queryStr
                    }
                    fittingBagFind(params).then(res => {
                        if('200' == res.returnCode) {
                            if(1 == type) {
                                this.searchFittingBagData = res.returnData;
                            }else if(2 == type){
                                this.formFittingBagData = res.returnData;
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }else{
                    var params = {
                        page:1,
                        rows:20
                    }
                    fittingBagList(params).then(res => {
                        if('200' == res.returnCode) {
                            if(1 == type) {
                                this.searchFittingBagData = res.rows;
                            }else if(2 == type){
                                this.formFittingBagData = res.rows;
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            handleSizeChange(val) {

            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.search();
            },
            clearSearchDto(){
                this.searchDto.fittingBagId = '';
                this.searchDto.storeAdjustmentItemId = '';
                this.searchDto.qualityCheckingPositionId = '';

                this.searchFittingBagData = [];
            },
            search(){
                var params = {
                    'fittingBagId':this.searchDto.fittingBagId,
                    'storeAdjustmentItemId':this.searchDto.storeAdjustmentItemId,
                    'qualityCheckingPositionId':this.searchDto.qualityCheckingPositionId,
					'rows':this.pageSize,
					'page':this.currentPage
                };
				ruleQualityCheckingList(params).then(res => {
                    console.log("### "+JSON.stringify(res));
					if('200' == res.returnCode) {
                        for(var i in res.rows) {
                            var item = res.rows[i];
                            if("1" == item.status) {
                                item.statusName = "生效";
                            }
                            if("2" == item.status) {
                                item.statusName = "失效";
                            }
                            if(item.storeAdjustmentItem ) {
                                if(item.storeAdjustmentItem.adjustMode) {
                                    if("1" == item.storeAdjustmentItem.adjustMode) {
                                        item.storeAdjustmentItem.adjustModeName = '步进值';
                                    }
                                    if("2" == item.storeAdjustmentItem.adjustMode) {
                                        item.storeAdjustmentItem.adjustModeName = '选择项';
                                        if(item.storeAdjustmentItem.options) {
                                            item.storeAdjustmentItem.options = JSON.parse(item.storeAdjustmentItem.options);
                                        }
                                    }
                                }
                            }
                        }
                        this.tableData = res.rows;
                    	this.total = res.total;
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
            initQualityCheckingPositionList(){
                var params = {
                }
                qualityCheckingPositionFind(params).then(res => {
					if('200' == res.returnCode) {
                        if(res.returnData && res.returnData.length > 0) {
                            this.qualityCheckingPositionList = res.returnData;
                        }
                    }
				}) .catch(err => {
					console.log(err);
				});
            },
            initSubmitFormData(){
                this.submitFormData.id = "";
                this.submitFormData.fittingBagId = "";
	            this.submitFormData.storeAdjustmentItemId = "";
	            this.submitFormData.storeAdjustmentItemOption = "";
	            this.submitFormData.qualityCheckingPositionId = "";
	            this.submitFormData.adjustValue = "";
	            this.submitFormData.unit = "";
	            this.submitFormData.operatorId = JSON.parse(sessionStorage.getItem("user")).accountId;
                this.submitFormData.remark = "";
                this.submitFormData.status = "";
                
                this.selectStoreAdjustmentItem = {};
                this.formFittingBagData = [];
            },
            showDialog() {
                this.initSubmitFormData();
                this.dialogVisible = true;
            },
            hiddenDialog(){
                this.initSubmitFormData();
                this.dialogVisible = false;
            },
            add() {
                this.showDialog();
                this.remoteFormFittingBagMethod('');
            },
            edit(row) {
                this.showDialog();
                if(row) {
                    this.submitFormData.id = row.id;
                    this.submitFormData.fittingBagId = row.fittingBag.id;
                    this.submitFormData.storeAdjustmentItemId = row.storeAdjustmentItem.id;
                    this.submitFormData.storeAdjustmentItemOption = row.storeAdjustmentItemOption;
                    this.submitFormData.qualityCheckingPositionId = row.qualityCheckingPosition.id;
                    this.submitFormData.adjustValue = row.adjustValue;
                    this.submitFormData.unit = row.unit;
                    this.submitFormData.remark = row.remark;
                    this.submitFormData.status = row.status;

                    this.selectStoreAdjustmentItem = row.storeAdjustmentItem;
                    this.formFittingBagData.push(row.fittingBag);
                }
            },
            submitForm() {
                if(!this.submitFormData.fittingBagId) {
                    this.$message({message: "请选择试衣包",type: 'error'});
                    return;
                }
                if(!this.submitFormData.storeAdjustmentItemId) {
                    this.$message({message: "请选择门店可调整项",type: 'error'});
                    return;
                }
                if('2' == this.selectStoreAdjustmentItem.adjustMode) {
                    if(!this.submitFormData.storeAdjustmentItemOption) {
                        this.$message({message: "请选择选项内容",type: 'error'});
                        return;
                    }
                }
                if(!this.submitFormData.qualityCheckingPositionId) {
                    this.$message({message: "请选择质检部位",type: 'error'});
                    return;
                }
                if(!this.submitFormData.adjustValue) {
                    this.$message({message: "请输入质检调整值",type: 'error'});
                    return;
                }
                if(!this.submitFormData.unit) {
                    this.$message({message: "请输入质检计量单位",type: 'error'});
                    return;
                }
                var param = {
                    id:this.submitFormData.id,
	                fittingBagId:this.submitFormData.fittingBagId,
	                storeAdjustmentItemId:this.submitFormData.storeAdjustmentItemId,
	                storeAdjustmentItemOption:this.submitFormData.storeAdjustmentItemOption,
	                qualityCheckingPositionId:this.submitFormData.qualityCheckingPositionId,
	                adjustValue:this.submitFormData.adjustValue,
	                unit:this.submitFormData.unit,
	                operatorId:this.submitFormData.operatorId,
                    remark:this.submitFormData.remark,
                    status:this.submitFormData.status
                }
                this.hiddenDialog();
                var func = param.id?ruleQualityCheckingEdit(param):ruleQualityCheckingAdd(param);
                func.then(res => {
                    if ('200' == res.returnCode) {
                        this.$message({message: '操作成功',type: 'success'});
                    } else {
                        this.$message({message: res.returnMsg,type: 'error'});
                    }
                    this.search();
                }) .catch(err => {
                    console.log(err);
                });
            },
            changeStoreAdjustmentItem(){
                for(var i in this.storeAdjustmentItemList) {
                    var item = this.storeAdjustmentItemList[i];
                    if(item.id == this.submitFormData.storeAdjustmentItemId) {
                        this.selectStoreAdjustmentItem = item;
                        break;
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .page {
        margin-top:10px;
        float:right;
        margin-right:0;
    }
    /* 公用表格样式修改 */
    .el-table {
        border-top: 1px solid #dfe6ec;
        border-left: 1px solid #dfe6ec;
        border-right: 1px solid #dfe6ec;
    }
    .el-table th {
        background-color: #eef1f6;
    }
    /* 公用搜索框+分页修改  */
    .toolbar {
        background: #f2f2f2;
        padding: 10px;
        margin: 10px 0;
    }
    .search-toolbar {
        margin-top: 0;
    }
    .search-toolbar .line {
        text-align: center;
    }
</style>