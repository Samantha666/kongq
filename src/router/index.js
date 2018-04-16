import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import main from '@/components/main/main'
import color from '@/components/store/color'
import cadPosition from '@/components/store/cadPosition'
import bomPosition from '@/components/store/bomPosition'
import qualityPosition from '@/components/store/qualityPosition'
import size from '@/components/store/size'
import technology from '@/components/store/technology'
import procedure from '@/components/store/procedure'
import style from '@/components/style/style'
import fittingCad from '@/components/store/fittingCad'
import fittingBom from '@/components/store/fittingBom'
import fittingQuality from '@/components/store/fittingQuality'
import fittingBag from '@/components/store/fittingBag'
import storeAdjustmentItem from '@/components/store/storeAdjustmentItem'
import storeAdjustmentItemCADRule from '@/components/cadDataMaintenance/storeAdjustmentItemCADRule'
import storeAdjustmentCad from '@/components/cadDataMaintenance/storeAdjustmentCad'
import storeAdjustmentItemBOMRule from '@/components/bomDataMaintenance/storeAdjustmentItemBOMRule'
import storeAdjustmentBom from '@/components/bomDataMaintenance/storeAdjustmentBom'
import storeAdjustmentItemTechnologyRule from '@/components/ieDataMaintenance/storeAdjustmentItemTechnologyRule'
import storeAdjustmentTechnology from '@/components/ieDataMaintenance/storeAdjustmentTechnology'
import storeAdjustmentItemProcedureRule from '@/components/ieDataMaintenance/storeAdjustmentItemProcedureRule'
import storeAdjustmentProcedure from '@/components/ieDataMaintenance/storeAdjustmentProcedure'
import storeAdjustmentItemQualityRule from '@/components/qualityDataMaintenance/storeAdjustmentItemQualityRule'
import storeAdjustmentQualityChecking from '@/components/qualityDataMaintenance/storeAdjustmentQualityChecking'
import submitOrder from '@/components/test/submitOrder'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      children: [
        { path: 'color',name: 'color',component: color },
        { path: 'procedure',name: 'procedure',component: procedure },
        { path: 'qualityPosition',name: 'qualityPosition',component: qualityPosition },
        { path: 'bomPosition',name: 'bomPosition',component: bomPosition },
        { path: 'cadPosition',name: 'cadPosition',component: cadPosition },
        { path: 'technology',name: 'technology',component: technology },
        { path: 'procedure',name: 'procedure',component: procedure },
        { path: 'procedure',name: 'procedure',component: procedure },
        { path: 'size',name: 'size',component: size },
        { path: 'fittingCad',name: 'fittingCad',component: fittingCad },
        { path: 'fittingBom',name: 'fittingBom',component: fittingBom },
        { path: 'fittingQuality',name: 'fittingQuality',component: fittingQuality },
        { path: 'fittingBag',name: 'fittingBag',component: fittingBag },
        { path: 'style',name: 'style',component: style },
        { path: 'storeAdjustmentItem',name: 'storeAdjustmentItem',component: storeAdjustmentItem },
        { path: 'storeAdjustmentItemCADRule',name: 'storeAdjustmentItemCADRule',component: storeAdjustmentItemCADRule },
        { path: 'storeAdjustmentCad',name: 'storeAdjustmentCad',component: storeAdjustmentCad },
        { path: 'storeAdjustmentItemBOMRule',name: 'storeAdjustmentItemBOMRule',component: storeAdjustmentItemBOMRule },
        { path: 'storeAdjustmentBom',name: 'storeAdjustmentBom',component: storeAdjustmentBom },
        { path: 'storeAdjustmentItemTechnologyRule',name: 'storeAdjustmentItemTechnologyRule',component: storeAdjustmentItemTechnologyRule },
        { path: 'storeAdjustmentTechnology',name: 'storeAdjustmentTechnology',component: storeAdjustmentTechnology },
        { path: 'storeAdjustmentItemProcedureRule',name: 'storeAdjustmentItemProcedureRule',component: storeAdjustmentItemProcedureRule },
        { path: 'storeAdjustmentProcedure',name: 'storeAdjustmentItemProcedureRule',component: storeAdjustmentProcedure },
        { path: 'storeAdjustmentItemQualityRule',name: 'storeAdjustmentItemQualityRule',component: storeAdjustmentItemQualityRule },
        { path: 'storeAdjustmentQualityChecking',name: 'storeAdjustmentQualityChecking',component: storeAdjustmentQualityChecking },
        { path: 'submitOrder',name: 'submitOrder',component: submitOrder }
      ],
      meta: {
        requireAuth: true
      }
    },

  ]
})
