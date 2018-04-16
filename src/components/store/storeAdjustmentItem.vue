<template>
    <div style="padding: 20px;">
        <el-row>
            <h3 style="margin-left: 2%;margin-top: 0;">门店可调整项管理</h3>
        </el-row>
        <el-row class="toolbar search-toolbar">
            <el-col :span="24">
                <el-form :inline="true" :model="searchDto"  class="form-search" label-width="75px">
                    <el-form-item label="名称:" style="margin-bottom: 10px;">
                        <el-input v-model="searchDto.name" ></el-input>
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
                prop="name"
                label="名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="adjustModeName"
                label="调整方式"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="stepValue"
                label="步进值"
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
                prop="optionName"
                label="选项内容"
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

                <el-form-item label="名称" prop="name" align="left">
                    <el-input v-model="submitFormData.name" style="width:50%"></el-input>
                </el-form-item>

                <el-form-item label="调整方式" prop="adjustMode" align="left">
                    <el-radio-group v-model="submitFormData.adjustMode">
                        <el-radio label="1">步进值</el-radio>
                        <el-radio label="2">选择项</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="步进值" prop="stepValue" v-show="1 == submitFormData.adjustMode"  align="left">
                    <el-input-number v-model="submitFormData.stepValue" :min="0"></el-input-number>
                </el-form-item>

                <el-form-item label="计量单位" prop="unit" v-show="1 == submitFormData.adjustMode"  align="left">
                    <el-input v-model="submitFormData.unit" style="width:50%"></el-input>
                </el-form-item>

                <el-form-item label="选项内容" v-show="2 == submitFormData.adjustMode"  align="left">
                    <el-input v-model="inputOption" style="width:50%"></el-input>
                    <el-button type="primary" @click="addOption()">添加选择</el-button>
                    <br/>
                    <el-tag
                        v-for="tag in submitFormData.options"
                        :key="tag"
                        closable
                        @close="handleClose(tag)"
                        >
                        {{tag}}
                    </el-tag>
                </el-form-item>

                <el-form-item label="备注" align="left">
                    <el-input  type="textarea" :rows="2" v-model="submitFormData.remark" style="width:50%"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button  type="primary" @click="submitForm()">{{submitFormData.id?"修改":"添加"}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
	import {storeAdjustmentItemList,storeAdjustmentItemAdd,storeAdjustmentItemEdit} from '../../api/api';
    export default {
        data() {
            return {
                searchDto:{
                    name:''
                },
                currentPage:1,
                total:0,
                pageSize:10,
                tableData:[],
                dialogVisible:false,
                submitFormData:{
                    id:'',
					name:'',
					adjustMode:'',
					stepValue:'',
					unit:'',
                    options:[],
                    operatorId:JSON.parse(sessionStorage.getItem("user")).accountId,
                    remark:''
                },
                inputOption:'',
            };
        },
        mounted(){
            this.search();
        },
        methods:{
            handleSizeChange(val) {

            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.search();
            },
            clearSearchDto(){
                this.searchDto.name = '';
            },
            search(){
                var params = {
					'name':this.searchDto.name,
					'rows':this.pageSize,
					'page':this.currentPage
                };
				storeAdjustmentItemList(params).then(res => {
					if('200' == res.returnCode) {
                        for(var i in res.rows) {
                            var item = res.rows[i];
                            if(item.options){
                                item.options = JSON.parse(item.options);
                                item.optionName = item.options.join(", ");
                            }else{
                                item.options = [];
                                item.optionName = '';
                            }
                            item.adjustModeName = ('1' == item.adjustMode)?'步进值':'选择项';
                        }
                        this.tableData = res.rows;
                    	this.total = res.total;
                    }
				}) .catch(err => {
					console.log(err);
				});
            },
            initSubmitFormData(){
                if(this.$refs.submitFormData) {
                    this.$refs.submitFormData.resetFields();
                }
				this.submitFormData.id = '';
				this.submitFormData.name = '';
				this.submitFormData.adjustMode = '';
				this.submitFormData.stepValue = '';
				this.submitFormData.unit = '';
                this.submitFormData.options = [];
                this.submitFormData.operatorId = JSON.parse(sessionStorage.getItem("user")).accountId;
                this.submitFormData.remark = '';

                this.inputOption = "";
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
            },
            edit(row) {
                this.showDialog();
                if(row) {
                    this.submitFormData.id = row.id;
					this.submitFormData.name = row.name;
					this.submitFormData.adjustMode = row.adjustMode;
					this.submitFormData.stepValue = row.stepValue;
					this.submitFormData.unit = row.unit;
					this.submitFormData.options = row.options;
					this.submitFormData.remark = row.remark;
                }
            },
            submitForm() {
                this.$refs.submitFormData.validate((valid) => {
                    if(valid) {
                        if(!this.submitFormData.name) {
                            this.$message({message: "请输入名称",type: 'error'});
                            return;
                        }
                        if(!this.submitFormData.adjustMode) {
                            this.$message({message: "请选择调整方式",type: 'error'});
                            return;
                        }
                        if("1" == this.submitFormData.adjustMode) {
                            if(!this.submitFormData.stepValue) {
                                this.$message({message: "请输入步进值",type: 'error'});
                                return;
                            }
                            if(this.submitFormData.stepValue <= 0) {
                                this.$message({message: "步进值请输入正数",type: 'error'});
                                return;
                            }
                            if(!this.submitFormData.unit) {
                                this.$message({message: "请输入计量单位",type: 'error'});
                                return;
                            }
                        }
                        if("2" == this.submitFormData.adjustMode) {
                            if(!this.submitFormData.options || (this.submitFormData.options.length == 0 )) {
                                this.$message({message: "请输入选项内容",type: 'error'});
                                return;
                            }
                        }
                        var param = {
                            id:this.submitFormData.id,
                            name:this.submitFormData.name,
                            adjustMode:this.submitFormData.adjustMode,
                            stepValue:this.submitFormData.stepValue,
                            unit:this.submitFormData.unit,
                            options:JSON.stringify(this.submitFormData.options),
                            operatorId:this.submitFormData.operatorId,
                            remark:this.submitFormData.remark
                        }
                        this.hiddenDialog();
                        var func = param.id?storeAdjustmentItemEdit(param):storeAdjustmentItemAdd(param);
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
                    }else{
                        return false;
                    }
                });
            },
            addOption() {
                this.submitFormData.options.push(this.inputOption);
                this.inputOption = "";
            },
            handleClose(tag){
                var index = this.submitFormData.options.indexOf(tag);
                if (index > -1) {
                    this.submitFormData.options.splice(index, 1);
                }
            },
            
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
