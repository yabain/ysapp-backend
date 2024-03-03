export class DateUtil
{
    static setFirstDayOfWeek(todayDate:Date,dayOfWeek)
    {
        while (todayDate.getDay() !== dayOfWeek) {
            todayDate.setDate(todayDate.getDate() + 1);
        }
    
    }
}