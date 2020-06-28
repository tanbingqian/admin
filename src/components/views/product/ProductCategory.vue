<template>
    <div class="view-white">
        <el-row>
            <router-link class="label-div shine-green" to="/productAdd/FIXED">{{ $t('comProduct') }}</router-link>
            <router-link class="label-div shine-light-blue" to="/productAdd/CUSONLINE">{{ $t('onLineMade') }}</router-link>
            <router-link class="label-div shine-purple" to="/productAdd/CUSOFFLINE">{{ $t('offLineMade') }}</router-link>
            <router-link class="label-div shine-blue" to="/productAdd/PLOT" >{{ $t('cutProduct') }}</router-link>
        </el-row>
    </div>
</template>

<script>
export default {
}
</script>
<style lang="less" scoped>
.el-row{
    padding: 60px;
}
.label-div{
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 180px;
    height: 135px;
    line-height: 30px;
    border-radius: 5px;
    background-color: #ebebee;
    text-align: center;
    color: #fff;
    letter-spacing: 1px;
    font-size: 14px;
    margin-right: 60px;
    cursor: pointer;
}
.shine-green{
    background-color: #6AB4DC;
    &:hover{
        animation: shine-green 2s ease-in-out infinite;
    }
}
.shine-light-blue{
    background-color: #27659A;
    &:hover{
        animation: shine-light-blue 2s ease-in-out infinite;
    }
}
.shine-purple{
    background: #44878E;
    &:hover{
        animation: shine-purple 2s ease-in-out infinite;
    }
}
.shine-blue{
    background: #97D9CC;
    &:hover{
        animation: shine-blue 2s ease-in-out infinite;
    }
}

@keyframes shine-green {
    form {
        box-shadow: 0 0 0 #fff;
    }
    50% {
        box-shadow: 0 0 10px 2px #6AB4DC;
    }
    to {
        box-shadow: 0 0 0 #fff;
    }
}
@keyframes shine-light-blue {
    form {
        box-shadow: 0 0 0 #fff;
    }
    50% {
        box-shadow: 0 0 10px 2px #27659A;
    }
    to {
        box-shadow: 0 0 0 #fff;
    }
}
@keyframes shine-purple {
    form {
        box-shadow: 0 0 0 #fff;
    }
    50% {
        box-shadow: 0 0 10px 2px #44878E;
    }
    to {
        box-shadow: 0 0 0 #fff;
    }
}
@keyframes shine-blue {
    form {
        box-shadow: 0 0 0 #fff;
    }
    50% {
        box-shadow: 0 0 10px 2px #97D9CC;
    }
    to {
        box-shadow: 0 0 0 #fff;
    }
}
</style>
