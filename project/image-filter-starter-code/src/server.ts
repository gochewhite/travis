import express,{ Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  app.get('/', (req, res) => {
    res.send(200)
  })
  
  
  
  app.use("/filteredimage", async (req, res) => {
    const imageUrl : string = <string>req.query.image_url;

    if (!imageUrl) {
      res.status(400).send("Image url is invalid");
    }
    try {
      const filteredimage : string = await filterImageFromURL(imageUrl);
      
      if(!filteredimage || filteredimage == null){
        res.status(422).send('invalid url');
      }
      res.status(200).sendFile(filteredimage);
      console.log(filteredimage);

      res.on("finish", () => {
        deleteLocalFiles([filteredimage]);
      });
    } catch (error) {
      console.log(error);
    }
  }); 
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();