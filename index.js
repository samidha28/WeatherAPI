//api.openweathermap.org/data/2.5/weather?q={city name}&appid=ef1bdcbe8dbc9b4aaee2c44f6437b9ea

const http = require("http");
const fs= require("fs");
var requests= require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal= (iniVal, finVal)=>{
    let temperature = iniVal.replace("{%tempVal%}", finVal.main.temp);
    temperature = temperature.replace("{%tempMin%}", finVal.main.temp_min);
    temperature = temperature.replace("{%tempMax%}", finVal.main.temp_max);
    temperature = temperature.replace("{%city%}", finVal.name);
    temperature = temperature.replace("{%country%}", finVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", finVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res)=>{
    if(req.url="/"){
       requests("https://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=30736aa80572886587ea1c203dafad1d&units=metric")
        .on("data", (chunk)=>{
            const objData= JSON.parse(chunk);
            const arrData= [objData];
            //console.log(arrData[0].main.temp);
            const realVal= arrData.map((val)=> replaceVal(homeFile, val))
            .join("");
            res.write(realVal);
            //console.log(realVal);
        })
        .on("end", (err)=>{
            if(err)
            console.log("connection closed due to errors", err);
                //console.log("end");
                res.end();
        });
    }
});

server.listen(8000, "127.0.0.1");