var derby = require('derby');
var _ = require('lodash');
var app = module.exports = derby.createApp('derby-bugreport2', __filename);

app.use(require('d-bootstrap'));
app.use(require('derby-debug'));
app.serverUse(module, 'derby-stylus');

app.loadViews(__dirname + '/views');
app.loadStyles(__dirname + '/styles');

app.get('/bugreport2', function(page, model, params, next) {
  model.fetch('foobar', function(err) {
    if(err) return next(err);
    
    model.root.add('foobar', {
      products: [
          {qty: 1}
        , {qty: 1}
        , {qty: 1}
        , {qty: 1}
        , {qty: 1}
      ]
    });

    model.set('_page.dataLocal', [
        {products: [{qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}]}
      , {products: [{qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}]}
      , {products: [{qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}]}
      , {products: [{qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}]}
      , {products: [{qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}, {qty: 1}]}      
    ]);
   
    page.render('home');
  });
});

app.proto.init = function(model) {
  var filter = model.filter('foobar', {limit: 5}, null)
  filter.ref('_page.data');
  var len = filter.get().length;

  for(var i = 0; i < len; i++) {
    model.start('_page.total.' + i, '_page.data.' + i + '.products', function(array) {
      console.log('Running reactive function on filter', array);
      return _.reduce(array, function(sum, item) {
        return sum + item.qty;
      }, 0)
    });
    model.start('_page.totalLocal.' + i, '_page.dataLocal.' + i + '.products', function(array) {
      console.log('Running reactive function on local data', array);
      return _.reduce(array, function(sum, item) {
        return sum + item.qty;
      }, 0)
    });
  }
};

app.proto.increment = function(dataIndex, productIndex, value) {
  this.model.increment('_page.data.' + dataIndex + '.products.' + productIndex + '.qty', value);
};

app.proto.incrementLocal = function(dataIndex, productIndex, value) {
  this.model.increment('_page.dataLocal.' + dataIndex + '.products.' + productIndex + '.qty', value);
};
