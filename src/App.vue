<template>
  <div id="app">
      <v-header :seller='seller'></v-header>
      <div class="tab">
          <div class="tab-item"><router-link to='/goods'>商品</router-link></div>
          <div class="tab-item"><router-link to='/ratings'>评论</router-link></div>
          <div class="tab-item"><router-link to='/seller'>商家</router-link></div>
      </div>
      <keep-alive>
          <router-view :seller='seller'/>
      </keep-alive>
    
  </div>
</template>

<script>
import header from '@/components/header/header'
import {urlParse} from '@/common/js/url.js'

const ERR_OK=0

export default {
  data(){
    return{
      seller:{    //seller带一个参数id
        id:(()=>{
          let queryParam=urlParse();   //通过urlParse()方法来获取到地址栏的专属id
          return queryParam.id;
        })()
      }
    }
  },
  created(){
      // GET /someUrl
      this.$http.get('/api/seller?id='+this.seller.id).then(response => {
        // get body data
        response = response.body;
        if(response.errno===ERR_OK){
         // this.seller=response.data;
        // Object.assign（）方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象
         //就可以把this.seller里的id和response.data的数据一起保存到{}中，然后再赋值给this.seller
          this.seller=Object.assign({},this.seller,response.data)
        }

      }, response => {
        // error callback
      });
  },
  components:{
    'v-header':header
  }

}
</script>

<style lang='stylus'>
@import 'common/stylus/mixin.styl'  //引入border-1px
@import "assets/iconfont/iconfont.css"

#app
  .tab
    display: flex
    width:100%
    height:40px
    line-height: 40px
    position: relative
    border:none
    border-1px(#000)
    .tab-item
      flex:1
      text-align: center
      a
        display:block
        font-size: 14px
        color:rgb(77,85,93)
      .router-link-active
        color:rgb(240,20,20)




</style>
