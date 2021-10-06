const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");

//create an express server application
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

//serve the css as static file
app.use(express.static(__dirname));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){

  var city = req.body.cityName;
  const myApiKey = "65c63899d7abab1433bc7a2b9185eb4f";
  var apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid="+ myApiKey+"&units=metric";

  https.get(apiEndpoint,function(httpResponse){
    if(httpResponse.statusCode == 200){

      httpResponse.on("data", function(data){
        //holding the actual data returned from the api
        var dataObj = JSON.parse(data);
        var temp = dataObj.main.temp;
        var weatherDescription = dataObj.weather[0].description;
        var icon = dataObj.weather[0].icon;
        var imgUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png";

        //building the response page
        fs.readFile(__dirname+"/weather.html","utf8",function(err,data){
          var firstIndex = data.search("<body>");
          var lastIndex = data.search("</body>");

          var heading1 = "<h1>Temprature in "+city+": "+temp+" </h1>";
          var heading3 = "<h3>"+weatherDescription+"</h3>";
          var img = "<img src='"+imgUrl+"' alt='weather icon img'>";

          var fileContent = data.slice(0,firstIndex+6) + heading1 + heading3 + img + data.slice(lastIndex,data.length);
          fs.writeFile(__dirname+"/weather.html",fileContent,"utf8",()=>{});

          res.send(fileContent);
        });
      });
    } else{
      res.sendFile(__dirname + "/notFound.html");
    }
  });
});

//Make server listen for requests on port 3000
app.listen(3000, function(){
  console.log("Express Server has started running");
});
