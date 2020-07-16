const express = require('express');
const mongoose = require('mongoose');
const ProductData = require('./src/model/Productdata');
const UserData = require('./src/model/user');
const jwt=require('jsonwebtoken');
const cors = require('cors');
var bodyparser = require('body-parser');
var app = new express();
app.use(cors());
app.use(bodyparser.json())

db='mongodb://localhost:27017/ProductDB'
//mongoose 
mongoose.connect(db,(err)=>
                        {
                          if(err)
                          {
                            console.log("error occurred:"+err);
                          } 
                          else
                          {
                            console.log("MongoDB SUCCESSFULLY Connected!");
                          }
                        });

function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized request')
    }
    let token=req.headers.authorization.split(' ')[1]
    if(token==='null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload=jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req.userId=payload.subject
    next()
}

app.get('/products', function(req, res) {
    res.header("Acess-Control-Allow-Origin", "*")
    res.header("Acess-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS")
    ProductData.find()
        .then(function(products) {
            res.send(products);
        });
});
app.post('/insert',verifyToken, function(req, res) {
    res.header("Acess-Control-Allow-Origin", "*")
    res.header("Acess-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    console.log(req.body);

    var product = {
        productId: req.body.product.productId,
        productName: req.body.product.productName,
        productCode: req.body.product.productCode,
        releaseDate: req.body.product.releaseDate,
        description: req.body.product.description,
        price: req.body.product.price,
        starRating: req.body.product.starRating,
        imageUrl: req.body.product.imageUrl,
    }
    var product = new ProductData(product);
    product.save();
});

app.post('/product', function(req, res) {
    res.header("Acess-Control-Allow-Origin", "*")
    res.header("Acess-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    const id = req.body.id;
    console.log(id);
    ProductData.findOne({ _id: id })
        .then((product) => {
            res.send(JSON.parse(JSON.stringify(product)));
        });
});

app.post('/updateproduct', function(req, res) {
    res.header("Acess-Control-Allow-Origin", "*")
    res.header("Acess-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    console.log(req.body);

    var product = {
        _id: req.body.product['_id'],
        productId: req.body.product['productId'],
        productName: req.body.product['productName'],
        productCode: req.body.product['productCode'],
        releaseDate: req.body.product['releaseDate'],
        description: req.body.product['description'],
        price: req.body.product['price'],
        starRating: req.body.product['starRating'],
        imageUrl: req.body.product['imageUrl']
    }
    ProductData.updateOne({ _id: product._id }, {
            $set: {
                productId: product.productId,
                productName: product.productName,
                productCode: product.productCode,
                releaseDate: product.releaseDate,
                description: product.description,
                price: product.price,
                starRating: product.starRating,
                imageUrl: product.imageUrl
            }

        })
        .then((product) => {
            res.send("Updated one product");
        });
});


app.post('/deleteProduct',verifyToken, function(req, res) {
    res.header("Acess-Control-Allow-Origin", "*")
    res.header("Acess-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    const id = req.body.id;
    console.log(req.body);
    ProductData.deleteOne({ _id: id })
        .then(function(products) {
            res.send('Deleted product');
        });
});

app.post('/signup', function(req, res) {
    res.header("Acess-Control-Allow-Origin", "*")
    res.header("Acess-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
//     console.log(req.body);

    var userd = {
        name: req.body.user.name,
       email: req.body.user.email,
        password: req.body.user.password,
        type:req.body.user.type
       
    }
    console.log(userd);
//     var userData = new UserData(user);
//    userData.save();

    let user=new UserData(userd)
    user.save((err,registeredUser)=>{
        if(err){
            console.error('error'+err);
        }
        else{
            let payload={subject:registeredUser._id}
            let token=jwt.sign(payload,'secretKey')

           res.status(200).send({token})
        } 
    })
});

app.post('/login', function(req, res) {
    res.header("Acess-Control-Allow-Origin", "*")
    res.header("Acess-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS");
    var email = req.body.user.email;
    var password = req.body.user.password;
    let status="invalid";
    UserData.findOne({email:email,password:password},(err,user)=>{
        if(err){
            console.error('error  '+err);
            res.send({status})
        }
        else{ 
            
            if(!user){
                console.log("err")
                res.send({status})
            
            }
        else{
            let payload={subject:user._id}
            let token=jwt.sign(payload,'secretKey')

           res.status(200).send({token})
       
        }
}

})
//     UserData.findOne({email:email,password:password},
//         (err,user)=>
//                         {
//                             console.log(user);
//                             let status=false;
                            
//                           if(err)
//                           {
                              
//                             console.log("errrrorrrr:"+err);
//                             res.send({status})
//                            }
//                           else
//                           {
//                              if(!user)
//                              {
//                                 console.log("err")
//                                 res.send({status})
//                              }
//                              else
//                              {
//                                  status=true
//                                  console.log("sccsss");
//                                  res.send({status});                            
//                              }
//                           }
//                         });
});

app.listen(6200, function() {
    console.log('listening to port 6200');

});



