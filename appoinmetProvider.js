
export default class AppointmentProvider{ 
    constructor(dataProvider){ 
        this.dataProvider = dataProvider;
    }
    async getAppointments(speciality, date, minscore) { 
        let result = await this.dataProvider.getData(speciality,date,minscore);
        return result; 
    }
}