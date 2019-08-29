<template>
    <transition name='translateToLeft'>
        <div v-show='showFlag' class='food-content' ref='food'>
            <div>

                <div class="image-header">
                    <img :src="food.image">
                    <div class="back" @click='hide'>
                        <i class="iconfont icon-arrow_lift"></i>
                    </div>
                </div>

                <div class="content">
                    <h1 class='title'>{{food.name}}</h1>
                    <div class="sales-volume">
                        <span class='count'>月售{{food.sellCount}}份</span
                        ><span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="newPrice"><i class='RMB'>￥</i>{{food.price}}</span
                        ><span v-if='food.oldPrice' class="oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cartcontrol-wrapper">
                        <v-cartcontrol :food='food'></v-cartcontrol>
                    </div>
                    <button @click='addFirst' class='join-cart' v-show='!food.count||food.count===0'>加入购物车</button>
                </div>

                <v-split></v-split>

                <div class="info" v-show='food.info'>
                    <h1 class="title">商品介绍</h1>
                    <div class='text'>{{food.info}}</div>
                </div>
                
                <v-split></v-split>

                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <v-ratingSelect :ratings='food.ratings'
                                    :select-type='selectType' 
                                    :only-content='onlyContent' 
                                    :desc='desc' 
                                    @select-type="select"
                                    @toggle-content='toggleContent'></v-ratingSelect>
                    <div class="rating-wrapper">
                        <ul v-show='food.ratings&&food.ratings.length'>
                            <li v-show='needShow(rating.rateType,rating.text)' v-for='(rating,index) in food.ratings' :key='index' class='rating-item'>
                                <div class="rating-title">
                                    <div class="rateTime">{{rating.rateTime | formatDate}}</div>
                                    <div class="userName">{{rating.username}}
                                        <div class='avatar'>
                                            <img width='12' height='12' :src='rating.avatar'>
                                        </div>
                                    </div>
                                </div>
                                <div class="rating-text">
                                    <i class='iconfont' :class="{'icon-dianzan':rating.rateType===0,'icon-dianzan1':rating.rateType===1}"></i
                                    ><span class='text'>{{rating.text===''?'该用户没有评价':rating.text}}</span>
                                </div>
                            </li>
                        </ul>
                        <div v-show='food.ratings!==undefined&&food.ratings.length===0' class="no-rating">该商品目前无任何评价</div>
                    </div>
                </div>

            </div>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import split from '@/components/split/split'
import ratingSelect from '@/components/ratingSelect/ratingSelect'
import {userDate} from '@/common/js/date' //调用export formatDate函数

const POSILIVE=0;    //点赞类型为0
const NEGALIVE=1;    //吐槽类型为1
const ALL=2;         //所有类型为2

export default {
    data(){
        return{
            showFlag:false,  //控制显示
            selectType:ALL,
            onlyContent:true,
            desc:{
                all:'全部',
                positive:'推荐',
                negative:'吐槽'
            }
        }
    },
    props:{
        food:{
            type:Object
        }
    },
    filters:{
        formatDate(time){  //可以接收时间，vue方法
            let date=new Date(time);
            return userDate(date);
        }
    },
    methods:{
        show(){  //点击商品显示
            this.showFlag=true;
            //初始化
            this.selectType=ALL;
            this.onlyContent=false;

            /* 滚动 */
            this.$nextTick(()=>{
            if(!this.scroll){
                this.scroll=new BScroll(this.$refs.food,{
                    click:true
                });
            }else{
                this.scroll.refresh();//如果已经实例化了，就直接用refresh()调用
            }
        })
        },
        hide(){  //点击返回隐藏
            this.showFlag=false;
        },
        addFirst(event){ //点击加入购物车
            this.$emit('join-cart',event.target);//自定义事件，直接在父组件的模板接口上@cart-add=''就可以输出
            Vue.set(this.food,'count',1);
        },
        select(type){  //商品评价下面几个类型的选择切换
            this.selectType=type;
        },
        toggleContent(){
            this.onlyContent=!this.onlyContent;
        },
        needShow(type,text){//点击不懂选项，评论列表展示的内容不一样
            if(this.onlyContent&&!text){   //如果是展示有内容的评论，并且没有内容，则返回false，让v-show=false，不显示
                return false;
            }
            if(this.selectType===ALL){ //如果选择类型是ALL，则v-show=true
                return true;
            }else{                   //如果不是，则type全等于当前选中的selectType就返回true
                return type===this.selectType;
            }
        }
    },
    components:{
        'v-cartcontrol':cartcontrol,
        'v-split':split,
        'v-ratingSelect':ratingSelect
    }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'


.translateToLeft-enter-active,.translateToLeft-leave-active
    transition:all .5s
.translateToLeft-enter,.translateToLeft-leave-to
    opacity:0
    transform:translate3d(100%,0,0)


.food-content
    position:fixed
    top:0
    left:0
    bottom:48px
    width:100%;
    background-color:#fff
    z-index:30
    overflow:hidden
    .image-header
        position:relative
        width:100%
        height:0
        padding-top:100%        /* 宽度确定，高度为0，那么padding-top:100%,就是高度等于宽度 */
        img 
            position:absolute
            top:0
            left:0
            width:100%
            height:100%
        .back
            position:absolute
            top:10px
            left:0
            .iconfont
                display:block
                padding:10px
                font-size:20px
                color:#fff;
    .content
        position:relative
        padding:18px
        .title
            height:14px
            line-height:14px
            font-size:14px
            font-weight:700
            color:rgb(7,17,27)
            margin-bottom:8px
        .sales-volume
            color:rgb(147,153,159)
            font-size:10px
            line-height:10px
            .rating
                padding-left:12px
        .price
            padding-top:18px
            height:24px
            line-height:24px
            .newPrice
                font-size:14px
                color:rgb(240,20,20)
                font-weight:700
                margin-right:8px
                .RMB
                    font-size:10px
                    font-weight:normal
                    vertical-align:bottom
            .oldPrice
                text-decoration:line-through
                font-size:10px
                font-weight:normal
                color:rgb(147,153,159)
        .join-cart
            position:absolute
            right:18px
            bottom:18px
            width:74px
            height:24px
            line-height:24px
            text-align:center
            background-color:rgb(0,160,220)
            color:#fff
            outline:none
            border:none
            border-radius:12px
        .cartcontrol-wrapper
            position:absolute
            right:18px
            bottom:12px
    .info
        padding:18px
        .title
            line-height:14px
            margin-bottom:6px
            font-size:14px
            color:rgb(7,0,27)
        .text
            padding:0 8px
            font-size:12px
            font-weight:200
            color:rgb(77,85,93)
            line-height:24px
    .rating
        padding-top:18px
        .title
            margin-left:18px
            line-height:14px
            font-size:14px
            color:rgb(7,0,27) 
        ul
            padding:0 18px
            .rating-item
                padding:16px 0
                font-size:10px
                color:rgb(147,153,159)
                border-1px(#dbdee1)
                .rating-title
                    margin-bottom:6px           
                    .rateTime
                        display:inline-block
                    .userName
                        float:right
                        .avatar
                            display:inline-block 
                            width:12px
                            height:12px
                            border-radius:6px
                            overflow:hidden
                            vertical-align:middle
                            margin-left:6px
                            img 
                                width:100%
                .rating-text
                    font-size:12px
                    .iconfont
                        padding-right:4px
                        vertical-align:middle
                    .icon-dianzan
                        color:rgb(0,160,220)
                    .icon-dianzan1
                        line-height:24px
                    .text
                        color:rgb(7,17,27)
                        line-height:16px  
        .no-rating
            padding:16px
</style>