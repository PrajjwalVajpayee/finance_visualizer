import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/mongodb.js';
import txRoutes from './routes/transactionRoutes.js';

dotenv.config();
await connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.use(morgan('dev'));

app.get('/', (_, res) => {
    res.send('Welcome to the Finance Visualizer API');
    });
app.use('/api/transactions', txRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  API ready on http://localhost:${PORT}`));
