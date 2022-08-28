import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port: string | number = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get( "/filteredimage", async ( req: express.Request , res: express.Response ) => {
    let  image_url:string = req.query.image_url;

    if ( !image_url ) {
      return res.status(400)
                .send(`Image url is required`);
    }

    filterImageFromURL(image_url).then((filteredImage: string) => {
      res.status(200).sendFile(filteredImage, () =>{
        deleteLocalFiles([filteredImage])
      })
    },
    (error: any) => {
      res.status(422).send(`Request failed due to image content "${error}"`)
    })
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: express.Request, res:express.Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();