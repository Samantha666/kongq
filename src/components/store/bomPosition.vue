<template>
  <div style="padding: 20px;">
    <el-row>
      <h3 style="margin-left: 2%;margin-top: 0;">bom部位管理</h3>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="toolbar saerch-toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="formSearchData" ref="formSearch" class="form-search" label-width="75px">
          <el-form-item label="部位码:" prop="code" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.code" placeholder="请输入部位码" ></el-input>
          </el-form-item>
          <el-form-item label="部位名称:" prop="name" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.name" placeholder="请输入部位名称"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 10px;">
            <el-button type="primary" @click="resetForm('formSearch')"  size="small">重置</el-button>
            <el-button type="primary" @click="submitSearch" size="small">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 新增 -->
    <el-button type="primary" icon="el-icon-plus" @click="handleClickAdd" size="small" style="margin-bottom: 10px;">新增</el-button>
    <!-- 表格 -->
    <el-table :data="tableData"
              fit
              style="width: 100%;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="部位码" prop="code"></el-table-column>
      <el-table-column label="部位名称" prop="name"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClickEdit(scope.row)">修改</el-button>
          <!--<el-button type="text" size="small" @click="handleClickDel(scope.row)">删除</el-button>-->
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
    <!-- 新增模态框 -->
    <el-dialog title="新增bom部位" :visible.sync="addDialogVisible"
               :close-on-click-modal="false"
               width="50%"
               @close="closeOuterDialog('addForm')">
      <el-form :model="addFormData" ref="addForm" :rules="rules" label-width="25%">
        <el-form-item prop="code" label="部位码:">
          <el-input auto-complete="off" v-model="addFormData.code" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="name" label="部位名称:">
          <el-input auto-complete="off" v-model="addFormData.name" placeholder=""></el-input>
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
  import {bomPositionList,bomPositionSaveOrUpdate,bomPositionDel} from '../../api/api';
  export default {
    // components: {
    //   ElTable,
    //   ElOption,
    //   ElInput,
    //   ElButton,
    //   ElFormItem},
    data() {
      return {
        formSearchData: {
          code: '',
          name: ''
        },
        tableData: [],
        addFormData: {
          id: '',
          code: '',
          name: '',
          remark: '',
          createTime: '',
          createrId: '',
          modifierId: ''
        },
        rules: {
          code: [
            { required: true, message: '请输入部位码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入部位名称', trigger: 'blur' }
          ]
        },
        currentPage: 1,
        tableTotal: 0,
        rows: 20,
        addDialogVisible: false,
        userInfo: {}
      }
    },
    mounted(){
      this.getList(1);
      this.getUserInfo();
    },
    methods: {
      getUserInfo() {
        //获取管理员信息
        var userInfo;
        userInfo = sessionStorage.getItem('user');
        userInfo = JSON.parse(userInfo);
        this.userInfo = userInfo;
        // console.log(userInfo);
      },
      getList(page) {
        var self = this;
        var params = {
          'code': self.formSearchData.code,
          'name': self.formSearchData.name,
          'page': page,
          'rows': self.rows
        };
        bomPositionList(params).then(function (res) {
          if(res.returnCode === '200'){
            self.tableData = res.rows;
            self.tableTotal = res.total;
          }
        }).catch(function(err){
          console.log("table",err)
        });
      },
      handleSizeChange(val) {
        //列表页分页
        // console.log(`每页 ${val} 条`);
        this.rows = val;
        this.getList(this.currentPage);
      },
      handleCurrentChange(val) {
        //列表页分页
        // console.log(`当前页: ${val}`);
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
      handleClickAdd() {
        // 新增-修改弹窗
        this.addDialogVisible = true;
        //清空详情信息
        this.addFormData.id = '';
        this.addFormData.code = '';
        this.addFormData.name = '';
        this.addFormData.remark = '';
        this.addFormData.createTime = '';
        this.addFormData.createrId = '';
        this.addFormData.modifierId = '';
      },
      handleClickEdit(row) {
        // 修改弹窗
        this.addDialogVisible = true;
        //获取详情信息
        this.addFormData = Object.assign({}, row);
      },
      submitAddData(formName) {
        //提交添加会员信息
        var self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$confirm('确认新增bom部位?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(self.addFormData.id === ''){
                //新增
                var params = {
                  id: '',
                  code: self.addFormData.code,
                  name: self.addFormData.name,
                  remark: self.addFormData.remark,
                  createrId: self.userInfo.accountId,
                  modifierId: ''
                };
              }else {
                //修改
                var params = {
                  id: self.addFormData.id,
                  code: self.addFormData.code,
                  name: self.addFormData.name,
                  remark: self.addFormData.remark,
                  createTime: self.addFormData.createTime,
                  createrId: self.userInfo.accountId,
                  modifierId: self.userInfo.accountId
                };
              }
              // console.log(params);
              bomPositionSaveOrUpdate(params).then(function (res) {
                if(res.returnCode === '200'){
                  self.$message({message: '操作成功',type: 'success'});
                  self.addDialogVisible = false;
                  self.getList(self.currentPage);
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
      handleClickDel(row) {
        var self = this;
        var delId;
        delId = row.id;
        this.$confirm('确认删除此条bom部位?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            id: delId
          };
          bomPositionDel(params).then(function (res) {
            if(res.returnCode === '200'){
              self.$message({message: '删除成功',type: 'success'});
              self.addDialogVisible = false;
              self.getList(self.currentPage);
            } else {
              self.$message({message: '删除失败',type: 'error'});
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
      },
      closeOuterDialog(formName1) {
        //外层弹窗关闭后回调-清空数据
        this.$refs[formName1].resetFields();
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
</style>
