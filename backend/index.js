const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
  // Load environment variables
  const jwt =require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 4000;  // Use port from environment variables or default to 4000

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// Ensure upload directory exists
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// API creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('image'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for Creating Products
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

const Product = mongoose.model("Product", productSchema);

app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product = products[products.length - 1];
            id = last_product.id + 1;
        } else {
            id = 1;
        }

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await product.save();
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Creating API for Deleting Product
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Creating API for Getting all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        res.send(products);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Schema creating for User model
const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,

    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})
// Creating EndPoint for registering user
app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found for same email id"});
    }
    let cart={};
    for (let i =0; i < 300;i++) {
        cart[i]=0;
        
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// creating endpoint for user login
app.post('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if(user){
        const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token =jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"wrong Password"});
        }
    }else{
        res.json({success:false,errors:"wrong Email Id"});
    }
});


// creating endpoint for newcollection data
app.get('/newcollections',async(req,res)=>{
    let products=await Product.find({});
    let newcollection=products.slice(1).slice(-8);
    console.log("new collection fetched");
    res.send(newcollection);
});

app.get('/popularinwomen',async(req,res)=>{
    let products=await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
});
// creting middleware to fetch user
const fetchUser=async (req,res,next)=>{
    const token=req.header('auth-token');
    if(!token){
      res.status(401).send({errors:"Please authenticate using valid"});
    }
    else{
        try {
            const data=jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate using valid"});
        }
    }
}

// creating endpoint for cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        console.log("added", req.body.itemId);
        let userData = await Users.findOne({ _id: req.user.id });
        userData.cartData[req.body.itemId] += 1;
        await Users.findByIdAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.json({ success: true, message: "Added" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// Creating endpoint for removing product from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            await Users.findByIdAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
            res.json({ success: true, message: "Removed" });
        } else {
            res.json({ success: false, message: "Item not in cart" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


// creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});