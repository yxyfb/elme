<template>
    <div class='ratings' ref='ratingWrapper'>
        <div class="ratings-content">

            <div class="overview">
                <div class="overview-left">
                    <h1 class='score'>{{seller.score}}</h1>
                    <h2 class='serviceScore'>综合评分</h2>
                    <div class='rankRate'>高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <div class="title">服务态度</div>
                        <v-star :size='36' :score='seller.serviceScore' class='star'></v-star
                        ><span class='score'>{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <div class="title">商品评分</div>
                        <v-star :size='36' :score='seller.score' class='star'></v-star
                        ><span class='score'>{{seller.score}}</span>
                    </div>
                    <div class="score-wrapper">
                        <div class="title">送达时间</div>
                        <div class="deliveryTime star">{{seller.deliveryTime}}分钟</div>
                    </div>
                </div>
            </div>

            <v-split></v-split>
            <v-ratingSelect :ratings='ratings'
                            :select-type='selectType' 
                            :only-content='onlyContent'
                            @select-type="select"
                            @toggle-content='toggleContent'>
            </v-ratingSelect>

            <div class="rating-wrapper">
                <ul v-show='ratings&&ratings.length'>
                    <li v-show='needShow(rating.rateType,rating.text)' v-for='(rating,index) in ratings' :key='index' class='rating-item'>
                        <div class="rating-title">
                            <div class='avatar'>
                                <img width='28' height='28' :src='rating.avatar'>
                            </div>
                            <div class="user">
                                <div class="name">{{rating.username}}</div>
                                <v-star :size='24' :score='rating.score' class='userScore'></v-star
                                ><span class="deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                            </div>
                            <div class="rateTime">{{rating.rateTime | formatDate}}</div>
                        </div>
                        <div class="rating-text">{{rating.text===''?'该用户没有评价':rating.text}}</div>
                        <div class="recommend-wrapper">
                            <i class='iconfont' :class="{'icon-dianzan':rating.rateType===0,'icon-dianzan1':rating.rateType===1}"></i>
                            <ul>
                                <li v-for='(recomend,index) in rating.recommend' :key='index' class='recommend'>{{recomend}}</li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <div v-show='ratings!==undefined&&ratings.length===0' class="no-rating">该商品目前无任何评价</div>
            </div>

        </div>       
    </div>
</template>

<script>
import BScroll from 'better-scroll'
import star from "@/components/star/star"
import split from '@/components/split/split'
import ratingSelect from '@/components/ratingSelect/ratingSelect'
import {userDate} from '@/common/js/date'

const POSILIVE=0;    //点赞类型为0
const NEGALIVE=1;    //吐槽类型为1
const ALL=2;         //所有类型为2
const ERR_OK=0;

export default {
    data(){
        return{
            ratings:[],
            selectType:ALL,
            onlyContent:true
        }
    },
    props:{
        seller:{
            type:Object
        }
    },
    components:{
        'v-star':star,
        'v-split':split,
        'v-ratingSelect':ratingSelect
    },
    created(){
        this.$http.get('/api/ratings').then(response=>{
            response=response.body;
            if(response.errno===ERR_OK){
                this.ratings=response.data;
                this.$nextTick(()=>{
                    if(!this.scroll){
                        this.scroll=new BScroll(this.$refs.ratingWrapper,{
                            click:true
                        });
                    }else{
                        this.scroll.refresh();//如果已经实例化了，就直接用refresh()调用
                    }
                })
            }
        })
    },
    methods:{
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
    filters:{
        formatDate(time){
            let date=new Date(time);
            return userDate(date);
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'
    
.ratings
    position:absolute
    top:176px
    bottom:0
    left:0
    width:100%
    overflow:hidden
    .overview
        display:flex
        padding:18px 0
        .overview-left
            flex:0 0 137px
            width:137px
            padding-top:6px
            text-align:center
            border-right:1px solid rgb(147,153,159)
            @media screen and (max-width:320px){
                flex:0 0 120px
                width:120px
            }
            .score
                line-height:28px
                font-size:24px
                color:rgb(255,153,0)
                padding-bottom:6px
            .serviceScore
                line-height:12px
                font-size:12px
                color:rgb(7,17,27)
                padding-bottom:8px
            .rankRate
                line-height:10px
                font-size:10px
                color:rgb(147,153,159)
                padding-bottom:6px
        .overview-right
            flex:1
            padding-left:24px
            padding-top:6px
            @media screen and (max-width:320px){
                padding-left:6px
            }
            .score-wrapper
                height:18px
                line-height:18px
                margin-bottom:8px
                color:rgb(7,17,27)
                font-size:12px
                &.last-child
                    margin-bottom:0
                .title
                    display:inline-block
                .star
                    display:inline-block
                    margin:0 12px
                    vertical-align:top
                .score
                    color:rgb(255,153,0)
                .deliveryTime
                    color:rgb(147,153,159)
    .rating-wrapper
        padding:0 18px
        .rating-item
            padding:18px 0 16px 0
            border-1px(rgb(147,153,159))
            .rating-title
                margin-bottom:6px
                .avatar
                    display:inline-block
                    width:28px
                    height:28px
                    border-radius:50%
                    margin-right:12px
                    overflow:hidden
                .user
                    display:inline-block
                    line-height:12px
                    font-size:10px
                    .name
                        margin-bottom:4px
                        color:rgb(7,17,27)
                    .userScore
                        display:inline-block
                        margin-right:6px
                    .deliveryTime
                        color:rgb(147,153,159)
                        font-weight:200
                .rateTime
                    float:right
                    line-height:12px
                    font-size:10px
                    color:rgb(147,153,159)
                    font-weight:200
            .rating-text
                margin-left:40px
                line-height:18px
                font-size:12px
                color:rgb(7,17,27)
                margin-bottom:8px
            .recommend-wrapper
                margin-left:40px
                font-size:0
                .iconfont
                    display:inline-block
                    line-height:16px
                    font-size:12px
                    vertical-align:top
                .icon-dianzan
                    color:rgb(0,160,220)
                .icon-dianzan1
                    line-height:24px
                ul
                    display:inline-block
                    width:80%
                    .recommend
                        display:inline-block
                        line-height:16px  
                        padding:0 6px
                        max-width:60px
                        margin-bottom:2px
                        overflow:hidden
                        white-space:nowrap
                        text-overflow:ellipsis
                        margin-left:8px
                        font-size:9px
                        color:rgb(7,17,27)
                        border:1px solid rgba(7,17,27,.1)
                        background-color:#fff   
</style>