<template>
  <div style="padding: 20px;">
    <el-row>
      <h3 style="margin-left: 2%;margin-top: 0;">款式管理</h3>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="toolbar saerch-toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="formSearchData" ref="formSearch" class="form-search" label-width="75px">
          <el-form-item label="款式编码:" prop="code" style="margin-bottom: 10px;">
            <el-input v-model="formSearchData.code" placeholder="请输入部位码" ></el-input>
          </el-form-item>
          <el-form-item label="款式名称:" prop="name" style="margin-bottom: 10px;">
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
              style="width: 100%;"
             >
      <el-table-column type="index" width="50" ></el-table-column>
      <el-table-column label="款式码" prop="code"></el-table-column>
      <el-table-column label="款式名称" prop="name"></el-table-column>
      <el-table-column label="品类" prop="category.name"></el-table-column>
      <el-table-column label="颜色" >
        <template slot-scope="scope">
          <span  v-for="item in scope.row.colorList" :key="item.color.id" width="50" height="25" style="margin-right: 10px;">
            {{item.color.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="工艺" >
        <template slot-scope="scope">
          <!---->
          <!--//{{scope.row.technologyList}}-->
          <span  v-for="item in scope.row.technologyList" >
            <img :src="src" v-for="src in JSON.parse(item.technology.imageKeys)"  width="50" height="50" style="margin-right: 10px;">
          </span>
        </template>
      </el-table-column>
      <el-table-column label="工序" >
        <template slot-scope="scope">
          <span  v-for="item in scope.row.procedureList"  width="50" height="25" style="margin-right: 10px;">
            {{item.procedure.procedureName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="计量单位" prop="unit"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClickEdit(scope.row)">修改</el-button>

         <!-- <el-button type="text" size="small" @click="handleClickDel(scope.row)">删除</el-button>-->

         <!-- <el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>-->

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
          layout="total, sizes, prev, pager, next"
          :total="tableTotal"
          style="float: right;">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 新增模态框 -->
    <el-dialog :title="title" :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="50%"
               @close="closeOuterDialog('addForm')">
      <el-form :model="addFormData" ref="addForm" :rules="rules" label-width="10%">
        <el-form-item prop="code" label="款式编码:">
          <el-input auto-complete="off" v-model="addFormData.code" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="name" label="款式名称:">
          <el-input auto-complete="off" v-model="addFormData.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item prop="unit" label="计量单位:">
          <el-input auto-complete="off" v-model="addFormData.unit" placeholder=""></el-input>
        </el-form-item>
        <el-form-item  label="品类:" prop="checkCategory">
          <el-cascader
            :options="category"
            v-model="addFormData.checkCategory"
            @change="handleCategoryChange"
            :props="props"
            filterable
            change-on-select>
          </el-cascader>
        </el-form-item>
        <el-form-item prop="colorIds" label="颜色:">
          <el-select v-model="addFormData.colorIds" multiple placeholder="请选择" @change="handleColorChange">
            <el-option
              v-for="item in color"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="technologyIds" label="工艺:" style="margin-bottom: 10px;">
          <el-select v-model="addFormData.technologyIds" multiple placeholder="请选择" @change="handleTechnologyChange">
            <el-option
              v-for="item in technology"
              :key="item.id"
              :label="item.code"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <table style="width: 100%;" class="checkTable" cellspacing="0" cellpadding="0" >
            <tr>
              <th>序号</th>
              <th>工艺编号</th>
              <th>工艺名称</th>
              <th>创建时间</th>
              <th>拖拽排序</th>
            </tr>
            <tr v-for="(technology,index) in checkTechnology" v-dragging="{ item: technology, list: checkTechnology, group: 'technology' }"  :key="technology.text">
              <td>{{index}}</td>
              <td>{{technology.code}}</td>
              <td>{{technology.manufacturingProcess}}</td>
              <td>{{technology.createTime}}</td>
              <td><i class="el-icon-rank"></i></td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item prop="procedureIds" label="工序:" style="margin-bottom: 10px;">
          <el-select v-model="addFormData.procedureIds" multiple placeholder="请选择" @change="handleProcedureChange">
            <el-option
              v-for="item in procedure"
              :key="item.id"
              :label="item.procedureName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <table style="width: 100%;" class="checkTable" cellspacing="0" cellpadding="0" >
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
          <tr v-for="(procedure,index) in checkProcedure" v-dragging="{ item: procedure, list: checkProcedure, group: 'procedure' }"  >
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
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
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
  import {styleList,categoryList,colorList,technologyList,procedureList,styleSaveOrUpdate} from '../../api/api';

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
          createrId: '',
          modifierId: '',
          categoryId:'',
          colorIds:[],
          technologyIds:[],
          procedureIds:[],
          checkCategory:[],
        },
        category:[],
        props: {
          value:'id',
          children:'childCategoryList',
          label:'name'
        },

        color:[],
        technology:[],
        checkTechnology:[],
        procedure:[],
        checkProcedure:[],
        // editFormData: {
        //
        // },
        rules: {
          code: [
            { required: true, message: '请输入款式码', trigger: 'blur' }
          ],
          checkCategory: [
            { required: true, message: '请输入款式名称', trigger: 'blur' }
          ],
          unit: [
            { required: true, message: '请输入单位', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请选择品类', trigger: 'blur' }
          ],
          colorIds: [
            { required: true, message: '请选择颜色', trigger: 'blur' }
          ],
          technologyIds: [
            { required: true, message: '请选择工艺', trigger: 'blur' }
          ],
          procedureIds: [
            { required: true, message: '请选择工序', trigger: 'blur' }
          ],
        },
        currentPage: 1,
        tableTotal: 0,
        rows: 20,
        dialogVisible: false,
        // editDialogVisible: false
        userInfo: {},
        title:''
      }
    },
    mounted(){
      this.getList(1);
      this.getUserInfo();
      this.getCategory();
      this.getColor();
      this.getTechnology();
      this.getProcedure();
    },
    methods: {
      getUserInfo() {
        //获取管理员信息
        var userInfo;
        userInfo = sessionStorage.getItem('user');
        userInfo = JSON.parse(userInfo);
        this.userInfo = userInfo;
        //console.log(userInfo);
      },
      getCategory(){
        let self = this;
        categoryList().then(function (res) {
          //console.log(res)
          if(res.returnCode == '200'){
            self.category = res.returnData;
            //console.log(self.category)
          }
        }).catch(function(err){
          console.log("table",err)
        });
      },
      getColor(){

        let self = this;
        colorList().then(function (res) {
          //console.log(res)
          if(res.returnCode == '200'){
            self.color = res.rows;
//            /console.log(self.category)
          }
        }).catch(function(err){
          console.log("table",err)
        });
      },
      getTechnology(){
        let self = this;
        technologyList().then(function (res) {
          //console.log(res)
          if(res.returnCode == '200'){
            self.technology = res.rows;
//            /console.log(self.category)
          }
        }).catch(function(err){
          console.log("table",err)
        });
      },
      getProcedure(){

        let self = this;
        procedureList().then(function (res) {
          //console.log(res)
          if(res.returnCode == '200'){
            self.procedure = res.rows;
//            /console.log(self.category)
          }
        }).catch(function(err){
          console.log("table",err)
        });
      },
      handleCategoryChange(val){
        //console.log(val)
        //console.log(val[val.length-1])
        this.addFormData.categoryId = val[val.length-1];
      },
      handleColorChange(val){
          //console.log(val)
          this.addFormData.colorIds = val
        //console.log(this.addFormData.colorId)
      },
      handleTechnologyChange(val){
          //console.log(val)
        var arr=[]
        for(var i=0;i<this.technology.length;i++){
            for(var j=0;j<val.length;j++){
              if(this.technology[i].id == val[j]){
               // console.log(this.technology[i])
                arr.push(this.technology[i])
                //console.log(arr)
              }
            }
        }
        this.checkTechnology = arr
      },
      handleProcedureChange(val){
        //console.log(val)
        var arr=[]
        for(var i=0;i<this.procedure.length;i++){
          for(var j=0;j<val.length;j++){
            if(this.procedure[i].id == val[j]){
              //console.log(this.procedure[i])
              arr.push(this.procedure[i])
              //console.log(arr)
            }
          }
        }
        this.checkProcedure = arr
      },
      getList(page) {
        var self = this;
        var params = {
          'code': self.formSearchData.code,
          'name': self.formSearchData.name,
          'page': page,
          'rows': self.rows
        };
        styleList(params).then(function (res) {
          //console.log(res)
          if(res.returnCode == '200'){
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
        this.dialogVisible = true;
        this.title = '新增'
      },
      handleClickEdit(row) {
        // 修改弹窗

        //获取详情信息

        //this.addFormData = Object.assign({}, row);
        this.addFormData.name = row.name;
        this.addFormData.code = row.code;
        this.addFormData.id = row.id;
        this.addFormData.createrId = row.createrId;
        this.addFormData.unit = row.unit;
        this.addFormData.remark = row.remark;
        this.addFormData.colorIds = [];
        this.addFormData.procedureIds = [];
        this.addFormData.technologyIds = [];
        for(var i=0;i<row.colorList.length;i++){
            this.addFormData.colorIds.push(row.colorList[i].colorId)
        }
        for(var i=0;i<row.procedureList.length;i++){
          this.addFormData.procedureIds.push(row.procedureList[i].procedureId)
          this.checkProcedure.push(row.procedureList[i].procedure)
        }
        for(var i=0;i<row.technologyList.length;i++){
          this.addFormData.technologyIds.push(row.technologyList[i].technologyId)
          this.checkTechnology.push(row.technologyList[i].technology)
        }
        if(row.category.pathIds == undefined){
          this.addFormData.checkCategory.push(row.categoryId)
        }else{
          this.addFormData.checkCategory = row.category.pathIds.split(",")
          this.addFormData.checkCategory.push(row.categoryId)
        }
        this.title = '修改';
        this.dialogVisible = true;

        //console.log(this.addFormData.checkCategory)
        /*for(var i=0; i<this.category.length;i++){
          if(this.FormData.categoryId == this.options[i].id){
            this.FormData.category = this.FormData.categoryId.split(",")
            //console.log(self.FormData.category)
          }
          for(var m=0; m<this.options[i].childCategoryList.length;m++){
            if(this.FormData.categoryId == this.options[i].childCategoryList[m].id){
              this.FormData.category = (this.options[i].childCategoryList[m].pathIds + ',' + this.FormData.categoryId).split(",")
              //console.log(self.FormData.category)
            }
            for(var n=0; n<this.options[i].childCategoryList[m].childCategoryList.length;n++){
              if(this.FormData.categoryId == this.options[i].childCategoryList[m].childCategoryList[n].id){
                this.FormData.category = (this.options[i].childCategoryList[m].childCategoryList[n].pathIds + ',' + this.FormData.categoryId).split(",")
                //console.log(self.formSizeEdit.category)
              }
            }
          }
        }*/
       /* this.addFormData = Object.assign({}, row);

        console.log(row)*/
      },
      submitAddData(formName) {
        //提交添加会员信息
        //console.log(this.checkTechnology)
        //console.log(this.checkProcedure)
        var self = this;
        if(self.addFormData.id == ""){
          var txt = '新增'
        }else{
          var txt = '修改'
        }
        self.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认'+txt+'款式数据?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //alert(2222)
                var te = [];
                for(var i=0;i<self.checkTechnology.length;i++){
                    te.push(self.checkTechnology[i].id)
                }
                var pr = [];
                for(var i=0;i<self.checkProcedure.length;i++){
                  pr.push(self.checkProcedure[i].id)
                }
                if(self.addFormData.id == ""){
                  var params = {
                    code: self.addFormData.code,
                    name: self.addFormData.name,
                    remark: self.addFormData.remark,
                    createrId: self.userInfo.accountId,
                    unit:self.addFormData.unit,
                    categoryId:self.addFormData.categoryId,
                    colorIds:self.addFormData.colorIds,
                    technologyIds:te,
                    procedureIds:pr,
                  };
                }else{
                  var params = {
                    id:self.addFormData.id,
                    code: self.addFormData.code,
                    name: self.addFormData.name,
                    remark: self.addFormData.remark,
                    createrId: self.addFormData.createrId,
                    unit:self.addFormData.unit,
                    categoryId:self.addFormData.categoryId,
                    colorIds:self.addFormData.colorIds,
                    technologyIds:te,
                    procedureIds:pr,
                    modifierId:self.userInfo.accountId,
                  };
                }

                //console.log(params);
                styleSaveOrUpdate(params).then(function (res) {
                  //alert(1111)
                  //console.log(res)
//                  /console.log()
                    if(res.returnCode == '200'){
                      self.$message({message: '操作成功',type: 'success'});
                      self.dialogVisible = false;
                      self.checkTechnology = [];
                      self.checkProcedure = [];
                      self.getList(1);
                    } else{
                      //会员卡号重复，请重新输入！

                        self.errMsg = res.returnMsg;

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
        this.checkTechnology = [];
        this.checkProcedure = [];

      },
      handleClickDel(row){

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
