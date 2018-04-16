<template>
    <div class="sidebar">
        <el-menu
                background-color="#20a0ff"
                text-color="#fff"
                active-text-color="#ffd04b"
                router
            >
            <el-submenu index="1" style="width:100%">
                <template slot="title">
                    商品数据维护
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/main/color">颜色管理</el-menu-item>
                    <el-menu-item index="/main/size">尺码管理</el-menu-item>
                    <el-menu-item index="/main/style">款式管理</el-menu-item>
                    <el-menu-item index="/main/fittingBag">试衣包管理</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentItem">门店可调整项管理</el-menu-item>
                    <el-menu-item index="/main/technology">工艺管理</el-menu-item>
                    <el-menu-item index="/main/procedure">工序管理</el-menu-item>
                    <el-menu-item index="/main/cadPosition">cad部位管理</el-menu-item>
                    <el-menu-item index="/main/bomPosition">bom部位管理</el-menu-item>
                    <el-menu-item index="/main/qualityPosition">质检部位管理</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2" style="width:100%">
                <template slot="title">
                    CAD数据维护
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/main/fittingCad">试衣包cad管理</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentItemCADRule">门店可调项-CAD规则</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentCad">订单CAD</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3" style="width:100%">
                <template slot="title">
                    BOM数据维护
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/main/fittingBom">试衣包bom管理</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentItemBOMRule">门店可调项-BOM规则</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentBom">订单BOM</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4" style="width:100%">
                <template slot="title">
                    IE数据维护
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/main/storeAdjustmentItemTechnologyRule">门店可调项-工艺规则</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentTechnology">订单工艺</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <el-menu-item index="/main/storeAdjustmentItemProcedureRule">门店可调项-工序规则</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentProcedure">订单工序</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5" style="width:100%">
                <template slot="title">
                    质检数据维护
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/main/fittingQuality">试衣包质检管理</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentItemQualityRule">门店可调项-质检规则</el-menu-item>
                    <el-menu-item index="/main/storeAdjustmentQualityChecking">订单质检</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6" style="width:100%">
                <template slot="title">
                    测试
                </template>
                <el-menu-item-group>
                    <el-menu-item index="/main/submitOrder">测试下单</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        mounted(){

        },
        methods:{

        }
    }
</script>

<style scoped>
.sidebar{
    position: absolute;
    top: 100px;
    bottom:0;
    left: 0;
    width: 200px;
    background-color:#20a0ff;
}
</style>
