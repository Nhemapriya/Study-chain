const Razorpay = require("razorpay");
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const { rpcURL,account,abi,contractAddress,private_key, } = require("../keys")

const web3 = new Web3(rpcURL)
const contract = new web3.eth.Contract(abi, contractAddress)

const RAZOR_KEY = "rzp_test_KNoCu64wQKXO55";       // TEST KEY
const RAZOR_SECRET = "vEpvJrZhB4W7bKi3kwdAKGLv";
//require('dotenv').config();
const crypto = require('crypto');


const PaymentDetailsSchema = mongoose.Schema({
  razorpayDetails: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  success: Boolean,
});

const PaymentDetails = mongoose.model('PaymentDetail', PaymentDetailsSchema);

router.post('/payment/orders', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: RAZOR_KEY, // YOUR RAZORPAY KEY
      key_secret: RAZOR_SECRET, // YOUR RAZORPAY SECRET
    });

    const options = {
      amount: 50000,
      currency: 'INR',
      receipt: 'receipt_order_74394',
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send('Some error occured');

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/payment/success', async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const shasum = crypto.createHmac('sha256', '<YOUR RAZORPAY SECRET>');
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    // if (digest !== razorpaySignature)
    //   return res.status(400).json({ msg: 'Transaction not legit!' });

    const newPayment = PaymentDetails({
      razorpayDetails: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
      success: true,
    });

    await newPayment.save();

    res.json({
      msg: 'success',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;