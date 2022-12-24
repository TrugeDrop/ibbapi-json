const cheerio = require('cheerio');
const Hatlar = require("../models/hatlar");

let data = {
    hatKodu: "",
    tekYonSeferSuresi: "",
    hatTipi: "",
    tarifeBilgisi: "",
    hareketSaatleri: {
        ilkDurak: {
            adi: "",
            saatler: {
                isGunleri: [],
                cumartesi: [],
                pazar: []
            },
            gectigiDuraklar: []
        },
        sonDurak: {
            adi: "",
            saatler: {
                isGunleri: [],
                cumartesi: [],
                pazar: []
            },
            gectigiDuraklar: []
        }
    }
};

module.exports = async function getData(hkod) {
    const hat = await Hatlar.findOne({ hatKodu: hkod });
    
    if(hat) return hat.hat_bilgisi;
    
    /* --- PARSE HTML / START  --- */
    const $ = cheerio.load(await require("./fetchData")(hkod));
    
    data.hatKodu = hkod;
    $('#info > div > div > p:nth-child(2) b').html("");
    $('#info > div > div > p:nth-child(3) b').html("");
    $('#info > div > div > p:nth-child(4) b').html("");
    data.tekYonSeferSuresi = $('#info > div > div > p:nth-child(2)').text().trim();
    data.hatTipi = $('#info > div > div > p:nth-child(3)').text().trim();
    data.tarifeBilgisi = $('#info > div > div > p:nth-child(4)').text().trim();
    
    //ilkDurak
    data.hareketSaatleri.ilkDurak.adi = $("#departure > div.departure-times-body > div > div:nth-child(1) > table > thead > tr:nth-child(1) > th").text();
    
    $('#departure > div.departure-times-body > div > div:nth-child(1) > table > tbody > tr')
        .each(function(i, element){
        $(element).find("td:nth-child(1)").each(function(i, elem){
            const text = $(elem).text().trim();
            if(text === "") return;
            data.hareketSaatleri.ilkDurak.saatler.isGunleri.push(text);
        });
        $(element).find("td:nth-child(2)").each(function(i, elem){
            const text = $(elem).text().trim();
            if(text === "") return;
            data.hareketSaatleri.ilkDurak.saatler.cumartesi.push(text);
        });
        $(element).find("td:nth-child(3)").each(function(i, elem){
            const text = $(elem).text().trim();
            if(text === "") return;
            data.hareketSaatleri.ilkDurak.saatler.pazar.push(text);
        });
    });
    
    $('#stationList > div:nth-child(1) > div.line-pass-body')
        .each(function(i, element){
        const text = $(element).find("a p").text().trim();
        data.hareketSaatleri.ilkDurak.gectigiDuraklar.push(text);
    });
    
    //ilkDurak son
    
    
    //sonDurak
    data.hareketSaatleri.sonDurak.adi = $("#departure > div.departure-times-body > div > div:nth-child(2) > table > thead > tr:nth-child(1) > th").text();
    
    $('#departure > div.departure-times-body > div > div:nth-child(2) > table > tbody > tr')
        .each(function(i, element){
        $(element).find("td:nth-child(1)").each(function(i, elem){
            const text = $(elem).text().trim();
            if(text === "") return;
            data.hareketSaatleri.sonDurak.saatler.isGunleri.push(text);
        });
        $(element).find("td:nth-child(2)").each(function(i, elem){
            const text = $(elem).text().trim();
            if(text === "") return;
            data.hareketSaatleri.sonDurak.saatler.cumartesi.push(text);
        });
        $(element).find("td:nth-child(3)").each(function(i, elem){
            const text = $(elem).text().trim();
            if(text === "") return;
            data.hareketSaatleri.sonDurak.saatler.pazar.push(text);
        });
    });
    
    $('#stationList > div:nth-child(2) > div.line-pass-body')
        .each(function(i, element){
        const text = $(element).find("a p").text().trim();
        data.hareketSaatleri.sonDurak.gectigiDuraklar.push(text);
    });
    //sonDurak son
    
    /* --- PARSE HTML / END --- */
    
    const createdHat = await Hatlar.create({ hatKodu: data.hatKodu, hat_bilgisi: data });
    
    return createdHat.hat_bilgisi;
};