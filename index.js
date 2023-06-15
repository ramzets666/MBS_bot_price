require('dotenv').config() 
const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()

let presenceOption = 1; 

function getPrices() {
        // API for price data.
    axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${process.env.PREFERRED_CURRENCY}&ids=${process.env.COIN_ID}`).then(res => {
        // If we  got a valid response
        if (res.data && res.data[0].current_price && res.data[0].price_change_percentage_24h) {
            let currentPrice = res.data[0].current_price || 0; // Default to zero
            let priceChange = res.data[0].price_change_percentage_24h || 0; // Default to zero
            let symbol = res.data[0].symbol || '?';
            let activityName = '';

            // Switch between presence options based on timer
            switch (presenceOption) {
      case 1:
            let arrow = priceChange > 0 ? '▲' : '▼';
            activityName = `${arrow} ${Math.abs(priceChange).toFixed(2)}% | ${symbol.toUpperCase()}`;
            presenceOption = 2;
            break;
      case 2:
            activityName = "AC Milan Monkeycup 🏆";
            presenceOption = 3;
            break;
      case 3:
            activityName = "The Qualifiers round starts!";
            presenceOption = 4;
            break;
      case 4:
            activityName = "#1: Jemyrr#5029🔥🔥🔥";
            presenceOption = 4;
            break;
}
if (presenceOption > 4) {
  presenceOption = 1;  
}

            // Update presence and username
            client.user.setPresence({
                activity: {
                    name: activityName,
                },
            });
            client.user.setUsername(`MBS ${process.env.CURRENCY_SYMBOL}${(currentPrice).toLocaleString().replace(/,/g, process.env.THOUSAND_SEPARATOR)}`);
            console.log('Updated username to', `MBS ${process.env.CURRENCY_SYMBOL}${(currentPrice).toLocaleString().replace(/,/g, process.env.THOUSAND_SEPARATOR)}`);
            console.log('Updated price to', currentPrice);
        } else {
            console.log('Could not load price data for', process.env.COIN_ID);
        }
    }).catch(err => {
        console.log('Error at api.coingecko.com data:', err);
    });
}

client.on('ready', () => {
    console.log('Logged in as', client.user.tag)

    getPrices() 
    // Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
    setInterval(getPrices, Math.max(1, process.env.MC_PING_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord
client.login(process.env.TOKEN)
