<template>
<!-- 添加进购物车加减的组件 -->
    <div class='cartcontrol'>
        <transition name='slider'>
            <div class="cart-decrease" v-show='food.count>0' @click='decreaseCart'>
                <span class='line iconfont icon-jinzhi'></span>
            </div>
        </transition>
        <div class="cart-count" v-show='food.count>0'>{{food.count}}</div>
        <div class="cart-add iconfont icon-jiahao" @click.stop='addCart'></div>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    props:{      //商品的加减都是围绕单一个商品来的，所以接收商品
        food:{
            type:Object
        }
    },
    methods:{
        addCart(event){//点击加号，就会触发这个事件---->添加count属性并赋值
            if(!this.food.count){
                Vue.set(this.food,'count',1);//通过Vue.set添加的属性才能被检测触发，会影响父组件中的food---------给这个food属性添加，就相当修改了本身food，给他添加了count
            }else{
                this.food.count++;
            }
            this.$emit('cart-add',event.target);//自定义事件，直接在父组件的模板接口上@cart-add=''就可以输出
        },
        decreaseCart(){
            this.food.count--;
        }
    }
}
</script>

<style lang="stylus" scoped>
.cartcontrol
    font-size:0
    .slider-leave-active,.slider-enter-active
        transition:all .4s
    .slider-enter,.slider-leave-to/* 点击刚起步样式，再点击隐藏结束时的样式 */
        opacity:0
        transform:translate3d(24px,0,0) rotate(180deg)
    .cart-decrease,.cart-add
        display:inline-block
        padding:6px
        .line
            line-height:24px
            font-size:24px
            color:rgb(0,160,220)
    .cart-count
        display:inline-block
        width:12px
        padding-top:6px
        line-height:24px
        vertical-align:top
        text-align:center
        font-size:10px
        color:#93999f
    .cart-add
        display:inline-block
        padding:6px
        line-height:24px
        font-size:24px
        color:rgb(0,160,220)
        
</style>