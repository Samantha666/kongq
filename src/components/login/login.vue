<template>
    <div>
        <el-form class="login-container" :model="loginFormData" :rules="loginFormRules" ref="loginForm" label-position="left">
            <h3 class="title">版型库登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginFormData.username" auto-complete="off" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginFormData.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item style="width:100%;padding-top:5%">
                <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {login} from '../../api/api';
    export default {
        data() {
            return {
                logining:false,
                //表单
                loginFormData:{
                    username:'',
                    password:''
                },
                loginFormRules:{
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ]
                }
            };
        },
        mounted(){

        },
        methods:{
            login() {
                this.$refs.loginForm.validate((valid) => {
                    if(valid) {
                        this.logining = true;
                        var loginParams = {
                            "username": this.loginFormData.username,
                            "password": this.loginFormData.password,
                            "sysId":"kongque-style-library"
                        }
                        login(loginParams).then(res => {
                            this.logining = false;
                            if ('200' == res.returnCode) {
                                this.$message({message: '登陆成功',type: 'success'});
                                sessionStorage.setItem('user',JSON.stringify(res.returnData));
                                this.$router.push({path: '/main'});
                            } else {
                                this.$message({message: res.returnMsg,type: 'error'});
                            }
                        }) .catch(err => {
                            console.log(err);
                        });
                    }
                });
            }


        }
    }
</script>

<style scoped>
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
.title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
}
</style>
