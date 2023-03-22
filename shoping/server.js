const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const db = require('./config/mongoose')
const Product = require("./config/product");
const Cart = require('./config/cart')
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for getting the list of products
app.get('/products', async  (req, res) => {
    // Get the search query parameter (if provided)
    const searchQuery = req.query.search || '';

    // Get the filter query parameter (if provided)
    const filterQuery = req.query.filter || '';

    // Retrieve the list of products from the database
    Product.find({},(err,products)=>{
        // Send the products back as a response
        res.json({
            products
        });
    });

});



// Define a route for adding an item to the cart
app.post('/cart', (req, res) => {
    // Add the item to the cart in the database
    Cart.find({_id:"641aca181dffe091f280b7fe"},(err,cart)=>{
        console.log(cart)
        if(cart.length > 0){
            Cart.updateOne({_id:"641aca181dffe091f280b7fe"},{$push:{ProductList: ObjectId(req.body.pid)}},  (err,cart)=>{});
        }else{
            Cart.create({ProductList: req.body.pid})
        }
    })



    // Send a success message back as a response
    res.send('Item added to cart successfully');
});

// Define a route for getting the list of items in the cart
app.get('/cart-list', (req, res) => {
    // Retrieve the list of items in the cart from the database

    Cart.find({},(err,cartItem)=>{
        // Send the products back as a response
        res.json({
            cartItem
        });
    });
});






// Define a route for the checkout process
app.post('/checkout', (req, res) => {
    // Retrieve the list of items in the cart from the database
    const cartItems = retrieveCartItems();

    // Calculate the total price of the items in the cart
    const totalPrice = calculateTotalPrice(cartItems);

    // Send a confirmation email to the customer
    sendConfirmationEmail(req.body.email, cartItems, totalPrice);

    // Clear the cart in the database
    clearCart();

    // Send a success message back as a response
    res.send('Checkout successful');
});

// Function to calculate the total price of the items in the cart
function calculateTotalPrice(cartItems) {
    // TODO: Calculate the total price of the items in the cart
    // Example: const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    return totalPrice;
}

// Function to send a confirmation email to the customer
function sendConfirmationEmail(customerEmail, cartItems, totalPrice) {
    // Create a transporter for sending the email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com', // Replace with your own Gmail address
            pass: 'yourpassword' // Replace with your own Gmail password
        }
    });

    // Set up the email options
    const mailOptions = {
        from: 'youremail@gmail.com', // Replace with your own Gmail address
        to: customerEmail,
        subject: 'Order Confirmation',
        html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <h2>Order Details:</h2>
      <ul>
        ${cartItems.map(item => `<li>${item.name}: ${item.quantity} x $${item.price.toFixed(2)}</li>`).join('')}
      </ul>
      <h2>Total Price: $${totalPrice.toFixed(2)}</h2>
    `
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}




// Define a route for getting product details by using product name or ID
app.get('/product/:productId', (req, res) => {
    // Retrieve the product details from the database
    const product = retrieveProduct(req.params.productId);

    // If the product is not found, send a 404 error
    if (!product) {
        res.status(404).send('Product not found');
        return;
    }

    // Send the product details as a response
    res.send(product);
});




app.listen(3000, () => console.log('Server started on port 3000'));
