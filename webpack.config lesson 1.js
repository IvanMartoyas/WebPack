var path = require('path');
//для этого примера index.html я вынес в корень проекта

module.exports = {
  mode: 'development',// режим компиляции, сейчас находится в режиме разрабодки
  entry: {// entry - это точка входа, т.е. откуда будет js код и в кокой последовательности он подключится
    /* 
      main и analitycs это чанки (сборники скриптов - chunks), которые компилируются последовательно в 'bundle.js'
      также есть паттерны, сдесь если  указать входные точки main и analitycs, то
      для каждой из них создасться файл bundle.js,а так как их будет 2 с одним именем то получится ошибка.
      поэтому я перед bundle.js укажу паттерн [name] которые установит для каждого файла его имя main и analitycs и препишет к ним .bundle.js
      так получится main.bundle.js и analitycs.bundle.js
    */
    main: './assets/js/index.js',
    analitycs: './assets/js/analitycs.js'
  },
  output: {
    filename: '[name].bundle.js',// имя файла в который будут компилироваться файлы
    path: path.resolve(__dirname, 'dist')// путь по которому будет создана папка dist со скомпелированными файлами
  }
};