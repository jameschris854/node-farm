const fs = require('fs');
const http = require('http');
const url = require('url');
const tempOverview = fs.readFileSync('./templates/overview.html','utf-8');
const tempProducts = fs.readFileSync('./templates/productscard.html','utf-8');
const card = fs.readFileSync('./templates/card.html','utf-8')


const data = fs.readFileSync('./dev-data/data.json')
const dataObj = JSON.parse(data);
console.log(dataObj[0].image);
http.createServer((req,res)=>
{
  const replaceTemplate = function(card,dataObj)
  {
    
  let output = card.replace(/{%emoji%}/g,dataObj.image)
  output = output.replace(/{%productname%}/g,dataObj.productName)
  output = output.replace(/{%quantity%}/g,dataObj.quantity)
  output = output.replace(/{%price%}/g,dataObj.price)
  output = output.replace(/{%id%}/g,dataObj.id)
  output = output.replace(/{%vitamen%}/g,dataObj.nutrients)
  output = output.replace(/{%from%}/g,dataObj.from)
  output = output.replace(/{%description%}/g,dataObj.description)
    if(dataObj.organic == true){
      output = output.replace(/{%type%}/g,"organic!")
      output = output.replace(/{%type-class%}/g,"organic")
    }else{
      output = output.replace(/{%type%}/g,"not organic!")
      output = output.replace(/{%type-class%}/g,"not-organic")
    }
   return output
  }
    const{query,pathname} = url.parse(req.url,true)
    console.log(dataObj.length);
    if(pathname == '/' || pathname == '/overview')
        {
        res.writeHead(200,{'content-type':'text/html'});
        let cardsHtml = dataObj.map(el => replaceTemplate(card, el)).join('');

        let output = tempOverview.replace('{%productcard%}', cardsHtml);
        
        res.end(output);

        }
    else if(pathname == '/productscard')
    {
            res.writeHead(200,{'content-type':'text/html'})

      const num = query.id;
      console.log(num);
      let Productspage = replaceTemplate(tempProducts,dataObj[num])
      res.end(Productspage)
    }
    else {
        res.writeHead(404, {
          'Content-type': 'text/html',
          'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
      }   
}).listen(7000);      