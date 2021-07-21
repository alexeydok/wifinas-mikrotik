
const wifi=require('./ssh-face.js');

const fs = require('fs');
require('dotenv').config()

const fastify = require('fastify')({ logger: true,
https: {
key: fs.readFileSync(process.env.SSL_KEY),
     ca: fs.readFileSync(process.env.SSL_CA),
      cert: fs.readFileSync(process.env.SSL_CERT),
     requestCert: true
}

 })


fastify.get('/rwifi/wifi-clients', async (request,reply) => {
     var rwifi= new wifi ('87.238.232.77','dok','/var/node/ssh-privkey/private-dok.key');

     return await rwifi.get_hotspot_active().then( (data) => {

           return(data); delete (rwifi);

     }
     );


});

fastify.get('/rwifi/wifi-clients/:param', async (request,reply) => {
     var rwifi= new wifi ('87.238.232.77','dok','/var/node/ssh-privkey/private-dok.key');

     return await rwifi.get_hotspot_active(request.params.param).then( (data) => {

           return(data); delete (rwifi);

     }
     );


}
)
fastify.get('/rwifi/wifi-clients/:param/remove', async (request,reply) => {
     var rwifi= new wifi ('87.238.232.77','dok','/var/node/ssh-privkey/private-dok.key');

     return await rwifi.kick_hotspot_user(request.params.param).then( (data) => {

           return(data); delete (rwifi);

     }
     );

})


const start = async () => {
  try {
    await fastify.listen({port:process.env.SERV_BINDPORT, 
                          host:process.env.SERV_BINDIP})
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
