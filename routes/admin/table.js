const express=require('express');
const pool=require('../../pool');
var router=express.Router();
module.exports=router;

/**
 * 桌台相关的路由器
 * GET/admin/table
 * 获取桌台的信息
 * 返回数据[
 * {tid:xxx,tname:'xxx',status:''},
 * ]
 */
router.get('/',(req,res)=>{
    pool.query('SELECT * FROM xfn_table ORDER BY tid',(err,result)=>{
        if(err)throw err;
        res.send(result);
    })
})


/**
 * PUT /admin/settings
 * 请求数据：{appName:'XX',adminUrl:'xx',appUrl:'xx',...}
 * 修改所有的全局设置信息
 * 返回数据：
 * {code:200,msg:'settings updated succ'}
 */
router.put('/',(req,res)=>{
    pool.query('SELECT * FROM xfn_settings LIMIT 1',req.body,(err,result)=>{
        if(err)throw err;
        res.send({code:200,msg:'settings updatd succ'})
    })
        
})