
const axios= require('axios');
const express = require('express');
const app = express()
const cors = require('cors')

const port = process.env.PORT || 4300;
const api_key = "DM9AGOY6P9PZL50V";
const api_url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='


app.use(cors({
    origin: 'http://localhost:4200'  // Replace this with your frontend's URL
  }));

app.get('/getQuote/:symbol',(req,res) =>{
    var getQuote_URL = api_url + req.params.symbol + "&apikey=" + api_key
    console.log (getQuote_URL)

    axios.get(getQuote_URL)
        .then( respond => {
             const headerDate = respond.headers && respond.headers.date ? respond.headers.date : 'no response date';
             console.log("Status Code:" , respond.status)
             console.log('date in response header:',headerDate);

             const _quote = respond.data['Global Quote'];
             console.log("respond.data['Global Quote']: ",_quote)

             if (!_quote || !_quote['01. symbol']){
                console.log(JSON.stringify(_quote))
                return res.status(500).json({ error: `no quote of symbol ${req.params.symbol} found` });

             }
            console.log(`got quote with id: ${_quote['01. symbol']}`)

            // export interface Quote {
            //     symbol: string;               
            //     high: number;          
            //     low: number;           
            //     lastPrice: number;     
            //     volume: number;       
            //     latestTradingDay: string;  
            //     previousClose: number;       
            // }

            const Quote = {
                symbol: _quote['01. symbol'],               
                high: Number(_quote['03. high']),         
                low:  Number(_quote['04. low']),           
                lastPrice:  Number(_quote['05. price']),     
                volume: Number( _quote['06. volume']),       
                latestTradingDay:  (_quote['07. latest trading day']),  
                previousClose: Number( _quote['08. previous close']),   

            }
            console.log(Quote)
            return res.json(Quote)
             
        })
        .catch (err =>{
            console.log("error: ", err.message);
            res.status(500).json({ error: 'Failed to fetch quote data' });
        })

})


app.listen(port, () =>{
    console.log(`server is running on port ${port}`)

})

