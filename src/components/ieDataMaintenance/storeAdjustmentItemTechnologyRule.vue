<template>
    <div style="padding: 20px;">
        <el-row>
            <h3 style="margin-left: 2%;margin-top: 0;">门店可调项-工艺规则</h3>
        </el-row>
        <el-row class="toolbar search-toolbar">
            <el-col :span="24">
                <el-form :inline="true" :model="searchDto"  class="form-search" label-width="150px">
                    <el-form-item label="款式:" style="margin-bottom: 10px;">
                        <el-select
                            v-model="searchDto.styleId"
                            filterable
                            remote
                            placeholder="请选择款式"
                            :remote-method="remoteSearchStyleMethod"
                            >
                                <el-option
                                    v-for="item in searchStyleData"
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
                prop="style.name"
                label="款式名称"
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
                <el-form-item label="款式:" align="left">
                    <el-select
                        v-model="submitFormData.styleId"
                        filterable
                        remote
                        placeholder="请选择款式"
                        :remote-method="remoteFormStyleMethod"
                        @change="formStyleChange"
                        >
                            <el-option
                                v-for="item in formStyleData"
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
                <el-form-item label="已选择工艺" align="left">
                    <el-button  type="primary" @click="showSelectTechnologyDialog()">添加工艺</el-button>

                    <table style="width: 100%;" class="checkTable" cellspacing="0" cellpadding="0" >
                        <tr>
                            <th>序号</th>
                            <th>工艺编号</th>
                            <th>制作工艺</th>
                            <th>图片</th>
                            <th>操作</th>
                            <th>拖拽排序</th>
                        </tr>
                        <tr v-for="(technology,index) in submitFormData.technologyAdjust" v-dragging="{ item: technology, list: submitFormData.technologyAdjust, group: 'technologyAdjust' }"  :key="technology.id">
                            <td>{{index}}</td>
                            <td>{{technology.code}}</td>
                            <td>{{technology.manufacturingProcess}}</td>
                            <td><img :src="url" style="width:50px;height:50px;" v-for="url in technology.imageKeys"/></td>
                            <td><el-button @click="delSelectTechnology(technology)" type="text" size="small">删除</el-button></td>
                            <td><i class="el-icon-rank"></i></td>
                        </tr>
                    </table>
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
        <!-- 工序选择 -->
        <el-dialog
                title="添加工序"
                @close="hiddenSelectTechnologyDialog"
                :visible.sync="selectTechnologyDialogVisible"
                >
            <el-table
                :data="selectTechnologyTableData"
                border
                style="width: 100%"
                @selection-change="chooseTechnology">
                    <el-table-column
                        :selectable="selectTechnologyIfSelectable"
                        type="selection"
                        width="55"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        label="工艺编号"
                        align="center">
                    </el-table-column>

                    <el-table-column
                        prop="manufacturingProcess"
                        label="制作工艺"
                        align="center">
                    </el-table-column>

                    <el-table-column
                        label="图片"
                        align="center">
                        <template slot-scope="scope">
                            <img :src="url" style="width:50px;height:50px;" v-for="url in scope.row.imageKeys"/>
                        </template>
                    </el-table-column>
            </el-table>
            <el-pagination
                class="page"
                @size-change="handleSelectTechnologySizeChange"
                @current-change="handleSelectTechnologyCurrentChange"
                :current-page.sync="selectTechnologyCurrentPage"
                :page-size="selectTechnologyPageSize"
                layout="total,pager"
                :total="selectTechnologyTotal">
            </el-pagination>
            <br/>
        </el-dialog>

    </div>
</template>

<script>
    import {storeAdjustmentItemFind,ruleTechnologyAdd,ruleTechnologyEdit,ruleTechnologyList,styleList,styleFind,technologyList,listStyleTechnologyByStyleId} from '../../api/api';
    export default {
        data() {
            return {
                searchDto:{
                    styleId:'',
                    storeAdjustmentItemId:'',
                },
                searchStyleData:[],

                currentPage:1,
                total:0,
                pageSize:10,
                tableData:[],
                dialogVisible:false,
                submitFormData:{
                    id:'',
	                styleId:'',
	                storeAdjustmentItemId:'',
	                storeAdjustmentItemOption:'',
                    technologyAdjust:[],
                    status:'',
	                operatorId:JSON.parse(sessionStorage.getItem("user")).accountId,
                    remark:''
                },
                formStyleData:[],

                storeAdjustmentItemList:[],
                selectStoreAdjustmentItem:{},

                //工序选择
                selectTechnologyCurrentPage:1,
                selectTechnologyTotal:0,
                selectTechnologyPageSize:10,
                selectTechnologyTableData:[],
                selectTechnologyDialogVisible:false,
            };
        },
        mounted(){
            this.remoteSearchStyleMethod('');
            this.initStoreAdjustmentItemList();
            this.search();
        },
        methods:{
            //工序选择
            handleSelectTechnologySizeChange() {

            },
            handleSelectTechnologyCurrentChange(val){
                this.selectTechnologyCurrentPage = val;
                this.searchSelectTechnology();
            },
            showSelectTechnologyDialog(){
                if(!this.submitFormData.styleId) {
                    this.$message({message: "请选择款式",type: 'error'});
                    return;
                }
                this.searchSelectTechnology();
                this.selectTechnologyDialogVisible = true;
            },
            hiddenSelectTechnologyDialog(){
                this.selectTechnologyDialogVisible = false;
            },
            searchSelectTechnology(){
                var params = {
					'rows':this.selectTechnologyPageSize,
					'page':this.selectTechnologyCurrentPage
                };
                technologyList(params).then(res => {
					if('200' == res.returnCode) {
                        for(var i in res.rows) {
                            var item = res.rows[i];
                            if(item.imageKeys) {
                                item.imageKeys = JSON.parse(item.imageKeys);
                            }
                        }
                        this.selectTechnologyTableData = res.rows;
                    	this.selectTechnologyTotal = res.total;
                    }
				}) .catch(err => {
					console.log(err);
				});
            },
            chooseTechnology(val){
                if(!this.submitFormData.technologyAdjust){
                    this.submitFormData.technologyAdjust = [];
                }
                var ifPush = false;
                for(var i in val) {
                    var item = val[i];
                    var b = true;
                    for(var j in this.submitFormData.technologyAdjust) {
                        var item0 = this.submitFormData.technologyAdjust[j];
                        if(item.id == item0.id) {
                            b = false;
                        }
                    }
                    if(b) {
                        this.submitFormData.technologyAdjust.push(item);
                        ifPush = true;
                    }
                }
                if(ifPush) {
                    this.$message({message: "添加成功",type: 'success'});
                }
            },
            selectTechnologyIfSelectable(row, index){
                for(var i in this.submitFormData.technologyAdjust) {
                    var item = this.submitFormData.technologyAdjust[i];
                    if(item.id == row.id) {
                        return false;
                    }
                }
                return true;
            },
            delSelectTechnology(row) {
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    for(var i in this.submitFormData.technologyAdjust) {
                        var item = this.submitFormData.technologyAdjust[i];
                        if(item.id == row.id) {
                            this.submitFormData.technologyAdjust.splice(i, 1);
                            return;
                        }
                    }
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            },
            //款式查询
            remoteSearchStyleMethod(queryStr) {
                this.queryStyle(1,queryStr);
            },
            remoteFormStyleMethod(queryStr) {
                this.queryStyle(2,queryStr);
            },
            queryStyle(type,queryStr){
                if(queryStr !== '') {
                    var params = {
                        name:queryStr
                    }
                    styleFind(params).then(res => {
                        if('200' == res.returnCode) {
                            if(1 == type) {
                                this.searchStyleData = res.returnData;
                            }else if(2 == type){
                                this.formStyleData = res.returnData;
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
                    styleList(params).then(res => {
                        if('200' == res.returnCode) {
                            if(1 == type) {
                                this.searchStyleData = res.rows;
                            }else if(2 == type){
                                this.formStyleData = res.rows;
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            formStyleChange(id) {
                if(!this.submitFormData.id) {
                    this.submitFormData.technologyAdjust = [];
                    var param = {
                        styleId : id
                    }
                    listStyleTechnologyByStyleId(param).then(res => {
                        if('200' == res.returnCode) {
                            for(var i in res.returnData) {
                                if(res.returnData[i].technology.imageKeys) {
                                    res.returnData[i].technology.imageKeys = JSON.parse(res.returnData[i].technology.imageKeys);
                                }
                                this.submitFormData.technologyAdjust.push(res.returnData[i].technology);
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
                this.searchDto.styleId = '';
                this.searchDto.storeAdjustmentItemId = '';

                this.searchStyleData = [];
            },
            search(){
                var params = {
                    'styleId':this.searchDto.styleId,
                    'storeAdjustmentItemId':this.searchDto.storeAdjustmentItemId,
					'rows':this.pageSize,
					'page':this.currentPage
                };
				ruleTechnologyList(params).then(res => {
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
                            if(item.technologyAdjust) {
                                item.technologyAdjust = JSON.parse(item.technologyAdjust);
                                for(var j in item.technologyAdjust){
                                    item.technologyAdjust[j].imageKeys = JSON.parse(item.technologyAdjust[j].imageKeys);
                                }
                            }else{
                                item.technologyAdjust = [];
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
                    adjustMode:'2'
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
            initSubmitFormData(){
                this.submitFormData.id = "";
                this.submitFormData.styleId = "";
	            this.submitFormData.storeAdjustmentItemId = "";
	            this.submitFormData.storeAdjustmentItemOption = "";
                this.submitFormData.technologyAdjust = [];
                this.submitFormData.status = "";
	            this.submitFormData.operatorId = JSON.parse(sessionStorage.getItem("user")).accountId;
                this.submitFormData.remark = "";
                
                this.selectStoreAdjustmentItem = {};
                this.formStyleData = [];
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
                this.remoteFormStyleMethod('');
            },
            edit(row) {
                this.showDialog();
                if(row) {
                    this.submitFormData.id = row.id;
                    this.submitFormData.styleId = row.style.id;
                    this.submitFormData.storeAdjustmentItemId = row.storeAdjustmentItem.id;
                    this.submitFormData.storeAdjustmentItemOption = row.storeAdjustmentItemOption;
                    this.submitFormData.technologyAdjust = row.technologyAdjust;
                    this.submitFormData.status = row.status;
                    this.submitFormData.remark = row.remark;

                    this.selectStoreAdjustmentItem = row.storeAdjustmentItem;
                    this.formStyleData.push(row.style);
                }
            },
            submitForm() {
                if(!this.submitFormData.styleId) {
                    this.$message({message: "请选择款式",type: 'error'});
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
                //排序
                for(var i in this.submitFormData.technologyAdjust) {
                    this.submitFormData.technologyAdjust[i].sort = i;
                }
                var param = {
                    id:this.submitFormData.id,
	                styleId:this.submitFormData.styleId,
	                storeAdjustmentItemId:this.submitFormData.storeAdjustmentItemId,
	                storeAdjustmentItemOption:this.submitFormData.storeAdjustmentItemOption,
	                technologyAdjust:JSON.stringify(this.submitFormData.technologyAdjust),
	                status:this.submitFormData.status,
	                operatorId:this.submitFormData.operatorId,
                    remark:this.submitFormData.remark
                }
                var technologyAdjustArr = JSON.parse(param.technologyAdjust);
                for(var j in technologyAdjustArr) {
                    technologyAdjustArr[j].imageKeys = JSON.stringify(technologyAdjustArr[j].imageKeys);
                }
                param.technologyAdjust = JSON.stringify(technologyAdjustArr);

                this.hiddenDialog();
                var func = param.id?ruleTechnologyEdit(param):ruleTechnologyAdd(param);
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
    .checkTable td{
        text-align: center;
        border-top:1px solid #ebeef5;
    }
    .checkTable th{
        background: #eef1f6;
    }
    .checkTable{
        border: 1px solid #dfe6ec;
        margin-top:2%;
    }
</style>