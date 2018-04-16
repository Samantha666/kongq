<template>
	<div style="padding: 20px;">
	    <el-row>
	      <h3 style="margin-left: 2%;margin-top: 0;">尺码管理</h3>
	    </el-row>
    	<!-- 搜索框 -->
		<el-row class="toolbar saerch-toolbar">
			<el-col :span="24">
				<el-form :inline="true" :model="FormSearch" ref="FormSearch" class="form-search" label-width="90px"> 					
					<el-form-item label="尺码编码:" prop="code">
		            	<el-input v-model="FormSearch.code" placeholder="请输入尺码编码"></el-input>
		          	</el-form-item>
		          	<el-form-item>			            
			            <el-button type="primary" @click="fetchData" size="small">查询</el-button>
			            <el-button type="primary" @click="resetForm('FormSearch')" size="small">重置</el-button>
		          	</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		
		<!--新增-->
		<el-button type="primary" icon="el-icon-plus" @click="handleClickAdd" size="small" style="margin-bottom: 10px;">新增</el-button>	
		
		<!-- 表格 -->
		<el-table :data="DataList" fit>
			<el-table-column fixed type="index" width="50"></el-table-column>
			<el-table-column label="尺码编码" prop="code"></el-table-column>
			<el-table-column label="品类" prop="category.name"></el-table-column>
			<el-table-column label="创建时间" prop="createTime"></el-table-column>			
			<el-table-column label="备注" prop="remark"></el-table-column>
			<el-table-column fixed="right" label="操作" width="140">
      			<template slot-scope="scope">
			        <el-button @click="handleClickEdit(scope.row)" type="text" size="small">修改</el-button>
			        <!--<el-button @click="handleClickDel(scope.row)" type="text" size="small">删除</el-button>-->
			    </template>
    		</el-table-column>
		</el-table>	
		
		<!--FormDialog-->
		<el-dialog title="尺码信息" :visible.sync="FormDialog" :close-on-click-modal="false" width="50%" @close="closeOuterDialog('FormDialog')">
			<el-form ref="FormDialog" :model="FormData" :rules="rules" label-width="140px" style="width: 60%;margin: 0 auto;">
			  	<el-form-item label="尺码编码" prop="code">
			    	<el-input v-model="FormData.code"></el-input>
			  	</el-form-item>	
			  	<el-form-item label="品类" prop="checkCategory">
			  		<el-cascader v-model="FormData.checkCategory" placeholder="请选择品类" :options="options" :props="categoryProps" @change="handleCategoryChange" filterable change-on-select style="width: 100%;"></el-cascader>
			  	</el-form-item>				  	
			  	<el-form-item label="备注" prop="remark">
			    	<el-input v-model="FormData.remark" type="textarea" :rows="2" placeholder="请填写备注"></el-input>
			  	</el-form-item>			  	
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="FormDialog = false" size="small">取 消</el-button>
			    <el-button type="primary" @click="handleClickSave('FormDialog')" size="small">保 存</el-button>
		  	</span>
		</el-dialog>
		
		<!-- 分页 -->
		<el-row class="toolbar">
			<el-col :span="24">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
					:current-page="currentPage" 
					:page-size="100" 
					layout="total,pager" 
					:total="total" 
					style="float: right;">					
				</el-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {sizeList,sizeCategoryList,sizeDialog,sizeDeletList} from '../../api/api';
	export default {
		data() {
			return {
				//分页
				currentPage: 1,
				total:0,				
				//搜索
				FormSearch: {
					code:''
				},
				//数据列表
				DataList: [],				
				//FormDialog
				FormDialog: false,
				//新增
				FormData:{
					code:'',					
					createrId:'',
					remark:'',
					categoryId:'',
					checkCategory:[]
				},
            	//表单验证
				rules: {
	          		code: [
			            {required: true, message: '请输入尺码编码', trigger: 'blur' }
		          	],
		          	checkCategory:[
		          		{required: true, message: '请选择品类', trigger: 'blur' }
		          	],
		          	remark:[
		          		{required: true, message: '请填写备注', trigger: 'blur' }
		          	]
		       	},
				//级联选择器配置选项
				options: [],
				categoryProps:{
					value: 'id',
					label: 'name',
					children: 'childCategoryList'
				}				  
           	}
       	},			
		methods: {
			//重置
			resetForm(FormSearch){
				if(this.$refs[FormSearch] !== undefined) {
          			this.$refs[FormSearch].resetFields();
        		}
				this.fetchData();
			},	
			//关闭Dialog
			closeOuterDialog(FormDialog) {
		        this.$refs[FormDialog].resetFields();
		    },
		    handleCategoryChange(val){
		    	console.log(val);
		    	this.FormData.categoryId = val[val.length - 1]
		    },
			//数据列表
			fetchData(){
				var self = this;				
		        var params = {
		          	'code': self.FormSearch.code,
		          	'page': self.currentPage,
		          	'rows': self.rows
		        };
		        sizeList(params).then(function (res) {		        	
		          	if(res.returnCode == '200'){
		            	//console.log(res.rows)
                    	self.DataList = res.rows;
                    	self.total = res.total;
		          	}
		        }).catch(function(err){
		          	console.log("table",err)
		        });
			},	
			//查询品类及其所属下级的品类信息
			searchCategoryList(){
				var self = this;
		        var params = {};
		        sizeCategoryList(params).then(function (res) {	
		        	//console.log(res)
		          	if(res.returnCode == '200'){
                    	self.options = res.returnData;
		          	}
		        }).catch(function(err){
		          	console.log("table",err)
		        });
			},						
			//新增
			handleClickAdd(){
				this.FormData = {}
				this.FormDialog = true; 
			},
			//修改
			handleClickEdit(row) {
				console.log(row);
				this.FormData = Object.assign({},row);
        		this.FormDialog = true;
		        
		        if(row.category.pathIds == undefined){
					this.FormData.checkCategory = row.categoryId.split(",")
		        }else{
		          	this.FormData.checkCategory = row.category.pathIds.split(",")
		          	this.FormData.checkCategory.push(row.categoryId)
		        }
     		},	
			handleClickSave(FormDialog){
				this.$refs[FormDialog].validate((valid) => {
		          	if (valid) {
		            	var self = this;
				        if(self.FormData.id === ''){
				        	//新增
				        	var params = {
					        	'code': self.FormData.code,		        	
					        	'categoryId': self.FormData.categoryId,
								'createrId': JSON.parse(sessionStorage.getItem("user")).accountId,
								'remark': self.FormData.remark 
					        }
				        }else{
				        	//修改
				        	var params = {
					        	'id': self.FormData.id,
								'code': self.FormData.code,
								'categoryId': self.FormData.categoryId,
								'createrId': JSON.parse(sessionStorage.getItem("user")).accountId,
								'remark': self.FormData.remark,
								'modifierId': JSON.parse(sessionStorage.getItem("user")).accountId,
								'createTime': self.FormData.createTime 
					        }
				        }
				        sizeDialog(params).then(function (res) {		        	
				          	if('200' == res.returnCode){
		                      self.$message({message: '操作成功',type: 'success'});
				        		self.fetchData();
				        		self.FormDialog = false;
		                  	}else{
		                      	self.$message({message: '操作失败',type: 'error'});
		                  	}   
				        }).catch(function(err){
				          	console.log("table",err)
				        });
		          	}else {
		            	console.log('error submit!!');
		           		return false;
		          	}
		        });	
			},
			//删除
			handleClickDel(row){
				//console.log(row.id)	
                //删除
				this.$confirm('确定要删除该条尺码信息吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
               	}).then(() => { 
               		var self = this;
			        var params = {
			          	'id':row.id
			        };
			        sizeDeletList(params).then(function (res) {
			          	if('200' == res.returnCode) {
                            self.$message({message: '删除成功',type: 'success'});
                            self.fetchData();
                        }else{
                            self.$message({message: '删除失败',type: 'error'});
                        }  
			        }).catch(function(err){
			          	console.log("table",err)
			        });
                })
			},
			//分页
			handleSizeChange(val) {
		        console.log(`每页 ${val} 条`);
		    },
		    handleCurrentChange(val) {		    	
		    	console.log(`当前页: ${val}`);
		    	this.currentPage = val;
		    	this.fetchData();
		    }
		},
		mounted(){
            this.fetchData();
            this.searchCategoryList();
        }
	}
</script>

<style>
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
  .saerch-toolbar {
    margin-top: 0;
  }
  .saerch-toolbar .line {
    text-align: center;
  }
  .el-form-item.is-success .el-input__inner, 
  .el-form-item.is-success .el-input__inner:focus, 
  .el-form-item.is-success .el-textarea__inner, 
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #409EFF;
}
</style>