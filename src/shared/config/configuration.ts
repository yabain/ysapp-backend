
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    mongoURI: process.env.MONGO_DATABASE_URL,
  });
  