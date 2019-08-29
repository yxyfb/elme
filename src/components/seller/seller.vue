<template>
    <div class='seller' ref='sellerWrapper'>
        <div class="seller-content">

            <div class="overview">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc">
                    <v-star :size='36' :score='seller.score' class='star'></v-star
                    ><span class="ratingCount">({{seller.ratingCount}})</span
                    ><span class="sellCount">月售{{seller.sellCount}}单</span>
                </div>
                <div class="collection" @click='toggleFavorite'>
                    <span class="iconfont icon-aixin" :class='{"active":favorite}'></span
                    ><span class='collection-text'>{{favoriteText}}</span>
                </div>
            </div>

            <ul class="remark">
                <li class="remark-list">
                    <h3 class="remark-title">起送价</h3>
                    <span class="remark-count">{{seller.minPrice}}<i class='remark-text'>元</i></span>
                </li>
                <li class="remark-list">
                    <h3 class="remark-title">商家配送</h3>
                    <span class="remark-count">{{seller.deliveryPrice}}<i class='remark-text'>元</i></span>
                </li>
                <li class="remark-list">
                    <h3 class="remark-title">平均配送时间</h3>
                    <span class="remark-count">{{seller.deliveryTime}}<i class='remark-text'>分钟</i></span>
                </li>
            </ul>

            <v-split></v-split>

            <div class="bas">
                <h2 class="bas-title">公告与活动</h2>
                <div class="bulletin-text">{{seller.bulletin}}</div>
                <ul v-if='seller.supports' class='supports'>
                    <li class='support' v-for='(support,index) in seller.supports' :key='index'>
                        <span class='icon' :class='iconArr[seller.supports[index].type]'></span
                        ><span class="text">{{seller.supports[index].description}}</span>
                    </li>
                </ul>
            </div>
            
            <v-split></v-split>

            <div class="seller-imgs">
                <h2 class="seller-img-title">商家实景</h2>
                <div class="slider" ref='slider'>
                    <ul class='pic-wrapper' ref='picWrapper'>
                        <li v-for='(pic,index) in seller.pics' :key='index' class='pic'>
                            <img :src="pic">
                        </li>
                    </ul>
                </div>
            </div>

            <v-split></v-split>

            <div class="seller-info">
                <h2 class="info">商家信息</h2>
                <ul class="info-wrapper">
                    <li v-for='(info,index) in seller.infos' :key='index' class="info-item">{{info}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import star from '@/components/star/star'
import split from '@/components/split/split'
import BScroll from 'better-scroll'
import {saveToLocal,loadFromLocal} from '@/common/js/store.js'

export default {
    data(){
        return {
            addActive:'',
            iconArr:['decrease','discount','special','invoice','guarantee'],
            favorite:(()=>{
                return loadFromLocal(this.seller.id,'favorite',false);//从缓存例读取到底是false,还是true
            })()
        }
    },
    computed:{
        favoriteText(){
            return this.favorite?'已收藏':'收藏';
        }
    },
    props:{
        seller:{
            type:Object
        }
    },
    created(){
        this.$nextTick(()=>{
            if(!this.scroll){
                this.scroll=new BScroll(this.$refs.sellerWrapper,{
                    click:true
                });
            }else{
                this.scroll.refresh();
            }

            //计算所有图片的总宽度，才能让BScroll横向移动
            if(this.seller.pics){
                let picWidth=120;
                let marginR=6;
                let picWrapperWidth=(picWidth+marginR)*this.seller.pics.length-marginR;
                this.$refs.picWrapper.style.width=picWrapperWidth+'px';
                if(!this.picScroll){
                    this.picScroll=new BScroll(this.$refs.slider,{
                        click:true,
                        scrollX:true,
                        eventPassthrough:'vertical'
                    });
                }else{
                    this.picScroll.refresh();
                }
            }
        });
        
    },
    methods:{
        toggleFavorite(){
            this.favorite=!this.favorite;
            saveToLocal(this.seller.id,'favorite',this.favorite);//将选择数据存入
        }
    },
    components:{
        'v-star':star,
        'v-split':split
    }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl';
.seller
    position:absolute
    top:176px
    bottom:0
    left:0
    width:100%
    overflow:hidden
    .seller-content
        .overview
            position:relative
            padding:18px 18px 0 18px
            .title
                line-height:14px
                font-size:14px
                color:rgb(7,17,27)
                margin-bottom:8px
            .desc
                height:18px
                line-height:18px
                padding-bottom:18px
                font-size:10px
                color:rgb(77,85,93)
                border-1px(rgba(7,17,27,.1))
                .star
                    display:inline-block
                    margin-right:8px
                    vertical-align:top
                .ratingCount
                    display:inline-block
                    margin-right:12px
                .sellCount
                    display:inline-block
            .collection
                position:absolute
                text-align:center
                top:20px
                right:18px
                width:36px
                .iconfont
                    display:block
                    line-height:24px
                    font-size:24px
                    margin-bottom:4px
                    &.active
                        color:rgb(240,20,20)
                .collection-text
                    line-height:10px
                    font-size:10px
                    color:rgb(77,85,93)
        .remark
            display:flex
            padding:18px
            .remark-list
                flex:1
                border-right:1px solid rgba(7,17,27,.1)
                text-align:center
                &:last-child
                    border-right:none
                .remark-title
                    line-height:10px
                    font-size:10px
                    color:rgb(147,153,159)
                    margin-bottom:4px
                .remark-count
                    line-height:24px
                    font-size:24px
                    font-weight:200
                    color:rgb(7,17,27)
                    .remark-text
                        font-size:10px
        .bas
            padding:18px 18px 0 18px
            .bas-title
                line-height:14px
                font-size:14px
                color:rgb(7,17,27)
                margin-bottom:8px
            .bulletin-text
                padding:0 12px
                line-height:24px
                padding-bottom:16px
                font-size:12px
                font-weight:200
                color:rgb(240,20,20)   
            .supports
                width :100%
                .support
                    padding:16px 12px
                    border-top-1px(rgba(7,17,27,.1))
                    .icon
                        display :inline-block
                        width:16px
                        height:16px
                        margin-right:6px
                        background-repeat :no-repeat
                        background-size :100%
                        vertical-align: middle
                        &.decrease
                            bg-image('../../assets/decrease_4')
                        &.discount
                            bg-image('../../assets/discount_4')
                        &.special
                            bg-image('../../assets/special_4')
                        &.invoice
                            bg-image('../../assets/invoice_4')
                        &.guarantee
                            bg-image('../../assets/guarantee_4')
                    .text
                        line-height:16px
                        font-size:12px
                        font weight 200
                        color:rgb(7,17,27)  
        .seller-imgs  
            padding:18px
            .seller-img-title
                line-height:14px
                font-size:14px
                color:rgb(7,17,27)
                margin-bottom:12px 
            .slider
                width:100%
                overflow:hidden
                .pic-wrapper
                    font-size:0
                    white-space:nowrap
                    .pic
                        display:inline-block
                        width:120px
                        height:90px
                        margin-right:6px
                        &:last-child
                            margin-right:0
                        img 
                            display:block
                            width:100%
                            height:100%
        .seller-info
            padding:18px 18px 0 18px;
            .info
                line-height:14px
                font-size:14px
                color:rgb(7,17,27)
                margin-bottom:12px 
            .info-wrapper
                .info-item
                    padding:16px 12px
                    line-height:16px
                    font-size:12px
                    font-weight:200
                    color:rgb(7,17,27)
                    border-top-1px(rgba(7,17,27,.1))


</style>