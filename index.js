const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const mongoURL = "mongodb://127.0.0.1:27017/k23-ecom-db";
mongoose.connect(mongoURL).then(() => {
    console.log("MongoDB connected");
  }).catch(err => {
    console.error("error", err);
  });

const schemaProduct = new mongoose.Schema({
    name: String,
    price: Number,
    description: String
});

const Product = mongoose.model('Product', schemaProduct);

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to API");
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products)
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.post("/products", async (req, res) => {
    const { name, price, description } = req.body;
    try{
        const newProduct = new Product({ name, price, description });
        await newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

app.listen(5050, () => {
  console.log("Server is running on port 5050");
});
