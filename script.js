const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const STORE = "utilhub-v11";

const defaults = {
  recent: [],
  favorites: [],
  theme: "dark",
  animations: true,
  cursor: true
};


/* =========================
   HERRAMIENTAS
========================= */

const tools = [

  {
    id: "calculator",
    cat: "Cálculos",
    icon: "🧮",
    name: "Calculadora",
    desc: "Operaciones matemáticas."
  },

  {
    id: "percentage",
    cat: "Cálculos",
    icon: "%",
    name: "Porcentajes",
    desc: "Calcula porcentajes."
  },

  {
    id: "discount",
    cat: "Cálculos",
    icon: "🏷️",
    name: "Descuentos",
    desc: "Calcula precio final y ahorro."
  },

  {
    id: "rule3",
    cat: "Cálculos",
    icon: "📐",
    name: "Regla de tres",
    desc: "Calcula proporciones."
  },

  {
    id: "converter",
    cat: "Convertidores",
    icon: "🔄",
    name: "Convertidor",
    desc: "Convierte diferentes unidades."
  },

  {
    id: "temperature",
    cat: "Convertidores",
    icon: "🌡️",
    name: "Temperatura",
    desc: "Celsius, Fahrenheit y Kelvin."
  },

  {
    id: "currency",
    cat: "Convertidores",
    icon: "💱",
    name: "Moneda",
    desc: "Convierte usando un tipo de cambio."
  },

  {
    id: "dates",
    cat: "Tiempo",
    icon: "📅",
    name: "Fechas",
    desc: "Calcula diferencias de fechas."
  },

  {
    id: "age",
    cat: "Tiempo",
    icon: "🎂",
    name: "Edad",
    desc: "Calcula la edad."
  },

  {
    id: "timer",
    cat: "Tiempo",
    icon: "⏱️",
    name: "Temporizador",
    desc: "Cuenta atrás."
  },

  {
    id: "stopwatch",
    cat: "Tiempo",
    icon: "⏲️",
    name: "Cronómetro",
    desc: "Mide el tiempo."
  },

  {
    id: "notes",
    cat: "Organización",
    icon: "📝",
    name: "Notas",
    desc: "Guarda notas."
  },

  {
    id: "tasks",
    cat: "Organización",
    icon: "✅",
    name: "Tareas",
    desc: "Organiza tareas."
  },

  {
    id: "shoppingList",
    cat: "Organización",
    icon: "🛍️",
    name: "Lista de compras",
    desc: "Organiza tus compras."
  },

  {
    id: "agenda",
    cat: "Organización",
    icon: "🗓️",
    name: "Agenda rápida",
    desc: "Organiza actividades."
  },

  {
    id: "password",
    cat: "Seguridad",
    icon: "🔐",
    name: "Contraseña",
    desc: "Genera contraseñas."
  },

  {
    id: "random",
    cat: "Seguridad",
    icon: "🎲",
    name: "Aleatorio",
    desc: "Números y dados."
  },

  {
    id: "qr",
    cat: "Herramientas",
    icon: "▣",
    name: "Generador QR",
    desc: "Crea códigos QR."
  },

  {
    id: "text",
    cat: "Herramientas",
    icon: "✍️",
    name: "Texto",
    desc: "Herramientas para texto."
  },

  {
    id: "tip",
    cat: "Herramientas",
    icon: "💡",
    name: "Consejo",
    desc: "Consejos prácticos."
  },

  {
    id: "dictionary",
    cat: "Estudio",
    icon: "📚",
    name: "Diccionario",
    desc: "Busca definiciones."
  },

  {
    id: "study",
    cat: "Estudio",
    icon: "🎓",
    name: "Organizador de estudio",
    desc: "Organiza sesiones de estudio."
  }

];


/* =========================
   DATOS
========================= */

let data = loadData();

function loadData() {

  try {

    return {
      ...defaults,
      ...JSON.parse(
        localStorage.getItem(STORE) || "{}"
      )
    };

  } catch {

    return {
      ...defaults
    };

  }

}

function saveData() {

  localStorage.setItem(
    STORE,
    JSON.stringify(data)
  );

}

function getTool(id) {

  return tools.find(tool => tool.id === id);

}


/* =========================
   RECIENTES
========================= */

function useTool(id) {

  data.recent = [
    id,
    ...data.recent.filter(item => item !== id)
  ].slice(0, 8);

  saveData();

  renderQuick();

}


/* =========================
   FAVORITOS
========================= */

function toggleFavorite(id) {

  if (data.favorites.includes(id)) {

    data.favorites =
      data.favorites.filter(item => item !== id);

  } else {

    data.favorites.push(id);

  }

  saveData();

  renderTools();

  renderQuick();

}


/* =========================
   SEGURIDAD HTML
========================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/[&<>"']/g, character => {

      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return map[character];

    });

}


/* =========================
   CATEGORÍAS
========================= */

const categories = [
  "Todos",
  ...new Set(
    tools.map(tool => tool.cat)
  )
];

let activeCategory = "Todos";
let searchQuery = "";


/* =========================
   FILTROS
========================= */

$("#filters").innerHTML =
  categories.map(category => `

    <button
      class="filter ${
        category === "Todos"
          ? "active"
          : ""
      }"
      data-category="${escapeHTML(category)}"
    >
      ${escapeHTML(category)}
    </button>

  `).join("");


/* =========================
   MOSTRAR HERRAMIENTAS
========================= */

function renderTools() {

  const list = tools.filter(tool => {

    const categoryOK =
      activeCategory === "Todos" ||
      tool.cat === activeCategory;

    const searchOK =
      !searchQuery ||
      `${tool.name} ${tool.desc} ${tool.cat}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return categoryOK && searchOK;

  });


  if (!list.length) {

    $("#toolGrid").innerHTML = `
      <div class="empty">
        No encontramos esa herramienta.
      </div>
    `;

    return;

  }


  $("#toolGrid").innerHTML =
    list.map(tool => `

      <article class="tool-card">

        <button
          class="fav"
          data-favorite="${tool.id}"
          title="Favorito"
        >
          ${
            data.favorites.includes(tool.id)
              ? "★"
              : "☆"
          }
        </button>

        <div class="tool-icon">
          ${tool.icon}
        </div>

        <h3>
          ${escapeHTML(tool.name)}
        </h3>

        <p>
          ${escapeHTML(tool.desc)}
        </p>

        <button
          class="open-tool"
          data-tool="${tool.id}"
        >
          Abrir
        </button>

      </article>

    `).join("");

}


/* =========================
   ACCESO RÁPIDO
========================= */

function miniTool(id) {

  const tool = getTool(id);

  if (!tool) {
    return "";
  }

  return `

    <button
      class="quick-card"
      data-tool="${tool.id}"
    >

      <div class="qicon">
        ${tool.icon}
      </div>

      <b>
        ${escapeHTML(tool.name)}
      </b>

    </button>

  `;

}


function renderQuick() {

  $("#recentTools").innerHTML =
    data.recent
      .map(miniTool)
      .join("");

  $("#emptyRecent").style.display =
    data.recent.length
      ? "none"
      : "block";


  $("#favoriteTools").innerHTML =
    data.favorites
      .map(miniTool)
      .join("");

  $("#emptyFavorites").style.display =
    data.favorites.length
      ? "none"
      : "block";

}


/* =========================
   MODAL
========================= */

function openModal(html) {

  $("#modalContent").innerHTML = html;

  $("#modal").classList.add("show");

  $("#modal").setAttribute(
    "aria-hidden",
    "false"
  );

}


function closeModal() {

  $("#modal").classList.remove("show");

  $("#modal").setAttribute(
    "aria-hidden",
    "true"
  );

}


/* =========================
   ABRIR HERRAMIENTA
========================= */

function openTool(id) {

  const tool = getTool(id);

  if (!tool) {
    return;
  }

  useTool(id);


  const forms = {

    calculator: `
      <h2>🧮 Calculadora</h2>

      <div class="tool-form">

        <input
          id="calc"
          placeholder="Ej. (25+5)*2"
        >

        <button
          class="primary"
          id="calcGo"
        >
          Calcular
        </button>

        <div
          id="calcOut"
          class="result"
        >
          Resultado...
        </div>

      </div>
    `,


    percentage: `
      <h2>% Porcentajes</h2>

      <div class="tool-form">

        <input
          id="p1"
          type="number"
          placeholder="Porcentaje"
        >

        <input
          id="p2"
          type="number"
          placeholder="De"
        >

        <button
          class="primary"
          id="pGo"
        >
          Calcular
        </button>

        <div
          id="pOut"
          class="result"
        >
          Resultado...
        </div>

      </div>
    `,


    discount: `
      <h2>🏷️ Descuento</h2>

      <div class="tool-form">

        <input
          id="price"
          type="number"
          placeholder="Precio"
        >

        <input
          id="disc"
          type="number"
          placeholder="Descuento %"
        >

        <button
          class="primary"
          id="dGo"
        >
          Calcular
        </button>

        <div
          id="dOut"
          class="result"
        >
          Resultado...
        </div>

      </div>
    `,


    rule3: `
      <h2>📐 Regla de tres</h2>

      <div class="tool-form">

        <div class="row">

          <input
            id="ra"
            type="number"
            placeholder="A"
          >

          <input
            id="rb"
            type="number"
            placeholder="B"
          >

        </div>

        <input
          id="rc"
          type="number"
          placeholder="C"
        >

        <button
          class="primary"
          id="rGo"
        >
          Calcular X
        </button>

        <div
          id="rOut"
          class="result"
        >
          X = ...
        </div>

      </div>
    `,


    converter: `
      <h2>🔄 Convertidor</h2>

      <div class="tool-form">

        <div class="row">

          <input
            id="cv"
            type="number"
            placeholder="Valor"
          >

          <select id="cu">

            <option value="km-mi">
              km → millas
            </option>

            <option value="mi-km">
              millas → km
            </option>

            <option value="kg-lb">
              kg → lb
            </option>

            <option value="lb-kg">
              lb → kg
            </option>

            <option value="m-yd">
              m → yardas
            </option>

            <option value="l-gal">
              litros → galones
            </option>

            <option value="h-min">
              horas → minutos
            </option>

            <option value="min-h">
              minutos → horas
            </option>

          </select>

        </div>

        <button
          class="primary"
          id="cvGo"
        >
          Convertir
        </button>

        <div
          id="cvOut"
          class="result"
        >
          Resultado...
        </div>

      </div>
    `,


    temperature: `
      <h2>🌡️ Temperatura</h2>

      <div class="tool-form">

        <div class="row">

          <input
            id="tv"
            type="number"
            placeholder="Valor"
          >

          <select id="tu">

            <option value="c-f">
              °C → °F
            </option>

            <option value="f-c">
              °F → °C
            </option>

            <option value="c-k">
              °C → K
            </option>

            <option value="k-c">
              K → °C
            </option>

          </select>

        </div>

        <button
          class="primary"
          id="tGo"
        >
          Convertir
        </button>

        <div
          id="tOut"
          class="result"
        >
          Resultado...
        </div>

      </div>
    `,


    currency: `
      <h2>💱 Moneda</h2>

      <p>
        Introduce manualmente el tipo de cambio que quieras utilizar.
      </p>

      <div class="tool-form">

        <div class="row">

          <input
            id="cvMoney"
            type="number"
            placeholder="Monto"
          >

          <input
            id="rate"
            type="number"
            placeholder="Tipo de cambio"
          >

        </div>

        <button
          class="primary"
          id="mGo"
        >
          Calcular
        </button>

        <div
          id="mOut"
          class="result"
        >
          Resultado...
        </div>

      </div>
    `,


    dates: `
      <h2>📅 Diferencia de fechas</h2>

      <div class="tool-form">

        <div class="row">

          <input
            id="dateA"
            type="date"
          >

          <input
            id="dateB"
            type="date"
          >

        </div>

        <button
          class="primary"
          id="dateGo"
        >
          Calcular
        </button>

        <div
          id="dateOut"
          class="result"
        >
          Resultado...
        </div>

      </div>
    `,


    age: `
      <h2>🎂 Edad</h2>

      <div class="tool-form">

        <input
          id="birth"
          type="date"
        >

        <button
          class="primary"
          id="ageGo"
        >
          Calcular edad
        </button>

        <div
          id="ageOut"
          class="result"
        >
          Resultado...
        </div>

      </div>
    `,


    timer: `
      <h2>⏱️ Temporizador</h2>

      <div class="tool-form">

        <input
          id="tm"
          type="number"
          min="1"
          placeholder="Segundos"
        >

        <button
          class="primary"
          id="tmGo"
        >
          Iniciar
        </button>

        <div
          id="tmOut"
          class="result"
        >
          00:00
        </div>

      </div>
    `,


    stopwatch: `
      <h2>⏲️ Cronómetro</h2>

      <div class="tool-form">

        <div
          id="swOut"
          class="result"
        >
          00:00.0
        </div>

        <div class="row">

          <button
            class="primary"
            id="swStart"
          >
            Iniciar
          </button>

          <button id="swReset">
            Reiniciar
          </button>

        </div>

      </div>
    `,


    notes: `
      <h2>📝 Notas</h2>

      <textarea
        id="notesArea"
        rows="10"
        placeholder="Escribe aquí..."
      >${escapeHTML(
        localStorage.getItem("uh_notes") || ""
      )}</textarea>

      <button
        class="primary"
        id="saveNotes"
      >
        Guardar
      </button>
    `,


    tasks: `
      <h2>✅ Tareas</h2>

      <div class="inline">

        <input
          id="taskInput"
          placeholder="Nueva tarea"
        >

        <button
          class="primary"
          id="addTask"
        >
          Añadir
        </button>

      </div>

      <div id="taskList"></div>
    `,


    shoppingList: `
      <h2>🛍️ Lista de compras</h2>

      <div class="inline">

        <input
          id="shopInput"
          placeholder="Producto"
        >

        <button
          class="primary"
          id="addShop"
        >
          Añadir
        </button>

      </div>

      <div id="shopList"></div>
    `,


    agenda: `
      <h2>🗓️ Agenda rápida</h2>

      <input
        id="agendaText"
        placeholder="Actividad"
      >

      <input
        id="agendaDate"
        type="datetime-local"
      >

      <button
        class="primary"
        id="addAgenda"
      >
        Guardar
      </button>

      <div id="agendaList"></div>
    `,


    password: `
      <h2>🔐 Generador de contraseña</h2>

      <div class="tool-form">

        <input
          id="passLen"
          type="number"
          min="6"
          max="64"
          value="16"
        >

        <button
          class="primary"
          id="passGo"
        >
          Generar
        </button>

        <input
          id="passOut"
          readonly
          placeholder="Resultado"
        >

      </div>
    `,


    random: `
      <h2>🎲 Aleatorio</h2>

      <div class="tool-form">

        <div class="row">

          <input
            id="minR"
            type="number"
            value="1"
          >

          <input
            id="maxR"
            type="number"
            value="100"
          >

        </div>

        <button
          class="primary"
          id="randGo"
        >
          Número aleatorio
        </button>

        <button id="diceGo">
          🎲 Lanzar dado
        </button>

        <div
          id="randOut"
          class="result"
        >
          ...
        </div>

      </div>
    `,


    qr: `
      <h2>▣ Generador QR</h2>

      <p>
        El QR se genera mediante un servicio externo.
        No introduzcas información privada.
      </p>

      <input
        id="qrText"
        placeholder="Texto o enlace"
      >

      <button
        class="primary"
        id="qrGo"
      >
        Generar QR
      </button>

      <div
        id="qrOut"
        class="result"
      ></div>
    `,


    text: `
      <h2>✍️ Herramientas de texto</h2>

      <textarea
        id="textArea"
        rows="8"
        placeholder="Escribe texto..."
      ></textarea>

      <div class="row">

        <button id="upper">
          MAYÚSCULAS
        </button>

        <button id="lower">
          minúsculas
        </button>

      </div>

      <div
        id="wordCount"
        class="result"
      >
        Palabras: 0 · Caracteres: 0
      </div>
    `,


    tip: `
      <h2>💡 Consejo</h2>

      <div
        id="tipOut"
        class="result"
      ></div>

      <button
        class="primary"
        id="newTip"
      >
        Otro consejo
      </button>
    `,


    dictionary: `
      <h2>📚 Diccionario</h2>

      <input
        id="word"
        placeholder="Escribe una palabra"
      >

      <button
        class="primary"
        id="dictGo"
      >
        Buscar
      </button>

      <div
        id="dictOut"
        class="result"
      >
        ...
      </div>
    `,


    study: `
      <h2>🎓 Organizador de estudio</h2>

      <input
        id="studyTopic"
        placeholder="Tema"
      >

      <div class="row">

        <input
          id="studyMin"
          type="number"
          value="25"
          placeholder="Minutos"
        >

        <input
          id="studyBreak"
          type="number"
          value="5"
          placeholder="Descanso"
        >

      </div>

      <button
        class="primary"
        id="studyGo"
      >
        Crear sesión
      </button>

      <div
        id="studyOut"
        class="result"
      >
        ...
      </div>
    `

  };


  openModal(
    forms[id] ||
    "<h2>Herramienta</h2>"
  );

  bindTool(id);

}


/* =========================
   FUNCIONES DE HERRAMIENTAS
========================= */

function bindTool(id) {


  if (id === "calculator") {

    $("#calcGo").onclick = () => {

      $("#calcOut").textContent =
        "Resultado: " +
        safeCalculator(
          $("#calc").value
        );

    };

  }


  if (id === "percentage") {

    $("#pGo").onclick = () => {

      const percentage =
        Number($("#p1").value);

      const number =
        Number($("#p2").value);

      $("#pOut").textContent =
        "Resultado: " +
        (percentage * number / 100);

    };

  }


  if (id === "discount") {

    $("#dGo").onclick = () => {

      const price =
        Number($("#price").value);

      const discount =
        Number($("#disc").value);

      const saving =
        price * discount / 100;

      const finalPrice =
        price - saving;

      $("#dOut").textContent =
        `Final: ${finalPrice.toFixed(2)}
        · Ahorras: ${saving.toFixed(2)}`;

    };

  }


  if (id === "rule3") {

    $("#rGo").onclick = () => {

      const a = Number($("#ra").value);
      const b = Number($("#rb").value);
      const c = Number($("#rc").value);

      if (a === 0) {

        $("#rOut").textContent =
          "A no puede ser 0.";

        return;

      }

      $("#rOut").textContent =
        "X = " +
        ((b * c) / a);

    };

  }


  if (id === "converter") {

    $("#cvGo").onclick = convert;

  }


  if (id === "temperature") {

    $("#tGo").onclick = () => {

      const value =
        Number($("#tv").value);

      const unit =
        $("#tu").value;

      let result;

      if (unit === "c-f") {
        result = value * 9 / 5 + 32;
      }

      if (unit === "f-c") {
        result = (value - 32) * 5 / 9;
      }

      if (unit === "c-k") {
        result = value + 273.15;
      }

      if (unit === "k-c") {
        result = value - 273.15;
      }

      $("#tOut").textContent =
        "Resultado: " +
        result.toFixed(2);

    };

  }


  if (id === "currency") {

    $("#mGo").onclick = () => {

      const amount =
        Number($("#cvMoney").value);

      const rate =
        Number($("#rate").value);

      $("#mOut").textContent =
        "Resultado: " +
        (amount * rate).toFixed(2);

    };

  }


  if (id === "dates") {

    $("#dateGo").onclick = () => {

      const a =
        new Date($("#dateA").value);

      const b =
        new Date($("#dateB").value);

      const days =
        Math.round(
          Math.abs(b - a) /
          86400000
        );

      $("#dateOut").textContent =
        "Días: " + days;

    };

  }


  if (id === "age") {

    $("#ageGo").onclick = () => {

      const birth =
        new Date($("#birth").value);

      const today =
        new Date();

      if (Number.isNaN(birth.getTime())) {

        $("#ageOut").textContent =
          "Introduce tu fecha.";

        return;

      }

      let age =
        today.getFullYear() -
        birth.getFullYear();

      const birthday =
        new Date(
          today.getFullYear(),
          birth.getMonth(),
          birth.getDate()
        );

      if (birthday > today) {
        age--;
      }

      $("#ageOut").textContent =
        "Edad: " +
        age +
        " años";

    };

  }


  if (id === "timer") {
    timerBind();
  }


  if (id === "stopwatch") {
    stopwatchBind();
  }


  if (id === "notes") {

    $("#saveNotes").onclick = () => {

      localStorage.setItem(
        "uh_notes",
        $("#notesArea").value
      );

      $("#saveNotes").textContent =
        "Guardado ✓";

    };

  }


  if (id === "tasks") {

    listBind(
      "uh_tasks",
      "taskInput",
      "addTask",
      "taskList"
    );

  }


  if (id === "shoppingList") {

    listBind(
      "uh_shop",
      "shopInput",
      "addShop",
      "shopList"
    );

  }


  if (id === "agenda") {
    agendaBind();
  }


  if (id === "password") {

    $("#passGo").onclick = () => {

      const length =
        Math.max(
          6,
          Math.min(
            64,
            Number($("#passLen").value) || 16
          )
        );

      $("#passOut").value =
        generatePassword(length);

    };

  }


  if (id === "random") {

    $("#randGo").onclick = () => {

      let min =
        Number($("#minR").value);

      let max =
        Number($("#maxR").value);

      if (min > max) {
        [min, max] = [max, min];
      }

      const result =
        Math.floor(
          Math.random() *
          (max - min + 1)
        ) + min;

      $("#randOut").textContent =
        result;

    };


    $("#diceGo").onclick = () => {

      $("#randOut").textContent =
        1 +
        Math.floor(
          Math.random() * 6
        );

    };

  }


  if (id === "qr") {

    $("#qrGo").onclick = () => {

      const text =
        $("#qrText").value.trim();

      if (!text) {
        return;
      }

      $("#qrOut").innerHTML = `

        <img
          alt="Código QR"
          style="max-width:240px"
          src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(text)}"
        >

      `;

    };

  }


  if (id === "text") {

    const area =
      $("#textArea");

    const count = () => {

      const words =
        area.value
          .trim()
          .match(/\S+/g) || [];

      $("#wordCount").textContent =
        `Palabras: ${words.length}
        · Caracteres: ${area.value.length}`;

    };

    area.oninput = count;


    $("#upper").onclick = () => {

      area.value =
        area.value.toUpperCase();

      count();

    };


    $("#lower").onclick = () => {

      area.value =
        area.value.toLowerCase();

      count();

    };

  }


  if (id === "tip") {

    showTip();

    $("#newTip").onclick =
      showTip;

  }


  if (id === "dictionary") {

    $("#dictGo").onclick =
      async () => {

        const word =
          $("#word").value.trim();

        if (!word) {
          return;
        }

        $("#dictOut").textContent =
          "Buscando...";

        try {

          const response =
            await fetch(
              `https://api.dictionaryapi.dev/api/v2/entries/es/${encodeURIComponent(word)}`
            );

          const result =
            await response.json();

          if (!response.ok) {

            $("#dictOut").textContent =
              "No se encontró la palabra.";

            return;

          }

          const definition =
            result[0]
              ?.meanings?.[0]
              ?.definitions?.[0]
              ?.definition;

          $("#dictOut").innerHTML = `

            <b>
              ${escapeHTML(result[0].word)}
            </b>

            <br>

            ${escapeHTML(
              definition ||
              "Sin definición encontrada."
            )}

          `;

        } catch {

          $("#dictOut").textContent =
            "Necesitas conexión a Internet.";

        }

      };

  }


  if (id === "study") {

    $("#studyGo").onclick = () => {

      const topic =
        $("#studyTopic").value ||
        "Estudio";

      const minutes =
        $("#studyMin").value;

      const breakTime =
        $("#studyBreak").value;

      $("#studyOut").textContent =
        `Sesión creada:
        ${topic}
        · ${minutes} min
        + ${breakTime} min de descanso.`;

    };

  }

}


/* =========================
   CALCULADORA
========================= */

function safeCalculator(expression) {

  try {

    if (
      !/^[0-9+\-*/().%\s]+$/.test(
        expression
      )
    ) {

      throw new Error();

    }

    return Function(
      `"use strict";return (${expression})`
    )();

  } catch {

    return "Expresión no válida";

  }

}


/* =========================
   CONVERSOR
========================= */

function convert() {

  const value =
    Number($("#cv").value);

  const unit =
    $("#cu").value;

  const conversions = {

    "km-mi": value * 0.621371,

    "mi-km": value * 1.609344,

    "kg-lb": value * 2.2046226218,

    "lb-kg": value * 0.45359237,

    "m-yd": value * 1.0936133,

    "l-gal": value * 0.264172052,

    "h-min": value * 60,

    "min-h": value / 60

  };

  $("#cvOut").textContent =
    "Resultado: " +
    conversions[unit];

}


/* =========================
   TEMPORIZADOR
========================= */

function timerBind() {

  let timer = null;
  let end = 0;

  const output =
    $("#tmOut");


  function draw() {

    const seconds =
      Math.max(
        0,
        Math.ceil(
          (end - Date.now()) / 1000
        )
      );

    const minutes =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    output.textContent =
      `${String(minutes).padStart(2, "0")}:
       ${String(secs).padStart(2, "0")}`;


    if (seconds <= 0) {

      clearInterval(timer);

      timer = null;

      alert(
        "Temporizador terminado."
      );

    }

  }


  $("#tmGo").onclick = () => {

    clearInterval(timer);

    const seconds =
      Math.max(
        1,
        Number($("#tm").value) || 1
      );

    end =
      Date.now() +
      seconds * 1000;

    draw();

    timer =
      setInterval(draw, 200);

  };

}


/* =========================
   CRONÓMETRO
========================= */

function stopwatchBind() {

  let start = 0;
  let elapsed = 0;
  let animation = null;

  const output =
    $("#swOut");


  function draw() {

    const current =
      elapsed +
      (
        start
          ? Date.now() - start
          : 0
      );

    const minutes =
      Math.floor(
        current / 60000
      );

    const seconds =
      Math.floor(
        current / 1000
      ) % 60;

    const tenths =
      Math.floor(
        current / 100
      ) % 10;

    output.textContent =
      `${String(minutes).padStart(2, "0")}:
       ${String(seconds).padStart(2, "0")}.
       ${tenths}`;


    if (start) {

      animation =
        requestAnimationFrame(draw);

    }

  }


  $("#swStart").onclick = () => {

    if (start) {

      elapsed +=
        Date.now() - start;

      start = 0;

      cancelAnimationFrame(
        animation
      );

      $("#swStart").textContent =
        "Iniciar";

    } else {

      start = Date.now();

      $("#swStart").textContent =
        "Pausar";

      draw();

    }

  };


  $("#swReset").onclick = () => {

    start = 0;

    elapsed = 0;

    cancelAnimationFrame(
      animation
    );

    output.textContent =
      "00:00.0";

    $("#swStart").textContent =
      "Iniciar";

  };

}


/* =========================
   LISTAS
========================= */

function listBind(
  key,
  input,
  button,
  list
) {

  let items =
    JSON.parse(
      localStorage.getItem(key) || "[]"
    );


  function render() {

    $(`#${list}`).innerHTML =
      items.map(
        (item, index) => `

          <div class="result">

            ${escapeHTML(item)}

            <button data-index="${index}">
              ✓
            </button>

          </div>

        `
      ).join("");


    $$(`#${list} button`)
      .forEach(button => {

        button.onclick = () => {

          items.splice(
            Number(button.dataset.index),
            1
          );

          localStorage.setItem(
            key,
            JSON.stringify(items)
          );

          render();

        };

      });

  }


  $(`#${button}`).onclick = () => {

    const value =
      $(`#${input}`).value.trim();

    if (!value) {
      return;
    }

    items.push(value);

    localStorage.setItem(
      key,
      JSON.stringify(items)
    );

    $(`#${input}`).value = "";

    render();

  };


  render();

}


/* =========================
   AGENDA
========================= */

function agendaBind() {

  let items =
    JSON.parse(
      localStorage.getItem(
        "uh_agenda"
      ) || "[]"
    );


  function render() {

    $("#agendaList").innerHTML =
      items.map(
        (item, index) => `

          <div class="result">

            <b>
              ${escapeHTML(item.text)}
            </b>

            <br>

            ${escapeHTML(item.date)}

            <button
              data-index="${index}"
            >
              ×
            </button>

          </div>

        `
      ).join("");


    $$("#agendaList button")
      .forEach(button => {

        button.onclick = () => {

          items.splice(
            Number(button.dataset.index),
            1
          );

          localStorage.setItem(
            "uh_agenda",
            JSON.stringify(items)
          );

          render();

        };

      });

  }


  $("#addAgenda").onclick = () => {

    const text =
      $("#agendaText").value.trim();

    if (!text) {
      return;
    }

    items.push({

      text,

      date:
        $("#agendaDate").value

    });


    localStorage.setItem(
      "uh_agenda",
      JSON.stringify(items)
    );


    $("#agendaText").value = "";

    render();

  };


  render();

}


/* =========================
   CONTRASEÑAS
========================= */

function generatePassword(length) {

  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ" +
    "abcdefghijkmnopqrstuvwxyz" +
    "23456789!@#$%&*";

  let password = "";

  const values =
    new Uint32Array(length);

  crypto.getRandomValues(values);

  for (const value of values) {

    password +=
      characters[
        value % characters.length
      ];

  }

  return password;

}


/* =========================
   CONSEJOS
========================= */

const tips = [

  "Guarda una copia de tus datos importantes.",

  "Divide una tarea grande en pasos pequeños.",

  "Revisa tus listas antes de salir a comprar.",

  "Usa favoritos para acceder rápidamente a lo que repites.",

  "Organiza primero las tareas más importantes."

];


function showTip() {

  const index =
    Math.floor(
      Math.random() * tips.length
    );

  $("#tipOut").textContent =
    tips[index];

}


/* =========================
   EVENTOS GENERALES
========================= */

document.addEventListener(
  "click",
  event => {

    const toolButton =
      event.target.closest(
        "[data-tool]"
      );

    if (toolButton) {

      openTool(
        toolButton.dataset.tool
      );

    }


    const favoriteButton =
      event.target.closest(
        "[data-favorite]"
      );

    if (favoriteButton) {

      event.stopPropagation();

      toggleFavorite(
        favoriteButton.dataset.favorite
      );

    }


    const categoryButton =
      event.target.closest(
        "[data-category]"
      );

    if (categoryButton) {

      activeCategory =
        categoryButton.dataset.category;

      $$(".filter")
        .forEach(button => {

          button.classList.toggle(
            "active",
            button === categoryButton
          );

        });

      renderTools();

    }


    const nearbyButton =
      event.target.closest(
        "[data-near]"
      );

    if (nearbyButton) {

      const place =
        nearbyButton.dataset.near;

      window.open(
        "https://www.google.com/maps/search/" +
        encodeURIComponent(
          place + " cerca de mí"
        ),
        "_blank",
        "noopener"
      );

    }


    const sideButton =
      event.target.closest(
        "[data-scroll]"
      );

    if (sideButton) {

      $("#sidebar")
        .classList
        .remove("open");

      document
        .getElementById(
          sideButton.dataset.scroll
        )
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }

  }
);


/* =========================
   MENÚ
========================= */

$("#menuBtn").onclick = () => {

  $("#sidebar")
    .classList
    .toggle("open");

};


/* =========================
   MODAL
========================= */

$("#closeModal").onclick =
  closeModal;

$("#modal").onclick = event => {

  if (event.target.id === "modal") {

    closeModal();

  }

};


/* =========================
   BUSCADOR
========================= */

$("#globalSearch").oninput =
  event => {

    searchQuery =
      event.target.value;

    renderTools();

    if (searchQuery) {

      document
        .getElementById("all-tools")
        .scrollIntoView({
          behavior: "smooth"
        });

    }

  };


/* =========================
   ATAJO CTRL + K
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      (event.ctrlKey ||
       event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {

      event.preventDefault();

      $("#globalSearch").focus();

    }


    if (event.key === "Escape") {

      closeModal();

    }

  }
);


/* =========================
   LIMPIAR RECIENTES
========================= */

$("#clearRecent").onclick = () => {

  data.recent = [];

  saveData();

  renderQuick();

};


/* =========================
   TEMA
========================= */

$("#themeBtn").onclick = () => {

  setTheme(
    data.theme === "dark"
      ? "light"
      : "dark"
  );

};


$("#settingsBtn").onclick = () => {

  document
    .getElementById("settings")
    .scrollIntoView({
      behavior: "smooth"
    });

};


$("#darkToggle").onchange =
  event => {

    setTheme(
      event.target.checked
        ? "dark"
        : "light"
    );

  };


function setTheme(theme) {

  data.theme = theme;

  saveData();

  applySettings();

}


/* =========================
   CONFIGURACIÓN
========================= */

$("#animToggle").onchange =
  event => {

    data.animations =
      event.target.checked;

    applySettings();

    saveData();

  };


$("#cursorToggle").onchange =
  event => {

    data.cursor =
      event.target.checked;

    applySettings();

    saveData();

  };


function applySettings() {

  document.body.classList.toggle(
    "light",
    data.theme === "light"
  );

  document.body.classList.toggle(
    "no-animation",
    !data.animations
  );

  $("#darkToggle").checked =
    data.theme === "dark";

  $("#animToggle").checked =
    data.animations;

  $("#cursorToggle").checked =
    data.cursor;

  $("#themeBtn").textContent =
    data.theme === "dark"
      ? "☀"
      : "☾";

}


/* =========================
   COMIDA
========================= */

$("#foodSearch").onclick = () => {

  const query =
    $("#foodInput")
      .value
      .trim() ||
    "restaurantes";

  window.open(
    "https://www.google.com/maps/search/" +
    encodeURIComponent(
      query + " restaurantes"
    ),
    "_blank",
    "noopener"
  );

};


/* =========================
   COMPRAS
========================= */

$("#shoppingSearch").onclick = () => {

  const query =
    $("#shoppingInput")
      .value
      .trim() ||
    "productos";

  window.open(
    "https://www.google.com/search?tbm=shop&q=" +
    encodeURIComponent(query),
    "_blank",
    "noopener"
  );

};


/* =========================
   EXPORTAR
========================= */

$("#exportBtn").onclick = () => {

  const backup = {

    ...data,

    notes:
      localStorage.getItem(
        "uh_notes"
      ) || "",

    tasks:
      localStorage.getItem(
        "uh_tasks"
      ) || "[]",

    shop:
      localStorage.getItem(
        "uh_shop"
      ) || "[]",

    agenda:
      localStorage.getItem(
        "uh_agenda"
      ) || "[]"

  };


  const blob =
    new Blob(
      [
        JSON.stringify(
          backup,
          null,
          2
        )
      ],
      {
        type:
          "application/json"
      }
    );


  const link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "utilhub-v11-respaldo.json";

  link.click();

  URL.revokeObjectURL(
    link.href
  );

};


/* =========================
   IMPORTAR
========================= */

$("#importFile").onchange =
  async event => {

    try {

      const file =
        event.target.files[0];

      const backup =
        JSON.parse(
          await file.text()
        );


      data = {
        ...defaults,
        ...backup
      };


      saveData();


      if (
        backup.notes !== undefined
      ) {

        localStorage.setItem(
          "uh_notes",
          backup.notes
        );

      }


      if (backup.tasks) {

        localStorage.setItem(
          "uh_tasks",
          backup.tasks
        );

      }


      if (backup.shop) {

        localStorage.setItem(
          "uh_shop",
          backup.shop
        );

      }


      if (backup.agenda) {

        localStorage.setItem(
          "uh_agenda",
          backup.agenda
        );

      }


      applySettings();

      renderQuick();

      renderTools();

      alert(
        "Respaldo importado correctamente."
      );

    } catch {

      alert(
        "Archivo de respaldo no válido."
      );

    }

  };


/* =========================
   BORRAR DATOS
========================= */

$("#resetBtn").onclick = () => {

  if (
    confirm(
      "¿Borrar todos los datos locales de ÚtilHub?"
    )
  ) {

    localStorage.clear();

    data = {
      ...defaults
    };

    applySettings();

    renderQuick();

    renderTools();

  }

};


/* =========================
   CONEXIÓN
========================= */

function updateConnection() {

  const online =
    navigator.onLine;

  $("#connection").textContent =
    online
      ? "● Conectado a Internet"
      : "● Sin conexión: funcionan las herramientas locales";

}


window.addEventListener(
  "online",
  updateConnection
);

window.addEventListener(
  "offline",
  updateConnection
);


/* =========================
   PARTÍCULAS NOVA
========================= */

function createParticles() {

  const container =
    $("#particles");

  for (
    let i = 0;
    i < 45;
    i++
  ) {

    const particle =
      document.createElement("i");

    particle.className =
      "particle";

    particle.style.left =
      Math.random() * 100 + "%";

    particle.style.top =
      75 +
      Math.random() * 30 +
      "%";

    particle.style.animationDuration =
      8 +
      Math.random() * 14 +
      "s";

    particle.style.animationDelay =
      -Math.random() * 15 +
      "s";

    container.appendChild(
      particle
    );

  }

}


/* =========================
   CURSOR NOVA
========================= */

if (
  data.cursor &&
  !matchMedia(
    "(pointer: coarse)"
  ).matches
) {

  document.addEventListener(
    "mousemove",
    event => {

      const x =
        (
          event.clientX /
          innerWidth -
          0.5
        ) * 12;

      const y =
        (
          event.clientY /
          innerHeight -
          0.5
        ) * 12;


      $(".orb-a").style.transform =
        `translate(${x}px, ${y}px)`;

      $(".orb-b").style.transform =
        `translate(${-x}px, ${-y}px)`;

    }
  );

}


/* =========================
   INICIAR
========================= */

createParticles();

applySettings();

renderQuick();

renderTools();

updateConnection();
