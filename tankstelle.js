//written by Ben D
//api credits: https://creativecommons.tankerkoenig.de/

buildWidget();
Script.setWidget(widget);
widget.presentSmall()


async function buildWidget() {
    let widget = new ListWidget();
    
    //assign important values
    json = await api_tanker();
    price = list(json);
    lowest = lowestprice_index(price);
    index = price.indexOf(lowest);

    const bgColor = new Color("282828");
    widget.backgroundColor = bgColor;
    
    const stack = widget.addStack();
    stack.layoutVertically();
    stack.spacing = 8;
    stack.size = new Size(130, 0);

    const bestprice = stack.addText(String("💰 " + lowest.price));
    bestprice.font = Font.mediumRoundedSystemFont(18); 
    bestprice.centerAlignText();
    bestprice.textColor = Color.white();

    if (lowest.isOpen === true) {
        const bzn = stack.addText("⌛ ist geöffnet");    
        bzn.font = Font.mediumRoundedSystemFont(11); 
        bzn.textColor = Color.white();
    } else {
        const bzn = stack.addText("⌛ hat geschlossen");    
        bzn.font = Font.mediumRoundedSystemFont(11); 
        bzn.textColor = Color.white();
    }
    

    address = lowest.street +" "+ lowest.houseNumber +", "+" "+lowest.place 
    const adrs = stack.addText("🚗 " + address);
    adrs.font = Font.mediumRoundedSystemFont(11); 
    adrs.textColor = Color.white();
    
    const brnd = stack.addText("🏭 "+lowest.brand);
    brnd.font = Font.mediumRoundedSystemFont(11); 
    brnd.textColor = Color.white();

    if (config.runsWithSiri) {
        Speech.speak("Hier ist die günstigste Tankstelle " + address);
      }
    
    return widget;
}


function list(json) {
    var price = [];
    for (let elem in json){
        if (json[elem].price != null){
            price.push(json[elem]);
        }
    }
    return price;
}

function lowestprice_index(price) {
    console.log(price)
    let smallest = price[0].price;
    let lowest = undefined;
    for (i = 1; i < price.length; i++){
        if (smallest > price[i].price) {
            smallest = price[i].price;
            lowest = price[i];
            console.log(lowest)
        } 
    }
    return lowest
}   


async function api_tanker() {
    const key = "53505577-1377-121e-25dc-fb2b1659764a"

    //lng and lat --> take while but accurate
    const location = await Location.current();
    const lng = await location.longitude;
    const lat = await location.latitude;

    const rad = 5 //radius to search for tankstellen
    const typ = "e10" //change value für diesel -> "diesel", Super -> "e5", Super E10 -> "e10"
    const url = 'https://creativecommons.tankerkoenig.de/json/list.php?lat='+lat+'&lng='+lng+'&rad='+rad+'&sort=dist&type='+typ+'&apikey='+key;
console.log(url)
    const response = new Request(url);
    const data = await response.loadJSON();

    json = data.stations;
    return json;
}