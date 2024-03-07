const multer = require("multer")
const express =require("express")
 const router  =express.Router()
 const  path =require("path")





 const diskstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


/* The `upload` constant is an instance of the `multer` middleware. It is responsible for handling file
uploads. */
const upload = multer({
    storage: diskstorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error("Filetype is not valid"));
        }
    }
});

router.post("/upload",upload.single("file"),function(req,res,next){
   // console.log(req.file)
    res.json({"filename":req.file.filename})
})
router.get('/files/:filename', (req, res) => {
    // Specify the file path to be downloaded
    // const relativePath ="upload" 
    const filename=req.params.filename
    
    const  filePath= path.join(`${global.__basedir}/upload/${filename}`)
  //  console.log(filePath)
   
    
    // Send the file as a download attachment
    res.download(filePath, (err) => {
      if (err) {
        // Handle errors, such as the file not being found
        res.status(404).send('File not found');
      }
    });
  });
 module.exports =router