const { createWriteStream,  ReadStream } = require("node:fs");
class sortReadStream extends ReadStream {
  constructor(path, id, opt) {
    super(path, opt);
    // this.rs = undefined
    // this.readPath = path;
    // this.opt = opt
    this.id = id;
    this.curElement = undefined;
    this.numArray = [];
    this.bufferStr = "";
    this.on("error", (err) => {
       console.log(`Woops, an error. ${err}`);
      return err;
    });
   this.on("pause", () => {
      return;
    });
    this.on("end", function (){
      this.emit('end_with_id',this.id)
      
    });
    this.on("ready", function (){
      // console.log("ready");
      this.read();
    });
    this.on("data", async function (chunk) {
      this.bufferStr += chunk.toString(); //not passing encoding yet...
      if (this.bufferStr && this.bufferStr.length) {
        let bufferArr = this.bufferStr.split("\n"); 
        this.numArray = bufferArr.slice(0, bufferArr.length - 1).map(Number);
        this.bufferStr = bufferArr.at(-1);
      }
      this.pause();
      await this.extractNumber();
      
    });
    
  }
  

  async init() {
    await new Promise((resolve, reject) => {
      this.on("data", async function (chunk) {
        resolve();
      });
    });
    
  }
  getNextValue() {
    if (this.isPaused()) {
      if (this.curElement) {
        return this.curElement;
      } else {
        console.log("This should not have happened");
        return undefined;
      }
    } else {
      console.log("This should not have happened");
      return undefined;
    }
  }
  async extractNumber() {

    if (this.numArray.length) {
      this.curElement = this.numArray.shift()
    
    }
    else {
      this.resume()
    await new Promise((resolve, reject) => {
      this.endFunc = function (chunk) {  
        // console.log('Worked new END from extractNubmer')
        this.removeListener("data",this.dataFunc);
        resolve();
          resolve();}
      this.dataFunc = function (chunk) {
        // console.log('Worked new DATA from extractNubmer')
        this.removeListener("end",this.endFunc);
        resolve();
    }
      this.once("end",this.endFunc);
      this.once("data",this.dataFunc)
    return 

  })
  }
  }}

class SortStreamController {
  constructor() {
    this.nextStreamID = 0;
    this.streams = [];

  }

  async extractNumber(id) {
    const strm = this.streams.find((s) => s.stream.id === id);
    if (strm) {
      //всегда должно выполняться но оставляю на всякий случай
      await strm.stream.extractNumber();
    }
    else {
      console.log("extractNumber(id)/Woops...ID does not exist")
    }
    return
  }
  _removeStream(id) {
    const index = this.streams.findIndex((s) => s.stream.id === id);
    if (index > -1) { //!!!Вопрос, стоит ли такие проверки оставлять? Архитектура приложения подразумевает, что это буедт true всегда. 
      //condition must always be met
      this.streams.splice(index, 1); 
    }
    else{}
  }
  async sort(out_path) {
    console.log("Sort started");
    const ws = await createWriteStream(out_path, {highWaterMark:1024*1});
    ///Add condition for this.streams.length === 1 to forward all data to the WriteStream...mb never)))
    while (this.streams.length) {

      const mv = await this._getMinValue();
      if (mv) {
        let written = ws.write(mv + "\n")
        while (!written){
          await new Promise(resolve => setImmediate(()=>{
            written = ws.write(mv + "\n")
            resolve()
          }))
          }
        }
        }
    ws.end();
    ws.close();
  }
  async addStream(path) {
    const newStreamObj = {};
    const rstream = new sortReadStream(path, ++this.nextStreamID, {highWaterMark:1024*64});
    await rstream.init();
    
    rstream.once("end_with_id", (id)=>{
      this._removeStream(id)
      
    });
    newStreamObj.stream = rstream;
    this.streams.push(newStreamObj);
    return
  }
  async _getMinValue() {
    let minrsId = undefined;
    let minValue = undefined;
    for (let rs of this.streams) {
      const v = rs.stream.getNextValue();

      if (v < minValue || typeof minValue === "undefined") {
        minValue = v;
        minrsId = rs.stream.id;
      }
    }
    if (minValue) {
      await this.extractNumber(minrsId);
      return minValue;
    }
    return null;
  }
}
  
module.exports = { SortStreamController }; 