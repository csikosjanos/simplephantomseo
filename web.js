var express = require('express');
var app = express();
var expressPort = 3000;

var getContent = function(url, callback) {
  var content = '';
  // Here we spawn a phantom.js process, the first element of the 
  // array is our phantomjs script and the second e
  var phantom = require('child_process').spawn('phantomjs', ['phantom-server.js', url]);
  phantom.stdout.setEncoding('utf8');
  // Our phantom.js script is simply logging the output and
  // we access it here through stdout
  phantom.stdout.on('data', function(data) {
    content += data.toString();
  });
  phantom.on('exit', function(code) {
    if (code !== 0) {
      console.log('We have an error: '+code);
      //console.log(content);
      callback('<h1>Error #'+code+'</h1><p>'+content+'</p>');
    } else {
      // once our phantom.js script exits, let's call out call back
      // which outputs the contents to the page
      //console.log('content.length: '+content.length);
      //console.log('content: '+content);
      callback(content);
    }
  });
};

var respond = function (req, res, next) {
  //console.log('respond: '+req.query['_escaped_fragment_']);
  if (req.query['_escaped_fragment_']) {
  	// go for phantom
	url = req.protocol + '://' + req.host + (80!=expressPort?':'+expressPort:'') +
		req.path + '#' + req.query['_escaped_fragment_'];
	//console.log('phantom url: '+url);
	getContent(url, function (content) {
		//console.log('cnt.lng: '+content.length);
		res.send(content);
	});
  } else {
  	next();
  }
}

var simplelogging = function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
}

//app.get(/(.*)/, respond);
//app.use(/(.*)/, respond);

//app.use(simplelogging);
app.use(respond);
app.use(express.static(__dirname + '/public_html'));
app.listen(expressPort);
console.log('server is runing');