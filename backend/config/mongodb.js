import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Kết nối tới MongoDB thành công`);
  } catch (error) {
    console.error(`❌ MongoDB kết nối không thành công: ${error.message}`);
    process.exit(1);
  }
};
