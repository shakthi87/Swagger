const config =require("../config")
const mysql=require('mysql2')
const pool =mysql.createPool({
      connectionLimit:20,
      host:config.mysql.host,
      user:config.mysql.user,
      password:config.mysql.password,
      database:config.mysql.database
})

pool.getConnection((error)=>{
      if(error) {
            console.log(error)
      }
      else{
            console.log("DB Connected !")
      }
})


module.exports={pool}