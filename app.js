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

let reports = load(STORAGE_KEYS.reports, seedReports);
let resources = load(STORAGE_KEYS.resources, seedResources);
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
  Amazonas: ["Alto Orinoco", "Atabapo", "Atures", "Autana", "Manapiare", "Maroa", "Rio Negro"],
  Anzoategui: ["Anaco", "Aragua", "Bolivar", "Bruzual", "Cajigal", "Carvajal", "Freites", "Guanipa", "Guanta", "Independencia", "Libertad", "McGregor", "Miranda", "Monagas", "Penalver", "Piritu", "San Juan de Capistrano", "Santa Ana", "Simon Rodriguez", "Sotillo", "Urbaneja"],
  Apure: ["Achaguas", "Biruaca", "Munoz", "Paez", "Pedro Camejo", "Romulo Gallegos", "San Fernando"],
  Aragua: ["Bolivar", "Camatagua", "Francisco Linares Alcantara", "Girardot", "Jose Angel Lamas", "Jose Felix Ribas", "Jose Rafael Revenga", "Libertador", "Mario Briceno Iragorry", "Ocumare de la Costa de Oro", "San Casimiro", "San Sebastian", "Santiago Marino", "Santos Michelena", "Sucre", "Tovar", "Urdaneta", "Zamora"],
  Barinas: ["Alberto Arvelo Torrealba", "Andres Eloy Blanco", "Antonio Jose de Sucre", "Arismendi", "Barinas", "Bolivar", "Cruz Paredes", "Ezequiel Zamora", "Obispos", "Pedraza", "Rojas", "Sosa"],
  Bolivar: ["Angostura", "Caroni", "Cedeno", "El Callao", "Gran Sabana", "Heres", "Piar", "Roscio", "Sifontes", "Sucre"],
  Carabobo: ["Bejuma", "Carlos Arvelo", "Diego Ibarra", "Guacara", "Juan Jose Mora", "Libertador", "Los Guayos", "Miranda", "Montalban", "Naguanagua", "Puerto Cabello", "San Diego", "San Joaquin", "Valencia"],
  Cojedes: ["Anzoategui", "Falcon", "Girardot", "Lima Blanco", "Pao de San Juan Bautista", "Ricaurte", "Romulo Gallegos", "San Carlos", "Tinaco"],
  "Delta Amacuro": ["Antonio Diaz", "Casacoima", "Pedernales", "Tucupita"],
  "Distrito Capital": ["Libertador"],
  Falcon: ["Acosta", "Bolivar", "Buchivacoa", "Cacique Manaure", "Carirubana", "Colina", "Dabajuro", "Democracia", "Falcon", "Federacion", "Jacura", "Los Taques", "Mauroa", "Miranda", "Monseñor Iturriza", "Palmasola", "Petit", "Piritu", "San Francisco", "Silva", "Sucre", "Tocopero", "Union", "Urumaco", "Zamora"],
  Guarico: ["Camaguan", "Chaguaramas", "El Socorro", "Francisco de Miranda", "Jose Felix Ribas", "Jose Tadeo Monagas", "Juan German Roscio", "Julian Mellado", "Las Mercedes", "Leonardo Infante", "Ortiz", "Pedro Zaraza", "San Geronimo de Guayabal", "San Jose de Guaribe", "Santa Maria de Ipire"],
  "La Guaira": ["Vargas"],
  Lara: ["Andres Eloy Blanco", "Crespo", "Iribarren", "Jimenez", "Moran", "Palavecino", "Simon Planas", "Torres", "Urdaneta"],
  Merida: ["Alberto Adriani", "Andres Bello", "Antonio Pinto Salinas", "Aricagua", "Arzobispo Chacon", "Campo Elias", "Caracciolo Parra Olmedo", "Cardenal Quintero", "Guaraque", "Julio Cesar Salas", "Justo Briceno", "Libertador", "Miranda", "Obispo Ramos de Lora", "Padre Noguera", "Pueblo Llano", "Rangel", "Rivas Davila", "Santos Marquina", "Sucre", "Tovar", "Tulio Febres Cordero", "Zea"],
  Miranda: ["Acevedo", "Andres Bello", "Baruta", "Brion", "Buroz", "Carrizal", "Chacao", "Cristobal Rojas", "El Hatillo", "Guaicaipuro", "Independencia", "Lander", "Los Salias", "Paez", "Paz Castillo", "Pedro Gual", "Plaza", "Simon Bolivar", "Sucre", "Urdaneta", "Zamora"],
  Monagas: ["Acosta", "Aguasay", "Bolivar", "Caripe", "Cedeno", "Ezequiel Zamora", "Libertador", "Maturin", "Piar", "Punceres", "Santa Barbara", "Sotillo", "Uracoa"],
  "Nueva Esparta": ["Antolin del Campo", "Arismendi", "Diaz", "Garcia", "Gomez", "Maneiro", "Marcano", "Marino", "Peninsula de Macanao", "Tubores", "Villalba"],
  Portuguesa: ["Agua Blanca", "Araure", "Esteller", "Guanare", "Guanarito", "Monseñor Jose Vicente de Unda", "Ospino", "Paez", "Papelon", "San Genaro de Boconoito", "San Rafael de Onoto", "Santa Rosalia", "Sucre", "Turen"],
  Sucre: ["Andres Eloy Blanco", "Andres Mata", "Arismendi", "Benitez", "Bermudez", "Bolivar", "Cajigal", "Cruz Salmeron Acosta", "Libertador", "Marino", "Mejia", "Montes", "Ribero", "Sucre", "Valdez"],
  Tachira: ["Andres Bello", "Antonio Romulo Costa", "Ayacucho", "Bolivar", "Cardenas", "Cordoba", "Fernandez Feo", "Francisco de Miranda", "Garcia de Hevia", "Guasimos", "Independencia", "Jauregui", "Jose Maria Vargas", "Junin", "Libertad", "Libertador", "Lobatera", "Michelena", "Panamericano", "Pedro Maria Ureña", "Rafael Urdaneta", "Samuel Dario Maldonado", "San Cristobal", "Seboruco", "Simon Rodriguez", "Sucre", "Torbes", "Uribante"],
  Trujillo: ["Andres Bello", "Bocono", "Bolivar", "Candelaria", "Carache", "Escuque", "Jose Felipe Marquez Cañizales", "Juan Vicente Campo Elias", "La Ceiba", "Miranda", "Monte Carmelo", "Motatan", "Pampan", "Pampanito", "Rafael Rangel", "San Rafael de Carvajal", "Sucre", "Trujillo", "Urdaneta", "Valera"],
  Yaracuy: ["Aristides Bastidas", "Bolivar", "Bruzual", "Cocorote", "Independencia", "Jose Antonio Paez", "La Trinidad", "Manuel Monge", "Nirgua", "Peña", "San Felipe", "Sucre", "Urachiche", "Veroes"],
  Zulia: ["Almirante Padilla", "Baralt", "Cabimas", "Catatumbo", "Colon", "Francisco Javier Pulgar", "Guajira", "Jesus Enrique Lossada", "Jesus Maria Semprun", "La Cañada de Urdaneta", "Lagunillas", "Machiques de Perija", "Mara", "Maracaibo", "Miranda", "Rosario de Perija", "San Francisco", "Santa Rita", "Simon Bolivar", "Sucre", "Valmore Rodriguez"],
};

const PARISHES_BY_STATE_MUNICIPALITY = {
  "Distrito Capital|Libertador": ["Altagracia", "Antimano", "Catedral", "Coche", "El Junquito", "El Paraiso", "El Recreo", "El Valle", "La Candelaria", "La Pastora", "La Vega", "Macarao", "San Agustin", "San Bernardino", "San Jose", "San Juan", "San Pedro", "Santa Rosalia", "Santa Teresa", "Sucre", "23 de Enero"],
  "Miranda|Baruta": ["Baruta", "El Cafetal", "Las Minas de Baruta"],
  "Miranda|Chacao": ["Chacao"],
  "Miranda|El Hatillo": ["El Hatillo"],
  "Miranda|Plaza": ["Guarenas"],
  "Miranda|Sucre": ["Caucaguita", "Filas de Mariche", "La Dolorita", "Leoncio Martinez", "Petare"],
  "Miranda|Zamora": ["Araira", "Guatire"],
  "La Guaira|Vargas": ["Caraballeda", "Carayaca", "Carlos Soublette", "Caruao", "Catia La Mar", "El Junko", "La Guaira", "Macuto", "Maiquetia", "Naiguata", "Urimare"],
  "Carabobo|Valencia": ["Candelaria", "Catedral", "El Socorro", "Miguel Peña", "Negro Primero", "Rafael Urdaneta", "San Blas", "San Jose", "Santa Rosa"],
  "Aragua|Girardot": ["Andres Eloy Blanco", "Choroni", "Joaquin Crespo", "Jose Casanova Godoy", "Las Delicias", "Los Tacarigua", "Madre Maria de San Jose", "Pedro Jose Ovalles"],
  "Lara|Iribarren": ["Aguedo Felipe Alvarado", "Buena Vista", "Catedral", "Concepcion", "El Cuji", "Juan de Villegas", "Juarez", "Santa Rosa", "Tamaca", "Union"],
  "Merida|Libertador": ["Antonio Spinetti Dini", "Arias", "Caracciolo Parra Perez", "Domingo Peña", "El Llano", "Gonzalo Picon Febres", "Jacinto Plaza", "Juan Rodriguez Suarez", "Lasso de la Vega", "Mariano Picon Salas", "Milla", "Osuna Rodriguez", "Sagrario"],
  "Tachira|San Cristobal": ["Francisco Romero Lobo", "La Concordia", "Pedro Maria Morantes", "San Juan Bautista", "San Sebastian"],
  "Trujillo|Valera": ["Juan Ignacio Montilla", "La Beatriz", "La Puerta", "Mendoza", "Mercedes Diaz", "San Luis"],
  "Zulia|Maracaibo": ["Antonio Borjas Romero", "Bolivar", "Cacique Mara", "Caracciolo Parra Perez", "Cecilio Acosta", "Chiquinquira", "Coquivacoa", "Cristo de Aranza", "Francisco Eugenio Bustamante", "Idelfonso Vasquez", "Juana de Avila", "Luis Hurtado Higuera", "Manuel Dagnino", "Olegario Villalobos", "Raul Leoni", "Santa Lucia", "Venancio Pulgar"],
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
  reports.unshift({
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
  save(STORAGE_KEYS.reports, reports);
  needForm.reset();
  populateMunicipalities("");
  populateParishes("", "");
  render();
  switchView("verificacion");
});

resourceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(resourceForm);
  resources.unshift({
    id: `O-${Date.now().toString().slice(-6)}`,
    type: form.get("type"),
    item: form.get("item").trim(),
    location: form.get("location").trim(),
    owner: form.get("owner").trim(),
    createdAt: new Date().toISOString(),
  });
  save(STORAGE_KEYS.resources, resources);
  resourceForm.reset();
  render();
});

searchInput.addEventListener("input", renderVerification);
statusFilter.addEventListener("change", renderVerification);
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
  const search = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const filtered = reports.filter((report) => {
    const matchesStatus = status === "Todos" || report.status === status;
    const haystack = `${report.state} ${report.place} ${report.parish || ""} ${report.category} ${report.description}`.toLowerCase();
    return matchesStatus && haystack.includes(search);
  });

  verificationList.innerHTML = filtered.length
    ? filtered.map(renderPrivateRecord).join("")
    : `<div class="empty">No hay reportes con ese filtro.</div>`;

  verificationList.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => updateStatus(button.dataset.id, button.dataset.status));
  });
}

function renderPublic() {
  const search = publicSearchInput.value.trim().toLowerCase();
  const category = publicCategoryFilter.value;
  let publicReports = reports.filter((report) => {
    const matchesStatus = ["Verificado", "En ruta", "Entregado"].includes(report.status);
    const matchesCategory = category === "Todas" || report.category === category;
    const haystack = `${report.state} ${report.place} ${report.parish || ""} ${report.category} ${report.description}`.toLowerCase();
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
          <button data-id="${escapeHtml(report.id)}" data-status="${status}">${status}</button>
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
  reports = reports.map((report) => {
    if (report.id !== id) {
      return report;
    }
    const coords = approximateCoords(report);
    return { ...report, ...coords, status };
  });
  save(STORAGE_KEYS.reports, reports);
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
  const haystack = `${report.state} ${report.place} ${report.parish || ""}`.toLowerCase();
  const match = APPROXIMATE_COORDS.find((item) => item.match.some((term) => haystack.includes(term)));
  return match ? { lat: match.lat, lng: match.lng } : null;
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
