//服务器端项目的入口文件
const express = require('express')
const app = express()
const cors = require('cors')
const moment = require('moment')
app.use(cors())

//注册解析表单的body-parser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))

const mysql = require('mysql')
const conn = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'mydb_12_9'
})

//获取所有未删除英雄的API接口
app.get('/api/getheros',(req,res)=>{
    // res.send('ok')
    // res.json({name:'zs',age:22})
    //定义sql语句
    const sqlStr = 'select * from heros where isdel = 0'//0表示未删除
    conn.query(sqlStr,(err,results)=>{
        if(err)return res.json({err_code:1,message:"获取数据失败",affectedRows:0})
        res.json({err_code:0,message:results,affectedRows:0})
    })
})

//根据id更新英雄数据
app.post('/api/updatehero',(req,res)=>{
    // console.log(req.body)
    // res.send('ok')
    const sqlStr = 'update heros set ? where id = ?'
    conn.query(sqlStr,[req.body,req.body.id],(err,results)=>{
        if(err)return res.json({err_code:1,message:'更新英雄失败',affectedRows:0})
        if(results.affectedRows != 1)return res.json({err_code:1,message:'更新的英雄不存在',affectedRows:0})
        return res.json({err_code:0,message:'更新英雄成功',affectedRows:1})

    })
})

//根据id获取英雄信息
app.get('/api/gethero',(req,res)=>{
    const id = req.query.id 
    const sqlStr = 'select * from heros where id = ?'
    conn.query(sqlStr,id,(err,results)=>{
        //执行sql语句失败
        if(err)return res.json({err_code:1,message:'获取英雄失败',affectedRows:0})
        //如果对应的id的英雄不存在
        if(results.length!=1)return res.json({err_code:1,message:'英雄不存在',affectedRows:0})
        res.json({err_code:0,message:results,affectedRows:1})
    })
})

//根据id删除英雄
app.get('/api/delhero',(req,res)=>{
    const id = req.query.id 
    const sqlStr = 'update heros set isdel = 1 where id = ?'
    conn.query(sqlStr,id,(err,results)=>{
        if(err)return res.json({err_code:1,message:'删除英雄失败',affectedRows:0})
        if(results.affectedRows != 1)return res.json({err_code:1,message:'删除英雄失败',affectedRows:0})
        res.json({err_code:0,message:'删除英雄成功',affectedRows:1})
    })
})

//添加英雄
app.post('/api/addhero',(req,res)=>{
    const hero = req.body 
    //补全英雄的创建时间
    hero.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(hero)
    const sqlStr = 'insert into heros set ?'
    conn.query(sqlStr,hero,(err,results)=>{
        if(err)return res.json({err_code:1,message:'添加失败!',affectedRows:0})
        if(results.affectedRows!=1)return res.json({err_code:1,message:'添加失败!',affectedRows:0})
        res.json({err_code:0,message:'添加成功',affectedRows:results.affectedRows})
    })
})
app.listen(5000,()=>{
    console.log('Data server running at http://127.0.0.1:5000')
})