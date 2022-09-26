
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    mongoURI: process.env.MONGO_DATABASE_URL,

    //MOMO API
    MOMO_API_DEFAULT_UUID:process.env.MOMO_API_DEFAULT_UUID,  
    MOMO_API_PRIMARY_KEY:process.env.MOMO_API_PRIMARY_KEY,   
    MOMO_API_SECONDARY_KEY:process.env.MOMO_API_SECONDARY_KEY,  
    MOMO_API_KEY:process.env.MOMO_API_KEY,  
    MOMO_API_PATH:process.env.MOMO_API_PATH,  
    MOMO_API_MODE_ENV:process.env.MOMO_API_MODE_ENV,

    OM_API_PATH:process.env.OM_API_PATH,
    OM_API_USERNAME:process.env.OM_API_USERNAME,
    OM_API_PASSWORD:process.env.OM_API_PASSWORD,
    OM_API_CONSUMER_KEY:process.env.OM_API_CONSUMER_KEY,
    OM_API_CONSUMER_SECRET:process.env.OM_API_CONSUMER_SECRET,

  });
  