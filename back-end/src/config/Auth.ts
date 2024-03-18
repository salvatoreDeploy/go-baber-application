import 'dotenv/config'

const authConfig = {
  jwt: {
    secret: process.env.APP_SECRET ,
    expiresIn: "1d",
  },
};


export { authConfig };
