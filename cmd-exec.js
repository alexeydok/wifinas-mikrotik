const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();

class SSH_transport {
      constructor(ip,username,privkey) {
            console.debug('SSH transport initialized '+ip) 
            this._ip = ip;
            this._username = username;
            this._privkey = privkey;
      } 

      cmd_exec(cmd) { 
            console.debug('Executing '+cmd+ ' via SSH'); 

            let conn = ssh.connect({ host:this._ip, username: this._username, privateKey: this._privkey}) 
            return conn.then(
                   () =>  { 
                      console.debug('SSH Connected');
                      return ssh.execCommand(cmd).then(
                               (result) =>  { 
                                 console.debug('Command executed');
                                 return(result.stdout);
                              }
                      );
                  }
            );

      }
   

}

class cmd_exec extends SSH_transport {


     kick_hotspot_user(user) {
           if (/\d{9}/.test(user)) {

                             return this.cmd_exec('/ip hotspot active remove [/ip hotspot active find user~"'+user+'"];:put "user removed"')

                        
           }
           if (/([0-9A-F]{2}:){5}[0-9A-F]{2}/.test(user)) {

                             return this.cmd_exec('/ip hotspot active remove [/ip hotspot active find mac-address~"'+user+'"];:put "user removed"')

                        
           }
     }

           
    
      get_hotspot_active (param) {
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
       

              return this.cmd_exec(':put "Hotspot Active:"; /ip hotspot active print detail without-paging'+cmd_filter)
}
}


module.exports = cmd_exec

