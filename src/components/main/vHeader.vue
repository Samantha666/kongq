<template>
    <div class="header">
        <a class="logout" @click="logout">退出</a>
    </div>
</template>

<script>
    import {logout} from '../../api/api';
    export default {
        data() {
            return {
                
            };
        },
        mounted(){
            
        },
        methods:{
            logout() {
                var params = {
                    token:JSON.parse(sessionStorage.getItem("user")).token
                }
                logout(params).then(res => {
					if('200' == res.returnCode) {
                        sessionStorage.removeItem('user');
                        this.$router.push('/login');
                        this.$message({message: '退出成功',type: 'success'});
                    }
				}) .catch(err => {
                });
            }
        }
    }
</script>

<style scoped>
.header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height:100px;
    background-color: #20a0ff;
    z-index:1000;
    box-shadow:2px 0 3px rgba(0,0,0,.5);
}
.logout{
    cursor: pointer;
    display:inline-block;
    margin-left:95%;
    margin-top:40px;
    color:white;
}
</style>