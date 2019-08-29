<template>
     <div class='header'>
         <!-- 头部主体 -->
        <div class="content-wrapper">
            <div class="avatar">
                <img :src="seller.avatar" width='64' height='64'>
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if='seller.supports' class="supports">
                    <span class="icon" :class='iconArr[seller.supports[0].type]'></span>
                    <span class='text'>{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if='seller.supports' class="support-count" @click='showDetail'>
                <span class="count">{{seller.supports.length}}个</span>
                <i class='iconfont icon-down'></i>
            </div>
        </div>
        <!-- 头部公告 -->
        <div class="bulletin-wrapper">
            <span class="bulletin-title"></span
            ><span class="bulletin-text">{{seller.bulletin}}</span>
            <i class='iconfont icon-down'></i>
        </div>
        <!-- 头部背景 -->
        <div class="headerBg">
            <img :src="seller.avatar">
        </div>

        <!-- 头部弹出层 -->
        <transition name='fade'>
            <div v-show='detailShow' class="detail">
                <div class="detail-wrapper">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <v-star :size='48' :score='seller.score' class='score'></v-star>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if='seller.supports' class='supports'>
                            <li class='support' v-for='(support,index) in seller.supports' :key='index'>
                                <span class='icon' :class='iconArr[seller.supports[index].type]'></span
                                ><span class="text">{{seller.supports[index].description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">{{seller.bulletin}}</div>
                    </div>
                </div>
                <div class="detail-colse" @click='hideDetail'>
                    <i class="iconfont icon-cha"></i>
                </div>
            </div>
        </transition>

    </div>
</template>

<script>
import star from '../star/star';    //引用star组件

export default {
    data(){
        return{
            iconArr:[],
            detailShow:false
        }
    },
    props:{
        seller:{
            type:Object
        }
    },
    created(){
        //class名，根据获取不同的type数字，来获取下标，对应图片
        this.iconArr=['decrease','discount','special','invoice','guarantee']
    },
    methods:{
        showDetail(){
            this.detailShow=true;
        },
        hideDetail(){
            this.detailShow=false;
        }
    },
    components:{
        'v-star':star    //注册star组件
    }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'

.fade-enter-active, .fade-leave-active 
  transition: opacity .5s
.fade-enter, .fade-leave-to 
  opacity: 0

.header
    position :relative
    color:#fff
    overflow :hidden
    .content-wrapper
        position relative
        height:108px
        background-color: rgba(7,17,27,.5)
        .avatar
            position: absolute
            left:24px
            top:24px
            border-radius: 2px
            img 
                border-radius:2px 
        .content
            padding-top:26px
            padding-left:106px
            .title
                margin-bottom:8px
                .brand
                    display: inline-block
                    width:30px
                    height:18px
                    background-size: 100%
                    vertical-align: top
                    bg-image('../../assets/brand')
                .name
                    display: inline-block
                    height:16px
                    line-height: 16px
                    font-size: 16px
                    font-weight: bold
                    margin-left:6px
            .description
                font-size 12px;
                color:#fff;
                line-height 12px;
                margin-bottom 10px;
            .supports
                .icon
                    display inline-block
                    width:12px
                    height :12px
                    margin-right:4px
                    background-size:100%
                    vertical-align: middle
                    &.decrease
                        bg-image('../../assets/decrease_1')
                    &.discount
                        bg-image('../../assets/discount_1')
                    &.special
                        bg-image('../../assets/special_1')
                    &.invoice
                        bg-image('../../assets/invoice_1')
                    &.guarantee
                        bg-image('../../assets/guarantee_1')
                .text
                    font-size 10px
                    color:#fff
                    line-height:12px
        .support-count
            position :absolute
            bottom:24px
            right:24px
            padding :0 8px
            height:24px
            line-height :24px
            font-size :10px;
            border-radius :10px
            color:#fff;
            background:rgba(0,0,0,.2) 
            text-align:center
            .count
                font-size :10px
            .icon-down
                font-size :10px
                margin-left :2px
    .bulletin-wrapper
        position :relative
        padding:0 22px 0 12px;
        height:28px;
        line-height :28px
        background-color:rgba(7,17,27,.7)
        overflow :hidden
        text-overflow:ellipsis;
        white-space: nowrap;
        .bulletin-title
            display:inline-block
            width:22px
            height:12px
            background-size :100%
            vertical-align :middle
            bg-image('../../assets/bulletin')
        .bulletin-text
            margin:0 4px
            font-size :10px
        .icon-down
            position:absolute
            right 12px
            top:2px
    .headerBg
        position :absolute
        top:0
        left:0
        width :100%
        height:100%
        z-index:-1
        filter:blur(10px)
        img 
            width :100%
            height:100%
            background-size :100% 
    .detail
        position :fixed
        top:0
        left:0
        width :100%;
        height :100%
        overflow :auto
        z-index:100
        background-color :rgba(7,17,27,.8)
        .detail-wrapper
            width:100%
            min-height:100%
            .detail-main
                padding:64px 0       
                .name
                    line-height :16px
                    font-size:16px
                    color :#fff
                    font-weight: 700
                    text-align:center
                .score
                    margin :16px 0 28px 0
                    text-align:center
                .title
                    display :flex
                    width:80%
                    margin:0 auto 24px auto
                    .line
                        flex:1
                        position:relative
                        top:-6px
                        border-bottom:1px solid rgba(255,255,255,.2)
                    .text
                        margin:0 12px
                        font size 14px
                        font-weight:700
                .supports
                    width :80%
                    margin:0 auto 28px auto 
                    .support
                        margin-bottom:12px
                        &:last-child
                            margin-bottom :0
                        .icon
                            display :inline-block
                            width:16px
                            height:16px
                            margin-right:6px
                            margin-left:12px
                            background-repeat :no-repeat
                            background-size :100%
                            vertical-align: middle
                            &.decrease
                                bg-image('../../assets/decrease_2')
                            &.discount
                                bg-image('../../assets/discount_2')
                            &.special
                                bg-image('../../assets/special_2')
                            &.invoice
                                bg-image('../../assets/invoice_2')
                            &.guarantee
                                bg-image('../../assets/guarantee_2')
                        .text
                            font-size:12px
                            font-weight:200
                            line-height :12px
                .bulletin
                    width :80%
                    box-sizing:border-box
                    margin:0 auto 
                    padding :0 12px
                    font-size:12px
                    font-weight:200
                    line-height :24px
        .detail-colse
            position:relative
            width:32px
            height:32px
            font-size:32px
            margin:-64px auto 0 auto   
</style>


