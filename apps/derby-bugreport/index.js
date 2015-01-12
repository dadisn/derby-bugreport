var derby = require('derby');

var app = module.exports = derby.createApp('derby-bugreport', __filename);

if (!derby.util.isProduction) global.app = app;

app.use(require('d-bootstrap'));
app.use(require('derby-debug'));
app.serverUse(module, 'derby-stylus');

app.loadViews(__dirname + '/views');
app.loadStyles(__dirname + '/styles');

app.get('/', function(page, model){
  model.set('_page.list', [{show: false, content: 'Foobar'}, {show: false, content: 'Foobar'}, {show: false, content: 'Foobar'}]);
  page.render('home');
});

