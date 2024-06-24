document.addEventListener("DOMContentLoaded", function () {
  const accessCounter = document.getElementById("accessCounter");

  // Retrieve the current access count from localStorage or initialize it
  let accessCount = localStorage.getItem("accessCount");
  if (!accessCount) {
    accessCount = 0;
  }
  accessCount = parseInt(accessCount) + 1;
  localStorage.setItem("accessCount", accessCount);

  // Update the access counter display
  accessCounter.textContent = `Acessos: ${accessCount}`;
});

document.getElementById("prazoForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const startDate = new Date(document.getElementById("startDate").value);
  const days = parseInt(document.getElementById("days").value);
  const type = document.getElementById("type").value;
  const materia = document.getElementById("materia").value;

  const holidays = {
    "2024-01-01": "Confraternização Universal",
    "2024-01-02": "Suspensão de Expediente",
    "2024-01-03": "Suspensão de Expediente",
    "2024-01-04": "Suspensão de Expediente",
    "2024-01-05": "Suspensão de Expediente",
    "2024-01-06": "Suspensão de Expediente",
    "2024-02-12": "Segunda-feira de Carnaval",
    "2024-02-13": "Carnaval",
    "2024-02-14": "Cinzas",
    "2024-03-27": "Quarta-feira Santa",
    "2024-03-28": "Quinta-feira Santa",
    "2024-03-29": "Paixão de Cristo",
    "2024-04-21": "Tiradentes",
    "2024-05-01": "Dia do Trabalho",
    "2024-05-29": "Suspensão de Expediente",
    "2024-05-30": "Corpus Christi",
    "2024-05-31": "Suspensão de Expediente",
    "2024-07-03": "Aniversário da Cidade de Montes Claros",
    "2024-09-07": "Independência do Brasil",
    "2024-10-12": "Nossa Senhora Aparecida",
    "2024-10-28": "Dia do Funcionário Público",
    "2024-11-02": "Finados",
    "2024-11-15": "Proclamação da República",
    "2024-11-20": "Dia Nacional da Consciência Negra",
    "2024-12-08": "Dia da Justiça",
    "2024-12-20": "Suspensão de Expediente",
    "2024-12-21": "Suspensão de Expediente",
    "2024-12-22": "Suspensão de Expediente",
    "2024-12-23": "Suspensão de Expediente",
    "2024-12-24": "Véspera de Natal",
    "2024-12-25": "Natal",
    "2024-12-26": "Suspensão de Expediente",
    "2024-12-27": "Suspensão de Expediente",
    "2024-12-28": "Suspensão de Expediente",
    "2024-12-29": "Suspensão de Expediente",
    "2024-12-30": "Suspensão de Expediente",
    "2024-12-31": "Véspera de Ano Novo",
  };

  let resultDate = new Date(startDate);
  let log = `Data inicial: ${startDate.toLocaleDateString()}\n\n`;

  // Ajustar a data inicial para o próximo dia (não contado)
  resultDate.setDate(resultDate.getDate() + 1);

  // Se a matéria for Direito Civil, ajustar a data inicial para o próximo dia útil
  if (materia === "civil") {
    while (
      resultDate.getDay() === 0 ||
      resultDate.getDay() === 6 ||
      holidays[resultDate.toISOString().slice(0, 10)]
    ) {
      resultDate.setDate(resultDate.getDate() + 1);
    }
  }
  log += `Data inicial ajustada (se Direito Civil): ${resultDate.toLocaleDateString()}\n\n`;

  let i = 0;
  let calendarHtml = `<table><tr><th>Dia</th><th>Data</th><th>Tipo</th></tr>`;
  while (i < days) {
    resultDate.setDate(resultDate.getDate() + 1);
    let dayType = "";
    if (type === "uteis") {
      if (
        resultDate.getDay() !== 0 &&
        resultDate.getDay() !== 6 &&
        !holidays[resultDate.toISOString().slice(0, 10)]
      ) {
        i++;
        dayType = "Dia Útil";
      } else {
        if (holidays[resultDate.toISOString().slice(0, 10)]) {
          dayType = `Feriado: ${holidays[resultDate.toISOString().slice(0, 10)]}`;
        } else {
          dayType = "Fim de Semana";
        }
      }
    } else {
      i++;
      dayType = "Dia Corrido";
    }

    let rowClass = "";
    if (dayType.includes("Feriado")) {
      rowClass = "holiday";
    } else if (dayType === "Fim de Semana") {
      rowClass = "weekend";
    }

    log += `${dayType} ${i}: ${resultDate.toLocaleDateString()}\n`;
    calendarHtml += `<tr class="${rowClass}"><td>${i}</td><td>${resultDate.toLocaleDateString()}</td><td>${dayType}</td></tr>`;
  }

  // Ajuste para o próximo dia útil se o vencimento cair em feriado ou fim de semana
  if (
    holidays[resultDate.toISOString().slice(0, 10)] ||
    resultDate.getDay() === 0 ||
    resultDate.getDay() === 6
  ) {
    log += `Último dia caiu em feriado ou fim de semana: ${resultDate.toLocaleDateString()} (${
      holidays[resultDate.toISOString().slice(0, 10)] || "Fim de semana"
    })\n`;
    while (
      resultDate.getDay() === 0 ||
      resultDate.getDay() === 6 ||
      holidays[resultDate.toISOString().slice(0, 10)]
    ) {
      resultDate.setDate(resultDate.getDate() + 1);
      log += `Ajustado para o próximo dia útil: ${resultDate.toLocaleDateString()}\n`;
    }
  }

  document.getElementById("result").innerText = `Data final: ${resultDate.toLocaleDateString()}`;

  calendarHtml += `</table>`;
  document.getElementById("calendarContainer").innerHTML = calendarHtml;

  // Mostrar o indicador de carregamento
  document.getElementById("loading").style.display = "block";

  // Usar html2canvas para capturar a imagem do calendário
  html2canvas(document.getElementById("calendarContainer")).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "calendario_prazo.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Esconder o indicador de carregamento
    document.getElementById("loading").style.display = "none";
  });
});
