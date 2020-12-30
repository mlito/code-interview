import express from 'express';
import AppointmentProvider from './appoinmetProvider.js';
import FileDataProvider from './fileDataProvider.js';
import { BADQUERY } from 'dns';

let app = express();
const PORT_NUM = 3500;

let dataProvider = new FileDataProvider();
let provider = new AppointmentProvider(dataProvider);

//test enpoint
app.get('/providers', function (req, res) {
    res.send('Providers');
});

app.get('/appointments', async function (req, res) {
    try {
        let minscore = req.query.minScore;
        let date = req.query.date;
        let specialty = req.query.specialty;

        if ((!minscore) || (!date) || (!specialty)) {
            res.sendStatus(400);
        }
        else {
            let result = await provider.getAppointments(specialty, date, minscore);
            res.json(result);
        }
    }
    catch(Err){ 
        console.log("Error occured");
        res.sendStatus(400);
    }
    
})

app.listen(PORT_NUM, function () {
    console.log('Listening on port ' + PORT_NUM);
});