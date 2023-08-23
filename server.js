const http = require("http");
const fs = require("fs").promises;
const path = require("path");
const { readJsonData, writeJsonData, addData, updateDataById, deleteDataById } = require("./controller/file.crud");
const { success, failure } = require("./message/message");

const FILE_NAME = "manga.json";
const APP_JSON =  { "Content-Type": "application/json" }
const dataFilePath = path.join(__dirname, "dbs", FILE_NAME);

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  try {

    if (req.url === "/getAllData" && req.method === "GET") {
      const jsonData = await readJsonData();

      res.writeHead(200, APP_JSON);
      res.end(success("data has been found",jsonData));

    }

    else if (req.url === "/addData" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      
      req.on("end", async () => {
        try {
          const receiveData = JSON.parse(body);
          if(!receiveData.stock){
           
            res.writeHead(300, APP_JSON);
            res.end(success("stock is required",receiveData));
  
          }else{
            const jsonData = await readJsonData();
            const addedJsonData = await addData(jsonData, receiveData); 
  
            res.writeHead(200, APP_JSON);
            res.end(success("data has been updated",addedJsonData));
  

          }

        

        } catch (error) {
  
          res.writeHead(400, APP_JSON);
          res.end(failure("Invalid request or data" , error));
        }
      });
    }  
    
    else if (req.url.startsWith("/updateData/") && req.method === "PUT") {
     
      const parts = req.url.split("/");
      const idToUpdate = parseInt(parts[2]); 
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          console.log(" idToUpdate", idToUpdate)

          const updatedData = JSON.parse(body);
          const jsonData = await readJsonData();

          const updatedJsonData = await updateDataById(jsonData, idToUpdate, updatedData);

          if(JSON.stringify(jsonData) !== JSON.stringify(updatedJsonData)){

          res.writeHead(200, APP_JSON);
          res.end(success("data has been updated", updatedJsonData));
          }else{
            res.writeHead(200, APP_JSON);
            res.end(success("ID was not found"));

          }
        } catch (error) {
          res.writeHead(400, APP_JSON);
          res.end(failure("Invalid request or data", error));
        }
      });
    } 
    
    else if (req.url.startsWith("/deleteData/") && req.method === "DELETE") {
      const parts = req.url.split("/");
      const idToDelete = parseInt(parts[2]); 

      try {
        const jsonData = await readJsonData();
        const updatedJsonData = await deleteDataById(jsonData, idToDelete);

        if(JSON.stringify(updatedJsonData) !== JSON.stringify(jsonData)){

          res.writeHead(200, APP_JSON);
          res.end(success("data has been deleted", updatedJsonData));
        }else{
          
        res.writeHead(200, APP_JSON);
        res.end(success("No Data With This ID Found"));
        }

      } catch (error) {
        res.writeHead(400, APP_JSON);
        res.end(failure("Invalid request or data", error));
      }
    } else {
      res.writeHead(404, APP_JSON);
      res.end(JSON.stringify({ error: "Endpoint not found" }));
    }
  } catch (err) {
    console.error("Internal server error:", err);
    res.writeHead(500, APP_JSON);
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});




server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
