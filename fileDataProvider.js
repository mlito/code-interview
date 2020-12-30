
import path from 'path'
import { dirname } from 'path'; 

import fs from 'fs-extra'; 

const FILE_NAME = '/providers/providers.json';
export default class FileDataProvider{
    constructor() {
        let dirname = process.cwd();
        this.filePath = path.join(dirname,FILE_NAME);
    }
    isDateAvailable(dateToCheck,dateIntervals) { 
        let indexFound = dateIntervals.findIndex((item)=>(item['from']<=dateToCheck && item['to']>=dateToCheck));
        let result = (indexFound > -1);
        return result;
    }
    async getData(specialty,date,minscore) { 
        let jsonDataFromFile = await fs.readJson(this.filePath);
        let filteredData = jsonDataFromFile.filter(
            (d=>(d['score']>=minscore) && d["specialties"].includes(specialty) && this.isDateAvailable(date,d["availableDates"])));

        let sortedData = filteredData.sort((item1, item2)=> parseFloat(item2.score)-parseFloat(item1.score));

        let result = sortedData.map(element=>element.name);    
        return result;     
    }
}