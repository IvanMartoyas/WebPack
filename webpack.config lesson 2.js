const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin")// добавляю установленый плагин
const {CleanWebpackPlugin} = require("clean-webpack-plugin")// удаляет старые файлы компиляции

module.exports = {
  context: path.resolve(__dirname, "src"),// это папка в которой будет webpack искать модули и файлы для сборки, а модуль path.resolve(__dirname, нужен чтобы указать полный относительный путь (чтобы небыло ошибок с путями)
  mode: 'development',
  entry: {
    main: './assets/js/index.js',
    analitycs: './assets/js/analitycs.js',
  },
  output: {
    /*
      паттерном [contenthash] главная особенность в том что создасться main.bcfe409047cfff64dde8.js
      который при каждом изменении будет менять хэш (bcfe409047cfff64dde8) на новый, это позволит сделать так чтобы браузер не сохранял хешь в памяти
      и все обновления вэб паком сразу же появлялись на сайте.
      Так-же благодаря плагину html-webpack-plugin в dist index-ный сам будет подставлять при компиляции новый js файл с хешем в имени
      т.е. мне его бельше ненужно вписывать руками после каждого обновления.

      template - суть в том что html-webpack-plugin сам создаёт index.html и вписывает в него файлы с путями main.bcfe409047cfff64dde8.js и analitycs.80b6ea7b18cf44fde47c.js
      динамические подстваляя их, а template позволяет указать контент который я хочу записать в index.html
      в моём случае я беру его из index.html который лежит в моей в дериктории проекта
    
      clean-webpack-plugin нужен чтобы удалять страые компиляции файлов в папке dist, без него 
      всё что было обновленно компелируется в ещё один файл только с другим хешем и это засоряет папку dist
     */
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "index.html"
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    /* сам вэбпак умеет работать только с js и больше ни с чем
      чтобы пропускать через него css, sass, image, sound, и т.п. нужен loader, который настраиваестя
      в rules 

      так-же прогоняя файлы через webpack я могу в файлах делать такие команды как  @import и импортировать одни файлы в другие 
    */
    rules: [
      {
        /*
          в test я пишу регулярное выражение того что я хочу чтобы вэб пак пропускал через себя дополнительно
          ставятся слеши (/ и между ними я пишу \.css$ /), т.е. я буду дополнительно обрабатывать css
          в  use я указываю чем я буду обрабатывать сыы, но тут есть одна особенность
          плагины в use будут пропускать css файлы с права на лево т.е. снала
          css пройдет через css-loader плагин, а затем через 
        */
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        // обрабатываб изображения
        test: /\.(jpg|png|svg|gif)$/,
        use: ["file-loader"]
      },
      {
        // обрабатыват шрифт
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"]
      },
      {
        // обрабатыват xml
        test: /\.xml$/,
        use: ["xml-loader"]
      },
      {
        // обрабатыват csv
        test: /\.csv$/,
        use: ["csv-loader"]
      }
    ]
  }
};