<template>
    <div class="detail">
    </div>
</template>

<script>
export default {
    name: 'ProductDetail'
}
</script>
<style lang="less">
.img-wrap{
    float: left;
    position: relative;
}
.gallery-wrap{
    width: 250px;
    height: 350px;
    padding: 0 14px;
}
.swiper-container{
    outline: none;
    .swiper-img{
        display: block;
        width: 250px;
        height: 350px;
    }
}
.thumbs-wrap{
    width: 250px;
}
.thumbs{
    .thumbs-img{
        display: block;
        width: 50px;
        height: 60px;
    }
}
</style>
