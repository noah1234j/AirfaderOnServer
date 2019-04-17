var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Airfader Automation Server',
  description: 'Airfader Automation Server',
  script: 'C:\\Users\\Wolt-Lenovo\\Documents\\01_workplace_william\\Airfader Power Server\\AirfaderOnServer\\startServer.cmd',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();