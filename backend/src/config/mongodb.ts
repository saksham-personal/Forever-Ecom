import { prisma } from './db';

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("MongoDB Connected via Prisma");
  } catch (error) {
    console.error("Error connecting to MongoDB via Prisma:", error);
    process.exit(1);
  }
}

export default connectDB;
