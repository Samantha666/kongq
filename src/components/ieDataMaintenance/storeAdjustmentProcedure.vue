<template>
  <div style="padding: 20px;">
    <el-row>
      <h3 style="margin-left: 2%;margin-top: 0;">订单工序</h3>
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
          <el-button type="text" size="small" @click.stop="handleClickEdit(scope.row)">编辑工序</el-button>
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
    <!-- 表格2-工序数据项表格 -->
    <el-row>
      <h4 style="margin-left: 2%;margin-top: 10px;">相关工序数据</h4>
    </el-row>
    <!-- 下载 -->
    <el-button type="primary" icon="el-icon-download" @click="handleDownload" size="small" style="margin-bottom: 10px;">下载</el-button>
    <el-table :data="tableProcedureData"
              fit
              style="width: 100%;">
      <el-table-column label="序号" width="50" type="index"></el-table-column>
      <el-table-column label="工程名称" prop="procedureName"></el-table-column>
      <el-table-column label="机种" prop="jizhong"></el-table-column>
      <el-table-column label="用线" prop="yongxian"></el-table-column>
      <el-table-column label="针幅/数" prop="zhenfuShu"></el-table-column>
      <el-table-column label="副材" prop="fucai"></el-table-column>
      <el-table-column label="注意事项" prop="notice"></el-table-column>
    </el-table>
    <!-- 新增模态框 -->
    <el-dialog title="编辑订单工序" :visible.sync="addDialogVisible"
               :close-on-click-modal="false"
               width="80%"
               @close="closeOuterDialog('addForm')">
      <el-form :model="addFormData" ref="addForm" :rules="rules" label-width="120px">
        <el-form-item prop="procedureKey" label="工序:" style="margin-bottom: 10px;">
          <el-select v-model="addFormData.procedureKey" multiple placeholder="请选择" @change="handleProcedureChange">
            <el-option
              v-for="item in procedureOptions"
              :key="item.id"
              :label="item.procedureName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <table style="width: 100%;" class="checkTable el-table" cellspacing="0" cellpadding="0" >
              <tr>
                <th>序号</th>
                <th>工程名称</th>
                <th>机种</th>
                <th>用线</th>
                <th>针幅/数</th>
                <th>副材</th>
                <th>注意事项</th>
                <th>拖拽排序</th>
              </tr>
              <tr v-for="(procedure,index) in addFormData.procedure" v-dragging="{ item: procedure, list: addFormData.procedure, group: 'procedure' }">
                <td>{{index}}</td>
                <td>{{procedure.procedureName}}</td>
                <td>{{procedure.jizhong}}</td>
                <td>{{procedure.yongxian}}</td>
                <td>{{procedure.zhenfuShu}}</td>
                <td>{{procedure.fucai}}</td>
                <td>{{procedure.notice}}</td>
                <td><i class="el-icon-rank"></i></td>
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
  import {CraftsStoreList, procedureList, storeAdjustmentProcedureSaveOrUpdate, returnDownloadOrderData} from '../../api/api';
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
          customerName: ''
        },
        tableData: [],
        tableProcedureData: [],//订单工序数据
        tableProcedureDataRowId: '',//当前行id
        procedureOptions: [],//工序数据项选项
        addFormData: {
          storeAdjustmentId: '',
          procedureKey: [],
          procedure: '',
          remark: '',
          operatorId: '',
        },
        rules: {
          procedureKey: [
            { required: true, message: '请选择工序', trigger: 'change' }
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
      this.getProcedureList();
    },
    methods: {
      getProcedureList() {
        //获取工序选项
        var self = this;
        // var params = {};
        procedureList().then(function (res) {
          if(res.returnCode === '200'){
            self.procedureOptions = res.rows;
          }
        }).catch(function(err){
          console.log("procedureOptions",err)
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
          'page': page,
          'rows': self.rows
        };
        CraftsStoreList(params).then(function (res) {
          if(res.returnCode === '200'){
            self.tableData = res.rows;
            self.tableTotal = res.total;
            //重置当前行的数据
            if(self.tableProcedureDataRowId !== ''){
              for(var i = 0,len = self.tableData.length; i < len;i++){
                if(self.tableProcedureDataRowId === self.tableData[i].id){
                  var temprow = {};
                  temprow = Object.assign({}, self.tableData[i].procedureList[0]);
                  var tempRowProcedure = JSON.parse(temprow.procedure);
                  self.tableProcedureData = tempRowProcedure;
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
        // this.tableProcedureDataRowId = ''; // 异步ajax 导致此处重置失败
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
        //获取详情信息
        if(row.procedureList[0] !== undefined){
          var temprow = {};
          temprow = Object.assign({}, row.procedureList[0]);
          var tempProcedure = temprow.procedure;
          tempProcedure = JSON.parse(tempProcedure);
          this.addFormData = temprow;
          this.addFormData.storeAdjustmentId = row.id;
          this.addFormData.procedure = tempProcedure;
          this.addFormData.procedureKey = [];
          for(var i in this.addFormData.procedure){
            this.addFormData.procedureKey.push(this.addFormData.procedure[i].id);
          }
        } else {
          this.addFormData.storeAdjustmentId = row.id;
          this.addFormData.procedureKey = [];
          this.addFormData.procedure = [];
          this.addFormData.remark = '';
          this.addFormData.operatorId = '';
        }
      },
      submitAddData(formName) {
        //提交添加会员信息
        var self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$confirm('确认新增订单工序?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var params = {
                id: self.addFormData.storeAdjustmentId,
                procedure: JSON.stringify(self.addFormData.procedure),
                remark: self.addFormData.remark,
                operatorId: self.userInfo.accountId,
              };
              // console.log(params);
              storeAdjustmentProcedureSaveOrUpdate(params).then(function (res) {
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
        //点击门店某行
        this.tableProcedureDataRowId = row.id;
        if(row.procedureList[0] !== undefined){
          var tempRowProcedure = JSON.parse(row.procedureList[0].procedure);
          this.tableProcedureData = tempRowProcedure;
        } else {
          this.tableProcedureData = [];
        }
      },
      handleProcedureChange(val){
        //dialog里面工序选项变化时触发
        var arr = [];
        var tempObj = {};
        for(var i = 0,cadLen = this.procedureOptions.length;i < cadLen;i++){
          for(var j = 0,valLen = val.length;j < valLen;j++){
            tempObj = {};
            if(this.procedureOptions[i].id === val[j]){
              tempObj.id = this.procedureOptions[i].id;
              tempObj.procedureName = this.procedureOptions[i].procedureName;
              tempObj.jizhong = this.procedureOptions[i].jizhong;
              tempObj.yongxian = this.procedureOptions[i].yongxian;
              tempObj.zhenfuShu = this.procedureOptions[i].zhenfuShu;
              tempObj.fucai = this.procedureOptions[i].fucai;
              tempObj.notice = this.procedureOptions[i].notice;
              arr.push(tempObj);
            }
          }
        }
        this.addFormData.procedure = arr;
      },
      handleDownload() {
        //下载
        var id = '';
        id = this.tableProcedureDataRowId;
        var params = {
          id: id,
          style: '4' //( style标识 1：cad 2：质检 3：bom 4：工序  5：工艺)
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
    text-align: center;
  }
  .checkTable{
    border: 1px solid #dfe6ec;
    margin-top:2%;
  }
</style>
