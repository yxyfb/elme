<template>
<!-- z商品栏组件 -->
    <div class='goods'>
        <!-- 商品导航信息栏 -->
        <div class="menu-wrapper" ref='menuWrapper'>
            <ul>                                                                 <!--如果获取的currentIndex=index,则添加上current的class名-->
                <li v-for='(item,index) in goods' :key='index' class='menu-item' :class="{'current':currentIndex===index}" @click='selectMenu(index,$event)'>
                    <span class='text'> 
                       <span v-if='item.type>0' class='icon' :class='iconArr[item.type]'></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <!-- 具体食品 -->
        <div class="foots-wrapper" ref='footsWrapper'>
            <ul>
                <li v-for='(item,index) in goods' :key='index' class='goods-title goods-title-hook'><!-- 国际通用：'-hook'只是获取，无其他意义 -->
                    <h1 class='title'>{{item.name}}</h1>
                    <ul>
                        <li @click='selectedFood(food)' v-for='(food,foodIndex) in item.foods' :key='foodIndex' class='food-item'>
                            <div class="food-icon">
                                <img width='57' height='57' :src="food.icon"/>
                            </div>
                            <div class="content">
                                <h2 class='food-name'>{{food.name}}</h2>
                                <p v-if='food.description' class="food-desc">{{food.description}}</p>
                                <div class='extra'>
                                    <span class="food-sellCount">月售{{food.sellCount}}份</span
                                    ><span class="food-rating">好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="newPrice"><i class='RMB'>￥</i>{{food.price}}</span
                                    ><span v-if='food.oldPrice' class="oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <!-- 加减按钮组件，传递当前对应的商品 -->
                                <div class="cartcontrol-wrapper">
                                    <!-- 在组件中会添加food.count属性,如果大于0则该商品选则上了 -->
                                    <v-cartcontrol :food='food'  @cart-add='cartAdd'></v-cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <!-- 底部购物车栏 -->
        <v-shopcart ref='shopcart' :select-foods='selectFoods' :delivert-price='seller.deliveryPrice' :min-price='seller.minPrice'></v-shopcart>

        <!-- 商品详情页 -->
        <v-food :food='selectFood' ref='food' @join-cart='joinCart'></v-food>
    </div>
</template>

<script>
import BScroll from 'better-scroll';
import shopcart from '@/components/shopcart/shopcart'
import cartcontrol from '@/components/cartcontrol/cartcontrol'
import food from '@/components/food/food'

const ERR_OK=0;

export default {
    props:{
        seller:{
            type:Object
        }
    },
    data(){
        return {
            goods:[],  //存放商品数据
            iconArr:[],  //存放图标class名
            listHeightArr:[], //存放每个分类的高度
            scrollY:0,      //滚动高度
            selectFood:{}  //点击的具体商品信息
        }
    },
    computed:{
        currentIndex(){//滚动时，返回当前的商品导航的下标
            for(let i=0;i<this.listHeightArr.length;i++){
                let height1=this.listHeightArr[i];
                let height2=this.listHeightArr[i+1];
                if(!height2||(this.scrollY>=height1 && this.scrollY<height2)){
                    return i;    
                }
            }
            return 0;
        },
        selectFoods(){
            let foods=[];        //每次改变都会重新计算，存放已选择的商品
            this.goods.forEach((good)=>{
                good.foods.forEach((food)=>{
                    if(food.count){ //count存在表示这个商品选择了
                        foods.push(food);
                    }
                });
            });
            return foods
        }
    },
    created(){
        this.$http.get('/api/goods').then(response=>{
            response=response.body;
            if(response.errno===ERR_OK){
                this.goods=response.data;
                this.$nextTick(()=>{     //数据获取完整后再执行
                    this._initScroll();      //滚动不出现滚动条
                    this.listHeight();
                })
                this.currentIndex;
            }
        });

        //class名，根据获取不同的type数字，来获取下标，对应图片
        this.iconArr=['decrease','discount','special','invoice','guarantee'];
    },
    methods:{
        selectMenu(index,event){  //点击商品导航，滚动到对应位置,接收点击的下标和点击事件
            let goodList=this.$refs.footsWrapper.getElementsByClassName('goods-title-hook');
            let el=goodList[index];
            this.footsScroll.scrollToElement(el,300);
        },
        _initScroll(){ //滚动不出现滚动条
            //将滚动DOM的父元素放入BScroll插件的实例中，然后再获取数据的时候触发，就可以滚动页面不出现滚动条
            this.menuScroll=new BScroll(this.$refs.menuWrapper,{
                click:true     //better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件
            });//后面{}可以传递参数

            this.footsScroll=new BScroll(this.$refs.footsWrapper,{
                click:true,
                probeType:3 //当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
            });
            this.footsScroll.on('scroll',(pos)=>{
                this.scrollY=Math.abs(Math.round(pos.y));  //获取滚动高度
            });
        },
        listHeight(){ //获取每一个分类的高度，放进这个数组
            let goodList=this.$refs.footsWrapper.getElementsByClassName('goods-title-hook');
            let listH=0; //一开始高度
            this.listHeightArr.push(listH);
            for(let i=0;i<goodList.length;i++){
                listH+=goodList[i].clientHeight;
                this.listHeightArr.push(listH);    
            }
        },
        cartAdd(el){  //接收的参数时从cartcontrol中传递过来的点击按钮的元素
           
         // dom元素更新后执行， 因此此处能正确打印出更改之后的值；
            this.$nextTick(()=>{
                //调用子组件v-shopcart的drop()函数
                this.$refs['shopcart'].drop(el);
            });
            
        },
        selectedFood(food){//点击具体商品触发的事件
             this.selectFood=food;
             this.$refs['food'].show();
        },
        joinCart(el){ //商品详细页的第一次加入购物车的动画小球飞入
            this.$nextTick(()=>{
                //调用子组件v-shopcart的drop()函数
                 this.$refs['shopcart'].drop(el);
            });
        }
    },
    components:{
        'v-shopcart':shopcart,
        'v-cartcontrol':cartcontrol,
        'v-food':food
    }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl';

.goods
    display:flex
    position:absolute
    width:100%
    top:176px
    bottom:46px
    overflow:hidden
    .menu-wrapper
        flex:0 0 80px
        width:80px
        background:#f3f5f7
        .menu-item
            display:table
            width:56px
            height:54px
            padding:0 12px
            text-align:left
            color:rgb(77,85,93)
            font-weight:200
            border-1px(rgba(7,17,27,.1))
            &.current
                position:relative
                top:-1px
                z-index:10
                background-color:#fff
            .icon
                display :inline-block
                width:12px
                height:12px
                margin-right:2px
                background-repeat :no-repeat
                background-size :100%
                vertical-align: top
                &.decrease
                    bg-image('../../assets/decrease_3')
                &.discount
                    bg-image('../../assets/discount_3')
                &.special
                    bg-image('../../assets/special_3')
                &.invoice
                    bg-image('../../assets/invoice_3')
                &.guarantee
                    bg-image('../../assets/guarantee_3')
            .text
                line-height:14px
                display: table-cell
                vertical-align: middle
                font-size:12px
    .foots-wrapper
        flex:1
        .goods-title
            width:100%
            .title
                height:26px
                line-height:26px
                padding-left:14px
                color:rgb(147,153,159)
                background-color:#f3f5f7
                border-left:1px solid #d9dde1
                font-size:12px
            .food-item
                display:flex
                margin:18px
                padding-bottom:18px
                border-1px(rgba(7,17,27,.1))
                .food-icon
                    flex:0 0 57px
                    margin-right:10px
                .content
                    flex:1
                    .food-name
                        margin-top:2px
                        font-size:14px
                        color:rgb(7,17,27)
                        line-height:14px
                    .food-desc,.extra
                        padding-top:8px
                        line-height:10px
                        color:rgb(147,153,159)
                        font-size:10px
                    .food-desc
                        line-height:12px
                    .extra
                        .food-sellCount
                            margin-right:12px
                    .price
                        padding-top:8px
                        height:24px
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
                    .cartcontrol-wrapper
                        position:absolute
                        right:0
                        bottom:19px
</style>