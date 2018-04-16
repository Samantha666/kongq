<template>
  <div style="padding: 20px;">
    <el-row>
      <h3 style="margin-left: 2%;margin-top: 0;">工序管理</h3>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="toolbar saerch-toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="formSearchData" ref="formSearch" class="form-search" label-width="75px">
          <el-form-item label="工程名称:" prop="procedureName" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.procedureName" placeholder="请输入工程名称"></el-input>
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
      <el-table-column label="工程名称" prop="procedureName"></el-table-column>
      <el-table-column label="机种" prop="jizhong"></el-table-column>
      <el-table-column label="用线" prop="yongxian"></el-table-column>
      <el-table-column label="针幅/数" prop="zhenfuShu"></el-table-column>
      <el-table-column label="副材" prop="fucai"></el-table-column>
      <el-table-column label="注意事项" prop="notice"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <!--<el-table-column label="款式" prop="style.name"></el-table-column>-->
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
    <el-dialog title="新增工序" :visible.sync="addDialogVisible"
               :close-on-click-modal="false"
               width="50%"
               @close="closeOuterDialog('addForm')">
      <el-form :model="addFormData" ref="addForm" :rules="rules" label-width="25%">
        <el-form-item prop="procedureName" label="工程名称:">
          <el-input auto-complete="off" v-model="addFormData.procedureName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="jizhong" label="机种:">
          <el-input auto-complete="off" v-model="addFormData.jizhong" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="yongxian" label="用线:">
          <el-input auto-complete="off" v-model="addFormData.yongxian" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="zhenfuShu" label="针幅/数:">
          <el-input auto-complete="off" v-model="addFormData.zhenfuShu" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="fucai" label="副材:">
          <el-input auto-complete="off" v-model="addFormData.fucai" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="notice" label="注意事项:">
          <el-input auto-complete="off" v-model="addFormData.notice" type="textarea" :row="2" placeholder=""></el-input>
        </el-form-item>
        <!--<el-form-item prop="styleId" label="款式表:">-->
          <!--<el-select v-model="addFormData.styleId" placeholder="" style="display: block;">-->
            <!--<el-option v-for="item in styleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
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
  import {procedureList,procedureSaveOrUpdate,procedureDel,styleList} from '../../api/api';
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
          procedureName: ''
        },
        tableData: [],
        // styleOptions: [],//款式表选项
        addFormData: {
          id: '',
          procedureName: '',
          jizhong: '',
          yongxian: '',
          zhenfuShu: '',
          fucai: '',
          notice: '',
          // styleId: '',
          createTime: '',
          createrId: '',
          modifierId: ''
        },
        rules: {
          procedureName: [
            { required: true, message: '请输入工程名称', trigger: 'blur' }
          ],
          jizhong: [
            { required: true, message: '请输入机种', trigger: 'blur' }
          ],
          yongxian: [
            { required: true, message: '请输入用线', trigger: 'blur' }
          ],
          zhenfuShu: [
            { required: true, message: '请输入针幅/数', trigger: 'blur' }
          ],
          fucai: [
            { required: true, message: '请输入副材', trigger: 'blur' }
          ],
          notice: [
            { required: true, message: '请输入注意事项', trigger: 'blur' }
          ],
          // styleId: [
          //   { required: true, message: '请选择款式表', trigger: 'change' }
          // ]
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
      // this.getStyleList(1);
    },
    methods: {
      // getStyleList(page) {
      //   //获取款式表选项
      //   var self = this;
      //   var params = {
      //     'code': '',
      //     'name': '',
      //     'page': page,
      //     'rows': self.rows
      //   };
      //   styleList(params).then(function (res) {
      //     if(res.returnCode === '200'){
      //       self.styleOptions = res.rows;
      //     }
      //   }).catch(function(err){
      //     console.log("styleOptions",err)
      //   });
      // },
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
          'procedureName': self.formSearchData.procedureName,
          'page': page,
          'rows': self.rows
        };
        procedureList(params).then(function (res) {
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
        this.addFormData.procedureName = '';
        this.addFormData.jizhong = '';
        this.addFormData.yongxian = '';
        this.addFormData.zhenfuShu = '';
        this.addFormData.fucai = '';
        this.addFormData.notice = '';
        // this.addFormData.styleId = '';
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
              self.$confirm('确认新增工序?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                if(self.addFormData.id === ''){
                  //新增
                  var params = {
                    id: '',
                    procedureName: self.addFormData.procedureName,
                    jizhong: self.addFormData.jizhong,
                    yongxian: self.addFormData.yongxian,
                    zhenfuShu: self.addFormData.zhenfuShu,
                    fucai: self.addFormData.fucai,
                    notice: self.addFormData.notice,
                    // styleId: self.addFormData.styleId,
                    createrId: self.userInfo.accountId,
                    modifierId: ''
                  };
                }else {
                  //修改
                  var params = {
                    id: self.addFormData.id,
                    procedureName: self.addFormData.procedureName,
                    jizhong: self.addFormData.jizhong,
                    yongxian: self.addFormData.yongxian,
                    zhenfuShu: self.addFormData.zhenfuShu,
                    fucai: self.addFormData.fucai,
                    notice: self.addFormData.notice,
                    // styleId: self.addFormData.styleId,
                    createTime: self.addFormData.createTime,
                    createrId: self.addFormData.createrId,
                    modifierId: self.userInfo.accountId
                  };
                }
                procedureSaveOrUpdate(params).then(function (res) {
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
        this.$confirm('确认删除此条工序?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var params = {
            id: delId
          };
          procedureDel(params).then(function (res) {
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
