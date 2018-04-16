<template>
    <div style="padding: 20px;">
        <el-row>
            <h3 style="margin-left: 2%;margin-top: 0;">门店可调项-BOM规则</h3>
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
                    <el-form-item label="BOM部位:" style="margin-bottom: 10px;">
                        <el-select v-model="searchDto.bomPositionId" placeholder="请选择">
                            <el-option
                                v-for="item in bomPositionList"
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
                prop="bomPosition.name"
                label="bom部位名称"
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
            <el-form :model="submitFormData" label-width="15%" ref="submitFormData">
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
                <el-form-item label="BOM部位:" align="left">
                    <el-select v-model="submitFormData.bomPositionId" placeholder="请选择">
                        <el-option
                            v-for="item in bomPositionList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="已选择物料:" align="left">
                    <el-button  type="primary" @click="showSelectMaterialDialog()">添加物料</el-button>
                    <el-table
                        :data="submitFormData.materialAdjust"
                        border
                        style="width: 100%">
                        <el-table-column
                            prop="code"
                            label="物料编码"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="物料名称"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="number"
                            label="数量"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="specifications"
                            label="规格"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="100"
                            align="center">
                            <template slot-scope="scope">
                                <el-button @click="showUpdateMaterialAdjustValueDialog(scope.row)" type="text" size="small">修改调整值</el-button>
                                <el-button @click="delSelectMaterial(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
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
        <!-- 添加物料 -->
        <el-dialog
                title="添加物料"
                @close="hiddenSelectMaterialDialog"
                :visible.sync="selectMaterialDialogVisible"
                >
            <el-table
                :data="selectMaterialTableData"
                border
                style="width: 100%"
                @selection-change="selectMaterial">
                    <el-table-column
                        :selectable="selectMaterialIfSelectable"
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        label="物料编码"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="物料名称"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        label="数量"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="specifications"
                        label="规格"
                        align="center">
                    </el-table-column>
            </el-table>
            <el-pagination
                class="page"
                @size-change="handleSelectMaterialSizeChange"
                @current-change="handleSelectMaterialCurrentChange"
                :current-page.sync="selectMaterialCurrentPage"
                :page-size="selectMaterialPageSize"
                layout="total,pager"
                :total="selectMaterialTotal">
            </el-pagination>
            <br/>
        </el-dialog>
        <!-- 修改物料调整值 -->
        <el-dialog
                    title="修改物料调整值"
                    @close="hiddenUpdateMaterialAdjustValueDialog"
                    :visible.sync="updateMaterialAdjustValueDialogVisible"
                >
            <el-form :model="currentUpdateMaterial" label-width="15%">
                <el-form-item label="数量调整值:" align="left">
                    <el-input-number v-model="currentUpdateMaterial.numberAdjustValue" ></el-input-number>
                </el-form-item>
                <el-form-item label="规格调整值:" align="left">
                    <el-input-number v-model="currentUpdateMaterial.specificationsAdjustValue" ></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateSelectMaterialAdjustValue()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {storeAdjustmentItemFind,ruleBomAdd,ruleBomEdit,ruleBomList,bomPositionFind,materialList,fittingBagFind,fittingBagList} from '../../api/api';
    export default {
        data() {
            return {
                searchDto:{
                    fittingBagId:'',
                    storeAdjustmentItemId:'',
                    bomPositionId:'',
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
                    bomPositionId:'',
                    materialAdjust:[],
	                operatorId:JSON.parse(sessionStorage.getItem("user")).accountId,
                    remark:'',
                    status:''
                },
                formFittingBagData:[],
                storeAdjustmentItemList:[],
                selectStoreAdjustmentItem:{},
                bomPositionList:[],
                //物料选择
                selectMaterialCurrentPage:1,
                selectMaterialTotal:0,
                selectMaterialPageSize:10,
                selectMaterialTableData:[],
                selectMaterialDialogVisible:false,
                //修改物料调整值
                updateMaterialAdjustValueDialogVisible:false,
                currentUpdateMaterial:{},

            };
        },
        mounted(){
            this.remoteSearchFittingBagMethod('');
            this.initStoreAdjustmentItemList();
            this.initBomPositionList();
            this.search();
            this.searchSelectMaterial();
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
            // 选择物料
            handleSelectMaterialSizeChange() {

            },
            handleSelectMaterialCurrentChange(val){
                this.selectMaterialCurrentPage = val;
                this.searchSelectMaterial();
            },
            showSelectMaterialDialog(){
                this.selectMaterialDialogVisible = true;
            },
            hiddenSelectMaterialDialog(){
                this.selectMaterialDialogVisible = false;
            },
            searchSelectMaterial(){
                var params = {
					'rows':this.selectMaterialPageSize,
					'page':this.selectMaterialCurrentPage
                };
                materialList(params).then(res => {
					if('200' == res.returnCode) {
                        this.selectMaterialTableData = res.rows;
                    	this.selectMaterialTotal = res.total;
                    }
				}) .catch(err => {
					console.log(err);
				});
            },
            selectMaterial(val) {
                if(!this.submitFormData.materialAdjust){
                    this.submitFormData.materialAdjust = [];
                }
                for(var i in val) {
                    var item = val[i];
                    var b = true;
                    for(var j in this.submitFormData.materialAdjust) {
                        var item0 = this.submitFormData.materialAdjust[j];
                        if(item.id == item0.id) {
                            b = false;
                        }
                    }
                    if(b) {
                        this.submitFormData.materialAdjust.push(item);
                    }
                }
                this.$message({message: "添加成功",type: 'success'});
            },
            selectMaterialIfSelectable(row, index){
                for(var i in this.submitFormData.materialAdjust) {
                    var item = this.submitFormData.materialAdjust[i];
                    if(item.id == row.id) {
                        return false;
                    }
                }
                return true;
            },
            delSelectMaterial(row) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    for(var i in this.submitFormData.materialAdjust) {
                        var item = this.submitFormData.materialAdjust[i];
                        if(item.id == row.id) {
                            this.submitFormData.materialAdjust.splice(i, 1);
                            return;
                        }
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            },
            // -- 修改调整值
            hiddenUpdateMaterialAdjustValueDialog(){
                this.updateMaterialAdjustValueDialogVisible = false;
                this.currentUpdateMaterial = {};
            },
            showUpdateMaterialAdjustValueDialog(row) {
                this.updateMaterialAdjustValueDialogVisible = true;
                this.currentUpdateMaterial = this.deepCopy(row);
            },
            deepCopy(oldValue) { 
                var strValue = JSON.stringify(oldValue);
                return JSON.parse(strValue);
            },
            updateSelectMaterialAdjustValue(){
                for(var i in this.submitFormData.materialAdjust) {
                    var item = this.submitFormData.materialAdjust[i];
                    if(item.id == this.currentUpdateMaterial.id) {
                        this.submitFormData.materialAdjust[i].numberAdjustValue = this.currentUpdateMaterial.numberAdjustValue;
                        this.submitFormData.materialAdjust[i].specificationsAdjustValue = this.currentUpdateMaterial.specificationsAdjustValue;
                        break;
                    }
                }
                this.hiddenUpdateMaterialAdjustValueDialog();
            },
            // --- 
            handleSizeChange(val) {

            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.search();
            },
            clearSearchDto(){
                this.searchDto.fittingBagId = '';
                this.searchDto.storeAdjustmentItemId = '';
                this.searchDto.bomPositionId = '';

                this.searchFittingBagData = [];
            },
            search(){
                var params = {
                    'fittingBagId':this.searchDto.fittingBagId,
                    'storeAdjustmentItemId':this.searchDto.storeAdjustmentItemId,
                    'bomPositionId':this.searchDto.bomPositionId,
					'rows':this.pageSize,
					'page':this.currentPage
                };
				ruleBomList(params).then(res => {
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
                            if(item.materialAdjust) {
                                item.materialAdjust = JSON.parse(item.materialAdjust);
                            }else{
                                item.materialAdjust = [];
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
            initBomPositionList(){
                var params = {
                }
                bomPositionFind(params).then(res => {
					if('200' == res.returnCode) {
                        if(res.returnData && res.returnData.length > 0) {
                            this.bomPositionList = res.returnData;
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
                this.submitFormData.bomPositionId = "";
                this.submitFormData.materialAdjust = [];
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
                this.search();
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
                    this.submitFormData.bomPositionId = row.bomPosition.id;
                    this.submitFormData.materialAdjust = row.materialAdjust;
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
                if(!this.submitFormData.bomPositionId) {
                    this.$message({message: "请选择BOM部位",type: 'error'});
                    return;
                }
                var param = {
                    id:this.submitFormData.id,
	                fittingBagId:this.submitFormData.fittingBagId,
	                storeAdjustmentItemId:this.submitFormData.storeAdjustmentItemId,
	                storeAdjustmentItemOption:this.submitFormData.storeAdjustmentItemOption,
                    bomPositionId:this.submitFormData.bomPositionId,
                    materialAdjust:JSON.stringify(this.submitFormData.materialAdjust),
	                operatorId:this.submitFormData.operatorId,
                    remark:this.submitFormData.remark,
                    status:this.submitFormData.status
                }
                this.hiddenDialog();
                var func = param.id?ruleBomEdit(param):ruleBomAdd(param);
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