require('dotenv').config();

const mongoName: string = process.env.MONGO_NAME || '';
const mongoUser: string = process.env.MONGODB_USER || '';
const mongoPassword: string = process.env.MONGODB_PASSWORD || '';

const mongoUrl: string = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster0.zmkox.mongodb.net/${mongoName}?retryWrites=true&w=majority`;

export default mongoUrl;
