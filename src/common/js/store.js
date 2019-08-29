/* 数据的存储  存进去的都是json字符串*/
/* 存储的结构
seller{
    id1:{key:value},
    id2:{key:value}
}
*/

/* 存 */
export function saveToLocal(id,key,value){//id:商家的id
    let seller=window.localStorage.__seller__;   //设置一个名叫__seller__的存储空间
    if(!seller){ //如果没有seller这个对象，则给他赋值为对象
        seller={};
        seller[id]={};
    }else{ //如果已经存在在个对象，则先获取对象，然后用parse解析成最开始typeof
        seller=JSON.parse(seller);//解析（把json字符串转换成json对象）来获取
        if(!seller[id]){      
            seller[id]={};
        }
    }
    seller[id][key]=value;   //无论走哪一步，最后都是要赋值
    window.localStorage.__seller__=JSON.stringify(seller);//JSON.stringify() 方法是将一个JavaScript值(对象或者数组)转换为一个 JSON字符串
}

/* 读取 */
export function loadFromLocal(id,key,def){  //def默认值
    let seller=window.localStorage.__seller__;//获取
    if(!seller){  //如果不存在数据空间则使用默认值
        return def;
    }
    let sellerDate=JSON.parse(seller)[id];
    if(!sellerDate){      //如果不存在id对应的数据则使用默认值
        return def;
    }
    let ret=sellerDate[key];
    return ret||def;
}