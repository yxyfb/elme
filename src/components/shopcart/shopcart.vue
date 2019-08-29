<template>
    <div>
        <!-- 购物车底部组件 -->
        <div class="shopcart">
            <div class="content">
                <div class="content-left" @click='toggleList'>
                    <div class="logo-wrapper">
                        <div class="logo" :class="{'hightlight':totalCount>0}">
                            <span class='iconfont icon-gouwuche'></span>
                        </div>
                        <div class="num" v-show='totalCount>0'>{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{'hightlight':totalCount>0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费{{delivertprice}}元</div>
                </div>
                <div class="content-right" :class="{'payclass':totalPrice>=minPrice}">
                    <div class="pay">{{payDesc}}</div>
                </div>
            </div>

            <!-- 1.定义一个数组，存放5个小球，这5个小球可以满足的动画的运行
                2.动画分为两层，外层控制小球y轴方向和运动的轨道，内层控制x轴方向的运动
                3.使用js动画钩子，vue在实现动画的时候提供了几个javascript钩子，可配合css动画一起使用，也可单独使用，因为购物车抛物线小球只有进入动画，没有离开的动画，所以enter的钩子有，before-enter,enter,after-enter,这些钩子需要在html属性中声明，然后在methods中使用这些方法
            -->
            <div class="ball-container">
                <transition @before-enter='beforeEnter' 
                            @enter="enter" 
                            @after-enter="afterEnter" 
                            name='drop' v-for='(ball,index) in balls' :key='index'>
                    <div class="ball" v-show='ball.show'>
                        <div class="inner"></div>
                    </div>
                </transition>
            </div>

            <!-- 购物车列表 -->
            <transition name='slider'>
                <div class="shopcart-list" v-show='listShow'>
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <div class="empty" @click='empty'>清空</div>
                    </div>
                    <div class="list-content" ref='listContent'>
                        <ul>
                            <li class='food' v-for='(food,index) in selectFoods' :key='index'>
                                <div class="name">{{food.name}}</div>
                                <div class="cartcontrol-wrapper">
                                    <v-cartcontrol :food='food' @cart-add='cartAdd'></v-cartcontrol>
                                </div>
                                <div class="price"><span class="icon">￥</span>{{food.price*food.count}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>

        </div>

        <transition name='fade'>
            <div class="list-mask" v-show='listShow' @click='toggleList'></div>
        </transition>
    </div>
</template>

<script>
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import BScroll from 'better-scroll'

export default {
    data(){
        return {
            //使用balls存放5个小球，这些小球的默认状态都是不显示的
            balls:[{show:false},{show:false},{show:false},{show:false},{show:false}],
            dropBalls:[],  //已经在下降的小球存在这里
            flod:true     //购物车详情页是否折叠，默认是折叠
        }
    },
    props:{
        selectFoods:{     //接收已选择商品的数组
            type:Array,
            default(){    //如果类型是array或object，那么默认值default为函数
                return [];
            }
        },
        delivertprice:{    //配送费
            type:Number,
            default:0
        },
        minPrice:{         //最低起送
            type:Number,
            default:0
        }
    },
    computed:{
        //计算已选择商品的总价
        totalPrice(){
            let total=0;
            this.selectFoods.forEach((food)=>{
                total+=food.price*food.count;
            });
            return total;
        },
        //计算已选择商品的总个数
        totalCount(){
            let count=0;
            this.selectFoods.forEach((food)=>{
                count+=food.count;
            });
            return count;
        },
        //不同总价，右侧结算显示的不同内容
        payDesc(){
            let totalPrice=this.totalPrice;
            let minPrice=this.minPrice;
            if(totalPrice===0){
                return `￥${minPrice}起送`;
            }else if(totalPrice>0&&totalPrice<minPrice){
                let diff=minPrice-totalPrice;
                return `还差￥${diff}起送`;
            }else{
                return '去结算';
            }
        },
        //计算购物车详细是否展开
        listShow(){
            if(!this.totalCount){
                this.flod=true;   //如果没有商品则是一个折叠状态
                return false;
            }
            let show=!this.flod   //如果是折叠状态，v-show=false
            if(show){
                //无滚动条的滚动
                this.$nextTick(()=>{
                    if(!this.scroll){//如果实例化不存在就实例化一次
                        this.scroll=new BScroll(this.$refs.listContent,{
                            click:true
                        });
                    }else{
                        this.scroll.refresh();
                    }
                });
            }
            return show;
        }
    },
    methods:{
        drop(el){//当触发drop方法时小球开始掉落，接收到点击按钮的元素
                    
            for(let i=0;i<this.balls.length;i++){
                let ball=this.balls[i];
                if(!ball.show){
                    ball.show=true; //将小球设置为显示
                    ball.el=el;     //将cartControl传过来的对象挂载到ball的el属性上
                    this.dropBalls.push(ball);//点击按钮加号，就把这个下降的球放进下降球数组中
                    return;          //结束循环和函数，不会让后面的循环执行了
                }
            }
        },
        beforeEnter(els){//动画进入前,<transition>中声明的钩子触发，自带当前类名为ball的元素
        //这个函数目的：让将要移动的小球位置移动到起点
            let count=this.balls.length;
            while(count--){
                let ball=this.balls[count];
                if(ball.show){  //如果ball.show=true，那么ball就有ball.el这个属性
                    let rect=ball.el.getBoundingClientRect();//获取某个元素相对视窗位置的方法
                    let x=rect.left-32;      //获取移动到终点的水平距离
                    let y=-(window.innerHeight-rect.bottom-22);  ////获取移动到起点的垂直距离，因为起点始终在终点上面，所以为负
                
                    //动画进入前，要将小圆点的位置移动到起点（也就是按钮点击位置）
                    els.style.display='block';
                    //外层元素垂直向上移动到起点
                    els.style.webkitTransform=`translate3d(0,${y}px,0)`;
                    els.style.tranform=`translate3d(0,${y}px,0)`;

                    //里层元素水平向右移动起点
                    let inner=els.getElementsByClassName('inner')[0];
                    inner.style.webkitTransform=`translate3d(${x}px,0,0)`;
                    inner.style.tranform=`translate3d(${x}px,0,0)`;
                }
            }
        },
        enter(els){//动画进入时
        //这个函数目的：移动到终点
            /* eslint-disable no-unused-vars */
            let rf=els.offsetHeight;//无作用，手动获取这个值，触发浏览器重绘

            this.$nextTick(()=>{
                //外层元素垂直运动
                els.style.webkitTransform='translate3d(0,0,0)';
                els.style.tranform='translate3d(0,0,0)';

                //里层元素水平运动
                let inner=els.getElementsByClassName('inner')[0];
                inner.style.webkitTransform='translate3d(0,0,0)';
                inner.style.tranform='translate3d(0,0,0)';
            })
        },
        afterEnter(els){//动画进入完后
         //这个函数目的：从下落数组中移出已落下的小球
            let ball=this.dropBalls.shift();
            if(ball){
                ball.show=false;
                els.style.display='none';
            }
        },
        //购物车列表的显示与隐藏
        toggleList(){
            if(!this.totalCount){
                return;
            }
            this.flod=!this.flod;
        },
        cartAdd(el){
            this.drop(el);
        },
        //清空购物车
        empty(){
            this.selectFoods.forEach((food)=>{
                food.count=0;
            });
        }
    },
    components:{
        'v-cartcontrol':cartcontrol
    }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl';

.shopcart
    position:fixed
    left:0
    bottom:0
    z-index:50
    width:100%
    height:48px
    .content
        display:flex
        background-color:#141d27
        .content-left
            flex:1
            background-color:#000
            line-height:48px
            font-size:0
            .logo-wrapper
                display:inline-block
                position:relative
                top:-10px
                margin:0 12px
                padding:6px
                width:56px
                height:56px
                box-sizing:border-box
                vertical-align:top
                border-radius:50%
                background-color:#000
                .logo
                    width:100%
                    height:100%
                    border-radius:50%
                    background-color:#2b343c
                    text-align:center
                    &.hightlight
                        background-color:#00a0dc
                        .icon-gouwuche
                            color:#fff
                    .icon-gouwuche
                        line-height:44px
                        font-size:24px
                        color:#80858a               
                .num
                    position:absolute
                    top:0
                    right:0
                    width:24px
                    height:16px
                    line-height:16px
                    font-size:9px
                    text-align:center
                    background-color:#f01414
                    color:#fff
                    box-shadown:0 4px 8px 0 rgba(0,0,0,.4)
                    border-radius:6px
                    font-weight:700
            .price
                display:inline-block
                vertical-align:top
                margin-top:12px
                line-height:24px
                padding-right:12px
                border-right:1px solid rgba(255,255,255,.1)
                box-sizing:border-box
                font-size:16px
                font-weight:700
                color:#919396
                &.hightlight
                    color:#fff
            .desc
                display:inline-block
                vertical-align:top
                padding-left:25px
                font-size:10px
                color:#8b8d90
        .content-right
            flex:0 0 105px
            width:105px
            &.payclass
                background-color:#00b43c
                .pay
                    color:#fff
            .pay
                height:48px
                line-height:48px
                vertical-align:top
                text-align:center
                color:#979a9c
                font-size:12px
                font-weight:700
    .ball-container
        .ball
            position:fixed
            left:32px
            bottom:22px
            z-index:500
            &.drop-enter-active
                transition:all .6s cubic-bezier(.19,-0.74,.71,.44)
            .inner
                width:16px
                height:16px
                border-radius:50%
                background-color:rgb(0,160,220)
                transition:all .6s linear
    .shopcart-list
        position:fixed
        bottom:48px
        left:0
        width:100%
        background-color:#fff
        z-index:-1
        &.slider-enter-active,&.slider-leave-active
            transition:all .5s ease
        &.slider-enter,&.slider-leave-to
            opacity:0
            transform:translate3d(0,100%,0)
        .list-header
            background-color:#f3f5f7
            height:40px
            padding:0 18px
            border-bottom:1px solid #dbdee1
            .title
                float:left
                height:40px
                line-height:40px
                font-weight:200
                font-size:14px
            .empty
                float:right
                height:40px
                line-height:40px
                font-size:12px
                color:rgb(0,160,220)
        .list-content
            padding:0 18px
            max-height:217px
            overflow:hidden
            .food
                height:48px
                border-1px(rgba(7,17,27,.1))
                .name
                    display:inline-block
                    height:24px
                    line-height:24px
                    margin-top:12px
                    vertical-align:top
                .price
                    float:right
                    margin-right:12px  
                    margin-top:17px
                    font-size :14px
                    color:rgb(240,20,20)
                    font-weight:700
                    .icon
                        font-size:10px
                        font-font-weight:normal
                .cartcontrol-wrapper
                    float:right  
                    margin-top:6px
.list-mask
    position:fixed
    top:0
    left:0
    width:100%
    height:100%
    z-index:40
    background-color:rgba(7,17,27,.6)
    blur:10px
    &.fade-enter-active,&fade-leave-active
        transition:all .5s ease 
    &.fade-enter,&fade-leave-to
        opacity:0;
</style>

