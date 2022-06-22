const TOKEN = "OTg0MTMwNjM0OTI0NTYwNDA1.GUpGQU.mkdxEYcP0RZHpCPpJs1oeSpkN6AFBy9lYczWrE"
const { Client, Intents } = require('discord.js');
var feed = require('./feed.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const fs = require('fs');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function  checkSpaceing(){
  var data = fs.readFileSync('productList.txt', 'utf-8');
  var space = data.split('\n').filter(Boolean).join('\n');
  fs.writeFileSync('productList.txt', space, 'utf-8');
}
checkSpaceing();

function index(){
  try {
     // When the client is ready, run this code (only once)
  client.once('ready', () => {
    console.log('Ready!');
  });


  client.on('messageCreate', (message)=>{
    if(message.content ==='Doc') {
      console.log('[Sheet command activated]')
      checkSpaceing();
      feed.main();
      sleep(6000).then(()=>{
        console.log('File Sent to server')
        message.reply({
          files: ['./feed.csv']
      });
    })
  }
  if(message.content.includes('Add')){
    
    var con = (message.content);
    con = con.replace('Add', "");
    con = con.replaceAll(' ', '\n');
    const content = `${con}`

    var data = fs.readFileSync('productList.txt', 'utf-8');


    if (data.includes(con)){
      message.reply(con + ' code already is in list.')
      return
    }else{
      fs.appendFile('productList.txt',content, err => {
         if (err) {
           console.error(err)
           return
         }
       });
    checkSpaceing()
      };
       
  };

  if(message.content.includes('Sub')){
    console.log('Sub command recieved')
    var con = (message.content);
    con = con.replace('Sub ', "");
    var data = fs.readFileSync('productList.txt', 'utf-8');
    var newValue = data.replaceAll(con, '');

    fs.writeFileSync('productList.txt', newValue, 'utf-8', err =>{
      if (err){
        console.log("ERROR: Problem occured withing Sub command.")
      }else(message.reply(`Product code ${con} taken away from list.`))
    });
    checkSpaceing();
  }; 

  if(message.content.includes('List')){
    data = fs.readFileSync('productList.txt', 'utf-8');
    message.reply('Product Codes:\n' + data)
    
  }
});

  

  // Login to Discord with your client's token
  client.login(TOKEN);
  } catch (error) {
    console.log(error)
  }
 
};


index()