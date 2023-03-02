async function firewallHandler(event){
    // Access the country code through geoip
    let countryCode = event.request.metadata["geoip_country_code"]

    // Do some logic here
    // In this example, if the request comes from Brazil, we add a header to the response
    if (countryCode === "BR"){
        event.addResponseHeader("test", "true");
    }

    // Then, if it comes from any other country,
    // the processing continues
    event.continue();
}

addEventListener("firewall", (event)=>event.waitUntil(firewallHandler(event)));