//Rendering for client.js
var canvas = document.getElementById("client");
var socket = io();

if (canvas.getContext){
    
    //Gets the rendering type from webgl, creates object to draw stuff on canvas
    
    var context = canvas.getContext('2d');
    
    //Animation frame updater, the script allows the animation to work on all websites
    function clearArc(x, y, radius) {
      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fill();
      context.restore();
    }
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
            return setTimeout(callback, 16);
        }
    
    //defines object for the render function
    
    var circle ={
        'x': 50,
        'y': 50,
        'radius': 20,
        'fill': "green",
        'linefill': "#222"
        
    }
    
    var users ={
    }
    
    var id = "NAN";
    
    var render = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath()
        context.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2)
        context.fillStyle = circle.fill
        context.fill()
        context.strokeStyle = circle.linefill
        context.lineWidth = 5
        context.stroke()
        for (i=0; i <= Object.keys(users).length - 1; i++){
            smallobj = users[Object.keys(users)[i]];
            context.beginPath()
            context.arc(smallobj[0], smallobj[1], circle.radius, 0, Math.PI*2)
            context.fillStyle = "red"
            context.fill()
            context.strokeStyle = "#222"
            context.lineWidth = 5
            context.stroke()
        }
        requestAnimationFrame(render)
        
    }
    render()
    var animate = function(prop, val, duration){
        var start = new Date().getTime()
        var end = start + duration
        var current = circle[prop]
        var distance = val - current
        var step = function(){
            var timestamp = new Date().getTime()
            var progress = Math.min((duration - (end - timestamp)) / duration, 1);
            circle[prop] = current + (distance * progress)
            socket.emit("updatePosServer", [id, circle.x, circle.y])
            if (progress < 1) {
                requestAnimationFrame(step)
            }
        }
        return step()
    }
    var meta = function(e){
        var distance = 150
        var prop = 'x'
        var mult = 1
        if (e.which < 37 || e.which > 40){
            return false
        }
        if (e.which == 37 || e.which == 38){
            mult = -1
        }
        if (e.which === 38 || e.which === 40) {
        prop = 'y';
        }
        return [prop, mult * distance]
    }
    document.body.addEventListener('keydown', function(e){
        var info = meta(e)
        if (info){
            e.preventDefault()
            animate(info[0], circle[info[0]] + info[1], 1000)
        }
        
    })
    document.body.addEventListener('keyup', function(e){
       var info = meta(e)
        if (info){
            e.preventDefault()
            animate(info[0], circle[info[0]], 1000)
        } 
    })
    socket.on('updateUsers', function(nuo){
        if (id == "NAN"){
            id = Object.keys(nuo).length - 1
        }
        users = nuo
        delete users[id.toString()]
    })
    socket.on("updateIds", function(idx){
        if (id > idx){
            id -= 1
        }
    })
}
