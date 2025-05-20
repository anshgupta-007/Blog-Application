const express=require('express');
const app=express();

const db=require("./config/database.jsx");
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');
const cors= require('cors');
const blogRoutes=require("./routes/blogRoutes.jsx");
const userRoutes=require("./routes/userRoutes.jsx");

require('dotenv').config();
const PORT=process.env.PORT || 4000;

db.dbConnect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'https://blog-application-roan-three.vercel.app/',   // ← your front-end URL
  credentials: true,                 // ← enable Access-Control-Allow-Credentials
}));

app.use("/api/blogs",blogRoutes);
app.use("/api/users",userRoutes);

app.listen(PORT,()=>{
    console.log(`Server Started SuccessFully at PORT ${PORT}`);
})

app.get('/', (req, res) => {
  const title = "This is Backend Server of Blog Application website";
  res.send(`
    <html>
      <head>
        <title>Backend Server</title>
      </head>
      <body style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f9fa;">
        <h1 style="font-size: 36px; font-family: Arial, sans-serif; color: #333;">
          ${title}
        </h1>
      </body>
    </html>
  `);
});

