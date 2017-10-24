/**
 * Created by '苏萧' on 2017/7/13.
 */
const express = require('express');
const open = require('open');
const path = require('path')
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const Cookies = require('cookies');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo/es5')(session);
// const passport = require('passport');

const config = require('../../webpack.dev.config');
const api = require('./api');
// const Users = require('./model/users');

const compiler = webpack(config);
const port = 3333;
const app = express();
// const Router = express.Router();
// 结合webpack
// 将这个添加到webpack配置文件的入口里面 ?reload=true 设置浏览器是否自动刷新；
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true';
const entries = Object.keys(config.entry);
//  添加热加载信息
entries.forEach((key) => {
  config.entry[key].push(hotMiddlewareScript);
})
//  添加插件信息
if(config.plugins === undefined) {
  config.plugins = []
}

//  添加热加载插件
config.plugins.push(
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
)
app.use(WebpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  quiet: true,
  stats: { colors: true }
}));
app.use(WebpackHotMiddleware(compiler, {
  log: () => {}
}));

// 文件位置
app.use(express.static('static'));
app.use(express.static('dist'));
app.use(bodyParser.urlencoded( {extended: true}));
app.use(bodyParser.json());

// 登录验证
app.use(cookieParser()); // 使用cookie-parser插件，后续代码直接使用req.cookies
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  secret: 'leo-blog',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    path: '/'
  }
}));
/*
* 验证登录，不过passport多用于多页面验证，所以这里不适用，自己写一个中间件实现吧
app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next()
  } else {
    // res.json({ status: '02', message: '请先登录' });
    res.redirect('/sign');
  }
}
// 后台权限
 app.get('/admin', isAuthenticated, async (req, res) => {
   console.log(req.session.user);
   
  const filename = path.join(config.output.path, 'index.html')
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  })
 })
*/
 // 设置跨域访问 
app.use(cors());
/*
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  if ( req.method === 'OPTIONS' ) {
    res.send(200);
  } else {
    next();
  }
});
*/
// 设置cookie
// app.use( (req, res, next) => {
//   req.cookies = new Cookies(req, res);
//   // console.log(req.cookies.get('userInfo'))
//   req.userInfo = {};
//   if (req.cookies.get('userInfo')) {
//     try {
//       req.userInfo = JSON.parse(req.cookies.get('userInfo'));
//       // 获取当前登录用户的类型，是否是管理员
//       // Users.findById(req.userInfo._id).then(function(userInfo) {
//       //   req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
//       //   next();
//       // })
//     }catch(err){
//       console.log(err);
//     }
//   } else {
//     next();
//   }
// })

app.use('/api', api);
// Router.route('/',(req, res) => {
//   res.send('hello world')
// });
// 解决子路由刷新无法访问的问题
app.get('/*', (req, res, next) => {
  console.log(req.session);
  const filename = path.join(config.output.path, 'index.html')
  console.log(filename);
  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err)
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  })
  // res.sendFile(path.resolve(__dirname + '/../../' + filename));
});
// 连接mongodb
mongoose.Promise = global.Promise;
// 使用connect 不要使用createConnection
mongoose.connect('mongodb://localhost:27017/leoBlog', {useMongoClient: true}, (err) => {
   if (err) {
     console.log(err)
   } else {
     console.log('数据连接成功');
     app.listen(port, (err) => {
       if (err) {
         console.log(err)
       } else {
         console.log(`正在打开http://localhost:${port}...`);
         open(`http://localhost:${port}`);
       }
     })
   }
});


