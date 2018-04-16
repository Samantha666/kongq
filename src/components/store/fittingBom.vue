<template>
  <div style="padding: 20px;">
    <el-row>
      <h3 style="margin-left: 2%;margin-top: 0;">试衣包bom管理</h3>
    </el-row>
    <!-- 搜索框 -->
    <el-row class="toolbar saerch-toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="formSearchData" ref="formSearch" class="form-search" label-width="60px">
          <el-form-item prop="styleId" label="款式:">
            <el-select v-model="formSearchData.styleId" placeholder="请选择款式表" @change="styleChange" filterable>
              <el-option v-for="item in styleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="colorId" label="颜色:">
            <el-select v-model="formSearchData.colorId" placeholder="请选择颜色表" filterable>
              <el-option v-for="item in colorOptions" :key="item.color.id" :label="item.color.name" :value="item.color.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="sizeId" label="尺码:">
            <el-select v-model="formSearchData.sizeId" placeholder="请选择款式表" filterable>
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
        width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClickAdd(scope.row)">新增bom项</el-button>
         <!-- <el-button type="text" size="small" @click="handleClickEdit(scope.row)">修改bom</el-button>-->
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
          :page-size="rows"
          layout="total, prev, pager, next"
          :total="tableTotal"
          style="float: right;">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格2-cad数据项表格 -->
    <el-row>
      <h4 style="margin-left: 2%;margin-top: 10px;">相关bom数据</h4>
    </el-row>
    <!--<el-table :data="tableMaterialData"
              fit
              style="width: 100%;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="使用部位" prop="bomPositionName"></el-table-column>
      <el-table-column label="物料名称" >
        <template slot-scope="scope">
          <p  v-for="item in scope.row.bomList">
            {{item.name}}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="物料名称" >
        <template slot-scope="scope">
          <el-button style="display: block" type="text" v-for="item in scope.row.bomList" size="small" @click="handleClickAdd(scope.row)">新增bom项</el-button>
        </template>
      </el-table-column>
     &lt;!&ndash; <el-table-column label="数值调动范围" prop="cadRange"></el-table-column>&ndash;&gt;
    </el-table>-->
    <el-row style="height: 44px;line-height: 44px;border: 1px solid #ebeef5;border-bottom: 0;background-color: #eef1f6;font-size: 14px;color: #909399;font-weight: 600;">
      <!--<el-col :span="1" style="text-align: center!important;">#</el-col>-->
      <el-col :span="3" style="text-align: center!important;">使用部位</el-col>
      <el-col :span="2" style="text-align: center!important;">大类</el-col>
      <el-col :span="2" style="text-align: center!important;">小类</el-col>
      <el-col :span="2" style="text-align: center!important;">物料编码</el-col>
      <el-col :span="3" style="text-align: center!important;">物料名称</el-col>
      <el-col :span="2" style="text-align: center!important;">规格</el-col>
      <el-col :span="2" style="text-align: center!important;">数量</el-col>
      <el-col :span="2" style="text-align: center!important;">属性</el-col>
      <el-col :span="2" style="text-align: center!important;">单位</el-col>
      <el-col :span="2" style="text-align: center!important;">状态</el-col>
      <el-col :span="2" style="text-align: center!important;">操作</el-col>
    </el-row>
    <table class="matable" style="max-height: 500px;width: 100%;border: 1px solid #e6e6e6;border-top: 0;border-bottom:0;text-align: center;" cellspacing="0" cellpadding="0" v-for="(item,itemindex) in tableMaterialData" >
      <tr  v-for="(ma,index) in item.bomList">
        <!--<td width="4%" :rowspan="item.bomList.length" v-if="index==0" style="border-bottom: 1px solid #e6e6e6;border-right: 1px solid #e6e6e6;">
          {{itemindex}}
        </td>-->
        <td width="12%" class="clearfix" style="border-right: 1px solid #e6e6e6;border-bottom: 1px solid #e6e6e6;" :rowspan="item.bomList.length" v-if="index==0">
          {{item.bomPositionName}}
        </td>
        <td width="7%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.bigClass}}</td>
        <td width="7%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.smallClass}}</td>
        <td width="8%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.code}}</td>
        <td width="12%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.name}}</td>
        <td width="7%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.specifications}}</td>
        <td width="8%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.number}}</td>
        <td width="7%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.attr}}</td>
        <td width="8%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.unit}}</td>
        <td width="8%" style="border-bottom: 1px solid #e6e6e6;"> {{ma.statusName}}</td>
        <td width="7%" style="border-bottom: 1px solid #e6e6e6;color: #409EFF;font-size: 12px;" >
          <span @click="handleDel(item,ma.id)">删除</span>
        </td>
        <!-- <td width="8%">{{good.calPrice}}</td>-->
       <!-- <td width="13%" style="border-right: 1px solid #e6e6e6;"> {{item.name}}</td>
        <td  width="13%"  style="height: 100%;border-right:1px solid #e6e6e6;" >{{item.unitCost}}</td>
        <td width="13%"  style="height: 100%;border-right:1px solid #e6e6e6;">{{item.billStatusName}}</td>
        <td width="20%"  style="height: 100%;">-->
         <!-- <span @click="detail(good.orderId)" style="display: block;margin-bottom: 3%;font-size: 14px;color: #ECAF93;cursor: pointer">查看详情</span>-->
         <!--</td>-->
      </tr>
    </table>
   <!-- <el-col :span="24" class="toolbar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="this.sizeRow"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[5, 10, 15, 20]"
        :total="this.total"
        style="float: right;">
      </el-pagination>
    </el-col>-->
    <!-- 新增模态框 -->
    <el-dialog title="编辑试衣包bom" :visible.sync="addDialogVisible"
               :close-on-click-modal="false"
               width="80%"
               @close="closeOuterDialog('addForm')">
      <el-form :model="addFormData" ref="addForm" :rules="rules" label-width="120px">
        <el-form-item prop="bomPositionId" label="使用部位:" >
          <el-select v-model="addFormData.bomPositionId" filterable placeholder="请选择" @change="handleBomChange">
            <el-option
              v-for="item in bomOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="material" label="物料选择:" >
          <el-select v-model="addFormData.material"  multiple placeholder="请选择" @change="handleMaterialChange">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-table :data="materialData"
                    fit
                    style="width: 100%;">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column label="大类" prop="bigClass"></el-table-column>
            <el-table-column label="小类" prop="smallClass"></el-table-column>
            <el-table-column label="物料编码" prop="code"></el-table-column>
            <el-table-column label="物料名称" prop="name"></el-table-column>
            <el-table-column label="规格" prop="specifications"></el-table-column>
            <el-table-column label="属性" prop="attr"></el-table-column>
            <el-table-column label="数量" prop="number"></el-table-column>
            <el-table-column label="单位" prop="unit"></el-table-column>
            <el-table-column label="状态" prop="statusName"></el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
          </el-table>
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
  import {fittingBagList,styleList,styleColorListByStyleId,sizeList,cadPositionList,fittingBagCadSaveOrUpdate,bomPositionFind,materialList,fittingBagBomaveOrUpdate} from '../../api/api';
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
        num:1,
        tableData: [],
        tableMaterialData: [],//试衣包bom数据
        styleOptions: [],//款式表选项
        colorOptions: [],//颜色表选项
        sizeOptions: [],//尺码选项
        bomOptions: [],//cad数据项选项
        materialOptions:[],
        addFormData: {
          fittingBagId: '',
          bomPositionId: '',
          bomPositionName:'',
          bom: [],
          material:[],
          remark: '',
          // createTime: '',
          createrId: '',
          modifierId: ''
        },
        materialData:[],
        rules: {
          bomPositionId: [
            { required: true, message: '请选择使用部位', trigger: 'blur' }
          ],
          material: [
            { required: true, message: '请选择物料', trigger: 'blur' }
          ]
        },
        currentPage: 1,
        tableTotal: 0,
        rows: 5,
        addDialogVisible: false,
        userInfo: {},
        rowData:{},
        delData:[],
        checkRow:[],
        bomData:[],
      }
    },
    mounted(){
      this.getList(1);
      this.getUserInfo();
      this.getStyleList();
      this.getSizeList();
      this.getBomList();
      this.getMaterialList();
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
      getBomList() {
        //获取cad选项
        var self = this;
        var params = {};
        bomPositionFind(params).then(function (res) {

          if(res.returnCode === '200'){
            self.bomOptions = res.returnData;
          }
        }).catch(function(err){
          console.log("sizeOptions",err)
        });
      },
      getMaterialList(){
        var self = this;
        var params = {};
        materialList(params).then(function (res) {
          if(res.returnCode === '200'){
            self.materialOptions = res.rows;
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
      handleClickAdd(row) {
        console.log(row)
        // 新增-修改弹窗
        this.addDialogVisible = true;
        this.rowData = row.bagBomList;
        if(this.rowData.length == 0){
          this.addFormData.remark ='';
          this.addFormData.fittingBagId = row.id;
          this.addFormData.createrId = this.userInfo.accountId
          this.addFormData.modifierId = '';
        }else{
          this.addFormData.remark = row.bagBomList[0].remark;
          this.addFormData.fittingBagId = row.bagBomList[0].fittingBagId;
          this.addFormData.createrId = row.bagBomList[0].createrId;
          this.addFormData.modifierId = this.userInfo.accountId
        }

        //清空详情信息
      /*  this.addFormData.id = '';
        this.addFormData.bomPositionId = '';
        this.addFormData.bomPositionName = '';
        this.addFormData.bom = '';
        this.addFormData.colorId = '';
        this.addFormData.sizeId = '';
        this.addFormData.remark = '';
        this.addFormData.createTime = '';
        this.addFormData.createrId = '';
        this.addFormData.modifierId = '';*/
      },
      submitAddData(formName) {
        //console.log(this.materialData);
        //console.log(this.rowData);
        //提交添加会员信息
        var self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$confirm('确认新增试衣包Bom?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //console.log(self.rowData.length)
                if(self.rowData.length == 0){
                  //
                  //console.log(self.bomOptions)
                  for(var j=0;j<self.bomOptions.length;j++) {
                    if (self.bomOptions[j].id == self.addFormData.bomPositionId) {
                      self.addFormData.bomPositionName = self.bomOptions[j].name
                    }
                  }
                  var mostNewbom = [{
                    bomList: self.materialData,
                    bomPositionId:self.addFormData.bomPositionId,
                    bomPositionName: self.addFormData.bomPositionName,
                  }]
                  var params = {
                    fittingBagId: self.addFormData.fittingBagId,
                    bom: JSON.stringify(mostNewbom),
                    remark: self.addFormData.remark,
                    createrId: self.addFormData.createrId,
                    modifierId: self.addFormData.modifierId,
                  };
                  this.bomData = mostNewbom

                }else{

                  let oldBom = JSON.parse(self.rowData[0].bom);
                  //console.log(oldBom)
                  for(var j=0;j<self.bomOptions.length;j++) {
                    if (self.bomOptions[j].id == self.addFormData.bomPositionId) {
                      self.addFormData.bomPositionName = self.bomOptions[j].name
                    }
                  }
                  /*var newBom = {
                    bomList: self.materialData,
                    bomPositionId: self.addFormData.bomPositionId,
                    bomPositionName: self.addFormData.bomPositionName,
                  };*/
                  var status = true
                  for(var a=0;a<oldBom.length;a++){
                    if(self.addFormData.bomPositionId == oldBom[a].bomPositionId){
                         oldBom[a] = {
                           bomList: self.materialData,
                           bomPositionId: self.addFormData.bomPositionId,
                           bomPositionName: self.addFormData.bomPositionName,
                         };
                        status = false
                         console.log(oldBom[a])
                    }
                  }
                  if(status == true){
                    var newBom = {
                      bomList: self.materialData,
                      bomPositionId: self.addFormData.bomPositionId,
                      bomPositionName: self.addFormData.bomPositionName,
                    };
                    oldBom.push(newBom)
                  }
                  /*for(var a=0;a<oldBom.length;a++){
                    if(self.addFormData.bomPositionId != oldBom[a].bomPositionId){
                      var newBom = {
                        bomList: self.materialData,
                        bomPositionId: self.addFormData.bomPositionId,
                        bomPositionName: self.addFormData.bomPositionName,
                      };
                      oldBom.push(newBom)
                    }
                  }*/

                  //oldBom.push(newBom)
                 // console.log(oldBom)
                  this.bomData = oldBom
                  var params = {
                    fittingBagId: self.addFormData.fittingBagId,
                    bom: JSON.stringify(oldBom),
                    remark: self.addFormData.remark,
                    createrId: self.addFormData.createrId,
                    modifierId: self.addFormData.modifierId,
                  };
                }

              /*console.log(oldBom);
              console.log(addBom)*/

                fittingBagBomaveOrUpdate(params).then(function (res) {
                  //console.log(res)
                  if(res.returnCode === '200'){
                    self.$message({message: '操作成功',type: 'success'});
                    //self.tableMaterialData = JSON.parse(params.bom);
                    self.getList(self.currentPage);
                    //console.log()
                    self.tableMaterialData = self.bomData;
                    self.addDialogVisible = false;

                  } else {
                    self.$message({message: res.returnMsg,type: 'error'});
                  }
                }).catch(function(err){
                  console.log("form",err)
                });
            }).catch(() => {
              //alert(33333)
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
        this.materialData = []
      },
      clickRow(row) {
        //点击试衣包某行
        console.log(row);
        this.checkRow = row;
        if(row.bagBomList.length == 0){
          this.$message.warning('当前试衣包没有bom清单，请添加')
          this.tableMaterialData = []
        }else{
          if(row.bagBomList[0].bom == '[]'){
            this.$message.warning('当前试衣包没有bom清单，请添加')
            this.tableMaterialData = []
          }else{
            this.tableMaterialData = JSON.parse(row.bagBomList[0].bom);
          }
        }

        for(var i=0;i<this.tableMaterialData.length;i++){
          for(var j=0;j<this.tableMaterialData[i].bomList.length;j++){
             if(this.tableMaterialData[i].bomList[j].status == '1'){
               this.tableMaterialData[i].bomList[j].statusName = '生效'
             }else if(this.tableMaterialData[i].bomList[j].status == '2'){
               this.tableMaterialData[i].bomList[j].statusName = '失效'
             }else{
               this.tableMaterialData[i].bomList[j].statusName = '状态错误'
             }
          }
        }
        //console.log(this.tableMaterialData)
      },
      handleMaterialChange(val){
        // 选择cad数据项改变时
        //console.log(val);
        var arr=[]
        for(var i=0;i<this.materialOptions.length;i++){
          for(var j=0;j<val.length;j++){
            if(this.materialOptions[i].id == val[j]){
              // console.log(this.technology[i])
              if(this.materialOptions[i].status == '1'){
                this.materialOptions[i].statusName = '生效'
              }else if(this.materialOptions[i].status == '2'){
                this.materialOptions[i].statusName = '失效'
              }else{
                this.materialOptions[i].statusName = '状态错误'
              }
              arr.push(this.materialOptions[i])
              //console.log(arr)
            }
          }
        }
        this.materialData = arr;
      },
      handleBomChange(val){
        //console.log(this.rowData)
        if(this.rowData.length == 0){
          this.addFormData.material = [];
          this.materialData = []
        }else{
          this.addFormData.material = [];
          this.materialData = []
          var bomcheck = JSON.parse(this.rowData[0].bom);
          //console.log(bomcheck)
        // console.log(val)
          for(var i=0;i<bomcheck.length;i++){
            //console.log(bomcheck[i].bomPositionId)
            if(bomcheck[i].bomPositionId == val){

              this.materialData = bomcheck[i].bomList;
              //console.log(this.materialData)
              for(var j=0;j<bomcheck[i].bomList.length;j++){
                this.addFormData.material.push(bomcheck[i].bomList[j].id)
              }
            }
          }
        }
        //console.log(this.materialData)
        //console.log(this.addFormData.material)
        /*if(val == this.rowData.bomList[0].){

        }*/
      },
      handleDel(row,delId){
        this.$confirm('确认删除此条Bom数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           //var delData = this.tableMaterialData;
//          /var delData = []
          /* for(var z=0;z<this.tableMaterialData.length;z++){
             delData.push(this.tableMaterialData[z])
           }*/
          //console.log(row)
            this.delData = this.tableMaterialData;
          //console.log(this.delData)
          //console.log(delId)
            var arr = [];

            for(var i=0;i<this.delData.length;i++){
              if(this.delData[i].bomPositionId == row.bomPositionId){
                 for(var j=0;j<this.delData[i].bomList.length;j++){
                    if(this.delData[i].bomList[j].id == delId){

                    }else{
                        arr.push(this.delData[i].bomList[j])
                    }

                 }
                //console.log(arr);
                this.delData[i].bomList = arr
              }
              //console.log(this.delData)
              //this.delData = bigArr
            }
          //console.log(this.delData)
          var lastData = [];
          for(var k=0;k<this.delData.length;k++){
            if(this.delData[k].bomList != 0){
              lastData.push(this.delData[k]);
            }
          }

            //console.log(lastData)

            var params = {
              fittingBagId: this.checkRow.id,
              bom: JSON.stringify(lastData),
              remark: this.checkRow.remark,
              createrId: this.checkRow.createrId,
              modifierId: this.userInfo.accountId,
            };
            //console.log(this.tableMaterialData)
          var self = this
            fittingBagBomaveOrUpdate(params).then(function (res) {
              //console.log(res)
              if(res.returnCode === '200'){
                self.$message({message: '操作成功',type: 'success'});
                //self.tableMaterialData = JSON.parse(params.bom);
                self.getList(self.currentPage);
                //console.log(self.tableData)
                /*for(var i=0;i<self.tableData.length;i++){
                  if(self.checkRow.id == self.tableData[i].id){
                      self.clickRow(self.tableData[i])
                  }
                }*/
                self.tableMaterialData = lastData
              } else {
                this.$message({message: res.returnMsg,type: 'error'});
              }
            }).catch(function(err){
              console.log("form",err)
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
  .matable td{
    line-height: 40px;
    height: 40px;
    font-size: 14px;
  }
</style>
