<template>
  <div style="padding: 20px;">
    <el-row>
      <h3 style="margin-left: 2%;margin-top: 0;">试衣包质检管理</h3>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="toolbar saerch-toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="formSearchData" ref="formSearch" class="form-search" label-width="90px">
          <el-form-item prop="styleId" label="款式码:">
            <el-select v-model="formSearchData.styleId" placeholder="请选择款式表" style="display: block;" @change="styleChange">
              <el-option v-for="item in styleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="colorId" label="颜色表:">
            <el-select v-model="formSearchData.colorId" placeholder="请选择颜色表" style="display: block;">
              <el-option v-for="item in colorOptions" :key="item.color.id" :label="item.color.name" :value="item.color.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="sizeId" label="尺码:">
            <el-select v-model="formSearchData.sizeId" placeholder="请选择尺码表" style="display: block;">
              <el-option v-for="item in sizeOptions" :key="item.id" :label="item.code" :value="item.id"></el-option>
            </el-select>
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
      <el-table-column label="试衣包编码" prop="code"></el-table-column>
      <el-table-column label="试衣包名称" prop="name"></el-table-column>
      <el-table-column label="款式表" prop="style.name"></el-table-column>
      <el-table-column label="颜色表" prop="color.name"></el-table-column>
      <el-table-column label="尺码" prop="size.code"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClickEdit(scope.row)">编辑</el-button>
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
    <el-row>
      <h4 style="margin-left: 2%;margin-top: 10px;">相关质检数据</h4>
    </el-row>

    <!-- 表格二 -->
    <el-table :data="tableQualityData"
              fit
              style="width: 100%;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="质检数据项" prop="qualityCheckingPositionName"></el-table-column>
      <el-table-column label="质检数据值" prop="qualityCheckingValue"></el-table-column>
    </el-table>
    <!-- 新增模态框 -->
    <el-dialog title="新增质检数据" :visible.sync="addDialogVisible"
               :close-on-click-modal="false"
               width="50%"
               @close="closeOuterDialog('addForm')">
      <el-form :model="addFormData" ref="addForm" :rules="rules" label-width="120px">
        <el-form-item prop="qualityKey" label="质检数据项:" style="margin-bottom: 10px;">
          <el-select v-model="addFormData.qualityKey" multiple @change="handleQualityChange" placeholder="请选择">
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
  import {fittingBagList,qualityCheckingPositionList,fittingBagCheckingSaveOrUpdate,styleList,styleColorListByStyleId,sizeList} from '../../api/api';
  import ElInput from "element-ui/packages/input/src/input";
  export default {
    // components: {
    //   ElTable,
    //   ElOption,
    //   ElInput,
    //   ElButton,
    //   ElFormItem},
    components: {ElInput},
    data() {
      return {
        formSearchData: {
          styleId: '',
          colorId: '',
          sizeId: ''
        },
        tableData: [],
        tableQualityData: [],
        tableQualityDataRowId: [],
        styleOptions: [],//款式表选项
        colorOptions: [],//颜色表选项
        sizeOptions: [],//尺码选项
        qualityOptions: [],//质检数据选项
        addFormData: {
          fittingBagId: '',
          qualityKey: '',
          qualityChecking: [],
          remark: '',
          createrId: '',
          modifierId: '',
          createTime: ''
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
      this.getStyleList();
      this.getSizeList();
      this.getQualityList();
    },
    methods: {
      getStyleList() {
        //获取款式表选项
        var self = this;
        var params = {};
        styleList(params).then(function (res) {
          if(res.returnCode === '200'){
            self.styleOptions = res.rows;
          }
        }).catch(function(err){
          console.log("styleOptions",err)
        });
      },
      styleChange(val) {
        //款式表改变选项后--获取对应颜色表选项
        var self = this;
        this.formSearchData.colorId = '';
        var params = {
          styleId: val
        };
        styleColorListByStyleId(params).then(function (res) {
          if(res.returnCode === '200'){
            self.colorOptions = res.returnData;
          }
        }).catch(function(err){
          console.log("colorOptions",err)
        });
      },
      getSizeList() {
        //获取尺码选项
        var self = this;
        var params = {};
        sizeList(params).then(function (res) {
          if(res.returnCode === '200'){
            self.sizeOptions = res.rows;
          }
        }).catch(function(err){
          console.log("sizeOptions",err)
        });
      },
      getQualityList() {
        var self = this;
        var params = {};
        qualityCheckingPositionList(params).then(function(res) {
          if(res.returnCode === '200'){
            self.qualityOptions = res.rows;
          }
        }).catch(function(err){
          console.log("sizeOptions",err)
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
          'styleId': self.formSearchData.styleId,
          'colorId': self.formSearchData.colorId,
          'sizeId': self.formSearchData.sizeId,
          'page': page,
          'rows': self.rows
        };
        fittingBagList(params).then(function (res) {
          if(res.returnCode === '200'){
            self.tableData = res.rows;
            self.tableTotal = res.total;
            if(self.tableQualityDataRowId !== ''){
              for(var i = 0,len = self.tableData.length; i < len;i++){
                if(self.tableQualityDataRowId === self.tableData[i].id){
                  var temprow = {};
                  temprow = Object.assign({}, self.tableData[i].bagQualityCheckingList[0]);
                  var tempRowQulity = JSON.parse(temprow.qualityChecking);
                  self.tableQualityData = tempRowQulity;
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
        if(row.bagQualityCheckingList[0] != undefined) {
          var temprow = {};
          temprow = Object.assign({},row.bagQualityCheckingList[0]);
          var tempQualityChecking = temprow.qualityChecking;
          tempQualityChecking = JSON.parse(tempQualityChecking);
          this.addFormData = temprow;
          this.addFormData.qualityChecking = tempQualityChecking;
          this.addFormData.qualityKey = [];
          for (var i in this.addFormData.qualityChecking) {
            this.addFormData.qualityKey.push(this.addFormData.qualityChecking[i].qualityCheckingPositionId)
          }
        } else {
          this.addFormData.id = '';
          this.addFormData.fittingBagId = row.id;
          this.addFormData.qualityKey = [];
          this.addFormData.qualityChecking = [];
          this.addFormData.remark = '';
          this.addFormData.createTime = '';
          this.addFormData.createrId = '';
          this.addFormData.modifierId = '';
        }
      },
      submitAddData(formName) {
        //提交添加会员信息
        var self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$confirm('确认新增试衣包质检?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(self.addFormData.modifierId === ''){
                //新增
                var params = {
                  fittingBagId: self.addFormData.fittingBagId,
                  qualityChecking: JSON.stringify(self.addFormData.qualityChecking),
                  remark: self.addFormData.remark,
                  createrId: self.userInfo.accountId,
                  modifierId: ''
                };
              }else {
                //修改
                var params = {
                  fittingBagId: self.addFormData.fittingBagId,
                  qualityChecking: JSON.stringify(self.addFormData.qualityChecking),
                  remark: self.addFormData.remark,
                  createrId: self.addFormData.createrId,
                  modifierId: self.userInfo.accountId
                };
              }
              fittingBagCheckingSaveOrUpdate(params).then(function (res) {
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
      clickRow (row) {
        if(row.bagQualityCheckingList[0] !=undefined) {
          var tempRowQuality = JSON.parse(row.bagQualityCheckingList[0].qualityChecking);
          this.tableQualityData = tempRowQuality;
        } else {
          this.tableQualityData = [];
        }
      },
      handleQualityChange(val){
        // 选择质检数据项改变时
        var arr=[];
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
      }
    }
  }
</script>

<style scoped>
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
    padding: 5px 0;
  }
  .checkTable th{
    background: #eef1f6;
  }
  .checkTable{
    border: 1px solid #dfe6ec;
    margin-top:2%;
  }
</style>
