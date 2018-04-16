<template>
  <div style="padding: 20px;">
    <el-row>
      <h3 style="margin-left: 2%;margin-top: 0;">试衣包管理</h3>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="toolbar saerch-toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="formSearchData" ref="formSearch" class="form-search" label-width="90px">
          <el-form-item label="试衣包编码:" prop="code" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.code" placeholder="请输入试衣包编码"></el-input>
          </el-form-item>
          <el-form-item label="试衣包名称:" prop="name" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.name" placeholder="请输入试衣包名称"></el-input>
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
    <el-dialog title="新增试衣包" :visible.sync="addDialogVisible"
               :close-on-click-modal="false"
               width="50%"
               @close="closeOuterDialog('addForm')">
      <el-form :model="addFormData" ref="addForm" :rules="rules" label-width="25%">
        <el-form-item prop="code" label="试衣包编码:">
          <el-input auto-complete="off" v-model="addFormData.code" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="name" label="试衣包名称:">
          <el-input auto-complete="off" v-model="addFormData.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="styleId" label="款式表:">
          <el-select v-model="addFormData.styleId" placeholder="" style="display: block;" @change="styleChange">
            <el-option v-for="item in styleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="colorId" label="颜色表:">
          <el-select v-model="addFormData.colorId" placeholder="" style="display: block;">
            <el-option v-for="item in colorOptions" :key="item.color.id" :label="item.color.name" :value="item.color.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sizeId" label="尺码:">
          <el-select v-model="addFormData.sizeId" placeholder="" style="display: block;">
            <el-option v-for="item in sizeOptions" :key="item.id" :label="item.code" :value="item.id"></el-option>
          </el-select>
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
  import {fittingBagList,fittingBagSaveOrUpdate,fittingBagDel,styleList,styleColorListByStyleId,sizeList} from '../../api/api';
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
        styleOptions: [],//款式表选项
        colorOptions: [],//颜色表选项
        sizeOptions: [],//尺码选项
        addFormData: {
          id: '',
          code: '',
          name: '',
          styleId: '',
          colorId: '',
          sizeId: '',
          remark: '',
          createTime: '',
          createrId: '',
          modifierId: ''
        },
        rules: {
          code: [
            { required: true, message: '请输入试衣包编码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入试衣包名称', trigger: 'blur' }
          ],
          styleId: [
            { required: true, message: '请选择款式表', trigger: 'change' }
          ],
          colorId: [
            { required: true, message: '请选择颜色表', trigger: 'change' }
          ],
          sizeId: [
            { required: true, message: '请选择尺码', trigger: 'change' }
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
      this.getStyleList();
      this.getSizeList();
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
        this.addFormData.colorId = '';
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
          'code': self.formSearchData.code,
          'name': self.formSearchData.name,
          'page': page,
          'rows': self.rows
        };
        fittingBagList(params).then(function (res) {
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
      handleClickAdd() {
        // 新增-修改弹窗
        this.addDialogVisible = true;
        //清空详情信息
        this.addFormData.id = '';
        this.addFormData.code = '';
        this.addFormData.name = '';
        this.addFormData.styleId = '';
        this.addFormData.colorId = '';
        this.addFormData.sizeId = '';
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
              self.$confirm('确认新增试衣包?', '提示', {
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
                    styleId: self.addFormData.styleId,
                    colorId: self.addFormData.colorId,
                    sizeId: self.addFormData.sizeId,
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
                    styleId: self.addFormData.styleId,
                    colorId: self.addFormData.colorId,
                    sizeId: self.addFormData.sizeId,
                    remark: self.addFormData.remark,
                    createTime: self.addFormData.createTime,
                    createrId: self.addFormData.createrId,
                    modifierId: self.userInfo.accountId
                  };
                }
                fittingBagSaveOrUpdate(params).then(function (res) {
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
        this.$confirm('确认删除此条试衣包?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            id: delId
          };
          fittingBagDel(params).then(function (res) {
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
