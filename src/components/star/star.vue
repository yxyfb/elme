<template>
    <div class='star' :class='starType'>
        <!-- 获取到itemClasses这个数组，然后循环赋值class名 -->
        <span v-for='(itemClass,index) in itemClasses' :key='index' :class='itemClass' class='star-item'></span>
    </div>
</template>

<script>
const allStar=5;           //总共星星颗数
const cls_on='on';       
const cls_half='half';
const cls_off='off';

export default {
    
    props:{   //这个star模板接收两个参数，大小和评分
        size:{
            type:Number
        },
        score:{         //评分，对应星星个数
            type:Number
        }
    },
    computed:{
        starType(){
            return 'star-'+this.size;//根据不同的尺寸，定义不同的class名
        },
        itemClasses(){
            //这个函数就是更新数组里面的class值，原理：假如是3.5分对应一个数组就应该是 [on,on,on,half,off]这样来

            let starClassArr=[];
            let newScore=Math.floor(this.score*2)/2;//如果是4.2评分，要当成4的星星显示，4.6要当成4.5显示
            let hasDecimal=(newScore%1!=0);   //是否有小数
            let integer=Math.floor(this.score);

            for(let i=0;i<integer;i++){
                starClassArr.push(cls_on);
            }
            if(hasDecimal){  //半个星星始终只有一颗，当有小数时，就给数组加上
                starClassArr.push(cls_half);
            }
            while(starClassArr.length<allStar){
                starClassArr.push(cls_off);
            }

            return starClassArr;
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

.star
    font-size:0
    .star-item
        display :inline-block
        background-repeat:no-repeat
    &.star-48
        .star-item
            width :20px
            height:20px
            margin-right:22px
            background-size :100%
            &:last-child
                margin-right:0
            &.on
                bg-image('../../assets/star48_on')
            &.half
                bg-image('../../assets/star48_half')
            &.off
                bg-image('../../assets/star48_off')
    &.star-36
        .star-item
            width :15px
            height:15px
            margin-right:6px
            background-size :100%
            &:last-child
                margin-right:0
            &.on
                bg-image('../../assets/star36_on')
            &.half
                bg-image('../../assets/star36_half')
            &.off
                bg-image('../../assets/star36_off')
    &.star-24  
        .star-item
            width :10px
            height:10px
            margin-right:3px
            background-size :100%
            &:last-child
                margin-right:0
            &.on
                bg-image('../../assets/star24_on')
            &.half
                bg-image('../../assets/star24_half')
            &.off
                bg-image('../../assets/star24_off') 
</style>