<template>
  <div style="padding: 20px;">
    <el-row>
      <h3 style="margin-left: 2%;margin-top: 0;">订单质检</h3>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="toolbar saerch-toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="formSearchData" ref="formSearch" class="form-search" label-width="75px">
          <el-form-item label="会员卡号:" prop="customerCardNo" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.customerCardNo" placeholder="请输入会员卡号"></el-input>
          </el-form-item>
          <el-form-item label="订单号:" prop="orderNo" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.orderNo" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="商品编码:" prop="goodsCode" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.goodsCode" placeholder="请输入商品编码"></el-input>
          </el-form-item>
          <el-form-item label="会员名:" prop="customerName" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.customerName" placeholder="请输入会员名"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 10px;">
            <el-button type="primary" @click="resetForm('formSearch')"  size="small">重置</el-button>
            <el-button type="primary" @click="submitSearch" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData"
              fit
              style="width: 100%;"
              @row-click="clickRow">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="会员卡号" prop="customerCardNo"></el-table-column>
      <el-table-column label="订单号" prop="orderNo"></el-table-column>
      <el-table-column label="商品编码" prop="goodsCode"></el-table-column>
      <el-table-column label="商品颜色" prop="goodsColor"></el-table-column>
      <el-table-column label="会员名" prop="customerName"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="90">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="handleClickEdit(scope.row)">编辑质检</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="toolbar">
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 30, 50]"
          :page-size="rows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableTotal"
          style="float: right;">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格2-质检数据项表格 -->
    <el-row>
      <h4 style="margin-left: 2%;margin-top: 10px;">相关质检数据</h4>
    </el-row>
    <!-- 新增 -->
    <el-button type="primary" icon="el-icon-download" @click="handleDownload" size="small" style="margin-bottom: 10px;">下载</el-button>
    <el-table :data="tableQualityData"
              fit
              style="width: 100%;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="质检数据项" prop="qualityCheckingPositionName"></el-table-column>
      <el-table-column label="质检数据值" prop="qualityCheckingValue"></el-table-column>
    </el-table>
    <!-- 新增模态框 -->
    <el-dialog title="编辑订单质检" :visible.sync="addDialogVisible"
               :close-on-click-modal="false"
               width="80%"
               @close="closeOuterDialog('addForm')">
      <el-form :model="addFormData" ref="addForm" :rules="rules" label-width="120px">
        <el-form-item prop="qualityKey" label="质检数据项:" style="margin-bottom: 10px;">
          <el-select v-model="addFormData.qualityKey" multiple placeholder="请选择" @change="handleQualityChange">
            <el-option
              v-for="item in qualityOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <table style="width: 100%;" class="checkTable" cellspacing="0" cellpadding="0" >
            <tr>
              <th>质检数据项</th>
              <th>质检数据值</th>
            </tr>
            <tr v-for="item in addFormData.qualityChecking">
              <td>{{item.qualityCheckingPositionName}}</td>
              <td><el-input v-model="item.qualityCheckingValue" size="small" style="width: 100px;"></el-input></td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item prop="remark" label="备注:">
          <el-input auto-complete="off" v-model="addFormData.remark" type="textarea" :row="2" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitAddData('addForm')" size="small">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import ElFormItem from "element-ui/packages/form/src/form-item";
  // import ElButton from "element-ui/packages/button/src/button";
  // import ElInput from "element-ui/packages/input/src/input";
  // import ElOption from "element-ui/packages/select/src/option";
  // import ElTable from "element-ui/packages/table/src/table";
  // import ElInput from "element-ui/packages/input/src/input";
  import {CraftsStoreList, qualityCheckingPositionList, storeAdjustmentQualityCheckingSaveOrUpdate, returnDownloadOrderData} from '../../api/api';
  export default {
    // components: {
    //   ElTable,
    //   ElOption,
    //   ElInput,
    //   ElButton,
    //   ElFormItem},
    // components: {ElInput},
    data() {
      return {
        formSearchData: {
          customerCardNo: '',
          orderNo: '',
          goodsCode: '',
          customerName: '',
          goodsColor: ''
        },
        tableData: [],
        tableQualityData: [],//试衣包cad数据
        tableQualityDataRowId: '',//当前行id
        qualityOptions: [],//cad数据项选项
        addFormData: {
          id: '',
          storeId: '',
          qualityKey: [],
          qualityChecking: '',
          remark: '',
          operatorId: '',
        },
        rules: {
          qualityKey: [
            { required: true, message: '请选择质检数据项', trigger: 'change' }
          ]
        },
        currentPage: 1,
        tableTotal: 0,
        rows: 5,
        addDialogVisible: false,
        userInfo: {}
      }
    },
    mounted(){
      this.getList(1);
      this.getUserInfo();
      this.getQualityList();
    },
    methods: {
      getQualityList() {
        //获取质检选项
        var self = this;
        var params = {};
        qualityCheckingPositionList(params).then(function (res) {
          if(res.returnCode === '200'){
            self.qualityOptions = res.rows;
          }
        }).catch(function(err){
          console.log("qualityOptions",err)
        });
      },
      getUserInfo() {
        //获取管理员信息
        var userInfo;
        userInfo = sessionStorage.getItem('user');
        userInfo = JSON.parse(userInfo);
        this.userInfo = userInfo;
      },
      getList(page) {
        var self = this;
        var params = {
          'customerCardNo': self.formSearchData.customerCardNo,
          'orderNo': self.formSearchData.orderNo,
          'goodsCode': self.formSearchData.goodsCode,
          'customerName': self.formSearchData.customerName,
          'goodsColor': self.formSearchData.goodsColor,
          'page': page,
          'rows': self.rows
        };
        CraftsStoreList(params).then(function (res) {
          if(res.returnCode === '200'){
            self.tableData = res.rows;
            self.tableTotal = res.total;
            //重置当前行的数据
            if(self.tableQualityDataRowId !== ''){
              for(var i = 0,len = self.tableData.length; i < len;i++){
                if(self.tableQualityDataRowId === self.tableData[i].id){
                  var temprow = {};
                  temprow = Object.assign({}, self.tableData[i].qualityCheckingList[0]);
                  var tempRowQuality = JSON.parse(temprow.qualityChecking);
                  self.tableQualityData = tempRowQuality;
                }
              }
            }
          }
        }).catch(function(err){
          console.log("table",err)
        });
      },
      handleSizeChange(val) {
        //列表页分页
        this.rows = val;
        this.getList(this.currentPage);
      },
      handleCurrentChange(val) {
        //列表页分页
        this.currentPage = val;
        // this.tableCadDataRowId = ''; // 异步ajax 导致此处重置失败
        this.getList(this.currentPage);
      },
      resetForm(formName) {
        //搜索框重置表单
        if(this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
        this.getList(1);
      },
      submitSearch() {
        //提交搜索框表单
        var self = this;
        self.getList(1);
      },
      handleClickEdit(row) {
        // 修改弹窗
        this.addDialogVisible = true;
        var rowId = row.id;
        //获取详情信息
        if(row.qualityCheckingList[0] !== undefined){
          var temprow = {};
          temprow = Object.assign({}, row.qualityCheckingList[0]);
          var tempQuality = temprow.qualityChecking;
          tempQuality = JSON.parse(tempQuality);
          this.addFormData = temprow;
          this.addFormData.storeAdjustmentItemId = row.id;
          this.addFormData.qualityChecking = tempQuality;
          this.addFormData.qualityKey = [];
          for(var i in this.addFormData.qualityChecking){
            this.addFormData.qualityKey.push(this.addFormData.qualityChecking[i].qualityCheckingPositionId);
          }
        } else {
          // this.addFormData.id = '';
          this.addFormData.storeAdjustmentItemId = row.id;
          this.addFormData.qualityKey = [];
          this.addFormData.qualityChecking = [];
          this.addFormData.remark = '';
          // this.addFormData.createTime = '';
          this.addFormData.operatorId = '';
        }
      },
      submitAddData(formName) {
        //提交添加会员信息
        var self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$confirm('确认新增试衣包订单质检?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var params = {
                id: self.addFormData.storeAdjustmentItemId,
                qualityChecking: JSON.stringify(self.addFormData.qualityChecking),
                remark: self.addFormData.remark,
                operatorId: self.userInfo.accountId
              };
              // console.log(params);
              storeAdjustmentQualityCheckingSaveOrUpdate(params).then(function (res) {
                if(res.returnCode === '200'){
                  self.$message({message: '操作成功',type: 'success'});
                  self.addDialogVisible = false;
                  self.getList(self.currentPage);
                } else {
                }
              }).catch(function(err){
                console.log("form",err)
              });
            }).catch(() => {
              self.$message({
                type: 'info',
                message: '已取消'
              });
            });
          } else {
            console.log('error valid!');
            return false;
          }
        });
      },
      closeOuterDialog(formName1) {
        //外层弹窗关闭后回调-清空数据
        this.$refs[formName1].resetFields();
      },
      clickRow(row) {
        //点击试衣包某行
        this.tableQualityDataRowId = row.id;
        if(row.qualityCheckingList[0] !== undefined){
          var tempRowQuality = JSON.parse(row.qualityCheckingList[0].qualityChecking);
          this.tableQualityData = tempRowQuality;
        } else {
          this.tableQualityData = [];
        }
      },
      handleQualityChange(val){
        //dialog里面质检选项变化时触发
        var arr = [];
        var tempObj = {};
        for(var i = 0,qualityLen = this.qualityOptions.length;i < qualityLen;i++){
          for(var j = 0,valLen = val.length;j < valLen;j++){
            tempObj = {};
            if(this.qualityOptions[i].id === val[j]){
              tempObj.qualityCheckingPositionId = this.qualityOptions[i].id;
              tempObj.qualityCheckingPositionName = this.qualityOptions[i].name;
              tempObj.qualityCheckingValue = '';
              for(var l = 0,formQualityLen = this.addFormData.qualityChecking.length;l < formQualityLen;l++){
                if(val[j] === this.addFormData.qualityChecking[l].qualityCheckingPositionId){
                  tempObj.qualityCheckingValue = this.addFormData.qualityChecking[l].qualityCheckingValue;
                }
              }
              arr.push(tempObj);
            }
          }
        }
        this.addFormData.qualityChecking = arr;
      },
      handleDownload() {
        //下载
        var id = '';
        id = this.tableQualityDataRowId;
        var params = {
          id: id,
          style: '2'
        };
        var baseURLAll = returnDownloadOrderData(params);
        if(id === ''){
          this.$message({message: '请点击要下载的门店行!',type: 'warning'});
        } else {
          window.location = baseURLAll;
        }
      }
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
  .table-align-center th, .table-align-center td{
    text-align: center;
  }
  /* dialog内部table样式 */
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
