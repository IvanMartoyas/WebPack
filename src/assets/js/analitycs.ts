import * as $ from "jquery"
import csv from "../csv/book.svg"

var clickCount: number = 0;

$(document).on("click", ()=>{
    clickCount +=1;
    console.log("clickCount " + clickCount)  
})

console.log("analitics start")
console.log("csv: ", csv)