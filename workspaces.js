var workspaces = []

let estados = ['stopped', 'stopping', 'unhealthy', 'terminating', 'available', 'pending', 'starting']

for(var i=0; i<1000; i++){
    let r = 1+parseInt(Math.random()*6)
    workspaces.push(
      {state: estados[r]}
    )
  }

  for(var i=0; i<100; i++){
    let r = parseInt(Math.random()*2)
    if(r%2 != 0){
      workspaces.push(
        {state: estados[r]}
      )
    }
  }

  for(var i=0; i<7; i++){
    
      workspaces.push(
        {state: estados[0]}
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
