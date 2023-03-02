async function firewallHandler(event){
    // Access the country code through geoip
    let countryCode = event.request.metadata["geoip_country_code"]

    // Do some logic here
    // In this example, we are blocking access from Brazil
    if (countryCode === "BR"){
        event.deny();
    }

    // Then, if it comes from any other country,
    // the processing continues
    event.continue();
}

addEventListener("firewall", (event)=>event.waitUntil(firewallHandler(event)));