var countryTelData = require('country-telephone-data')

export class CountryInfo
{
    static getCountryByPhoneCode(phoneCode)
    {
        let country = countryTelData.allCountries.find((country)=>country.dialCode==phoneCode)
        return country
    }
}