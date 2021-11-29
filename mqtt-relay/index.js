const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://192.168.50.225:1883')



client.on('connect', () => {
    console.log(`connected to Server`)
    client.subscribe('adfsmarthome/+/SENSOR')
});

client.on('message', (topic, message) => {
    let mqttMessage = JSON.parse(message);
    console.log(mqttMessage)
    let id = topic.split('/')[1];
    let requestBody = {
        "sensorId": id,
        "time": mqttMessage.Time,
        "total": mqttMessage.ENERGY.Total,
        "power": mqttMessage.ENERGY.Power,
        "current": mqttMessage.ENERGY.Current,
    };
    const httpOptions =  {
        host:'https://u4u945u70c.execute-api.eu-central-1.amazonaws.com',
        path:'/prod',
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            'Content-Length': requestBody.length
        }
    } 
    let request = http.request(httpOptions, response => {
        if(response.statusCode != 200){
            console.error(`ERROR: Response ${response.statusMessage}`)
        }
        else{
            console.log('Data saved');
        }
    });
    request.write(requestBody);
});