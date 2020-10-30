const path = require('path');
const HTMLWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');// минифицирует css код
const TerserPlugin = require('terser-webpack-plugin');// минифицирует js код

/*
*/
const devMode = process.env.NODE_ENV === 'development';// узнаю в каком я режиме разрабодки
const isProduction = !devMode;

// здесь настраиваем хеши для filename, в зависимости от режима разрабодки
// хешь будет в продакшене для того чтобы браузер не хешировал файл и изменения были сразу видны
const filename = ext => devMode ? `[name].${ext}` : `[name].[hash].${ext}` 

console.log("devMode "+ devMode)

// конфиг для лоадеров вынес чтобы меньше плодить кода

const cssLoaders = (preprocessor_loader) => {

  const loader = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: devMode,
        reloadAll: true
      },
    },
    "css-loader"
  ]

  if(preprocessor_loader) {
    loader.push(preprocessor_loader)
  }
  return loader
}

const optimization = () => {
  /*
  эта функция возвращает конфиг для оптимизации кода 
  для повышения производительности ряд оптимизаций будут только в продакшене

     к примеру у меня несколько файлов(чанков) к которым я подключаю одну и туже библиотеку
     чтобы она не подключалась два раза вэбпак создат файл vendor и в него запишет эту библиотеку,
    */
    const config = {
      splitChunks: {
        chunks: "all"
      }
    }
    if(isProduction) {
      config.minimizer = [
        new OptimizeCssAssetsPlugin(),
        new TerserPlugin()
      ]
    } 
  return config;
}
    

console.log("NODE_ENV (devMode) is: "+ devMode);
module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: 'development',
  entry: {
    main: ["@babel/polyfill", './assets/js/index.js'],
    analitycs: './assets/js/analitycs.js',
  },
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    /**
     * extensions это масив хранящий расширения которые будет искать вэб пак к примеру если у меня есть файл json
     * мне необязательно дописывать .json в путях, я могу добавить в масив extensions расширение .JSON и его будет 
     * искать вэбпак по умолчанию а в путях я могу его и не писать
     * если extensions: [] я сделаю пустым тогда, вэб пак не будет искать файлы по умолчанию и мне каждому файлу нужно будет писать расширения .js .png ...
     * в  extensions я могу задать какие расширения он будет искать сам 
     */
      extensions: [".js",".json",".png",".jpeg",".svg",".png",".css", ".sass"],
      alias: {
        /**
         * в алиасах я могу создать относительный путь он помогает при большой вложенности
         * чтобы путь монжно было писать так "@/assets/css/style.css", a не  ../../../../../../assets/css/csv/...clear
         * это короче и меньше шанс ошибиться
         */
        "@models": path.resolve(__dirname,"src/models"),
        "@": path.resolve(__dirname,"src"),
        "A": path.resolve(__dirname,"src/assets"),
      }
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "index.html",
      minify: {
        collapseWhitespace: isProduction // если я в продакшене, то я минифицирую html файлы  
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      /*
         при старте сервера webpack переводит все файлы в папку dist, но 
         к примеру фото нужно каждый раз копировать из src/assets/ в dist/assets/ вручную
         что неудобно и что позволяет сделать автоматически этот плагин
        Указывается папка или который нужно скопировать и потом куда
      */
      patterns: [
        { 
          from: path.resolve(__dirname, "src/assets/favicon/favicon.ico"),
          to: path.resolve(__dirname, "dist") 
        },
        { 
          from: path.resolve(__dirname, "src/assets/"),
          to: path.resolve(__dirname, "dist/assets/") 
        }

      ],
    }),
    new MiniCssExtractPlugin({
      /*
        плагин позволяет обьединять css в один файл и связать его с выбраным js файлом чанком
        также он поддерживает Hot Module Replacement  который настраивается в rules/use
      */
      filename: filename("css")
    })
  ],
  devServer: {
    // настройка webpack-dev-server, чтобы запустив webpack--watch браузер тожее обновлялсяцуи 
    port: 4200,
    hot: devMode // Hot Module Replacement 
  },
  devtool: 'source-map',
  optimization: optimization(), // оптимизация минификация файлов, загружается из возвращаемого конфига функцией 
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              /**
               * hmr это Hot Module Replacement т.е. изменения в файлах будут поялятся на странице без её перезагрузки
               * также у webpack-dev-server есть эта опция, называется только hot: true
               * я же использую  devMode это переменная которую я проинициализировал с верху в общем если я в режиме разрабодки то она true
               */
              hmr: devMode,
              reloadAll: true
            },
          },
          "css-loader"
        ]
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"]
      },
      {
        test: /\.xml$/,
        use: ["xml-loader"]
      },
      {
        test: /\.csv$/,
        use: ["csv-loader"]
      },
      {
        test: /\.s[ac]ss$/,// т.е. webpack удет обрабатывать sass и scss
        use: cssLoaders("sass-loader")
      },
      {
        /**
         * babel сомпилирует самые новые стандарты языка
         * в старый js который не отвалится про воспроезвидении его старым браузером
         * и будет работать корректно в старых браузерах
         * 
         * также у него есть пресеты (presets), т.е. это плагины, 
         * которые также можно подключають в babel.config.json
         * и компиляции js кода будет происходить через них
         * 
         * сейчас для простоты разрабодки у babel есть один стандартный присет (preset-env)
         * в нём есть все необходимы плагины для работы с самыми новыми версиями языка
         * 
         * также в package.json добаляю строчку "browserslist": "> 0.25%, not dead"
         * она означает поддержку браузеров которые не мертвы и которыми пользуются более 0.25% интернет пользователй 

          также для оддержки async await необходщимо подклюбчить полифилы
          module.exports = {
            entry: ["@babel/polyfill", "./app/js"],
          };
          
         */
        test: /\.m?js$/,
        exclude: /node_modules/,// говорим бэйбэлу чтобы он не компелировал файлы из папки node_modules
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};