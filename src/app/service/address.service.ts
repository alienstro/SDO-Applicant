import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor() { }

  region: { [id: string]: string[] } = {
    "Region I (Ilocos)": [
      "Ilocos Norte",
      "Ilocos Sur",
      "La Union",
      "Pangasinan"
    ],
    "Region II (Cagayan Valley)": [
      "Batanes",
      "Cagayan",
      "Isabela",
      "Nueva Vizcaya",
      "Quirino"
    ],
    "Region III (Central Luzon)": [
      "Bataan",
      "Bulacan",
      "Nueva Ecija",
      "Pampanga",
      "Tarlac",
      "Zambales",
      "Aurora"
    ],
    "Region IV-A (Calabarzon)": [
      "Batangas",
      "Cavite",
      "Laguna",
      "Quezon",
      "Rizal"
    ],
    "Region IV-B (Mimaropa)": [
      "Marinduque",
      "Occidental Mindoro",
      "Oriental Mindoro",
      "Palawan",
      "Romblon"
    ],
    "Region V (Bicol)": [
      "Albay",
      "Camarines Norte",
      "Camarines Sur",
      "Catanduanes",
      "Masbate",
      "Sorsogon"
    ],
    "Region VI (Western Visayas)": [
      "Aklan",
      "Antique",
      "Capiz",
      "Iloilo",
      "Negros Occidental",
      "Guimaras"
    ],
    "Region VII (Central Visayas)": [
      "Bohol",
      "Cebu",
      "Negros Oriental",
      "Siquijor"
    ],
    "Region VIII (Eastern Visayas)": [
      "Eastern Samar",
      "Leyte",
      "Northern Samar",
      "Samar (Western Samar)",
      "Southern Leyte",
      "Biliran"
    ],
    "Region IX (Zamboanga Peninsula)": [
      "Zamboanga Del Norte",
      "Zamboanga Del Sur",
      "Zamboanga Sibugay",
      "City Of Isabela"
    ],
    "Region X (Northern Mindanao)": [
      "Bukidnon",
      "Camiguin",
      "Lanao Del Norte",
      "Misamis Occidental",
      "Misamis Oriental"
    ],
    "Region XI (Davao)": [
      "Davao Del Norte",
      "Davao Del Sur",
      "Davao Oriental",
      "Compostela Valley",
      "Davao Occidental"
    ],
    "Region XII (Soccsksargen)": [
      "Cotabato (North Cotabato)",
      "South Cotabato",
      "Sultan Kudarat",
      "Sarangani",
      "Cotabato City"
    ],
    "National Capital Region (Ncr)": [
      "Ncr, City Of Manila, First District",
      "City Of Manila",
      "Ncr, Second District",
      "Ncr, Third District",
      "Ncr, Fourth District"
    ],
    "Cordillera Administrative Region (Car)": [
      "Abra",
      "Benguet",
      "Ifugao",
      "Kalinga",
      "Mountain Province",
      "Apayao"
    ],
    "Autonomous Region In Muslim Mindanao (Armm)": [
      "Basilan",
      "Lanao Del Sur",
      "Maguindanao",
      "Sulu",
      "Tawi-Tawi"
    ],
    "Region XIII (Caraga)": [
      "Agusan Del Norte",
      "Agusan Del Sur",
      "Surigao Del Norte",
      "Surigao Del Sur",
      "Dinagat Islands"
    ]
  }

  municipalities: { [id: string]: string[] } = {
    "Botolan": [
      "Bangan", "Batonlapoc", "Beneg", "Capayawan", "Carael", "Danacbunga",
      "Maguisguis", "Mambog", "Moraza", "Paco (Pob.)", "Panan", "Parel", "Paudpod",
      "Poonbato", "Porac", "San Isidro", "San Juan", "San Miguel", "Santiago",
      "Tampo (Pob.)", "Taugtog", "Villar", "Bancal", "Belbel", "Binuclutan",
      "Burgos", "Cabatuan", "Malomboy", "Nacolcol", "Owaog-Nibloc", "Palis"
    ],
    "Cabangan": [
      "Anonang", "Apo-Apo", "Arew", "Banuambayo (Pob.)", "Cadmang-Reserva",
      "Camiling (Camiing)", "Casabaan", "Dolores (Pob.)", "Del Carmen (Pob.)",
      "Laoag", "Lomboy", "Longos", "Mabanglit", "New San Juan", "San Antonio",
      "San Isidro", "San Juan (Pob.)", "San Rafael", "Santa Rita", "Santo Niño",
      "Tondo", "Felmida-Diaz"
    ],
    "Candelaria": [
      "Babancal", "Binabalian", "Catol", "Dampay", "Lauis", "Libertador",
      "Malabon (San Roque)", "Malimanga", "Pamibian", "Panayonan", "Pinagrealan",
      "Poblacion", "Sinabacan", "Taposo", "Uacon", "Yamot"
    ],
    "Castillejos": [
      "Balaybay", "Buenavista", "Del Pilar", "Looc", "Magsaysay", "Nagbayan",
      "Nagbunga", "San Agustin", "San Jose (Pob.)", "San Juan (Pob.)",
      "San Nicolas", "San Pablo (Pob.)", "San Roque", "Santa Maria"
    ],
    "Iba (Capital)": [
      "Amungan", "Zone 2 Pob. (Aypa)", "Zone 5 Pob. (Bano)", "Bangantalinga",
      "Zone 6 Pob. (Baytan)", "Zone 3 Pob. (Botlay)", "Dirita-Baloguen",
      "Zone 1 Pob. (Libaba)", "Lipay-Dingin-Panibuatan", "Palanginan (Palanguinan-Tambak)",
      "Zone 4 Pob. (Sagapan)", "San Agustin", "Santa Barbara", "Santo Rosario"
    ],
    "Masinloc": [
      "Baloganon", "Bamban", "Bani", "Collat", "Inhobol", "North Poblacion",
      "San Lorenzo", "San Salvador", "Santa Rita", "Santo Rosario", "South Poblacion",
      "Taltal", "Tapuac"
    ],
    "Olongapo City": [
      "Asinan", "Banicain", "Barreto", "East Bajac-Bajac", "East Tapinac",
      "Gordon Heights", "Kalaklan", "New Kalalake", "Mabayuan", "New Cabalan",
      "New Ilalim", "New Kababae", "Pag-Asa", "Santa Rita", "West Bajac-Bajac",
      "West Tapinac", "Old Cabalan"
    ],
    "Palauig": [
      "Alwa", "Bato", "Bulawen", "Cauyan", "Garreta", "Libaba", "Liozon", "Lipay",
      "Locloc", "Macarang", "Magalawa", "Pangolingan", "East Poblacion", "West Poblacion",
      "Salaza", "San Juan", "Santo Niño", "Santo Tomas", "Tition (San Vicente)"
    ],
    "San Antonio": [
      "Angeles", "Antipolo (Pob.)", "Burgos (Pob.)", "West Dirita", "East Dirita",
      "Luna (Pob.)", "Pundaquit", "San Esteban", "San Gregorio (Pob.)", "San Juan (Pob.)",
      "San Miguel", "San Nicolas (Pob.)", "Santiago", "Rizal"
    ],
    "San Felipe": [
      "Amagna (Pob.)", "Apostol (Pob.)", "Balincaguing", "Farañal (Pob.)", "Feria (Pob.)",
      "Maloma", "Manglicmot (Pob.)", "Rosete (Pob.)", "San Rafael", "Santo Niño", "Sindol"
    ],
    "San Marcelino": [
      "Aglao", "Buhawen", "Burgos (Pob.)", "Consuelo Norte", "Consuelo Sur (Pob.)",
      "La Paz (Pob.)", "Laoag", "Linasin", "Linusungan", "Lucero (Pob.)", "Nagbunga",
      "Rizal (Pob.)", "San Guillermo (Pob.)", "San Isidro (Pob.)", "San Rafael", "Santa Fe",
      "Central (Pob.)", "Rabanes"
    ],
    "San Narciso": [
      "Alusiis", "Beddeng", "Candelaria (Pob.)", "Dallipawen", "Grullo", "La Paz",
      "Libertad (Pob.)", "Namatacan", "Natividad (Pob.)", "Paite", "Patrocinio (Pob.)",
      "San Jose (Pob.)", "San Juan (Pob.)", "San Pascual (Pob.)", "San Rafael (Pob.)",
      "Siminublan", "Omaya"
    ],
    "Santa Cruz": [
      "Babuyan", "Bolitoc", "Bangcol", "Bayto", "Biay", "Canaynayan", "Gama",
      "Guinabon", "Guisguis", "Lipay", "Lomboy", "Lucapon North", "Lucapon South",
      "Malabago", "Naulo", "Poblacion North", "Pagatpat", "Pamonoran", "Sabang",
      "San Fernando", "Poblacion South", "Tabalong", "Tubotubo North", "Tubotubo South",
      "Bulawon"
    ],
    "Subic": [
      "Aningway Sacatihan", "Asinan Poblacion", "Asinan Proper", "Baraca-Camachile (Pob.)",
      "Batiawan", "Calapacuan", "Calapandayan (Pob.)", "Cawag", "Ilwas (Pob.)",
      "Mangan-Vaca", "Matain", "Naugsol", "Pamatawan", "San Isidro", "Santo Tomas",
      "Wawandue (Pob.)"
    ]
  };

}
