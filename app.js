const STORAGE_KEYS = {
  reports: "msv24j_reports",
  resources: "msv24j_resources",
};

const seedReports = [
  {
    id: "R-2401",
    createdAt: new Date().toISOString(),
    state: "Distrito Capital",
    place: "Libertador",
    parish: "La Candelaria",
    category: "Agua",
    quantity: 80,
    priority: "Alta",
    description: "Edificio con adultos mayores sin suministro. Se requiere agua potable para 24 horas.",
    contact: "Contacto interno pendiente",
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    locationLink: "",
    channel: "WhatsApp",
    status: "En verificacion",
    evidence: "Mensaje reenviado, falta llamada.",
    verifiedBy: "",
    lat: 10.5061,
    lng: -66.9146,
  },
  {
    id: "R-2402",
    createdAt: new Date().toISOString(),
    state: "Miranda",
    place: "Plaza",
    parish: "Guarenas",
    category: "Medicinas",
    quantity: 12,
    priority: "Alta",
    description: "Pacientes cronicos requieren antihipertensivos e insulina. Confirmado por voluntario local.",
    contact: "Coordinacion medica interna",
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    locationLink: "",
    channel: "Llamada",
    status: "Verificado",
    evidence: "Llamada + foto de lista medica.",
    verifiedBy: "Voluntario local",
    lat: 10.4703,
    lng: -66.6193,
  },
];

const seedResources = [
  {
    id: "O-1001",
    type: "Inventario",
    item: "120 botellas de agua",
    location: "Chacao",
    owner: "Centro de acopio interno",
    createdAt: new Date().toISOString(),
  },
  {
    id: "O-1002",
    type: "Transporte",
    item: "Camioneta disponible despues de las 15:00",
    location: "Los Dos Caminos",
    owner: "Chofer voluntario",
    createdAt: new Date().toISOString(),
  },
];

const dataProvider = createLocalStorageDataProvider();

let reports = dataProvider.listReports();
let resources = dataProvider.listResources();
let selectedChannel = "Google Forms";
let userLocation = null;

const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");
const needForm = document.querySelector("#needForm");
const resourceForm = document.querySelector("#resourceForm");
const verificationList = document.querySelector("#verificationList");
const publicList = document.querySelector("#publicList");
const resourceList = document.querySelector("#resourceList");
const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const publicSearchInput = document.querySelector("#publicSearchInput");
const publicCategoryFilter = document.querySelector("#publicCategoryFilter");
const nearMeButton = document.querySelector("#nearMeButton");
const clearPublicFilters = document.querySelector("#clearPublicFilters");
const geoStatus = document.querySelector("#geoStatus");
const verificationNotice = document.querySelector("#verificationNotice");
const stateSelect = document.querySelector("#stateSelect");
const placeSelect = document.querySelector("#placeSelect");
const parishSelect = document.querySelector("#parishSelect");

const APPROXIMATE_COORDS = [
  { match: ["distrito capital", "caracas", "la candelaria"], lat: 10.5061, lng: -66.9146 },
  { match: ["miranda", "guarenas"], lat: 10.4703, lng: -66.6193 },
  { match: ["chacao", "los palos grandes", "los dos caminos"], lat: 10.4996, lng: -66.8522 },
  { match: ["la guaira", "macuto"], lat: 10.6016, lng: -66.8953 },
  { match: ["carabobo", "valencia"], lat: 10.1621, lng: -68.0077 },
  { match: ["aragua", "maracay"], lat: 10.2469, lng: -67.5958 },
  { match: ["lara", "barquisimeto"], lat: 10.0678, lng: -69.3474 },
  { match: ["zulia", "maracaibo"], lat: 10.6427, lng: -71.6125 },
  { match: ["merida"], lat: 8.5897, lng: -71.1561 },
  { match: ["tachira", "san cristobal"], lat: 7.7669, lng: -72.2250 },
  { match: ["trujillo"], lat: 9.3658, lng: -70.4369 },
];

const MUNICIPALITIES_BY_STATE = {
  "Amazonas": [
    "Alto Orinoco",
    "Atabapo",
    "Atures",
    "Autana",
    "Manapiare",
    "Maroa",
    "Río Negro"
  ],
  "Anzoátegui": [
    "Anaco",
    "Aragua",
    "Diego Bautista Urbaneja",
    "Fernando Peñalver",
    "Francisco Del Carmen Carvajal",
    "Francisco de Miranda",
    "General Sir Arthur McGregor",
    "Guanta",
    "Independencia",
    "José Gregorio Monagas",
    "Juan Antonio Sotillo",
    "Juan Manuel Cajigal",
    "Libertad",
    "Manuel Ezequiel Bruzual",
    "Pedro María Freites",
    "Píritu",
    "San José de Guanipa",
    "San Juan de Capistrano",
    "Santa Ana",
    "Simón Bolívar",
    "Simón Rodríguez"
  ],
  "Apure": [
    "Achaguas",
    "Biruaca",
    "Muñóz",
    "Páez",
    "Pedro Camejo",
    "Rómulo Gallegos",
    "San Fernando"
  ],
  "Aragua": [
    "Atanasio Girardot",
    "Bolívar",
    "Camatagua",
    "Francisco Linares Alcántara",
    "José Ángel Lamas",
    "José Félix Ribas",
    "José Rafael Revenga",
    "Libertador",
    "Mario Briceño Iragorry",
    "Ocumare de la Costa de Oro",
    "San Casimiro",
    "San Sebastián",
    "Santiago Mariño",
    "Santos Michelena",
    "Sucre",
    "Tovar",
    "Urdaneta",
    "Zamora"
  ],
  "Barinas": [
    "Alberto Arvelo Torrealba",
    "Andrés Eloy Blanco",
    "Antonio José de Sucre",
    "Arismendi",
    "Barinas",
    "Bolívar",
    "Cruz Paredes",
    "Ezequiel Zamora",
    "Obispos",
    "Pedraza",
    "Rojas",
    "Sosa"
  ],
  "Bolívar": [
    "Angostura (Raúl Leoni)",
    "Caroní",
    "Cedeño",
    "El Callao",
    "Gran Sabana",
    "Heres",
    "Padre Pedro Chien",
    "Piar",
    "Roscio",
    "Sifontes",
    "Sucre"
  ],
  "Carabobo": [
    "Bejuma",
    "Carlos Arvelo",
    "Diego Ibarra",
    "Guacara",
    "Juan José Mora",
    "Libertador",
    "Los Guayos",
    "Miranda",
    "Montalbán",
    "Naguanagua",
    "Puerto Cabello",
    "San Diego",
    "San Joaquín",
    "Valencia"
  ],
  "Cojedes": [
    "Anzoátegui",
    "Girardot",
    "Lima Blanco",
    "Pao de San Juan Bautista",
    "Ricaurte",
    "Rómulo Gallegos",
    "San Carlos",
    "Tinaco",
    "Tinaquillo"
  ],
  "Delta Amacuro": [
    "Antonio Díaz",
    "Casacoima",
    "Pedernales",
    "Tucupita"
  ],
  "Distrito Capital": [
    "Libertador"
  ],
  "Falcón": [
    "Acosta",
    "Bolívar",
    "Buchivacoa",
    "Cacique Manaure",
    "Carirubana",
    "Colina",
    "Dabajuro",
    "Democracia",
    "Falcón",
    "Federación",
    "Jacura",
    "José Laurencio Silva",
    "Los Taques",
    "Mauroa",
    "Miranda",
    "Monseñor Iturriza",
    "Palmasola",
    "Petit",
    "Píritu",
    "San Francisco",
    "Sucre",
    "Tocópero",
    "Unión",
    "Urumaco",
    "Zamora"
  ],
  "Guárico": [
    "Camaguán",
    "Chaguaramas",
    "El Socorro",
    "José Félix Ribas",
    "José Tadeo Monagas",
    "Juan Germán Roscio",
    "Julián Mellado",
    "Las Mercedes",
    "Leonardo Infante",
    "Ortíz",
    "Pedro Zaraza",
    "San Gerónimo de Guayabal",
    "San José de Guaribe",
    "Santa María de Ipire",
    "Sebastián Francisco de Miranda"
  ],
  "La Guaira": [
    "Vargas"
  ],
  "Lara": [
    "Andrés Eloy Blanco",
    "Crespo",
    "Iribarren",
    "Jiménez",
    "Morán",
    "Palavecino",
    "Simón Planas",
    "Torres",
    "Urdaneta"
  ],
  "Mérida": [
    "Alberto Adriani",
    "Andrés Bello",
    "Antonio Pinto Salinas",
    "Aricagua",
    "Arzobispo Chacón",
    "Campo Elías",
    "Caracciolo Parra Olmedo",
    "Cardenal Quintero",
    "Guaraque",
    "Julio César Salas",
    "Justo Briceño",
    "Libertador",
    "Miranda",
    "Obispo Ramos de Lora",
    "Padre Noguera",
    "Pueblo Llano",
    "Rangel",
    "Rivas Dávila",
    "Santos Marquina",
    "Sucre",
    "Tovar",
    "Tulio Febres Cordero",
    "Zea"
  ],
  "Miranda": [
    "Acevedo",
    "Andrés Bello",
    "Baruta",
    "Brión",
    "Buroz",
    "Carrizal",
    "Chacao",
    "Cristóbal Rojas",
    "El Hatillo",
    "Guaicaipuro",
    "Independencia",
    "Lander",
    "Los Salias",
    "Páez",
    "Paz Castillo",
    "Pedro Gual",
    "Plaza",
    "Simón Bolívar",
    "Sucre",
    "Urdaneta",
    "Zamora"
  ],
  "Monagas": [
    "Acosta",
    "Aguasay",
    "Bolívar",
    "Caripe",
    "Cedeño",
    "Ezequiel Zamora",
    "Libertador",
    "Maturín",
    "Piar",
    "Punceres",
    "Santa Bárbara",
    "Sotillo",
    "Uracoa"
  ],
  "Nueva Esparta": [
    "Antolín del Campo",
    "Arismendi",
    "Díaz",
    "García",
    "Gómez",
    "Maneiro",
    "Marcano",
    "Mariño",
    "Península de Macanao",
    "Tubores",
    "Villalba"
  ],
  "Portuguesa": [
    "Agua Blanca",
    "Araure",
    "Esteller",
    "Guanare",
    "Guanarito",
    "Monseñor José Vicente de Unda",
    "Ospino",
    "Páez",
    "Papelón",
    "San Genaro de Boconoíto",
    "San Rafael de Onoto",
    "Santa Rosalía",
    "Sucre",
    "Turén"
  ],
  "Sucre": [
    "Andrés Eloy Blanco",
    "Andrés Mata",
    "Arismendi",
    "Benítez",
    "Bermúdez",
    "Bolívar",
    "Cajigal",
    "Cruz Salmerón Acosta",
    "Libertador",
    "Mariño",
    "Mejía",
    "Montes",
    "Ribero",
    "Sucre",
    "Valdéz"
  ],
  "Táchira": [
    "Andrés Bello",
    "Antonio Rómulo Costa",
    "Ayacucho",
    "Bolívar",
    "Cárdenas",
    "Córdoba",
    "Fernández Feo",
    "Francisco de Miranda",
    "García de Hevia",
    "Guásimos",
    "Independencia",
    "Jáuregui",
    "José María Vargas",
    "Junín",
    "Libertad",
    "Libertador",
    "Lobatera",
    "Michelena",
    "Panamericano",
    "Pedro María Ureña",
    "Rafael Urdaneta",
    "Samuel Darío Maldonado",
    "San Cristóbal",
    "San Judas Tadeo",
    "Seboruco",
    "Simón Rodríguez",
    "Sucre",
    "Torbes",
    "Uribante"
  ],
  "Trujillo": [
    "Andrés Bello",
    "Boconó",
    "Bolívar",
    "Candelaria",
    "Carache",
    "Escuque",
    "José Felipe Márquez Cañizalez",
    "Juan Vicente Campos Elías",
    "La Ceiba",
    "Miranda",
    "Monte Carmelo",
    "Motatán",
    "Pampán",
    "Pampanito",
    "Rafael Rangel",
    "San Rafael de Carvajal",
    "Sucre",
    "Trujillo",
    "Urdaneta",
    "Valera"
  ],
  "Yaracuy": [
    "Arístides Bastidas",
    "Bolívar",
    "Bruzual",
    "Cocorote",
    "Independencia",
    "José Antonio Páez",
    "José Joaquín Veroes",
    "La Trinidad",
    "Manuel Monge",
    "Nirgua",
    "Peña",
    "San Felipe",
    "Sucre",
    "Urachiche"
  ],
  "Zulia": [
    "Almirante Padilla",
    "Baralt",
    "Cabimas",
    "Catatumbo",
    "Colón",
    "Francisco Javier Pulgar",
    "Jesús Enrique Losada",
    "Jesús María Semprún",
    "La Cañada de Urdaneta",
    "Lagunillas",
    "Machiques de Perijá",
    "Mara",
    "Maracaibo",
    "Miranda",
    "Páez",
    "Rosario de Perijá",
    "San Francisco",
    "Santa Rita",
    "Simón Bolívar",
    "Sucre",
    "Valmore Rodríguez"
  ]
};

const PARISHES_BY_STATE_MUNICIPALITY = {
  "Amazonas|Alto Orinoco": [
    "Alto Orinoco",
    "Huachamacare",
    "Marawaka",
    "Mavaca",
    "Sierra Parima"
  ],
  "Amazonas|Atabapo": [
    "Caname",
    "Ucata",
    "Yapacana"
  ],
  "Amazonas|Atures": [
    "Fernando Girón Tovar",
    "Luis Alberto Gómez",
    "Parhueña",
    "Platanillal"
  ],
  "Amazonas|Autana": [
    "Guayapo",
    "Munduapo",
    "Samariapo",
    "Sipapo"
  ],
  "Amazonas|Manapiare": [
    "Alto Ventuari",
    "Bajo Ventuari",
    "Medio Ventuari"
  ],
  "Amazonas|Maroa": [
    "Comunidad",
    "Victorino"
  ],
  "Amazonas|Río Negro": [
    "Casiquiare",
    "Cocuy",
    "San Carlos de Río Negro",
    "Solano"
  ],
  "Anzoátegui|Anaco": [
    "Anaco",
    "San Joaquín"
  ],
  "Anzoátegui|Aragua": [
    "Aragua de Barcelona",
    "Cachipo"
  ],
  "Anzoátegui|Diego Bautista Urbaneja": [
    "El Morro",
    "Lechería"
  ],
  "Anzoátegui|Fernando Peñalver": [
    "Puerto Píritu",
    "San Miguel",
    "Sucre"
  ],
  "Anzoátegui|Francisco Del Carmen Carvajal": [
    "Santa Bárbara",
    "Valle de Guanape"
  ],
  "Anzoátegui|Francisco de Miranda": [
    "Atapirire",
    "Boca del Pao",
    "El Pao",
    "Pariaguán"
  ],
  "Anzoátegui|General Sir Arthur McGregor": [
    "Calatrava",
    "El Chaparro",
    "Tomás Alfaro"
  ],
  "Anzoátegui|Guanta": [
    "Chorrerón",
    "Guanta"
  ],
  "Anzoátegui|Independencia": [
    "Mamo",
    "Soledad"
  ],
  "Anzoátegui|José Gregorio Monagas": [
    "Mapire",
    "Piar",
    "San Diego de Cabrutica",
    "Santa Clara",
    "Uverito",
    "Zuata"
  ],
  "Anzoátegui|Juan Antonio Sotillo": [
    "Pozuelos",
    "Puerto La Cruz"
  ],
  "Anzoátegui|Juan Manuel Cajigal": [
    "Onoto",
    "San Pablo"
  ],
  "Anzoátegui|Libertad": [
    "El Carito",
    "La Romereña",
    "San Mateo",
    "Santa Inés"
  ],
  "Anzoátegui|Manuel Ezequiel Bruzual": [
    "Clarines",
    "Guanape",
    "Sabana de Uchire"
  ],
  "Anzoátegui|Pedro María Freites": [
    "Cantaura",
    "Libertador",
    "Santa Rosa",
    "Urica"
  ],
  "Anzoátegui|Píritu": [
    "Píritu",
    "San Francisco"
  ],
  "Anzoátegui|San José de Guanipa": [
    "San José de Guanipa"
  ],
  "Anzoátegui|San Juan de Capistrano": [
    "Boca de Chávez",
    "Boca de Uchire"
  ],
  "Anzoátegui|Santa Ana": [
    "Pueblo Nuevo",
    "Santa Ana"
  ],
  "Anzoátegui|Simón Bolívar": [
    "Bergantín",
    "Caigua",
    "El Carmen",
    "El Pilar",
    "Naricual",
    "San Crsitóbal"
  ],
  "Anzoátegui|Simón Rodríguez": [
    "Edmundo Barrios",
    "Miguel Otero Silva"
  ],
  "Apure|Achaguas": [
    "Achaguas",
    "Apurito",
    "El Yagual",
    "Guachara",
    "Mucuritas",
    "Queseras del medio"
  ],
  "Apure|Biruaca": [
    "Biruaca"
  ],
  "Apure|Muñóz": [
    "Bruzual",
    "Mantecal",
    "Quintero",
    "Rincón Hondo",
    "San Vicente"
  ],
  "Apure|Páez": [
    "Aramendi",
    "El Amparo",
    "Guasdualito",
    "San Camilo",
    "Urdaneta"
  ],
  "Apure|Pedro Camejo": [
    "Codazzi",
    "Cunaviche",
    "San Juan de Payara"
  ],
  "Apure|Rómulo Gallegos": [
    "Elorza",
    "La Trinidad"
  ],
  "Apure|San Fernando": [
    "El Recreo",
    "Peñalver",
    "San Fernando",
    "San Rafael de Atamaica"
  ],
  "Aragua|Atanasio Girardot": [
    "Andrés Eloy Blanco",
    "Choroní",
    "Joaquín Crespo",
    "José Casanova Godoy",
    "Las Delicias",
    "Los Tacarigua",
    "Madre María de San José",
    "Pedro José Ovalles"
  ],
  "Aragua|Bolívar": [
    "Bolívar"
  ],
  "Aragua|Camatagua": [
    "Camatagua",
    "Carmen de Cura"
  ],
  "Aragua|Francisco Linares Alcántara": [
    "Francisco de Miranda",
    "Moseñor Feliciano González",
    "Santa Rita"
  ],
  "Aragua|José Ángel Lamas": [
    "José Ángel Lamas"
  ],
  "Aragua|José Félix Ribas": [
    "Castor Nieves Ríos",
    "José Félix Ribas",
    "Las Guacamayas",
    "Pao de Zárate",
    "Zuata"
  ],
  "Aragua|José Rafael Revenga": [
    "José Rafael Revenga"
  ],
  "Aragua|Libertador": [
    "Palo Negro",
    "San Martín de Porres"
  ],
  "Aragua|Mario Briceño Iragorry": [
    "Caña de Azúcar",
    "El Limón"
  ],
  "Aragua|Ocumare de la Costa de Oro": [
    "Ocumare de la Costa de Oro"
  ],
  "Aragua|San Casimiro": [
    "Güiripa",
    "Ollas de Caramacate",
    "San Casimiro",
    "Valle Morín"
  ],
  "Aragua|San Sebastián": [
    "San Sebastián"
  ],
  "Aragua|Santiago Mariño": [
    "Alfredo Pacheco Miranda",
    "Arevalo Aponte",
    "Chuao",
    "Samán de Güere",
    "Turmero"
  ],
  "Aragua|Santos Michelena": [
    "Santos Michelena",
    "Tiara"
  ],
  "Aragua|Sucre": [
    "Bella Vista",
    "Cagua"
  ],
  "Aragua|Tovar": [
    "Tovar"
  ],
  "Aragua|Urdaneta": [
    "Las Peñitas",
    "San Francisco de Cara",
    "Taguay",
    "Urdaneta"
  ],
  "Aragua|Zamora": [
    "Augusto Mijares",
    "Magdaleno",
    "San Francisco de Asís",
    "Valles de Tucutunemo",
    "Zamora"
  ],
  "Barinas|Alberto Arvelo Torrealba": [
    "Juan Antonio Rodríguez Domínguez",
    "Sabaneta"
  ],
  "Barinas|Andrés Eloy Blanco": [
    "El Cantón",
    "Puerto Vivas",
    "Santa Cruz de Guacas"
  ],
  "Barinas|Antonio José de Sucre": [
    "Andrés Bello",
    "Nicolás Pulido",
    "Ticoporo"
  ],
  "Barinas|Arismendi": [
    "Arismendi",
    "Guadarrama",
    "La Unión",
    "San Antonio"
  ],
  "Barinas|Barinas": [
    "Alberto Arvelo Larriva",
    "Alto Barinas",
    "Barinas",
    "Corazón de Jesús",
    "Dominga Ortiz de Páez",
    "El Carmen",
    "Juan Antonio Rodríguez Domínguez",
    "Manuel Palacio Fajardo",
    "Ramón Ignacio Méndez",
    "Rómulo Betancourt",
    "San Silvestre",
    "Santa Inés",
    "Santa Lucía",
    "Torumos"
  ],
  "Barinas|Bolívar": [
    "Altamira de Cáceres",
    "Barinitas",
    "Calderas"
  ],
  "Barinas|Cruz Paredes": [
    "Barrancas",
    "El Socorro",
    "Mazparrito"
  ],
  "Barinas|Ezequiel Zamora": [
    "José Ignacio del Pumar",
    "Pedro Briceño Méndez",
    "Ramón Ignacio Méndez",
    "Santa Bárbara"
  ],
  "Barinas|Obispos": [
    "El Real",
    "Guasimitos",
    "La Luz",
    "Obispos"
  ],
  "Barinas|Pedraza": [
    "Ciudad Bolívia",
    "José Félix Ribas",
    "José Ignacio Briceño",
    "Páez"
  ],
  "Barinas|Rojas": [
    "Dolores",
    "Libertad",
    "Palacio Fajardo",
    "Santa Rosa"
  ],
  "Barinas|Sosa": [
    "Ciudad de Nutrias",
    "El Regalo",
    "Puerto Nutrias",
    "Santa Catalina"
  ],
  "Bolívar|Angostura (Raúl Leoni)": [
    "Barceloneta",
    "Raúl Leoni",
    "San Francisco",
    "Santa Bárbara"
  ],
  "Bolívar|Caroní": [
    "5 de Julio",
    "Cachamay",
    "Chirica",
    "Dalla Costa",
    "Once de Abril",
    "Pozo Verde",
    "Simón Bolívar",
    "Unare",
    "Universidad",
    "Vista al Sol",
    "Yocoima"
  ],
  "Bolívar|Cedeño": [
    "Altagracia",
    "Ascensión Farreras",
    "Cedeño",
    "Guaniamo",
    "La Urbana",
    "Pijiguaos"
  ],
  "Bolívar|El Callao": [
    "El Callao"
  ],
  "Bolívar|Gran Sabana": [
    "Gran Sabana",
    "Ikabarú"
  ],
  "Bolívar|Heres": [
    "Agua Salada",
    "Catedral",
    "José Antonio Páez",
    "La Sabanita",
    "Marhuanta",
    "Orinoco",
    "Panapana",
    "Vista Hermosa",
    "Zea"
  ],
  "Bolívar|Padre Pedro Chien": [
    "Padre Pedro Chien"
  ],
  "Bolívar|Piar": [
    "Andrés Eloy Blanco",
    "Pedro Cova"
  ],
  "Bolívar|Roscio": [
    "Roscio",
    "Salóm"
  ],
  "Bolívar|Sifontes": [
    "Dalla Costa",
    "San Isidro",
    "Sifontes"
  ],
  "Bolívar|Sucre": [
    "Aripao",
    "Guarataro",
    "Las Majadas",
    "Moitaco",
    "Sucre"
  ],
  "Carabobo|Bejuma": [
    "Bejuma",
    "Canoabo",
    "Simón Bolívar"
  ],
  "Carabobo|Carlos Arvelo": [
    "Carabobo",
    "Güigüe",
    "Tacarigua"
  ],
  "Carabobo|Diego Ibarra": [
    "Aguas Calientes",
    "Mariara"
  ],
  "Carabobo|Guacara": [
    "Ciudad Alianza",
    "Guacara",
    "Yagua"
  ],
  "Carabobo|Juan José Mora": [
    "Morón",
    "Yagua"
  ],
  "Carabobo|Libertador": [
    "Independencia",
    "Tocuyito"
  ],
  "Carabobo|Los Guayos": [
    "Los Guayos"
  ],
  "Carabobo|Miranda": [
    "Miranda"
  ],
  "Carabobo|Montalbán": [
    "Montalbán"
  ],
  "Carabobo|Naguanagua": [
    "Naguanagua"
  ],
  "Carabobo|Puerto Cabello": [
    "Bartolomé Salóm",
    "Borburata",
    "Democracia",
    "Fraternidad",
    "Goaigoaza",
    "Juan José Flores",
    "Patanemo",
    "Unión"
  ],
  "Carabobo|San Diego": [
    "San Diego"
  ],
  "Carabobo|San Joaquín": [
    "San Joaquín"
  ],
  "Carabobo|Valencia": [
    "Candelaria",
    "Catedral",
    "El Socorro",
    "Miguel Peña",
    "Negro Primero",
    "Rafael Urdaneta",
    "San Blas",
    "San José",
    "Santa Rosa"
  ],
  "Cojedes|Anzoátegui": [
    "Cojedes",
    "Juan de Mata Suárez"
  ],
  "Cojedes|Girardot": [
    "El Baúl",
    "Sucre"
  ],
  "Cojedes|Lima Blanco": [
    "La Aguadita",
    "Macapo"
  ],
  "Cojedes|Pao de San Juan Bautista": [
    "El Pao"
  ],
  "Cojedes|Ricaurte": [
    "El Amparo",
    "Libertad de Cojedes"
  ],
  "Cojedes|Rómulo Gallegos": [
    "Rómulo Gallegos"
  ],
  "Cojedes|San Carlos": [
    "Juan Ángel Bravo",
    "Manuel Manrique",
    "San Carlos de Austria"
  ],
  "Cojedes|Tinaco": [
    "General en Jefe José Laurencio Silva"
  ],
  "Cojedes|Tinaquillo": [
    "Tinaquillo"
  ],
  "Delta Amacuro|Antonio Díaz": [
    "Almirante Luis Brión",
    "Curiapo",
    "Francisco Aniceto Lugo",
    "Manuel Renaud",
    "Padre Barral",
    "Santos de Abelgas"
  ],
  "Delta Amacuro|Casacoima": [
    "Cinco de Julio",
    "Imataca",
    "Juan Bautista Arismendi",
    "Manuel Piar",
    "Rómulo Gallegos"
  ],
  "Delta Amacuro|Pedernales": [
    "Luis Beltrán Prieto Figueroa",
    "Pedernales"
  ],
  "Delta Amacuro|Tucupita": [
    "José Vidal Marcano",
    "Juan Millán",
    "Leonardo Ruíz Pineda",
    "Mariscal Antonio José de Sucre",
    "Monseñor Argimiro García",
    "San José (Delta Amacuro)",
    "San Rafael (Delta Amacuro)",
    "Virgen del Valle"
  ],
  "Distrito Capital|Libertador": [
    "23 de enero",
    "Altagracia",
    "Antímano",
    "Caricuao",
    "Catedral",
    "Coche",
    "El Junquito",
    "El Paraíso",
    "El Recreo",
    "El Valle",
    "La Candelaria",
    "La Pastora",
    "La Vega",
    "Macarao",
    "San Agustín",
    "San Bernardino",
    "San José",
    "San Juan",
    "San Pedro",
    "Santa Rosalía",
    "Santa Teresa",
    "Sucre (Catia)"
  ],
  "Falcón|Acosta": [
    "Capadare",
    "La Pastora",
    "Libertador",
    "San Juan de los Cayos"
  ],
  "Falcón|Bolívar": [
    "Aracua",
    "La Peña",
    "San Luis"
  ],
  "Falcón|Buchivacoa": [
    "Bariro",
    "Borojó",
    "Capatárida",
    "Guajiro",
    "Seque",
    "Valle de Eroa",
    "Zazárida"
  ],
  "Falcón|Cacique Manaure": [
    "Cacique Manaure"
  ],
  "Falcón|Carirubana": [
    "Carirubana",
    "Norte",
    "Santa Ana",
    "Urbana Punta Cardón"
  ],
  "Falcón|Colina": [
    "Acurigua",
    "Guaibacoa",
    "La Vela de Coro",
    "Las Calderas",
    "Macoruca"
  ],
  "Falcón|Dabajuro": [
    "Dabajuro"
  ],
  "Falcón|Democracia": [
    "Agua Clara",
    "Avaria",
    "Pedregal",
    "Piedra Grande",
    "Purureche"
  ],
  "Falcón|Falcón": [
    "Adaure",
    "Adícora",
    "Baraived",
    "Buena Vista",
    "El Hato",
    "El Vínculo",
    "Jadacaquiva",
    "Moruy",
    "Pueblo Nuevo"
  ],
  "Falcón|Federación": [
    "Agua Larga",
    "Churuguara",
    "El Paují",
    "Independencia",
    "Mapararí"
  ],
  "Falcón|Jacura": [
    "Agua Linda",
    "Araurima",
    "Jacura"
  ],
  "Falcón|José Laurencio Silva": [
    "Boca de Aroa",
    "Tucacas"
  ],
  "Falcón|Los Taques": [
    "Judibana",
    "Los Taques"
  ],
  "Falcón|Mauroa": [
    "Casigua",
    "Mene de Mauroa",
    "San Félix"
  ],
  "Falcón|Miranda": [
    "Guzmán Guillermo",
    "Mitare",
    "Río Seco",
    "Sabaneta",
    "San Antonio",
    "San Gabriel",
    "Santa Ana"
  ],
  "Falcón|Monseñor Iturriza": [
    "Boca del Tocuyo",
    "Chichiriviche",
    "Tocuyo de la Costa"
  ],
  "Falcón|Palmasola": [
    "Palmasola"
  ],
  "Falcón|Petit": [
    "Cabure",
    "Colina",
    "Curimagua"
  ],
  "Falcón|Píritu": [
    "Píritu",
    "San José de la Costa"
  ],
  "Falcón|San Francisco": [
    "San Francisco"
  ],
  "Falcón|Sucre": [
    "Pecaya",
    "Sucre"
  ],
  "Falcón|Tocópero": [
    "Tocópero"
  ],
  "Falcón|Unión": [
    "El Charal",
    "Las Vegas del Tuy",
    "Santa Cruz de Bucaral"
  ],
  "Falcón|Urumaco": [
    "Bruzual",
    "Urumaco"
  ],
  "Falcón|Zamora": [
    "La Ciénaga",
    "La Soledad",
    "Pueblo Cumarebo",
    "Puerto Cumarebo",
    "Zazárida"
  ],
  "Guárico|Camaguán": [
    "Camaguán",
    "Puerto Miranda",
    "Uverito"
  ],
  "Guárico|Chaguaramas": [
    "Chaguaramas"
  ],
  "Guárico|El Socorro": [
    "El Socorro"
  ],
  "Guárico|José Félix Ribas": [
    "San Rafael de Laya",
    "Tucupido"
  ],
  "Guárico|José Tadeo Monagas": [
    "Altagracia de Orituco",
    "Carlos Soublette",
    "Libertad de Orituco",
    "Paso Real de Macaira",
    "San Francisco Javier de Lezama",
    "San Francisco de Macaira",
    "San Rafael de Orituco"
  ],
  "Guárico|Juan Germán Roscio": [
    "Cantaclaro",
    "Parapara",
    "San Juan de los Morros"
  ],
  "Guárico|Julián Mellado": [
    "El Sombrero",
    "Sosa"
  ],
  "Guárico|Las Mercedes": [
    "Cabruta",
    "Las Mercedes",
    "Santa Rita de Manapire"
  ],
  "Guárico|Leonardo Infante": [
    "Espino",
    "Valle de la Pascua"
  ],
  "Guárico|Ortíz": [
    "Ortiz",
    "San Francisco de Tiznados",
    "San José de Tiznados",
    "San Lorenzo de Tiznados"
  ],
  "Guárico|Pedro Zaraza": [
    "San José de Unare",
    "Zaraza"
  ],
  "Guárico|San Gerónimo de Guayabal": [
    "Cazorla",
    "Guayabal"
  ],
  "Guárico|San José de Guaribe": [
    "San José de Guaribe",
    "Uveral"
  ],
  "Guárico|Santa María de Ipire": [
    "Altamira",
    "Santa María de Ipire"
  ],
  "Guárico|Sebastián Francisco de Miranda": [
    "Capital Urbana Calabozo",
    "El Calvario",
    "El Rastro",
    "Guardatinajas"
  ],
  "La Guaira|Vargas": [
    "Caraballeda",
    "Carayaca",
    "Carlos Soublette",
    "Caruao Chuspa",
    "Catia La Mar",
    "El Junko",
    "La Guaira",
    "Macuto",
    "Maiquetía",
    "Naiguatá",
    "Urimare"
  ],
  "Lara|Andrés Eloy Blanco": [
    "Pío Tamayo",
    "Quebrada Honda de Guache",
    "Yacambú"
  ],
  "Lara|Crespo": [
    "Fréitez",
    "José María Blanco"
  ],
  "Lara|Iribarren": [
    "Aguedo Felipe Alvarado",
    "Buena Vista",
    "Catedral",
    "Concepción",
    "El Cují",
    "Juan de Villegas",
    "Juárez",
    "Santa Rosa",
    "Tamaca",
    "Unión"
  ],
  "Lara|Jiménez": [
    "Coronel Mariano Peraza",
    "Cuara",
    "Diego de Lozada",
    "José Bernardo Dorante",
    "Juan Bautista Rodríguez",
    "Paraíso de San José",
    "San Miguel",
    "Tintorero"
  ],
  "Lara|Morán": [
    "Anzoátegui",
    "Bolívar",
    "Guarico",
    "Hilario Luna y Luna",
    "Humocaro Alto",
    "Humocaro Bajo",
    "La Candelaria",
    "Morán"
  ],
  "Lara|Palavecino": [
    "Agua Viva",
    "Cabudare",
    "José Gregorio Bastidas"
  ],
  "Lara|Simón Planas": [
    "Buría",
    "Gustavo Vegas León",
    "Sarare"
  ],
  "Lara|Torres": [
    "Altagracia",
    "Antonio Díaz",
    "Camacaro",
    "Castañeda",
    "Cecilio Zubillaga",
    "Chiquinquirá",
    "El Blanco",
    "Espinoza de los Monteros",
    "Heriberto Arroyo",
    "Lara",
    "Las Mercedes",
    "Manuel Morillo",
    "Montaña Verde",
    "Montes de Oca",
    "Reyes Vargas",
    "Torres",
    "Trinidad Samuel"
  ],
  "Lara|Urdaneta": [
    "Moroturo",
    "San Miguel",
    "Siquisique",
    "Xaguas"
  ],
  "Mérida|Alberto Adriani": [
    "Gabriel Picón González",
    "Héctor Amable Mora",
    "José Nucete Sardi",
    "Presidente Betancourt",
    "Presidente Páez",
    "Presidente Rómulo Gallegos",
    "Pulido Méndez"
  ],
  "Mérida|Andrés Bello": [
    "Andrés Bello"
  ],
  "Mérida|Antonio Pinto Salinas": [
    "Mesa Bolívar",
    "Mesa de Las Palmas",
    "Santa Cruz de Mora"
  ],
  "Mérida|Aricagua": [
    "Aricagua",
    "San Antonio"
  ],
  "Mérida|Arzobispo Chacón": [
    "Canagua",
    "Capurí",
    "Chacantá",
    "El Molino",
    "Guaimaral",
    "Mucuchachí",
    "Mucutuy"
  ],
  "Mérida|Campo Elías": [
    "Acequias",
    "Fernández Peña",
    "Jají",
    "La Mesa",
    "Matriz",
    "Montalbán",
    "San José del Sur"
  ],
  "Mérida|Caracciolo Parra Olmedo": [
    "Florencio Ramírez",
    "Tucaní"
  ],
  "Mérida|Cardenal Quintero": [
    "Las Piedras",
    "Santo Domingo"
  ],
  "Mérida|Guaraque": [
    "Guaraque",
    "Mesa de Quintero",
    "Río Negro"
  ],
  "Mérida|Julio César Salas": [
    "Arapuey",
    "Palmira"
  ],
  "Mérida|Justo Briceño": [
    "San Cristóbal de Torondoy",
    "Torondoy"
  ],
  "Mérida|Libertador": [
    "Antonio Spinetti Dini",
    "Arias",
    "Caracciolo Parra Pérez",
    "Domingo Peña",
    "El Llano",
    "El Morro",
    "Gonzalo Picón Febres",
    "Jacinto Plaza",
    "Juan Rodríguez Suárez",
    "Lasso de la Vega",
    "Los Nevados",
    "Mariano Picón Salas",
    "Milla",
    "Osuna Rodríguez",
    "Sagrario"
  ],
  "Mérida|Miranda": [
    "Andrés Eloy Blanco",
    "La Venta",
    "Piñango",
    "Timotes"
  ],
  "Mérida|Obispo Ramos de Lora": [
    "Eloy Paredes",
    "San Rafael de Alcázar",
    "Santa Elena de Arenales"
  ],
  "Mérida|Padre Noguera": [
    "Padre Noguera"
  ],
  "Mérida|Pueblo Llano": [
    "Pueblo Llano"
  ],
  "Mérida|Rangel": [
    "Cacute",
    "La Toma",
    "Mucuchíes",
    "Mucurubá",
    "San Rafael"
  ],
  "Mérida|Rivas Dávila": [
    "Bailadores",
    "Gerónimo Maldonado"
  ],
  "Mérida|Santos Marquina": [
    "Santos Marquina"
  ],
  "Mérida|Sucre": [
    "Chiguará",
    "Estánquez",
    "La Trampa",
    "Lagunillas",
    "Pueblo Nuevo del Sur",
    "San Juan"
  ],
  "Mérida|Tovar": [
    "El Amparo",
    "El Llano",
    "San Francisco",
    "Tovar"
  ],
  "Mérida|Tulio Febres Cordero": [
    "Independencia",
    "María de la Concepción Palacios Blanco",
    "Nueva Bolivia",
    "Santa Apolonia"
  ],
  "Mérida|Zea": [
    "Caño El Tigre",
    "Zea"
  ],
  "Miranda|Acevedo": [
    "Aragüita",
    "Arévalo González",
    "Capaya",
    "Caucagua",
    "El Café",
    "Marizapa",
    "Panaquire",
    "Ribas"
  ],
  "Miranda|Andrés Bello": [
    "Cumbo",
    "San José de Barlovento"
  ],
  "Miranda|Baruta": [
    "El Cafetal",
    "Las Minas",
    "Nuestra Señora del Rosario"
  ],
  "Miranda|Brión": [
    "Curiepe",
    "Higuerote",
    "Tacarigua de Brión"
  ],
  "Miranda|Buroz": [
    "Mamporal"
  ],
  "Miranda|Carrizal": [
    "Carrizal"
  ],
  "Miranda|Chacao": [
    "Chacao"
  ],
  "Miranda|Cristóbal Rojas": [
    "Charallave",
    "Las Brisas"
  ],
  "Miranda|El Hatillo": [
    "El Hatillo"
  ],
  "Miranda|Guaicaipuro": [
    "Altagracia de la Montaña",
    "Cecilio Acosta",
    "El Jarillo",
    "Los Teques",
    "Paracotos",
    "San Pedro",
    "Tácata"
  ],
  "Miranda|Independencia": [
    "Cartanal",
    "Santa Teresa del Tuy"
  ],
  "Miranda|Lander": [
    "La Democracia",
    "Ocumare del Tuy",
    "Santa Bárbara"
  ],
  "Miranda|Los Salias": [
    "San Antonio de los Altos"
  ],
  "Miranda|Páez": [
    "El Guapo",
    "Paparo",
    "Río Chico",
    "San Fernando del Guapo",
    "Tacarigua de la Laguna"
  ],
  "Miranda|Paz Castillo": [
    "Santa Lucía del Tuy"
  ],
  "Miranda|Pedro Gual": [
    "Cúpira",
    "Machurucuto"
  ],
  "Miranda|Plaza": [
    "Guarenas"
  ],
  "Miranda|Simón Bolívar": [
    "San Antonio de Yare",
    "San Francisco de Yare"
  ],
  "Miranda|Sucre": [
    "Caucagüita",
    "Filas de Mariche",
    "La Dolorita",
    "Leoncio Martínez",
    "Petare"
  ],
  "Miranda|Urdaneta": [
    "Cúa",
    "Nueva Cúa"
  ],
  "Miranda|Zamora": [
    "Bolívar",
    "Guatire"
  ],
  "Monagas|Acosta": [
    "San Antonio de Maturín",
    "San Francisco de Maturín"
  ],
  "Monagas|Aguasay": [
    "Aguasay"
  ],
  "Monagas|Bolívar": [
    "Bolívar"
  ],
  "Monagas|Caripe": [
    "Caripe",
    "El Guácharo",
    "La Guanota",
    "Sabana de Piedra",
    "San Agustín",
    "Teresen"
  ],
  "Monagas|Cedeño": [
    "Areo",
    "Capital Cedeño",
    "San Félix de Cantalicio",
    "Viento Fresco"
  ],
  "Monagas|Ezequiel Zamora": [
    "El Tejero",
    "Punta de Mata"
  ],
  "Monagas|Libertador": [
    "Chaguaramas",
    "Las Alhuacas",
    "Tabasca",
    "Temblador"
  ],
  "Monagas|Maturín": [
    "Alto de los Godos",
    "Boquerón",
    "El Corozo",
    "El Furrial",
    "Jusepín",
    "La Cruz",
    "La Pica",
    "Las Cocuizas",
    "San Simón",
    "San Vicente"
  ],
  "Monagas|Piar": [
    "Aparicio",
    "Aragua de Maturín",
    "Chaguamal",
    "El Pinto",
    "Guanaguana",
    "La Toscana",
    "Taguaya"
  ],
  "Monagas|Punceres": [
    "Cachipo",
    "Quiriquire"
  ],
  "Monagas|Santa Bárbara": [
    "Santa Bárbara"
  ],
  "Monagas|Sotillo": [
    "Barrancas",
    "Los Barrancos de Fajardo"
  ],
  "Monagas|Uracoa": [
    "Uracoa"
  ],
  "Nueva Esparta|Antolín del Campo": [
    "Antolín del Campo"
  ],
  "Nueva Esparta|Arismendi": [
    "Arismendi"
  ],
  "Nueva Esparta|Díaz": [
    "San Juan Bautista",
    "Zabala"
  ],
  "Nueva Esparta|García": [
    "Francisco Fajardo",
    "García"
  ],
  "Nueva Esparta|Gómez": [
    "Bolívar",
    "Guevara",
    "Matasiete",
    "Santa Ana",
    "Sucre"
  ],
  "Nueva Esparta|Maneiro": [
    "Aguirre",
    "Maneiro"
  ],
  "Nueva Esparta|Marcano": [
    "Adrián",
    "Juan Griego",
    "Yaguaraparo"
  ],
  "Nueva Esparta|Mariño": [
    "Mariño"
  ],
  "Nueva Esparta|Península de Macanao": [
    "Boca de Río",
    "San Francisco de Macanao"
  ],
  "Nueva Esparta|Tubores": [
    "Los Baleales",
    "Tubores"
  ],
  "Nueva Esparta|Villalba": [
    "Vicente Fuentes",
    "Villalba"
  ],
  "Portuguesa|Agua Blanca": [
    "Agua Blanca"
  ],
  "Portuguesa|Araure": [
    "Capital Araure",
    "Río Acarigua"
  ],
  "Portuguesa|Esteller": [
    "Capital Esteller",
    "Uveral"
  ],
  "Portuguesa|Guanare": [
    "Córdoba",
    "Guanare",
    "San José de la Montaña",
    "San Juan de Guanaguanare",
    "Virgen de la Coromoto"
  ],
  "Portuguesa|Guanarito": [
    "Divina Pastora",
    "Guanarito",
    "Trinidad de la Capilla"
  ],
  "Portuguesa|Monseñor José Vicente de Unda": [
    "Monseñor José Vicente de Unda",
    "Peña Blanca"
  ],
  "Portuguesa|Ospino": [
    "Aparición",
    "Capital Ospino",
    "La Estación"
  ],
  "Portuguesa|Páez": [
    "Páez",
    "Payara",
    "Pimpinela",
    "Ramón Peraza"
  ],
  "Portuguesa|Papelón": [
    "Caño Delgadito",
    "Papelón"
  ],
  "Portuguesa|San Genaro de Boconoíto": [
    "Antolín Tovar",
    "San Genaro de Boconoito"
  ],
  "Portuguesa|San Rafael de Onoto": [
    "San Rafael de Onoto",
    "Santa Fe",
    "Thermo Morles"
  ],
  "Portuguesa|Santa Rosalía": [
    "Florida",
    "Santa Rosalía"
  ],
  "Portuguesa|Sucre": [
    "Concepción",
    "San José de Saguaz",
    "San Rafael de Palo Alzado",
    "Sucre",
    "Uvencio Antonio Velásquez",
    "Villa Rosa"
  ],
  "Portuguesa|Turén": [
    "Canelones",
    "San Isidro Labrador",
    "Santa Cruz",
    "Turén"
  ],
  "Sucre|Andrés Eloy Blanco": [
    "Mariño",
    "Rómulo Gallegos"
  ],
  "Sucre|Andrés Mata": [
    "San José de Aerocuar",
    "Tavera Acosta"
  ],
  "Sucre|Arismendi": [
    "Antonio José de Sucre",
    "El Morro de Puerto Santo",
    "Puerto Santo",
    "Río Caribe",
    "San Juan de las Galdonas"
  ],
  "Sucre|Benítez": [
    "El Pilar",
    "El Rincón",
    "General Francisco Antonio Váquez",
    "Guaraúnos",
    "Tunapuicito",
    "Unión"
  ],
  "Sucre|Bermúdez": [
    "Bolívar",
    "Maracapana",
    "Santa Catalina",
    "Santa Rosa",
    "Santa Teresa"
  ],
  "Sucre|Bolívar": [
    "Bolívar"
  ],
  "Sucre|Cajigal": [
    "El Paujil",
    "Libertad",
    "Yaguaraparo"
  ],
  "Sucre|Cruz Salmerón Acosta": [
    "Chacopata",
    "Cruz Salmerón Acosta",
    "Manicuare"
  ],
  "Sucre|Libertador": [
    "Campo Elías",
    "Tunapuy"
  ],
  "Sucre|Mariño": [
    "Campo Claro",
    "Irapa",
    "Maraval",
    "San Antonio de Irapa",
    "Soro"
  ],
  "Sucre|Mejía": [
    "Mejía"
  ],
  "Sucre|Montes": [
    "Arenas",
    "Aricagua",
    "Cogollar",
    "Cumanacoa",
    "San Fernando",
    "San Lorenzo"
  ],
  "Sucre|Ribero": [
    "Catuaro",
    "Rendón",
    "San Cruz",
    "Santa María",
    "Villa Frontado (Muelle de Cariaco)"
  ],
  "Sucre|Sucre": [
    "Altagracia",
    "Ayacucho",
    "Gran Mariscal",
    "Raúl Leoni",
    "San Juan",
    "Santa Inés",
    "Valentín Valiente"
  ],
  "Sucre|Valdéz": [
    "Bideau",
    "Cristóbal Colón",
    "Güiria",
    "Punta de Piedras"
  ],
  "Táchira|Andrés Bello": [
    "Andrés Bello"
  ],
  "Táchira|Antonio Rómulo Costa": [
    "Antonio Rómulo Costa"
  ],
  "Táchira|Ayacucho": [
    "Ayacucho",
    "Rivas Berti",
    "San Pedro del Río"
  ],
  "Táchira|Bolívar": [
    "Bolívar",
    "General Juan Vicente Gómez",
    "Isaías Medina Angarita",
    "Palotal"
  ],
  "Táchira|Cárdenas": [
    "Amenodoro Ángel Lamus",
    "Cárdenas",
    "La Florida"
  ],
  "Táchira|Córdoba": [
    "Córdoba"
  ],
  "Táchira|Fernández Feo": [
    "Alberto Adriani",
    "Fernández Feo",
    "Santo Domingo"
  ],
  "Táchira|Francisco de Miranda": [
    "Francisco de Miranda"
  ],
  "Táchira|García de Hevia": [
    "Boca de Grita",
    "García de Hevia",
    "José Antonio Páez"
  ],
  "Táchira|Guásimos": [
    "Guásimos"
  ],
  "Táchira|Independencia": [
    "Independencia",
    "Juan Germán Roscio",
    "Román Cárdenas"
  ],
  "Táchira|Jáuregui": [
    "Emilio Constantino Guerrero",
    "Jáuregui",
    "Monseñor Miguel Antonio Salas"
  ],
  "Táchira|José María Vargas": [
    "José María Vargas"
  ],
  "Táchira|Junín": [
    "Bramón",
    "Junín",
    "La Petrólea",
    "Quinimarí"
  ],
  "Táchira|Libertad": [
    "Cipriano Castro",
    "Libertad",
    "Manuel Felipe Rugeles"
  ],
  "Táchira|Libertador": [
    "Doradas",
    "Emeterio Ochoa",
    "Libertador",
    "San Joaquín de Navay"
  ],
  "Táchira|Lobatera": [
    "Constitución",
    "Lobatera"
  ],
  "Táchira|Michelena": [
    "Michelena"
  ],
  "Táchira|Panamericano": [
    "La Palmita",
    "Panamericano"
  ],
  "Táchira|Pedro María Ureña": [
    "Nueva Arcadia",
    "Pedro María Ureña"
  ],
  "Táchira|Rafael Urdaneta": [
    "Rafael Urdaneta"
  ],
  "Táchira|Samuel Darío Maldonado": [
    "Boconó",
    "Hernández",
    "Samuel Darío Maldonado"
  ],
  "Táchira|San Cristóbal": [
    "Dr. Francisco Romero Lobo",
    "La Concordia",
    "Pedro María Morantes",
    "San Juan Bautista",
    "San Sebastián"
  ],
  "Táchira|San Judas Tadeo": [
    "San Judas Tadeo"
  ],
  "Táchira|Seboruco": [
    "Seboruco"
  ],
  "Táchira|Simón Rodríguez": [
    "Simón Rodríguez"
  ],
  "Táchira|Sucre": [
    "Eleazar López Contreras",
    "San Pablo",
    "Sucre"
  ],
  "Táchira|Torbes": [
    "Torbes"
  ],
  "Táchira|Uribante": [
    "Cárdenas",
    "Juan Pablo Peñalosa",
    "Potosí",
    "Uribante"
  ],
  "Trujillo|Andrés Bello": [
    "Araguaney",
    "El Jaguito",
    "La Esperanza",
    "Santa Isabel"
  ],
  "Trujillo|Boconó": [
    "Ayacucho",
    "Boconó",
    "Burbusay",
    "El Carmen",
    "General Ribas",
    "Guaramacal",
    "Monseñor Jáuregui",
    "Mosquey",
    "Rafael Rangel",
    "San José",
    "San Miguel",
    "Vega de Guaramacal"
  ],
  "Trujillo|Bolívar": [
    "Cheregüé",
    "Granados",
    "Sabana Grande"
  ],
  "Trujillo|Candelaria": [
    "Arnoldo Gabaldón",
    "Bolivia",
    "Carrillo",
    "Cegarra",
    "Chejendé",
    "Manuel Salvador Ulloa",
    "San José"
  ],
  "Trujillo|Carache": [
    "Carache",
    "Cuicas",
    "La Concepción",
    "Panamericana",
    "Santa Cruz"
  ],
  "Trujillo|Escuque": [
    "Escuque",
    "La Unión",
    "Sabana Libre",
    "Santa Rita"
  ],
  "Trujillo|José Felipe Márquez Cañizalez": [
    "Antonio José de Sucre",
    "El Socorro",
    "Los Caprichos"
  ],
  "Trujillo|Juan Vicente Campos Elías": [
    "Arnoldo Gabaldón",
    "Campo Elías"
  ],
  "Trujillo|La Ceiba": [
    "El Progreso",
    "La Ceiba",
    "Santa Apolonia",
    "Tres de Febrero"
  ],
  "Trujillo|Miranda": [
    "Agua Caliente",
    "Agua Santa",
    "El Cenizo",
    "El Dividive",
    "Valerita"
  ],
  "Trujillo|Monte Carmelo": [
    "Buena Vista",
    "Monte Carmelo",
    "Santa María del Horcón"
  ],
  "Trujillo|Motatán": [
    "El Baño",
    "Jalisco",
    "Motatán"
  ],
  "Trujillo|Pampán": [
    "Flor de Patria",
    "La Paz",
    "Pampán",
    "Santa Ana"
  ],
  "Trujillo|Pampanito": [
    "La Concepción",
    "Pampanito",
    "Pampanito II"
  ],
  "Trujillo|Rafael Rangel": [
    "Betijoque",
    "José Gregorio Hernández",
    "La Pueblita",
    "Los Cedros"
  ],
  "Trujillo|San Rafael de Carvajal": [
    "Antonio Nicolás Briceño",
    "Campo Alegre",
    "Carvajal",
    "José Leonardo Suárez"
  ],
  "Trujillo|Sucre": [
    "El Paraíso",
    "Junín",
    "Sabana de Mendoza",
    "Valmore Rodríguez"
  ],
  "Trujillo|Trujillo": [
    "Andrés Linares",
    "Chiquinquirá",
    "Cristóbal Mendoza",
    "Cruz Carrillo",
    "Matriz",
    "Monseñor Carrillo",
    "Tres Esquinas"
  ],
  "Trujillo|Urdaneta": [
    "Cabimbú",
    "Jajó",
    "La Mesa de Esnujaque",
    "La Quebrada",
    "Santiago",
    "Tuñame"
  ],
  "Trujillo|Valera": [
    "Juan Ignacio Montilla",
    "La Beatriz",
    "La Puerta",
    "Mendoza del Valle de Momboy",
    "Mercedes Díaz",
    "San Luis"
  ],
  "Yaracuy|Arístides Bastidas": [
    "Arístides Bastidas"
  ],
  "Yaracuy|Bolívar": [
    "Bolívar"
  ],
  "Yaracuy|Bruzual": [
    "Campo Elías",
    "Chivacoa"
  ],
  "Yaracuy|Cocorote": [
    "Cocorote"
  ],
  "Yaracuy|Independencia": [
    "Independencia"
  ],
  "Yaracuy|José Antonio Páez": [
    "José Antonio Páez"
  ],
  "Yaracuy|José Joaquín Veroes": [
    "El Guayabo",
    "Farriar"
  ],
  "Yaracuy|La Trinidad": [
    "La Trinidad"
  ],
  "Yaracuy|Manuel Monge": [
    "Manuel Monge"
  ],
  "Yaracuy|Nirgua": [
    "Nirgua",
    "Salóm",
    "Temerla"
  ],
  "Yaracuy|Peña": [
    "San Andrés",
    "Yaritagua"
  ],
  "Yaracuy|San Felipe": [
    "Albarico",
    "San Felipe",
    "San Javier"
  ],
  "Yaracuy|Sucre": [
    "Sucre"
  ],
  "Yaracuy|Urachiche": [
    "Urachiche"
  ],
  "Zulia|Almirante Padilla": [
    "Isla de Toas",
    "Monagas"
  ],
  "Zulia|Baralt": [
    "General Urdaneta",
    "Libertador",
    "Manuel Guanipa Matos",
    "Marcelino Briceño",
    "Pueblo Nuevo",
    "San Timoteo"
  ],
  "Zulia|Cabimas": [
    "Ambrosio",
    "Arístides Calvani",
    "Carmen Herrera",
    "Germán Ríos Linares",
    "Jorge Hernández",
    "La Rosa",
    "Punta Gorda",
    "Rómulo Betancourt",
    "San Benito"
  ],
  "Zulia|Catatumbo": [
    "Encontrados",
    "Udón Pérez"
  ],
  "Zulia|Colón": [
    "Moralito",
    "San Carlos del Zulia",
    "Santa Bárbara",
    "Santa Cruz del Zulia",
    "Urribarrí"
  ],
  "Zulia|Francisco Javier Pulgar": [
    "Carlos Quevedo",
    "Francisco Javier Pulgar",
    "Guamo-Gavilanes",
    "Simón Rodríguez"
  ],
  "Zulia|Jesús Enrique Losada": [
    "José Ramón Yépez",
    "La Concepción",
    "Mariano Parra León",
    "San José"
  ],
  "Zulia|Jesús María Semprún": [
    "Barí",
    "Jesús María Semprún"
  ],
  "Zulia|La Cañada de Urdaneta": [
    "Andrés Bello",
    "Chiquinquirá",
    "Concepción",
    "El Carmelo",
    "Potreritos"
  ],
  "Zulia|Lagunillas": [
    "Alonso de Ojeda",
    "Campo Lara",
    "Eleazar López Contreras",
    "Libertad",
    "Venezuela"
  ],
  "Zulia|Machiques de Perijá": [
    "Bartolomé de las Casas",
    "Libertad",
    "Río Negro",
    "San José de Perijá"
  ],
  "Zulia|Mara": [
    "La Sierrita",
    "Las Parcelas",
    "Luis de Vicente",
    "Monseñor Marcos Sergio Godoy",
    "Ricaurte",
    "San Rafael",
    "Tamare"
  ],
  "Zulia|Maracaibo": [
    "Antonio Borjas Romero",
    "Bolívar",
    "Cacique Mara",
    "Carracciolo Parra Pérez",
    "Cecilio Acosta",
    "Chiquinquirá",
    "Coquivacoa",
    "Cristo de Aranza",
    "Francisco Eugenio Bustamante",
    "Idelfonzo Vásquez",
    "Juana de Ávila",
    "Luis Hurtado Higuera",
    "Manuel Dagnino",
    "Olegario Villalobos",
    "Raúl Leoni",
    "San Isidro",
    "Santa Lucía",
    "Venancio Pulgar"
  ],
  "Zulia|Miranda": [
    "Altagracia",
    "Ana María Campos",
    "Faría",
    "San Antonio",
    "San José"
  ],
  "Zulia|Páez": [
    "Alta Guajira",
    "Elías Sánchez Rubio",
    "Guajira",
    "Sinamaica"
  ],
  "Zulia|Rosario de Perijá": [
    "Donaldo García",
    "El Rosario",
    "Sixto Zambrano"
  ],
  "Zulia|San Francisco": [
    "Domitila Flores",
    "El Bajo",
    "Francisco Ochoa",
    "Los Cortijos",
    "Marcial Hernández",
    "San Francisco"
  ],
  "Zulia|Santa Rita": [
    "El Mene",
    "José Cenobio Urribarrí",
    "Pedro Lucas Urribarrí",
    "Santa Rita"
  ],
  "Zulia|Simón Bolívar": [
    "Manuel Manrique",
    "Rafael Maria Baralt",
    "Rafael Urdaneta"
  ],
  "Zulia|Sucre": [
    "Bobures",
    "El Batey",
    "Gibraltar",
    "Heras",
    "Monseñor Arturo Álvarez",
    "Rómulo Gallegos"
  ],
  "Zulia|Valmore Rodríguez": [
    "La Victoria",
    "Rafael Urdaneta",
    "Raúl Cuenca"
  ]
};

stateSelect.addEventListener("change", () => {
  populateMunicipalities(stateSelect.value);
  populateParishes("", "");
});

placeSelect.addEventListener("change", () => {
  populateParishes(stateSelect.value, placeSelect.value);
});

populateMunicipalities("");
populateParishes("", "");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchView(tab.dataset.view));
});

document.querySelectorAll("[data-channel]").forEach((button) => {
  button.addEventListener("click", () => {
    selectedChannel = button.dataset.channel;
    document.querySelectorAll("[data-channel]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

needForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(needForm);
  reports = dataProvider.createReport({
    id: `R-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    state: form.get("state"),
    place: form.get("place").trim(),
    parish: form.get("parish").trim(),
    category: form.get("category"),
    quantity: Number(form.get("quantity")),
    priority: form.get("priority"),
    description: form.get("description").trim(),
    contact: form.get("contact").trim(),
    firstName: form.get("firstName").trim(),
    lastName: form.get("lastName").trim(),
    nationalId: form.get("nationalId").trim(),
    phone: form.get("phone").trim(),
    locationLink: form.get("locationLink").trim(),
    channel: selectedChannel,
    status: "Recibido",
    evidence: "Sin verificacion todavia.",
    verifiedBy: "",
  });
  needForm.reset();
  populateMunicipalities("");
  populateParishes("", "");
  render();
  switchView("verificacion");
});

resourceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(resourceForm);
  resources = dataProvider.createResource({
    id: `O-${Date.now().toString().slice(-6)}`,
    type: form.get("type"),
    item: form.get("item").trim(),
    location: form.get("location").trim(),
    owner: form.get("owner").trim(),
    createdAt: new Date().toISOString(),
  });
  resourceForm.reset();
  render();
});

searchInput.addEventListener("input", renderVerification);
statusFilter.addEventListener("change", renderVerification);
verificationList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-status]");
  if (!button) {
    return;
  }
  updateStatus(button.dataset.id, button.dataset.status);
});
publicSearchInput.addEventListener("input", renderPublic);
publicCategoryFilter.addEventListener("change", renderPublic);
clearPublicFilters.addEventListener("click", () => {
  publicSearchInput.value = "";
  publicCategoryFilter.value = "Todas";
  userLocation = null;
  geoStatus.textContent = "La ubicacion es opcional. Solo se usa en este navegador para ordenar resultados cercanos.";
  renderPublic();
});
nearMeButton.addEventListener("click", requestNearbyNeeds);

document.querySelector("#exportCsv").addEventListener("click", () => {
  const headers = ["id", "createdAt", "state", "place", "parish", "category", "quantity", "priority", "status", "channel", "description", "firstName", "lastName", "nationalId", "phone", "contact", "locationLink", "evidence", "verifiedBy"];
  const rows = reports.map((report) => headers.map((key) => csvCell(report[key])).join(","));
  download("reportes_mapa_solidario.csv", [headers.join(","), ...rows].join("\n"), "text/csv");
});

document.querySelector("#exportJson").addEventListener("click", () => {
  download("reportes_mapa_solidario.json", JSON.stringify({ reports, resources }, null, 2), "application/json");
});

function switchView(viewId) {
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewId));
  views.forEach((view) => view.classList.toggle("active", view.id === viewId));
}

function render() {
  renderMetrics();
  renderVerification();
  renderPublic();
  renderResources();
}

function populateMunicipalities(state) {
  const municipalities = MUNICIPALITIES_BY_STATE[state] || [];
  placeSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = municipalities.length ? "Seleccionar" : "Selecciona un estado primero";
  placeSelect.appendChild(placeholder);

  municipalities.forEach((municipality) => {
    const option = document.createElement("option");
    option.value = municipality;
    option.textContent = municipality;
    placeSelect.appendChild(option);
  });

  const otherOption = document.createElement("option");
  otherOption.value = "Otro / por confirmar";
  otherOption.textContent = "Otro / por confirmar";
  if (municipalities.length) {
    placeSelect.appendChild(otherOption);
  }

  placeSelect.disabled = !municipalities.length;
}

function populateParishes(state, municipality) {
  const key = `${state}|${municipality}`;
  const parishes = PARISHES_BY_STATE_MUNICIPALITY[key] || [];
  parishSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = municipality ? "Seleccionar" : "Selecciona un municipio primero";
  parishSelect.appendChild(placeholder);

  parishes.forEach((parish) => {
    const option = document.createElement("option");
    option.value = parish;
    option.textContent = parish;
    parishSelect.appendChild(option);
  });

  if (municipality) {
    const otherOption = document.createElement("option");
    otherOption.value = "Otro / por confirmar";
    otherOption.textContent = parishes.length ? "Otro / por confirmar" : "Parroquia o sector por confirmar";
    parishSelect.appendChild(otherOption);
  }

  parishSelect.disabled = !municipality;
}

function renderMetrics() {
  document.querySelector("#openNeeds").textContent = reports.filter((report) => !["Entregado", "Cerrado", "Falso / duplicado"].includes(report.status)).length;
  document.querySelector("#verifiedNeeds").textContent = reports.filter((report) => report.status === "Verificado").length;
  document.querySelector("#inTransitNeeds").textContent = reports.filter((report) => report.status === "En ruta").length;
  document.querySelector("#deliveredNeeds").textContent = reports.filter((report) => report.status === "Entregado").length;
}

function renderVerification() {
  const search = normalizeText(searchInput.value);
  const status = statusFilter.value;
  const filtered = reports.filter((report) => {
    const matchesStatus = status === "Todos" || report.status === status;
    const haystack = normalizeText(`${report.state} ${report.place} ${report.parish || ""} ${report.category} ${report.description}`);
    return matchesStatus && haystack.includes(search);
  });

  verificationList.innerHTML = filtered.length
    ? filtered.map(renderPrivateRecord).join("")
    : `<div class="empty">No hay reportes con ese filtro.</div>`;
}

function renderPublic() {
  const search = normalizeText(publicSearchInput.value);
  const category = publicCategoryFilter.value;
  let publicReports = reports.filter((report) => {
    const matchesStatus = ["Verificado", "En ruta", "Entregado"].includes(report.status);
    const matchesCategory = category === "Todas" || report.category === category;
    const haystack = normalizeText(`${report.state} ${report.place} ${report.parish || ""} ${report.category} ${report.description}`);
    return matchesStatus && matchesCategory && haystack.includes(search);
  });

  if (userLocation) {
    publicReports = publicReports
      .map((report) => addDistance(report, userLocation))
      .sort((left, right) => (left.distanceKm || 99999) - (right.distanceKm || 99999));
  }

  publicList.innerHTML = publicReports.length
    ? publicReports.map(renderPublicRecord).join("")
    : `<div class="empty">Todavia no hay necesidades verificadas para publicar.</div>`;
}

function renderResources() {
  resourceList.innerHTML = resources.length
    ? resources.map((resource) => `
      <article class="record">
        <div class="record-head">
          <div>
            <h3>${escapeHtml(resource.item)}</h3>
            <p>${escapeHtml(resource.location)}</p>
          </div>
          <span class="pill">${escapeHtml(resource.type)}</span>
        </div>
        <div class="meta">
          <span class="pill">Interno: ${escapeHtml(resource.owner)}</span>
        </div>
      </article>
    `).join("")
    : `<div class="empty">No hay recursos registrados.</div>`;
}

function renderPrivateRecord(report) {
  return `
    <article class="record">
      <div class="record-head">
        <div>
          <h3>${escapeHtml(report.category)} en ${escapeHtml(locationLabel(report))}</h3>
          <p>${escapeHtml(report.description)}</p>
        </div>
        <span class="pill ${escapeHtml(report.priority)}">${escapeHtml(report.priority)}</span>
      </div>
      <div class="meta">
        <span class="pill">${escapeHtml(report.id)}</span>
        <span class="pill">${escapeHtml(report.status)}</span>
        <span class="pill">${escapeHtml(report.channel)}</span>
        <span class="pill">Cantidad: ${escapeHtml(report.quantity)}</span>
      </div>
      <p><strong>Evidencia:</strong> ${escapeHtml(report.evidence)}</p>
      <p><strong>Verificador interno:</strong> ${escapeHtml(report.verifiedBy || "Pendiente por asignar")}</p>
      <p><strong>Persona reportada:</strong> ${escapeHtml(personName(report) || "Sin nombre registrado")}</p>
      <p><strong>Cedula:</strong> ${escapeHtml(report.nationalId || "No registrada")}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(report.phone || "No registrado")}</p>
      <p><strong>Notas internas de contacto:</strong> ${escapeHtml(report.contact || "Sin notas")}</p>
      <p><strong>Link de ubicacion:</strong> ${renderLocationLink(report.locationLink)}</p>
      <div class="record-actions">
        ${["Recibido", "En verificacion", "Verificado", "Asignado", "En ruta", "Entregado", "Cerrado", "Falso / duplicado"].map((status) => `
          <button type="button" class="${status === report.status ? "current" : ""}" data-id="${escapeHtml(report.id)}" data-status="${status}">${status}</button>
        `).join("")}
      </div>
    </article>
  `;
}

function renderPublicRecord(report) {
  return `
    <article class="record">
      <div class="record-head">
        <div>
          <h3>${escapeHtml(report.category)} - ${escapeHtml(report.state)}</h3>
          <p>${escapeHtml(locationLabel(report))}. ${escapeHtml(publicSummary(report.description))}</p>
        </div>
        <span class="pill ${escapeHtml(report.priority)}">${escapeHtml(report.priority)}</span>
      </div>
      <div class="meta">
        <span class="pill">${escapeHtml(report.status)}</span>
        <span class="pill">Cantidad: ${escapeHtml(report.quantity)}</span>
        ${report.distanceKm ? `<span class="pill">Aprox. ${escapeHtml(Math.round(report.distanceKm))} km</span>` : ""}
      </div>
    </article>
  `;
}

function updateStatus(id, status) {
  const report = reports.find((item) => item.id === id);
  if (!report) {
    return;
  }

  const coords = approximateCoords(report);
  const updatedReport = { ...report, ...coords, status };
  reports = dataProvider.updateReport(id, updatedReport);
  if (updatedReport) {
    const publicMessage = ["Verificado", "En ruta", "Entregado"].includes(status)
      ? " Ya aparece en la vista publica."
      : " Sigue siendo solo interno.";
    verificationNotice.textContent = `${updatedReport.id} marcado como "${status}".${publicMessage}`;
  }
  render();
}

function requestNearbyNeeds() {
  if (!navigator.geolocation) {
    geoStatus.textContent = "Este navegador no permite geolocalizacion. Puedes buscar manualmente por estado o municipio.";
    return;
  }

  geoStatus.textContent = "Pidiendo permiso de ubicacion...";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      geoStatus.textContent = "Resultados ordenados por cercania aproximada. Tu ubicacion no se guarda.";
      renderPublic();
    },
    () => {
      userLocation = null;
      geoStatus.textContent = "No se uso ubicacion. Puedes buscar manualmente por estado o municipio.";
      renderPublic();
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
  );
}

function addDistance(report, location) {
  const coords = getReportCoords(report);
  if (!coords) {
    return report;
  }
  return {
    ...report,
    distanceKm: distanceKm(location.lat, location.lng, coords.lat, coords.lng),
  };
}

function getReportCoords(report) {
  if (typeof report.lat === "number" && typeof report.lng === "number") {
    return { lat: report.lat, lng: report.lng };
  }
  return approximateCoords(report);
}

function approximateCoords(report) {
  const haystack = normalizeText(`${report.state} ${report.place} ${report.parish || ""}`);
  const match = APPROXIMATE_COORDS.find((item) => item.match.some((term) => haystack.includes(term)));
  return match ? { lat: match.lat, lng: match.lng } : null;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function publicSummary(text) {
  return text.length > 135 ? `${text.slice(0, 132)}...` : text;
}

function locationLabel(report) {
  return [report.parish, report.place, report.state].filter(Boolean).join(", ");
}

function personName(report) {
  return `${report.firstName || ""} ${report.lastName || ""}`.trim();
}

function renderLocationLink(value) {
  if (!value) {
    return "No registrado";
  }
  const safeValue = escapeHtml(value);
  if (/^https?:\/\//i.test(value)) {
    return `<a href="${safeValue}" target="_blank" rel="noopener noreferrer">Abrir ubicacion</a>`;
  }
  return safeValue;
}

function createLocalStorageDataProvider() {
  return {
    listReports() {
      return load(STORAGE_KEYS.reports, seedReports);
    },
    createReport(report) {
      const nextReports = [report, ...this.listReports()];
      save(STORAGE_KEYS.reports, nextReports);
      return nextReports;
    },
    updateReport(id, updatedReport) {
      const nextReports = this.listReports().map((report) => (
        report.id === id ? updatedReport : report
      ));
      save(STORAGE_KEYS.reports, nextReports);
      return nextReports;
    },
    listResources() {
      return load(STORAGE_KEYS.resources, seedResources);
    },
    createResource(resource) {
      const nextResources = [resource, ...this.listResources()];
      save(STORAGE_KEYS.resources, nextResources);
      return nextResources;
    },
  };
}

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const safeValue = value == null ? "" : value;
  return `"${String(safeValue).split('"').join('""')}"`;
}

function escapeHtml(value) {
  const safeValue = value == null ? "" : value;
  return String(safeValue)
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

render();
