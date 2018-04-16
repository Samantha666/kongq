import axios from 'axios'
//dev
//let baseURL = 'http://192.168.0.157:8080/';

//test
let baseURL = 'http://172.16.87.100:8888/';

//production
// let baseURL = '';

export const login = params => {
    return axios.post(`${baseURL}kongque-account/account/login`, params).then(res => res.data);
};

export const logout = params => {
    return axios.get(`${baseURL}kongque-account/account/logout`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

// ---  门店可调整项
export const storeAdjustmentItemList = params => {
    return axios.get(`${baseURL}kongque-style-library/storeAdjustmentItem/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

export const storeAdjustmentItemFind = params => {
    return axios.get(`${baseURL}kongque-style-library/storeAdjustmentItem/find`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

export const storeAdjustmentItemAdd = params => {
    return axios.post(`${baseURL}kongque-style-library/storeAdjustmentItem/add`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const storeAdjustmentItemEdit = params => {
    return axios.post(`${baseURL}kongque-style-library/storeAdjustmentItem/edit`, params, {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const submitStoreAdjustment = params => {
    return axios.post(`${baseURL}kongque-style-library/storeAdjustment/submit`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

// ---  CAD规则
export const ruleCadAdd = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleCad/add`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleCadEdit = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleCad/edit`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleCadList = params => {
    return axios.get(`${baseURL}kongque-style-library/ruleCad/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

// ---  BOM规则
export const ruleBomAdd = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleBom/add`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleBomEdit = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleBom/edit`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleBomList = params => {
    return axios.get(`${baseURL}kongque-style-library/ruleBom/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

// -- bom部位
export const bomPositionFind = params => {
    return axios.get(`${baseURL}kongque-style-library/bomPosition/find`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

// -- 物料
export const materialList = params => {
    return axios.get(`${baseURL}kongque-style-library/material/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

//-- 质检规则
export const ruleQualityCheckingAdd = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleQualityChecking/add`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleQualityCheckingEdit = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleQualityChecking/edit`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleQualityCheckingList = params => {
    return axios.get(`${baseURL}kongque-style-library/ruleQualityChecking/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};
// -- 质检部位
export const qualityCheckingPositionFind = params => {
    return axios.get(`${baseURL}kongque-style-library/qualityCheckingPosition/find`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

// -- 工艺规则
export const ruleTechnologyAdd = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleTechnology/add`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleTechnologyEdit = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleTechnology/edit`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleTechnologyList = params => {
    return axios.get(`${baseURL}kongque-style-library/ruleTechnology/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

// -- 工序规则
export const ruleProcedureAdd = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleProcedure/add`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleProcedureEdit = params => {
    return axios.post(`${baseURL}kongque-style-library/ruleProcedure/edit`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};

export const ruleProcedureList = params => {
    return axios.get(`${baseURL}kongque-style-library/ruleProcedure/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

//-- cad部位
export const cadPositionFind = params => {
    return axios.get(`${baseURL}kongque-style-library/cadPosition/find`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

export const cadPositionList = params => {
  return axios.get(`${baseURL}kongque-style-library/cadPosition/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

export const cadPositionSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/cadPosition/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

export const cadPositionDel = params => {
  return axios.get(`${baseURL}kongque-style-library/cadPosition/del`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

//颜色管理
export const colorList = params => {
    return axios.get(`${baseURL}kongque-style-library/color/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};
export const colorDialog = params => {
    return axios.post(`${baseURL}kongque-style-library/color/saveOrUpdate`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};
export const colorDeletList = params => {
    return axios.get(`${baseURL}kongque-style-library/color/del`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};
export const colorFind = params => {
    return axios.get(`${baseURL}kongque-style-library/color/find`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};
//尺码管理
export const sizeList = params => {
    return axios.get(`${baseURL}kongque-style-library/size/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};
export const sizeDialog = params => {
    return axios.post(`${baseURL}kongque-style-library/size/saveOrUpdate`, params , {
        'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
    }).then(res => res.data);
};
export const sizeDeletList = params => {
    return axios.get(`${baseURL}kongque-style-library/size/del`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};
export const sizeCategoryList = params => {
    return axios.get(`${baseURL}kongque-style-library/category/list`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};
export const sizeCalculate = params => {
    return axios.get(`${baseURL}kongque-style-library/size/calculate`,
        {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

//bom部位
export const bomPositionList = params => {
  return axios.get(`${baseURL}kongque-style-library/bomPosition/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token}, params: params}
  ).then(res => res.data);
}

//款式列表
export const styleList = params => {
  return axios.get(`${baseURL}kongque-style-library/style/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

export const styleFind = params => {
    return axios.get(`${baseURL}kongque-style-library/style/find`,
      {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
  };

export const bomPositionSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/bomPosition/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

export const bomPositionDel = params => {
  return axios.get(`${baseURL}kongque-style-library/bomPosition/del`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

//质检管理
export const qualityCheckingPositionList = params => {
  return axios.get(`${baseURL}kongque-style-library/qualityCheckingPosition/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

//品类列表
export const categoryList = params => {
  return axios.get(`${baseURL}kongque-style-library/category/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

export const qualityCheckingPositionSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/qualityCheckingPosition/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

export const qualityCheckingPositionDel = params => {
  return axios.get(`${baseURL}kongque-style-library/qualityCheckingPosition/del`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

//工艺
export const listStyleTechnologyByStyleId = params => {
    return axios.get(`${baseURL}kongque-style-library/style/technology/list/byStyleId`,
      {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

export const technologyList = params => {
  return axios.get(`${baseURL}kongque-style-library/technology/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

export const technologySaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/technology/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

export const technologyDel = params => {
  return axios.get(`${baseURL}kongque-style-library/technology/del`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

//工序
export const listStyleProcedureByStyleId = params => {
    return axios.get(`${baseURL}kongque-style-library/style/procedure/list/byStyleId`,
      {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
};

export const procedureList = params => {
  return axios.get(`${baseURL}kongque-style-library/procedure/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

export const procedureSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/procedure/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

export const procedureDel = params => {
  return axios.get(`${baseURL}kongque-style-library/procedure/del`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};
//试衣包
export const styleColorListByStyleId = params => {
  return axios.get(`${baseURL}kongque-style-library/style/color/list/byStyleId`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

export const fittingBagList = params => {
  return axios.get(`${baseURL}kongque-style-library/fittingBag/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

export const fittingBagFind = params => {
    return axios.get(`${baseURL}kongque-style-library/fittingBag/find`,
      {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
    ).then(res => res.data);
  };

export const fittingBagSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/fittingBag/addOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

export const fittingBagDel = params => {
  return axios.get(`${baseURL}kongque-style-library/fittingBag/del`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};

//试衣包cad
export const fittingBagCadSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/fittingBag/cad/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

//试衣包bom
export const fittingBagBomaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/fittingBag/bom/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

//试衣包质检
export const fittingBagCheckingSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/fittingBag/checking/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};
//款式新增或修改
export const styleSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/style/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

//IE数据维护 订单工艺 门店可调整列表
export const CraftsStoreList = params => {
  return axios.get(`${baseURL}kongque-style-library/storeAdjustment/list`,
    {headers: {'token': JSON.parse(sessionStorage.getItem("user")).token},params: params}
  ).then(res => res.data);
};
//门店调整工艺项新增或修改
export const CraftsAdd = params => {
  return axios.post(`${baseURL}kongque-style-library/storeAdjustment/technology/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};
//门店调整cad项新增或修改
export const storeAdjustmentCadSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/storeAdjustment/cad/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};
// 门店数据下载-- 参数：id（门店id），style(标识 1：cad 2：质检 3：bom 4：工序  5：工艺)
export const returnDownloadOrderData = (params) => {
  return baseURL+'kongque-style-library/storeAdjustment/exportExcel?id='+params.id + '&style='+params.style;
};
//门店调整工序项新增或修改
export const storeAdjustmentProcedureSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/storeAdjustment/procedure/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};
//门店调整质检项新增或修改
export const storeAdjustmentQualityCheckingSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/storeAdjustment/qualityChecking/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};
/*门店调整bom新增或修改*/
export const storeAdjustmentBomCheckingSaveOrUpdate = params => {
  return axios.post(`${baseURL}kongque-style-library/storeAdjustment/bom/saveOrUpdate`, params , {
    'headers': {'token': JSON.parse(sessionStorage.getItem("user")).token}
  }).then(res => res.data);
};

