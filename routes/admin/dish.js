/**
 * 菜品相关路由
 */
const express=require('express');
const pool=require('../../pool');
var router=express.Router();
module.exports=router;

/**
 * API:GET /admin/dish
 * 获取所有的菜品（按类别进行分类）
 * 返回数据：
 * [
 * {cid:1,cname:'肉类'，dishList:[{},{}...]}
 * {cid:2,cname:'菜类'，dishList:[{},{}...]}
 * ]
 */
router.get('/',(req,res)=>{
    //查询所有的菜品类别
    pool.query('SELECT cid,cname FROM xfn_category ORDER BY cid',(err,result)=>{
        if(err)throw err;
        // res.send(result);
        //循环遍历每一个菜品类别，查询该类别下有哪些菜品
        var categoryList=result;//菜品类别数组
        var finishCount = 0;//已经查询完菜品的类别的数量
        for(let c of categoryList){
            //循环查询每个类别下有哪些菜品
            pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC',c.cid,(err,result)=>{
                if(err)throw err;
                // res.send(result);
                c.dishList=result;
                //必须保证所有的类别下的菜品都查询完成才能发送响应消息——这些查询都是异步执行的
                finishCount++;
                if(finishCount==categoryList.length){
                    res.send(categoryList)
                }
            })
        }
    })
})

/**
 * POST /admin/dish/image
 * 请求参数：
 * 接收客户端上传的菜品图片 ，保存在服务器上，返回该图片在服务器上的随机文件名
 * 响应数据：
 * {code:200,msg:"upload succ",fileName:'13512873612-2342.jpg'}
 */
//引入multer中间件
const multer=require('multer');
const fs = require('fs');
var upload=multer({
    dest:'tmp/'  //指定客户端上传的文件临时存储路径
})
//定义路由，使用文件上传中间件
router.post('/image',upload.single('dishImg'),(req,res)=>{
    // console.log(req.file);//客户端上传的图片
    // console.log(req.body);//客户端随同图片提交的字符数据
    //把客户端上传的文件从临时目录转移到永久的图片路径下
    var tmpFile=req.file.path;//临时文件名
    var suffix=req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));//原始文件名中的后缀部分//substring()求子串
    var newFile=randFileName(suffix);//目标文件名
    fs.rename(tmpFile,'img/dish/'+newFile,()=>{
        res.send({code:200,msg:'upload succ',fileName:newFile})//把临时文件转移重命名
    })
    res.send({});
})
//生成一个随机文件名
//参数：suffix表示要生成的文件名中的后缀
function randFileName(suffix){
    var time=new Date().getTime();//当前系统时间戳
    var num= Math.floor(Math.random()*(10000-1000)+1000);//4位的随机数
    return time + '-' + num + suffix;
}

//min ~ max随机数：Math.random()*（max-min)+min

 /**
 * POST /admin/dish
 * 请求参数：{title:'xx',imgUrl:'...jpg',price:xx,detail:'xx',category:xx}
 * 添加一个新菜品
 * 输出消息：
 * {code:200,msg:'dish added succ',dishId:46}
 */
router.post('/',(req,res)=>{
    pool.query('INSERT INTO xfn_dish SET ?',req.body,(err,result)=>{
        res.send({code:200,msg:'dish added succ',dishId:result.insertId})//将INSERT语句产生的自增编号输出给客户端
    })
})

/**
 * DELETE /admin/dish/:did
 * 根据指定的菜品编号删除该菜品
 * 输出数据：
 * {code:200,msg:'dish deleted succ'}
 * {code:400,msg:'dish not exsits'}
 */

 /**
 * PUT /admin/dish
 * 请求参数：{did:xx,title:'xx',imgUrl:'..jpg',price:xx,detail:'xx',category:xx}
 * 根据指定的菜品编号修改菜品
 * 输出数据：
 * {code:200,msg:'dish updated succ'}
 * {code:400,msg:'dish not exsits'}
 */

