import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';

import userRouter from './routes/UserRoute.js';
import sellerRouter from './routes/sellerRoutes.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhook } from './controllers/orderController.js';

const app = express();
const port = process.env.PORT || 4000;

// ✅ Connect to DB & Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://greencart-umber-gamma.vercel.app',
  'https://greencart-kf31zg2e7-sakshis-projects-ac7e9add.vercel.app'
];

// ✅ Stripe webhook (MUST be before express.json)
app.post(
  '/api/order/stripe-webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// ✅ CORS should be FIRST middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Handle preflight requests (VERY IMPORTANT)
app.options('*', cors());

// ✅ Other middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Test route
app.get('/', (req, res) => {
  res.send("API is working ✅");
});

// ✅ Routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
