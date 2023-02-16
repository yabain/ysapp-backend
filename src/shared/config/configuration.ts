export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoURI: process.env.MONGO_DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  SECRET_ENCRIPTION_ALGORITHM: process.env.SECRET_ENCRIPTION_ALGORITHM,
  SECRET_ENCRIPTION_KEY: process.env.SECRET_ENCRIPTION_KEY,
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN
});
