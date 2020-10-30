import * as $ from "jquery"// импортировать всё из jquery в знак $
import greet from './greeter.js';
import "@/assets/css/style.css"
import json from "@/assets/js/data"// пример подключения json файла, можно писать без разширения
import back from "@/assets/img/SrQOr14iYIQ.jpg"// пример подключения фото
import model from "@models/model"
import "A/sass/main.sass"
import  "./babel"



console.log("I'm the entry point");


greet();
console.log("img "+back)


$("pre").html(json)
console.log("json: "+ json )