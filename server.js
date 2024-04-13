const express= require('express');
const db = require('./mysql/db_connect');
const bodyParser= require('body-parser');
const swaggerui=require('swagger-ui-express')
const swaggerdoc=require('./swagger.json')
const user = require('./router/userRouter')
const feed=require('./router/feedRouter')
const likes=require('./router/likeRouther')
const comment=require('./router/commentRouter')
const cors =require('cors')
const app = express();


app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use('/user',user)
app.use('/feed',feed)
app.use('/likes',likes)
app.use('/comment',comment)
app.use("/files",express.static('files'))

/*const options = {
      definition:{
            openapi:"3.0.0",
            info: {
                  title: 'USER DATABASE',
                  version: '1.0.0',
                  description: '    ',
                },
            
            servers:[{
                  url:"http://localhost:5001"
            }]
              },
              apis: ['./router/userRouter.js'],
}

const SwaggerSpace = swaggerjsdoc(options)*/
app.use("/api-docs",swaggerui.serve,swaggerui.setup(swaggerdoc))

app.get('/',(req,res)=>{
      res.json({message:"API Connected"})
})

app.listen(5001,()=>{
      console.log("server is Listening")
})
module.exports=app