 //CREAZIONE DEL SERVER SOCKET IN LOCALE 
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var querystring = require('querystring');  

app.listen(9999);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// SALVO I DATI DEL FILE PHP
var message = new Array;

// SALVO I DATI DEL SOCKET ID
var socketID;




var http = require('http'); 



// CONNESSIONE AL CLIENT

io.sockets.on('connection', function (socket) {
	
		var socketID = socket.id;
		var online_status = {'socketid': socketID, 'online' : 0};
	
		
		socket.on('disconnect', function () {
			console. log("disconnessione"+socket.id);
			
			var onlinedata = querystring.stringify(online_status); 
			
			  console.log('onlinedata='+onlinedata);
			  
			  var options = {  
				   host: 'trinity.micc.unifi.it',   
				   port: 80,   
				   path: '/ollie/ollie_php/update_online_status.php',
				   method: 'POST',
				   headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': onlinedata.length
				   }
			  };
				console.log('risposta'+onlinedata);
				
			  var req = http.request(options, function(res) {
			  	res.setEncoding('utf8');
				console.log('in req');
				
				res.on('data', function (){ 
					
						console.log('che cazzo'+req);
			  			socket.broadcast.emit('user_disconnected', socketID);
			  	});
			  
    		
 		 	  });
 		 	  req.write(onlinedata);
			  req.end();
		});
		
		
		//INVIO DATI CARICATI AL CLIENT DEL PROFILO
		socket.emit('profile_data', message);
		//INVIO ID SOCKET AL CLIENT
		socket.emit('socketID', socketID);
	
		//RICEZIONE DATI GPS
			socket.on('update_user_on_map', function(data){
			console.log("data fbid " + data.fbid);
			console.log("data fbname " + data.fbname);
			  
			  //RICHIESTA POST PER INVIARE I DATI AL FILE USER_POSITION_UPLOAD
			  
			  var post_data = querystring.stringify(data);
			  
			  var options = {  
				   host: 'trinity.micc.unifi.it',   
				   port: 80,   
				   path: '/ollie/ollie_php/user_position_upload.php',
				   method: 'POST',
				   headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': post_data.length
				   }
			  };
					  
			  var req = http.request(options, function(res) {
			  	res.setEncoding('utf8');

				res.on('data', function (chunk){ 
					
					//INVIO DATI CARICATI AL CLIENT DELLE POSIZIONI DEGLI UTENTI
					socket.emit('user_position_data', chunk);
					
					var socketlist = new Array();
					var json = eval(chunk);
					
					if(data.notify){	
						for( var i in json) {	
							var sockid = json[i].socketid;
							console.log("dati Json di fbname"+json[i].fbname);
							console.log("dati Json di fbid"+json[i].fbid);

							io.sockets.socket(sockid).emit('new_user',data);
							console.log(data);	
						}
					}
					
					 
						
					//console.log(chunk);		
			  	});
			  });
			  
			  
			  // SCRIVO I DATI
			  req.write(post_data);
			  req.end();
			  
			
			  
		});
		
		
		
		//CHAT
		
		socket.on('chat', function(data){
			
			console.log(data);
			
			var socketreceiver = data.receiver;
			
			var socketsender = socketID;
			
			var message = data.text;
			
			//socket.broadcast.send(data);
			
			io.sockets.socket(socketreceiver).emit('chats',{text : message, sender: socketsender});
			
		});
		
	
});





