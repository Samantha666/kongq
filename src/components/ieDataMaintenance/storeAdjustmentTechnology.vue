<template>
	<div style="padding: 20px;">
		<el-row>
	      <h3 style="margin-left: 2%;margin-top: 0;">订单工艺</h3>
	    </el-row>
    	<!-- 搜索框 -->
		<el-row class="toolbar saerch-toolbar">
			<el-col :span="24">
				<el-form :inline="true" :model="FormSearch" ref="FormSearch" class="form-search" label-width="90px">					      
					<el-form-item label="订单号:" prop="orderNo">
		            	<el-input v-model="FormSearch.orderNo" placeholder="请输入订单号"></el-input>
		          	</el-form-item>
					<el-form-item label="会员姓名:" prop="name">
		            	<el-input v-model="FormSearch.name" placeholder="请输入会员姓名"></el-input>
		          	</el-form-item>		          	
		          	<el-form-item label="会员卡号:" prop="memberNo">
		            	<el-input v-model="FormSearch.memberNo" placeholder="请输入会员卡号"></el-input>
		          	</el-form-item>
		          	<el-form-item label="商品编码:" prop="code">
		            	<el-input v-model="FormSearch.code" placeholder="请输入商品编码"></el-input>
		          	</el-form-item>
		          	<el-form-item>			            
			            <el-button type="primary" @click="feathStoreList" size="small">查询</el-button>
			            <el-button type="primary" @click="resetForm('FormSearch')" size="small">重置</el-button>
		          	</el-form-item>
				</el-form>
			</el-col>
		</el-row>
		
		<!-- 门店列表 -->
		<el-table :data="StoreList" highlight-current-row @current-change="handleCurrentChange" style="width: 100%">
		    <el-table-column type="index" width="50"></el-table-column>
		    <el-table-column property="customerCardNo" label="会员卡号"></el-table-column>
		    <el-table-column property="customerName" label="会员姓名"></el-table-column>
		    <el-table-column property="orderNo" label="订单号"></el-table-column>
		    <el-table-column property="goodsCode" label="商品编码"></el-table-column>		    
		    <el-table-column property="goodsColor" label="颜色"></el-table-column>
		    <el-table-column property="goodsSn" label="尺码"></el-table-column>
		    <el-table-column property="createTime" label="创建时间" ></el-table-column>		    
		    <el-table-column fixed="right" label="操作" width="140">
      			<template slot-scope="scope">
			        <el-button @click="handleClickAddCrafts(scope.row)" type="text" size="small">新增</el-button>
			    </template>
    		</el-table-column>
  		</el-table>
  		
  		<!-- 分页 -->
		<el-row class="toolbar">
			<el-col :span="24">
				<el-pagination @size-change="handleCraftsChange" @current-change="handlePageChange" 
					:current-page="currentPage" 
					:page-size="100" 
					layout="total,pager" 
					:total="total" 
					style="float: right;">					
				</el-pagination>
			</el-col>
		</el-row>
  		
		<!--//下载-->
		<el-button type="primary" icon="el-icon-download" @click="handleDownload" size="small" style="margin: 10px 0;">下载</el-button>
		
		<!-- 工艺列表 -->
		<el-table :data="craftsList" fit style="margin-top:10px">
			<el-table-column fixed type="index" width="50"></el-table-column>
			<el-table-column label="工艺编号" prop="code"></el-table-column>
			<el-table-column label="制作工艺" prop="manufacturingProcess"></el-table-column>
			<el-table-column label="图片" prop="img">
		        <template slot-scope="scope">
		          	<img :src="item" v-for="item in JSON.parse(scope.row.imageKeys)" :key="item" width="50" height="50" style="margin-right: 10px;">
		        </template>
		    </el-table-column>
			<el-table-column fixed="right" label="操作" width="140">
      			<template slot-scope="scope">
			        <el-button @click="handleClickDel(scope.$index, craftsList)" type="text" size="small">删除</el-button>
			    </template>
    		</el-table-column>
		</el-table>
				
		<!--FormDialog-->
		<el-dialog title="新增工艺" :visible.sync="FormDialog" :close-on-click-modal="false" width="50%" @close="closeOuterDialog('FormDialog')">
			<el-form ref="FormDialog" :model="FormData" label-width="140px" :rules="rules">
			  	<el-form-item label="添加工艺" prop="craftsAdd">
			    	<el-select v-model="FormData.craftsAdd" multiple filterable allow-create default-first-option placeholder="请选择要添加的工艺" @change="checkedCrafts" style="width: 100%;">
					    <el-option
					      	v-for="item in craftsOptions"
					      	:key="item.code"
					      	:label="item.code"
					      	:value="item.code">
					    </el-option>
		  			</el-select>
			  	</el-form-item>
			  	<el-form-item>
			  		<table style="width: 100%;" class="checkTable" cellspacing="0" cellpadding="0" >
						<tr>
							<th>序号</th>
							<th>工艺编号</th>
							<th>工艺名称</th>
							<th>图片</th>
							<th>创建时间</th>
							<th>拖拽排序</th>
						</tr>
						<tr v-for="(technology,index) in AddCraftsList" v-dragging="{ item: technology, list: AddCraftsList, group: 'technology' }">
							<td>{{index}}</td>
							<td>{{technology.code}}</td>							
							<td>{{technology.manufacturingProcess}}</td>
							<td><img :src="item" v-for="item in JSON.parse(technology.imageKeys)" :key="item" width="50" height="50" style="margin: 10px 10px 0 0;"></td>
							<td>{{technology.createTime}}</td>
							<td><i class="el-icon-rank"></i></td>
						</tr>
					</table>
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
		
	</div>
</template>
<script>
	import {CraftsStoreList,CraftsAdd,technologyList,returnDownloadOrderData} from '../../api/api';
	export default {
		data() {
			return {
				//分页
				currentPage: 1,
				total:0,
				rows:5,
				
				//搜索条件
				FormSearch: {
					orderNo:'',
					name:'',
					code:'',
					memberNo:''
				},				
				//门店列表
				StoreList: [],
				//门店id
				StoreID:'',
				//选中门店id
				checkedStoreID:'',
				currentRow: null,
				//FormDialog
				FormDialog: false,
				//工艺列表
				craftsList:[],				
				//新增工艺
				FormData:{
					craftsAdd: [],
					remark:''
				},
				craftsOptions: [],
				//弹框工艺列表
				AddCraftsList:[],
		        //表单验证
				rules: {
	          		craftsAdd:[
		          		{required: true, message: '请选择工艺', trigger: 'blur' }
		          	],
		          	remark:[
		          		{required: true, message: '请填写备注', trigger: 'blur' }
		          	]
		       	},
			};
		},		
		methods:{			
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
			//门店列表
			feathStoreList(){
				var self = this;
		        var params = {
		        	'customerCardNo':self.FormSearch.memberNo,
		        	'orderNo':self.FormSearch.orderNo,
		        	'goodsCode':self.FormSearch.code,
		        	'customerName':self.FormSearch.name,
		        	'page':self.currentPage,
		        	'rows': self.rows
		        };
		        CraftsStoreList(params).then(function (res) {		        	
		          	if(res.returnCode == '200'){
		            	//console.log(res)
                    	self.StoreList = res.rows;
                    	self.total = res.total;
                    	
                    	for(var j=0;j<self.StoreList.length;j++){
                    		self.StoreID = self.StoreList[j].id;
	                    }
                    	 
		          	}
		        }).catch(function(err){
		          	console.log("table",err)
		        });
			},
			//门店id关联工艺列表
			handleCurrentChange(val) {
        		console.log(val)
      			this.checkedStoreID = val.id;
      			for(var k=0;k<val.technologyList.length;k++){
      				console.log(JSON.parse(val.technologyList[k].technology))
					this.craftsList = JSON.parse(val.technologyList[k].technology)
				}
      		},
			//工艺列表
			craftsListFind(){
				var self = this;
        		var params = {
		        	'page':self.currentPage,
		        	'rows': self.rows
		        };
		        technologyList(params).then(function (res) {		        	
		          	if(res.returnCode == '200'){
			           	//console.log(res);
			            self.craftsOptions = res.rows;
		          	}
		        }).catch(function(err){
		          	console.log("table",err)
		        });
			},
			checkedCrafts(val){
				//console.log(val)
				var AddCraftsArray=[]
				for(var s=0;s<this.craftsOptions.length;s++){
					for(var i=0;i<val.length;i++){
						if(val[i] == this.craftsOptions[s].code){
							AddCraftsArray.push(this.craftsOptions[s])
						}
					}
				}
				this.AddCraftsList = AddCraftsArray;
				//console.log(this.AddCraftsList)
			},			
			//新增工艺
			handleClickAddCrafts(val){
				this.FormDialog = true;
				this.AddCraftsList = this.craftsList;
				//console.log(this.AddCraftsList)	
				var checkedCode =[];
				for(var x=0;x<this.craftsOptions.length;x++){
					for(var m=0;m<this.AddCraftsList.length;m++){
						if(this.AddCraftsList[m].code == this.craftsOptions[x].code){
							checkedCode.push(this.AddCraftsList[m].code)
						}
					}
				}
				this.FormData.craftsAdd = checkedCode
			},
			handleClickSave(FormDialog){	
				var self = this;
				self.craftsList = self.AddCraftsList
				self.$refs[FormDialog].validate((valid) => {
            		if (valid) { 
		                //新增
		                var params = {
				        	'id':self.checkedStoreID,
				        	'technology': JSON.stringify(self.AddCraftsList),
				        	'remark':self.FormData.remark,
				        	'operatorId':JSON.parse(sessionStorage.getItem("user")).accountId
				        };
		                CraftsAdd(params).then(function (res) {
		                  	if(res.returnCode === '200'){
		                    	self.$message({message: '操作成功',type: 'success'});
		                    	self.FormDialog = false;
		                    	self.feathStoreList();
		                  	} else {
		                    	self.$message({message: '操作失败',type: 'error'});
		                  	}
		                }).catch(function(err){
		                  console.log("form",err)
		                });
		          	}else {
		            	console.log('error submit!!');
		           		return false;
		          	}
		        });	
			},
			//删除当条工艺
			handleClickDel(index, rows){				
				//console.log(index, rows)
				rows.splice(index, 1);
				this.$confirm('确定要删除该条工艺信息吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
               	}).then(() => { 
               		var self = this;
			        var params = {
			          	'id':self.StoreID,
				        'technology': JSON.stringify(self.craftsList),
				        'operatorId':JSON.parse(sessionStorage.getItem("user")).accountId
			        };
			        CraftsAdd(params).then(function (res) {
			          	if('200' == res.returnCode) {
                            self.$message({message: '删除成功',type: 'success'});
                            console.log(self.craftsList)
                            self.feathStoreList();
                        }else{
                            self.$message({message: '删除失败',type: 'error'});
                        }  
			        }).catch(function(err){
			          	console.log("table",err)
			        });
                })
			},
			//分页
			handleCraftsChange(val) {
		        console.log(`每页 ${val} 条`);
		    },
		    handlePageChange(val) {		    	
		    	console.log(`当前页: ${val}`);
		    	this.currentPage = val;
		    	this.feathStoreList();
		    },
		    handleDownload() {
		        //下载
		        var id = '';
		        id = this.checkedStoreID;
		        var params = {
		          id: id,
		          style: '5' //1代表订单cad，2代表质检
		        };
		        var baseURLAll = returnDownloadOrderData(params);
		        if(id === ''){
		          this.$message({message: '请点击要下载的门店行!',type: 'warning'});
		        } else {
		          window.location = baseURLAll;
		        }
		      }
        },
        mounted(){
            this.feathStoreList();
            this.craftsListFind();
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