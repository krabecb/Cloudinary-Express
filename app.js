const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;
const ejsLayouts = require('express-ejs-layouts')
const clConfig = require('./cloudinary-config')
console.log(clConfig)

const multer = require('multer')
const upload = multer()
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config(clConfig)

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(ejsLayouts)

// app.post('/single-file', upload.single('imageUpload'), function(req, res, next) {
// 	console.log(req.file) //Created by multer
// 	console.log(req.body) //Takes the rest of form data and makes it available to Express
// 	res.redirect('/')
// })

app.post('/single-file', upload.single('imageUpload'), function (req, res, next) {
let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

       streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};

async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    res.redirect('/')
}

upload(req);
});

app.get('/', (req,res)=>{
    res.render('index')
})

const server = app.listen(PORT)

server.on('listening',()=>console.log(`Listening on port: ${PORT}`))