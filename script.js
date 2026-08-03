const STORAGE_KEY = "commercial-offer-calculator:v1";

const defaultState = {
  clientName: "",
  projectName: "",
  deadline: "7 рабочих дней",
  paymentTerms: "50% предоплата, 50% после согласования результата",
  currency: "RUB",
  discount: 0,
  markup: 0,
  note: "Стоимость актуальна в течение 5 рабочих дней.",
  customProposal: "",
  proposalEdited: false,
  items: [
    { title: "Подготовка структуры проекта", qty: 1, price: 15000 },
    { title: "Разработка и настройка", qty: 1, price: 45000 },
    { title: "Финальная проверка и передача результата", qty: 1, price: 10000 },
  ],
};

const currencyMap = {
  RUB: { locale: "ru-RU", currency: "RUB", symbol: "₽" },
  USD: { locale: "en-US", currency: "USD", symbol: "$" },
  EUR: { locale: "de-DE", currency: "EUR", symbol: "€" },
};

const form = document.querySelector("#offerForm");
const itemsList = document.querySelector("#itemsList");
const itemTemplate = document.querySelector("#itemTemplate");
const proposalText = document.querySelector("#proposalText");
const saveStatus = document.querySelector("#saveStatus");
const copyHint = document.querySelector("#copyHint");

const fields = {
  clientName: document.querySelector("#clientName"),
  projectName: document.querySelector("#projectName"),
  deadline: document.querySelector("#deadline"),
  paymentTerms: document.querySelector("#paymentTerms"),
  currency: document.querySelector("#currency"),
  discount: document.querySelector("#discount"),
  markup: document.querySelector("#markup"),
  note: document.querySelector("#note"),
};

const totals = {
  subtotal: document.querySelector("#subtotalValue"),
  discount: document.querySelector("#discountValue"),
  markup: document.querySelector("#markupValue"),
  total: document.querySelector("#totalValue"),
};

let state = loadState();
let saveTimer = null;

function cloneData(data) {
  if (typeof structuredClone === "function") {
    return structuredClone(data);
  }
  return JSON.parse(JSON.stringify(data));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneData(defaultState);
    const parsed = JSON.parse(raw);
    return {
      ...cloneData(defaultState),
      ...parsed,
      items: Array.isArray(parsed.items) && parsed.items.length ? parsed.items : defaultState.items,
    };
  } catch {
    return cloneData(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveStatus.textContent = "Черновик сохранён";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveStatus.textContent = "Автосохранение включено";
  }, 1800);
}

function money(value) {
  const currency = currencyMap[state.currency] || currencyMap.RUB;
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.currency,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function hydrateFields() {
  Object.entries(fields).forEach(([key, element]) => {
    element.value = state[key] ?? "";
  });
}

function readFields() {
  Object.entries(fields).forEach(([key, element]) => {
    if (element.type === "number") {
      state[key] = numberValue(element.value);
    } else {
      state[key] = element.value.trim();
    }
  });
}

function getGeneratedProposal() {
  return buildProposal(calculate());
}

function renderItems() {
  itemsList.innerHTML = "";

  state.items.forEach((item, index) => {
    const row = itemTemplate.content.firstElementChild.cloneNode(true);
    const title = row.querySelector(".item-title");
    const qty = row.querySelector(".item-qty");
    const price = row.querySelector(".item-price");
    const sum = row.querySelector(".item-sum strong");
    const remove = row.querySelector(".remove-item");

    title.value = item.title;
    qty.value = item.qty;
    price.value = item.price;
    sum.textContent = money(numberValue(item.qty) * numberValue(item.price));

    title.addEventListener("input", () => {
      state.items[index].title = title.value.trim();
      update();
    });

    qty.addEventListener("input", () => {
      state.items[index].qty = numberValue(qty.value);
      update();
    });

    price.addEventListener("input", () => {
      state.items[index].price = numberValue(price.value);
      update();
    });

    remove.addEventListener("click", () => {
      state.items.splice(index, 1);
      if (!state.items.length) {
        state.items.push({ title: "", qty: 1, price: 0 });
      }
      renderItems();
      update();
    });

    itemsList.append(row);
  });
}

function calculate() {
  const subtotal = state.items.reduce((sum, item) => {
    return sum + numberValue(item.qty) * numberValue(item.price);
  }, 0);
  const discount = Math.min(numberValue(state.discount), subtotal);
  const markup = numberValue(state.markup);
  const total = Math.max(subtotal - discount + markup, 0);
  return { subtotal, discount, markup, total };
}

function renderTotals(result) {
  totals.subtotal.textContent = money(result.subtotal);
  totals.discount.textContent = money(result.discount);
  totals.markup.textContent = money(result.markup);
  totals.total.textContent = money(result.total);
}

function renderItemSums() {
  const rows = itemsList.querySelectorAll(".item-row");
  rows.forEach((row, index) => {
    const sum = row.querySelector(".item-sum strong");
    const item = state.items[index];
    if (sum && item) {
      sum.textContent = money(numberValue(item.qty) * numberValue(item.price));
    }
  });
}

function buildProposal(result) {
  const client = state.clientName || "коллеги";
  const project = state.projectName || "вашему проекту";
  const deadline = state.deadline || "срок согласуем отдельно";
  const paymentTerms = state.paymentTerms || "условия оплаты согласуем отдельно";
  const note = state.note;

  const filledItems = state.items.filter((item) => item.title || numberValue(item.price));
  const itemLines = filledItems.length
    ? filledItems
        .map((item, index) => {
          const title = item.title || `Позиция ${index + 1}`;
          const qty = numberValue(item.qty) || 1;
          const price = numberValue(item.price);
          return `${index + 1}. ${title} — ${qty} × ${money(price)} = ${money(qty * price)}`;
        })
        .join("\n")
    : "1. Позиции будут уточнены после согласования объёма работ.";

  const adjustments = [];
  if (result.discount > 0) adjustments.push(`Скидка: ${money(result.discount)}.`);
  if (result.markup > 0) adjustments.push(`Наценка: ${money(result.markup)}.`);

  const lines = [
    `Здравствуйте, ${client}!`,
    "",
    `Подготовил расчёт по проекту: ${project}.`,
    "",
    "Состав работ:",
    itemLines,
    "",
    `Предварительная стоимость: ${money(result.subtotal)}.`,
  ];

  if (adjustments.length) {
    lines.push(...adjustments);
  }

  lines.push(
    `Итоговая стоимость: ${money(result.total)}.`,
    "",
    `Срок выполнения: ${deadline}.`,
    `Условия оплаты: ${paymentTerms}.`
  );

  if (note) {
    lines.push(`Комментарий: ${note}`);
  }

  lines.push("", "Если всё подходит, следующим шагом я подтверждаю объём работ и фиксирую старт.");

  return lines.join("\n");
}

function update() {
  readFields();
  const result = calculate();
  renderItemSums();
  renderTotals(result);
  if (!state.proposalEdited) {
    state.customProposal = buildProposal(result);
  }
  proposalText.value = state.customProposal || buildProposal(result);
  saveState();
}

function addItem() {
  state.items.push({ title: "", qty: 1, price: 0 });
  renderItems();
  update();
  const lastTitle = itemsList.querySelector(".item-row:last-child .item-title");
  if (lastTitle) lastTitle.focus();
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    copyHint.textContent = message;
  } catch {
    proposalText.focus();
    proposalText.select();
    document.execCommand("copy");
    copyHint.textContent = message;
  }

  setTimeout(() => {
    copyHint.textContent = "";
  }, 2200);
}

function resetAll() {
  const confirmed = window.confirm("Очистить форму и начать новый расчёт?");
  if (!confirmed) return;
  state = {
    ...cloneData(defaultState),
    clientName: "",
    projectName: "",
    items: [{ title: "", qty: 1, price: 0 }],
  };
  hydrateFields();
  renderItems();
  update();
}

document.querySelector("#addItem").addEventListener("click", addItem);

document.querySelector("#copyOffer").addEventListener("click", () => {
  copyText(proposalText.value, "Текст КП скопирован.");
});

document.querySelector("#copyTotal").addEventListener("click", () => {
  copyText(totals.total.textContent, "Итоговая сумма скопирована.");
});

document.querySelector("#regenerateOffer").addEventListener("click", () => {
  state.proposalEdited = false;
  state.customProposal = getGeneratedProposal();
  proposalText.value = state.customProposal;
  saveState();
  copyHint.textContent = "Текст обновлён по текущим данным.";
  setTimeout(() => {
    copyHint.textContent = "";
  }, 2200);
});

document.querySelector("#resetAll").addEventListener("click", resetAll);

form.addEventListener("input", update);
form.addEventListener("change", update);

proposalText.addEventListener("input", () => {
  state.proposalEdited = true;
  state.customProposal = proposalText.value;
  saveState();
  saveStatus.textContent = "Текст изменён вручную";
});

hydrateFields();
renderItems();
update();
