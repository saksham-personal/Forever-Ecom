// src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();

dotenv.config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

async function connectDb() {
    try {
      await prisma.$connect(); // Connect to the database
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }
  

export {prisma, connectDB, connectDb};
