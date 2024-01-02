var countryTelData = require('country-telephone-data')

export class CountryInfo
{
    static getCountryByPhoneCode(phoneCode)
    {
        return countryTelData.allCountries.find((country)=>country.dialCode==phoneCode);
    }
}