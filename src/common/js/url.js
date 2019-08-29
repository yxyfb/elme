/* 
解析url参数------http://localhost:8080/?12345&a=b#/seller
 ?id=12345&a=b就是一个店铺专属id，对应专属地址
返回一个对象 {id:12345,a:b}
*/


export function urlParse(){
    let url=window.location.search;   //获取url参数
    let obj={};
            //包含？h或&开始，包含非？和&的符号一个或多个，用等号链接，包含非？和&的符号一个或多个
    let patter=/[?&][^?&]+=[^?&]+/g; //---->第一次匹配?id=12345，接着匹配出&a=b
    let arr=url.match(patter); //match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
    //arr=['?id=12345','&a=b']
    if(arr){
        arr.forEach((item)=>{
            let tempArr=item.substring(1).split('=');//从字符串第一个下标开始获取，从等号分割----》id,12345
            let key=decodeURIComponent(tempArr[0]);//decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
            let val=decodeURIComponent(tempArr[1]);
            obj[key]=val;
        })
    }
    return obj;
   
}