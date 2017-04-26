express = require("express");
var app = express();
var server = require("http").createServer(app)
var io = require("socket.io").listen(server)

users = {
}
connections = []

server.listen(process.env.PORT || 3000);

console.log("Server online")

app.get("/", function(req, res){
    app.use(express.static('static'));
    res.sendFile(__dirname + "/client.html")
})

io.on("connection", function(socket){
    console.log(connections.push(socket).toString() + " users connected")
    cnl = connections.length - 1
    users[cnl.toString()] = [50, 50]
    io.emit('updateUsers', users)
    socket.on('updatePosServer', function(payload){
        users[payload[0].toString()][0] = payload[1]
        users[payload[0].toString()][1] = payload[2]
        console.log(users);
        io.emit("updateUsers", users)
    })
    socket.on("disconnect", function(){
        console.log(connections.indexOf(socket).toString() + " disconnected")
        delete users[connections.indexOf(socket).toString()]
        ind = connections.indexOf(socket)
        connections.splice(connections.indexOf(socket), 1)
        for(i = 0; i <= Object.keys(users).length; i++){
            console.log(i)
            console.log(ind)
            if (i > ind){
                temp = i - 1
                users[temp.toString()] = users[i.toString()]
                delete users[i.toString()]
                console.log(i)
            }
        }
        io.emit("updateIds", ind)
        io.emit("updateUsers", users)
    })
})
