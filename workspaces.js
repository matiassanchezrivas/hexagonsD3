var workspaces = []

let estados = ['stopped', 'stopping', 'unhealthy', 'terminating', 'available', 'pending', 'starting']

for(var i=0; i<100; i++){
    let r = parseInt(Math.random()*7)
    workspaces.push(
      {state: estados[r]}
    )
  }
  

var statusColors =
{
    stopped: '#7f0000', // Azul
    stopping: '#8e0000', //Negro
    unhealthy: '#c62828', //Unhealthy
    terminating: '#ff5f52', //Naranja

    available: '#00b8d4', //Verde
    pending: '#0088a3', //Pending
    starting: '#62ebff' //
}
