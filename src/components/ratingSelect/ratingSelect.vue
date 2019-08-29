<template>
    <div class="ratingSelect">

        <div class="rating-type">
            <span @click='select(2)' class="block all" :class="{'active':selectType===2}">{{desc.all}}<i class='count'>{{ratings.length}}</i></span
            ><span @click='select(0)' class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<i class='count'>{{positiveNum}}</i></span
            ><span @click='select(1)' class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<i class='count'>{{negativeNum}}</i></span>
        </div>

        <div @click='toggleContent' class="switch" :class="{'on':onlyContent}">
            <span class="iconfont icon-gougou"></span
            ><span class='text'>只看有内容的评价</span>
        </div> 

    </div>
</template>

<script>
const POSILIVE=0;    //点赞类型为0
const NEGALIVE=1;    //吐槽类型为1
const ALL=2;         //所有类型为2


export default {
    props:{
        ratings:{  //接收的评价数据
            type:Array,
            default(){
                return [];
            }
        },
        selectType:{  //传递过来的数据的类型
            type:Number,
            default:ALL
        },
        onlyContent:{  //是否显示全部内容
            type:Boolean,
            default:false
        },
        desc:{       //按钮描述，默认为下面三个
            type:Object,
            default(){
                return {
                    all:'全部',
                    positive:'满意',
                    negative:'不满意'
                }
            }
        }
    },
    computed:{
        positiveNum(){//计算点赞个数
            let positiveCount=0;
            this.ratings.forEach((rating)=>{
                if(rating.rateType===POSILIVE){
                    positiveCount++;
                }
            })
            return positiveCount;
        },
        negativeNum(){//计算吐槽个数
            let negativeCount=0;
            this.ratings.forEach((rating)=>{
                if(rating.rateType===NEGALIVE){
                    negativeCount++;
                }
            })
            return negativeCount;
        }
    },
    methods:{
        select(type){//子组件，不能直接修改父组件中的变量，要传递给父组件，在父组件中修改
            this.$emit('select-type',type);
        },
        toggleContent(){
            this.$emit('toggle-content');
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

.ratingSelect
    .rating-type
        padding:18px 0
        margin:0 18px
        font-size:0
        border-1px(#dbdee1)
        .block 
            display:inline-block
            padding:8px 12px
            margin-right:8px
            font-size:12px
            color:rgb(77,85,93)
            border-radius:2px
            &.positive,&.all
                background:rgba(0,160,220,.2)
                &.active
                    background:rgb(0,160,220)
                    color:white
            &.negative
                background:rgba(77,85,93,.2)
                &.active
                   background:rgb(77,85,93) 
                   color:white
            .count
                font-size:8px
                vertical-align:bottom
                padding-left:2px
    .switch
        padding:12px 18px
        line-height:24px
        border-bottom:1px solid #dbdee1
        font-size:12px
        color:rgb(147,153,159)
        &.on
            .iconfont
                color:#00c850
        .iconfont
            font-size:24px
            color:rgb(147,153,159)
            line-height:24px
            padding-right:4px
            vertical-align:middle
           
</style>