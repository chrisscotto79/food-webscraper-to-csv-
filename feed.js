const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');
var csvjson = require('csvjson');

function syncReadFile(filename) {
  const contents = readFileSync(filename, 'utf-8');

  const arr = contents.split(/\r?\n/);

  console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']

  return arr;
};


function main(){

  console.log('Get Price Feed start up')
  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }


  async function getPriceFeed() {
      console.log('Starting up phase 2 \n')
      var feedData = [];
    
    try {

        const path1 = "./feed.json";
        const path2 = './feed.csv'

        try {
          if (path1){fs.unlinkSync(path1);
          console.log("File removed:", path1);}
          
          if (path2){fs.unlinkSync(path2);
          console.log("File removed:", path2);}
          
          } catch (err) {
            console.log('Error/No File Found')
          }

        
        var myStringArray = [
          '108213',
          '235203',
          '322873',
          
        ];

        var arrayLength = myStringArray.length;

        var array = fs.readFileSync('productList.txt').toString().split("\n");
        

        for (i in array) {
          const siteURL = `https://gfsstore.com/products/${array[i]}/`
          
          if(array[i] === ''){
            return false
          }else{

          
          axios(siteURL)
            .then(res => {
              const htmlData = res.data
              const $ = cheerio.default.load(htmlData)
              
    
              //stock product
              var product = ''
              $('#product_main', htmlData).each((index, element) => {
                product = $(element).find('h1').text();
                return product;
                  
              }) 
    
    
              //item code
              var newCode = ''
                $('#product_details', htmlData).each((index, element) => {
                    var item_code = $(element).find('#item_code').text();
                    newCode = item_code.replace("ITEM CODE:", "");
                    return newCode;
                    
                    
                }) 
    
    
                //Stock inventory 
              var inventory = ''
              $('.item_inventory', htmlData).each((index, element) => {
                inventory = $(element).children('.item_inventory_stock_level').text();
                return inventory;
                
              }) 
    
              
              //unit price
              var price = ''
              $('.unit_container', htmlData).each((index ,element) => {
                price = $(element).children('.unit_price').text();
                return price;
              })
    
              
              //pushes the data into a dictionary
              var feed = {
                'product': product,
                'itemCode': newCode,
                'inventory': inventory,
                'price': price
              };
              feedData.push(feed);
              
              
              
              
            })
        //END OF FOR 
        }};
              sleep(5000).then(() =>{
              
              let data = JSON.stringify(feedData, null, 2);
    
              fs.writeFile('./feed.json',data, (err) => {
              if (!err) {
                console.log('Submited response');
              }
              });   
              })
              
      
        

    } catch (err) {
        console.error('err')
    }

  }

  getPriceFeed();



  const checkTime = 5000;


  function check() {
    
    setTimeout(() => {
        fs.readFile('feed.json', 'utf8', function(err, data) {
            if (err) {
                // got error reading the file, call check() again
                check();
            } else {
              
              console.log('File found!')    

              const csvData = csvjson.toCSV(data, {
          headers: 'key'
      });
    
      // Write data into csv file named college_data.csv
            fs.writeFile('./feed.csv', csvData, (err) => {
                if(err) {
                    // Do something to handle the error or just throw it
                    console.log(err); 
                    throw new Error(err);
                }
                console.log('Data stored into csv file successfully');
               
            });
              
              
              
                
            }
        });
    }, checkTime)
  }

  check();

};

module.exports = {main}



