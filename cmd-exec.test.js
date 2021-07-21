

const wifi=require('./cmd-exec.js');
require('dotenv').config()


exec=new wifi(process.env.NAS_IP, process.env.NAS_LOGIN, process.env.NAS_SSHKEY)


test('SSH_transport.cmd_exec must return defined', () => {
   expect(async () => { return await exec.cmd_exec('/ip hotspot active print').then( (data) => {return(data)})}).toBeDefined()
});

test('wifion.get_hotspot_active must return defined', () => {
   expect(async () => {exec.get_hotspot_active().then( (data) => {console.log(data)})}).toBeDefined()
}); 




