import mongoose from 'mongoose';
import { config as dotenvConfig } from 'dotenv';


dotenvConfig({ path: '.env' });

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

async function connectToDatabase() {
  try {
    
    await mongoose.connect(process.env.uri, clientOptions);

    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; 
  }
}

export { connectToDatabase };
