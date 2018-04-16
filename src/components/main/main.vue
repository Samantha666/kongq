<template>
    <div class="wrapper">
        <vHead></vHead>
        <vSidebar></vSidebar>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import vHead from './vHeader.vue';
    import vSidebar from './vSidebar.vue';
    export default {
        components:{
            vHead,vSidebar
        },
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
.wrapper{
    width:100%;
    height:100%;
    overflow: hidden;
}
.content{
    position: absolute;
    top: 100px;
    bottom:0;
    left: 200px;
    right: 0;
    overflow-y: scroll;
    background: none repeat scroll 0 0 white;
}
</style>
