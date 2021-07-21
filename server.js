
require('dotenv').config()
const nas=require('./cmd-exec.js');
const rwifi=new nas(process.env.NAS_IP, process.env.NAS_LOGIN, process.env.NAS_SSHKEY);

const fs = require('fs');

const fastify = require('fastify')({ logger: true,
https: {
key: fs.readFileSync(process.env.SSL_KEY),
     ca: fs.readFileSync(process.env.SSL_CA),
      cert: fs.readFileSync(process.env.SSL_CERT),
     requestCert: true
}

 })


fastify.get('/rwifi/wifi-clients', async (request,reply) => {

     return await rwifi.get_hotspot_active().then( (data) => { return(data);  });


});

fastify.get('/rwifi/wifi-clients/:param', async (request,reply) => {

      return await rwifi.get_hotspot_active(request.params.param).then( (data) => { return(data); });


}
);
fastify.get('/rwifi/wifi-clients/:param/remove', async (request,reply) => {

      return await rwifi.kick_hotspot_user(request.params.param).then( (data) => { return(data); });

});


const start = async () => {
  try {
    await fastify.listen({port:process.env.SERV_BINDPORT, 
                          host:process.env.SERV_BINDIP})
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
