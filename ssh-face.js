const node_ssh = require('node-ssh');
const ssh = new node_ssh();

module.exports=class wifinas {

      constructor(ip,username,privkey) {
            this._ip = ip;
            this._username = username;
            this._privkey = privkey;
            this._ssh=ssh.connect({ host:this._ip, username: this._username, privateKey: this._privkey}) 
      }

     async kick_hotspot_user(user) {
           if (/\d{9}/.test(user)) {
                   return this._ssh.then(async function () {
                             return ssh.execCommand('/ip hotspot active remove [/ip hotspot active find user~"'+user+'"];:put "user removed"').then(async function(result) {
                               return(result.stdout);
                             });

                        
                   });           
           }
           if (/([0-9A-F]{2}:){5}[0-9A-F]{2}/.test(user)) {
                   return this._ssh.then(async function () {
                             return ssh.execCommand('/ip hotspot active remove [/ip hotspot active find mac-address~"'+user+'"];:put "user removed"').then(async function(result) {
                               return(result.stdout);
                             });

                        
                   });           
           }
     }

           
    
      async get_hotspot_active (param) {
        var cmd_filter = '';
        switch(true) {
          case /:/.test(param): 
             cmd_filter=' where mac-address~"' + param +'";';
             cmd_filter+=':put "Hotspot Host:"; /ip hotspot host print detail where mac-address~"' + param +'";';
             cmd_filter+=':put "Hotspot Cookies:"; /ip hotspot cookie print detail where mac-address~"' + param +'";';
             cmd_filter+=':put "DHCP Lease:"; /ip dhcp-server lease print detail where mac-address~"' + param +'";';
             cmd_filter += ':foreach id in=[/ip hotspot active find  mac-address~"'+ param +'"] do={:local user [/ip hotspot active get value-name=user  [find where .id=$id]] ;:put "---------- $user ---------";'
             cmd_filter+=':put "Log Entries:"; /log print where topics~"hotspot.*|dhcp.*" and message~$user;}'; 


             break;
   
          case /\d{3,9}/.test(param):
             cmd_filter=' where user~"' + param +'";:put "-----------------------------------------------";';

             cmd_filter += ':foreach id in=[/ip hotspot active find  user~"'+ param +'"] do={:local mac [/ip hotspot active get value-name=mac-address  [find where .id=$id]] ;:put "---------- $mac ---------";'
             cmd_filter+=':put "Hotspot Host:"; /ip hotspot host print detail where mac-address=$mac;';
             cmd_filter+=':put "Hotspot Cookies:"; /ip hotspot cookie print detail where mac-address=$mac;';
             cmd_filter+=':put "DHCP Lease:"; /ip dhcp-server lease print detail where mac-address=$mac; };';

             cmd_filter+=':put "-----------------------------------------------";';
             
             cmd_filter+=':put "Log Entries:"; /log print where topics~"hotspot.*|dhcp.*" and message~"' + param +'";'; 


             break;
         
          default : 
             console.log('no params');
             break;
         
        }
       

         return this._ssh.then(async function () {
              return ssh.execCommand(':put "Hotspot Active:"; /ip hotspot active print detail without-paging'+cmd_filter).then(async function(result) {
              return(result.stdout);
              });
      
      });      
      }

}

