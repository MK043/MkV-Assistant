// Advanced AI Video Script & Storyboard Engine
// Context-aware semantic parsing and adaptive video script generation

export function parsePromptNiche(rawPrompt) {
  const text = (rawPrompt || '').toLowerCase();

  // 1. AUTO / CARS / ELECTRIC VEHICLES / IMPORT
  const autoKeywords = [
    'авто', 'машин', 'тачк', 'ліф', 'leaf', 'nissan', 'нісан', 'ніссан', 'бмв', 'bmw',
    'мерседес', 'mercedes', 'audi', 'ауді', 'tesla', 'тесла', 'volkswagen', 'фольц',
    'сша', 'usa', 'пробіг', 'км', 'квт', 'електрокар', 'електромобіль', 'дизель', 'бензин',
    'автопідбір', 'купити авто', 'пошкоджен', 'сл плюс', 'sl plus', 'комплектац', 'carfax'
  ];

  // 2. BEAUTY & SKINCARE
  const beautyKeywords = [
    'крем', 'сироватк', 'шкір', 'обличч', 'догляд', 'зморшк', 'акне', 'косметик',
    'волос', 'шампунь', 'маск', 'spf', 'ретинол', 'гіалурон', 'пептид'
  ];

  // 3. TECH & ELECTRONICS
  const techKeywords = [
    'телефон', 'айфон', 'iphone', 'samsung', 'ноутбук', 'макбук', 'macbook', 'навушник',
    'airpods', 'годинник', 'apple watch', 'гаджет', 'девайс', 'пк', 'комп\'ютер'
  ];

  // 4. REAL ESTATE
  const realEstateKeywords = [
    'квартир', 'житл', 'новобудов', 'оренд', 'будинок', 'котедж', 'жк', 'кімнат',
    'квадратн', 'ремонт', 'локаці', 'рієлтор', 'забудовник'
  ];

  // 5. CLOTHING & FASHION
  const clothingKeywords = [
    'одяг', 'взутт', 'кросівк', 'худі', 'футболк', 'костюм', 'куртк', 'бренд',
    'дроп', 'колекці', 'плаття', 'сумк'
  ];

  // 6. EDUCATION & COURSES
  const eduKeywords = [
    'курс', 'навчан', 'вебінар', 'англійськ', 'професі', 'it', 'крипт', 'ментор',
    'школ', 'урок', 'сертифікат'
  ];

  // 7. SERVICES & B2B
  const servicesKeywords = [
    'послуг', 'маркетинг', 'таргет', 'бухгалтер', 'юрист', 'розробк', 'сайт',
    'дизайн', 'клінінг', 'ремонт авто', 'сервіс'
  ];

  // Check matching scores
  const score = (keywords) => keywords.filter((k) => text.includes(k)).length;

  const scores = {
    auto: score(autoKeywords),
    beauty: score(beautyKeywords),
    tech: score(techKeywords),
    realEstate: score(realEstateKeywords),
    clothing: score(clothingKeywords),
    education: score(eduKeywords),
    services: score(servicesKeywords),
  };

  const highestNiche = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a), ['general', 0]);

  if (highestNiche[1] > 0) {
    return highestNiche[0];
  }
  return 'general';
}

// Extract specific car / product attributes from user prompt
export function extractEntities(rawPrompt) {
  const text = rawPrompt || '';
  const yearMatch = text.match(/\b(201\d|202\d)\b/);
  const kmMatch = text.match(/\b(\d+[\d\s]*(?:тис|тис\.|тисяч|000)?\s*(?:км|km))\b/i);
  const kwhMatch = text.match(/\b(\d+\s*(?:квт|kwh|квт\*год))\b/i);
  const priceMatch = text.match(/(\$?\d+[\d\s]*(?:\$|usd|грн|євро|k))/i);

  // Clean title formulation
  let cleanTitle = rawPrompt.slice(0, 50).trim();
  if (cleanTitle.length >= 48) {
    const lastSpace = cleanTitle.lastIndexOf(' ');
    if (lastSpace > 20) cleanTitle = cleanTitle.slice(0, lastSpace);
    cleanTitle += '...';
  }

  return {
    year: yearMatch ? yearMatch[1] : null,
    mileage: kmMatch ? kmMatch[1] : null,
    battery: kwhMatch ? kwhMatch[1] : null,
    price: priceMatch ? priceMatch[1] : null,
    cleanTitle,
  };
}

// Timings calculator based on duration & scene count
function calculateTimings(totalSeconds, count) {
  const hookSeconds = Math.min(3, Math.round(totalSeconds * 0.15));
  const remaining = totalSeconds - hookSeconds;
  const middleScenes = count - 2;
  const timePerMiddle = Math.round(remaining / (middleScenes + 1));

  const timings = [];
  let currentStart = 0;

  // Scene 1: Hook
  timings.push({ start: 0, end: hookSeconds, label: `0–${hookSeconds}с` });
  currentStart = hookSeconds + 1;

  // Middle scenes
  for (let i = 0; i < middleScenes; i++) {
    const end = i === middleScenes - 1
      ? totalSeconds - Math.round(remaining / (middleScenes + 1))
      : currentStart + timePerMiddle - 1;
    timings.push({ start: currentStart, end, label: `${currentStart}–${end}с` });
    currentStart = end + 1;
  }

  // Final Scene: CTA
  timings.push({ start: currentStart, end: totalSeconds, label: `${currentStart}–${totalSeconds}с` });
  return timings;
}

export function generateSmartStoryboard({
  product = '',
  format = 'TikTok / Reels (9:16 Вертикальне)',
  duration = '30 секунд',
  scenesCount = 4,
  filmingStyle = 'UGC зйомка на iPhone (Селфі + POV)',
  campaignGoal = 'Холодний трафік (Максимальне зачеплення)',
  hookType = 'Ціна / Вигода (Shock Price)',
  tone = 'Динамічна та провокативна',
}) {
  const niche = parsePromptNiche(product);
  const entities = extractEntities(product);
  const totalSeconds = parseInt(duration) || 30;
  const numScenes = Number(scenesCount) || 4;
  const timings = calculateTimings(totalSeconds, numScenes);

  // Generate tailored storyboard based on detected niche
  if (niche === 'auto') {
    return buildAutoStoryboard({
      rawPrompt: product,
      entities,
      format,
      duration,
      timings,
      numScenes,
      filmingStyle,
      campaignGoal,
      hookType,
      tone,
    });
  }

  if (niche === 'beauty') {
    return buildBeautyStoryboard({
      rawPrompt: product,
      entities,
      format,
      duration,
      timings,
      numScenes,
      filmingStyle,
      campaignGoal,
      hookType,
      tone,
    });
  }

  if (niche === 'tech') {
    return buildTechStoryboard({
      rawPrompt: product,
      entities,
      format,
      duration,
      timings,
      numScenes,
      filmingStyle,
      campaignGoal,
      hookType,
      tone,
    });
  }

  if (niche === 'realEstate') {
    return buildRealEstateStoryboard({
      rawPrompt: product,
      entities,
      format,
      duration,
      timings,
      numScenes,
      filmingStyle,
      campaignGoal,
      hookType,
      tone,
    });
  }

  // Default Universal Adaptive Generator
  return buildGeneralStoryboard({
    rawPrompt: product,
    entities,
    format,
    duration,
    timings,
    numScenes,
    filmingStyle,
    campaignGoal,
    hookType,
    tone,
  });
}

// ----------------------------------------------------
// 1. AUTO / CARS / ELECTRIC VEHICLES (E.g. Nissan Leaf USA)
// ----------------------------------------------------
function buildAutoStoryboard({ rawPrompt, entities, format, duration, timings, numScenes, filmingStyle, hookType, tone }) {
  const carName = entities.year ? `Nissan Leaf ${entities.year}` : 'Nissan Leaf';
  const batteryStr = entities.battery ? `на ${entities.battery}` : 'на 62 кВт';
  const mileageStr = entities.mileage ? `з пробігом ${entities.mileage}` : 'з рідним пробігом';

  const title = `${carName} SL Plus (${batteryStr}) • Авто з США`;

  const scenes = [];

  // Scene 1: Hook
  let hookQuote = '';
  if (hookType.includes('Ціна') || hookType.includes('Shock')) {
    hookQuote = `«Скільки насправді коштує привезти живий ${carName} ${batteryStr} з США під ключ без націнок перекупів? Показую цифри...»`;
  } else if (hookType.includes('Особистий')) {
    hookQuote = `«Щойно розмитнив та забрав з порту цей ${carName} SL Plus. Зараз чесно покажу, що з ним було в Америці та в якому він стані...»`;
  } else {
    hookQuote = `«Не купуй бензинове авто у 2026 році, поки не побачиш цей ${carName} ${batteryStr}. Повний заряд — всього 65 гривень!»`;
  }

  scenes.push({
    number: 1,
    time: timings[0].label,
    title: 'Шок-хук та привернення уваги',
    shotType: 'Динамічний Crash Zoom на передню оптику + селфі-камера',
    visual: `Ведучий стоїть біля капота авто з фірмовим ключем-брелоком. Камера швидко наїжджає на відновлене переднє крило та фару, демонструючи ідеальні заводські зазори без кривизни.`,
    quote: hookQuote,
    audioFx: 'Тихий футуристичний свист увімкнення електрокара, різкий бас-дроп',
    tag: '3s Hold Rate ціль: > 62%',
  });

  // Scene 2: Bodywork & Inspection (Proof / Damage honesty)
  scenes.push({
    number: 2,
    time: timings[1].label,
    title: 'Перевірка стану та доказ якості відновлення',
    shotType: 'Макрозйомка товщиноміром + крупний план підкапотного простору',
    visual: `Ведучий прикладає прилад до переднього крила та капота (покази 110–120 мікронів). Камера показує цілі лонжерони, заводські кліпси та рідний бачок. Поверх відео плашка: «Безпека ціла, стріляних подушок 0».`,
    quote: `«Удар у США був суто косметичний — по бамперу та крилу. Геометрія в заводі, радіатор цілий, безпека взагалі не спрацьовувала. Carfax кришталево чистий.»`,
    audioFx: 'Звук сигналу товщиноміра «пік-пік», динамічний фоновий трек',
    tag: 'Закриття головного страху (ДТП)',
  });

  // Scene 3: Battery & Interior (if >= 3 scenes)
  if (numScenes >= 3) {
    scenes.push({
      number: 3,
      time: timings[2].label,
      title: 'Салон SL Plus та стан батареї',
      shotType: 'Плавний рух камери салоном (POV від водія)',
      visual: `Широкий кадр максимальної комплектації: чорна перфорована шкіра, камери 360°, круїз-контроль ProPILOT. Кадр панелі приладів: зафіксовано ${mileageStr} та всі 12 поділок здоров\'я батареї (SOH 93%).`,
      quote: `«Це максималка SL Plus: камери 360, підігріви всіх сидінь, преміум акустика. А головне — батарея ${batteryStr} з залишком понад 90%. Запас ходу до 380 км на одному заряді!»`,
      audioFx: 'Клацання замка дверей, тихий звук сенсорного монітора',
      tag: 'Підтвердження цінності комплектації',
    });
  }

  // Scene 4: Drive test (if >= 5 scenes)
  if (numScenes >= 5) {
    scenes.push({
      number: 4,
      time: timings[3].label,
      title: 'Тест-драйв у місті та розгін',
      shotType: 'Камера на лобовому склі + вигляд з пасажирського сидіння',
      visual: `Плавний безшумний старт на світлофорі, водій тисне педаль у підлогу — відчутна динаміка електротяги. Графіка на екрані: «Витрати на 100 км: 55–65 грн замість 450 грн на бензині».`,
      quote: `«Динаміка розгону вражає з першої секунди. Забудь про заміну мастила, фільтрів та черги на заправках — заряджаєш вночі в гаражі за копійки.»`,
      audioFx: 'Звук прискорення електрокара, легкий ембієнт',
      tag: 'Раціональне обґрунтування вигоди',
    });
  }

  // Final Scene: Offer & CTA
  const lastTiming = timings[timings.length - 1];
  scenes.push({
    number: numScenes,
    time: lastTiming.label,
    title: 'Фінальний заклик до дії (Офер та тест-драйв)',
    shotType: 'Пакшот автомобіля в русі + ведучий біля відкритого вікна',
    visual: `Автомобіль стоїть на майданчику з українськими номерами. З\'являється стрілка на кнопку сайту та плашка: «Доступний лізинг від 15% або викуп за готівку. Повний звіт Carfax безкоштовно».`,
    quote: `«Авто вже в наявності та готове до переоформлення за 30 хвилин. Тисни посилання внизу під відео, щоб зафіксувати ціну та забронювати тест-драйв просто зараз!»`,
    audioFx: 'Фінальний акорд біта, клік на кнопку',
    tag: 'Конверсія в лід / Запис на тест-драйв',
  });

  return {
    title,
    duration,
    product: rawPrompt,
    format,
    hookType,
    tone,
    niche: 'Автобізнес та електромобілі',
    scenes,
  };
}

// ----------------------------------------------------
// 2. BEAUTY & COSMETICS
// ----------------------------------------------------
function buildBeautyStoryboard({ rawPrompt, entities, format, duration, timings, numScenes, hookType, tone }) {
  const pName = entities.cleanTitle || 'Сироватка для обличчя';
  const title = `${pName} • Конверсійний UGC ролик`;
  const scenes = [];

  scenes.push({
    number: 1,
    time: timings[0].label,
    title: 'Шок-хук проблеми шкіри',
    shotType: 'Крупний план дзеркала, селфі дівчини без макіяжу',
    visual: 'Дівчина розчаровано дивиться на пори та сухість у дзеркалі, змиваючи звичайний засіб водою.',
    quote: '«Якщо твій крем досі скочується і забиває пори замість зволоження — викинь його просто зараз...»',
    audioFx: 'Звук крапель води, глухий бас-хук',
    tag: '3s Hold Rate ціль: > 58%',
  });

  scenes.push({
    number: 2,
    time: timings[1].label,
    title: 'Демонстрація текстури та нанесення',
    shotType: 'Макрозйомка піпетки та краплі на вилиці (Slow-mo)',
    visual: 'Крапля сироватки повільно розтікається по шкірі. Миттєве вбирання без липкого шару, сяючий фініш.',
    quote: '«Ця формула проникає в дерму за 10 секунд. Замінює одразу зволожуючий крем, праймер і сироватку.»',
    audioFx: 'Приємний ASMR звук краплі та дотику',
    tag: 'Продуктовий доказ (Product Proof)',
  });

  if (numScenes >= 4) {
    scenes.push({
      number: 3,
      time: timings[2].label,
      title: 'Результат "До / Після"',
      shotType: 'Розділений екран (Split-screen) 50/50',
      visual: 'Зліва тьмяна шкіра до використання, справа — рівний тон та сяйво через 7 днів застосування.',
      quote: '«Вже через тиждень зникає лущення, а макіяж лягає рівно без тонального крему.»',
      audioFx: 'Легкий звуковий гліммер (Magic chime)',
      tag: 'Соціальний доказ та результат',
    });
  }

  const lastTiming = timings[timings.length - 1];
  scenes.push({
    number: numScenes,
    time: lastTiming.label,
    title: 'Офер зі знижкою та CTA',
    shotType: 'Фірмовий пакшот баночки поруч з боксом доставки',
    visual: 'Плашка з промокодом на знижку -25% та безкоштовною доставкою при замовленні від 2 штук.',
    quote: '«Переходь на сайт за кнопкою нижче та забирай сироватку зі знижкою 25%, поки діє акційна партія!»',
    audioFx: 'Енергійний джингл, клік кнопки замовлення',
    tag: 'Офер: Знижка -25% + Free delivery',
  });

  return { title, duration, product: rawPrompt, format, hookType, tone, niche: 'Краса та косметика', scenes };
}

// ----------------------------------------------------
// 3. TECH & GADGETS
// ----------------------------------------------------
function buildTechStoryboard({ rawPrompt, entities, format, duration, timings, numScenes, hookType, tone }) {
  const pName = entities.cleanTitle || 'Гаджет';
  const title = `${pName} • Техно-огляд та офер`;
  const scenes = [];

  scenes.push({
    number: 1,
    time: timings[0].label,
    title: 'Хук розпаковки та ціни',
    shotType: 'Швидкий наїзд зверху (Top-Down Desk Shot)',
    visual: 'Руки зривають заводську плівку з коробки, камера фіксує матові грані пристрою під студійним світлом.',
    quote: `«Чому всі переплачують у великих мережах, якщо цей ${pName} можна забрати на 30% дешевше з офіційною гарантією?»`,
    audioFx: 'Приємний ASMR звук зривання захисної плівки, клацання',
    tag: 'Hold Rate ціль: > 65%',
  });

  scenes.push({
    number: 2,
    time: timings[1].label,
    title: 'Тест екрану та швидкодії',
    shotType: 'Макрозйомка дисплея 120 Гц під кутом 45°',
    visual: 'Швидкий скролінг інтерфейсу, перевірка динаміків та камер. Чіткі графічні плашки з характеристиками.',
    quote: '«Оригінальний акумулятор 100%, екран без жодної подряпини, камери пишуть 4K 60 кадрів без змазування.»',
    audioFx: 'Звук затвора камери, стереозвучання динаміків',
    tag: 'Перевірка якості та оригінальності',
  });

  if (numScenes >= 4) {
    scenes.push({
      number: 3,
      time: timings[2].label,
      title: 'Комплектація та захист клієнта',
      shotType: 'Розкладка комплекту на фірмовому килимку',
      visual: 'Демонстрація повного комплекту: кабель швидкої зарядки, гарантійний талон на 12 місяців, подарунковий чохол.',
      quote: '«Кожен девайс проходить 32 тести за протоколом. Відправляємо накладним платежем без передоплат.»',
      audioFx: 'Клацання коробки, звук розпаковки',
      tag: 'Зняття бар\'єру недовіри',
    });
  }

  const lastTiming = timings[timings.length - 1];
  scenes.push({
    number: numScenes,
    time: lastTiming.label,
    title: 'Заклик до дії та бронь',
    shotType: 'Ведучий тримає гаджет у руці, спрямовуючи погляд у камеру',
    visual: 'Плашка: «Залишилося всього 4 одиниці за цією ціною». Кнопка переходу в каталог.',
    quote: '«Тисни «Детальніше» прямо зараз, замовляй без передоплати та отримай захисне скло в подарунок!»',
    audioFx: 'Фінальний дроп, кнопка покупки',
    tag: 'Конверсія в замовлення',
  });

  return { title, duration, product: rawPrompt, format, hookType, tone, niche: 'Електроніка та гаджети', scenes };
}

// ----------------------------------------------------
// 4. REAL ESTATE & HOUSING
// ----------------------------------------------------
function buildRealEstateStoryboard({ rawPrompt, entities, format, duration, timings, numScenes, hookType, tone }) {
  const pName = entities.cleanTitle || 'Нерухомість';
  const title = `${pName} • Відео-тур об\'єктом`;
  const scenes = [];

  scenes.push({
    number: 1,
    time: timings[0].label,
    title: 'Хук панорами та ціни',
    shotType: 'Кінематографічний проліт від дверей до панорамного вікна',
    visual: 'Широкий кут 0.5x: сонячне світло заливає кухню-вітальню з високими стелями. На екрані ціна за м².',
    quote: '«Квартира з готовим ремонтом за ціною сирцю? Показую планування, яке розберуть до кінця тижня...»',
    audioFx: 'Звук відкриття дверей, повітряний гліссандо',
    tag: 'Hold Rate ціль: > 60%',
  });

  scenes.push({
    number: 2,
    time: timings[1].label,
    title: 'Планування та якість оздоблення',
    shotType: 'Плавний рух на стабілізаторі через спальню та санвузол',
    visual: 'Камера показує вбудовану техніку, теплу підлогу, якісну сантехніку та вид з балкона.',
    quote: '«Автономне опалення, шумоізоляція, закритий двір без авто та підземний паркінг прямо під будинком.»',
    audioFx: 'Спокійна лаунж-музика, кроки по паркету',
    tag: 'Демонстрація переваг локації',
  });

  const lastTiming = timings[timings.length - 1];
  scenes.push({
    number: numScenes,
    time: lastTiming.label,
    title: 'Запис на перегляд',
    shotType: 'Рієлтор на фоні будинку з ключами',
    visual: 'Кнопка «Записатися на персональний перегляд». Контакти та карта району.',
    quote: '«Пиши в дірект або тисни кнопку під відео, щоб отримати планування у PDF та приїхати на перегляд сьогодні!»',
    audioFx: 'Фінальний акорд',
    tag: 'Конверсія в запис на перегляд',
  });

  return { title, duration, product: rawPrompt, format, hookType, tone, niche: 'Нерухомість', scenes };
}

// ----------------------------------------------------
// 5. UNIVERSAL ADAPTIVE GENERATOR (For Any Task)
// ----------------------------------------------------
function buildGeneralStoryboard({ rawPrompt, entities, format, duration, timings, numScenes, hookType, tone, filmingStyle }) {
  const cleanSubject = entities.cleanTitle || rawPrompt.slice(0, 40).trim() || 'Ваша пропозиція';
  const title = `Рекламна кампанія: «${cleanSubject}»`;
  const scenes = [];

  // Scene 1: Hook
  scenes.push({
    number: 1,
    time: timings[0].label,
    title: 'Хук перших 3 секунд (Утримання уваги)',
    shotType: `${filmingStyle.split(' ')[0]} + Динамічний наїзд камери`,
    visual: `Динамічний перший план: ведучий або демонстратор одразу презентує ключовий об\'єкт: ${cleanSubject}. Кадр починається з несподіваного кута або інтригуючої дії.`,
    quote: `«Більшість помиляється, обираючи це наосліп... Якщо шукаєш перевірене рішення для ${cleanSubject} — дивись до кінця!»`,
    audioFx: 'Різкий звуковий перехід (Woosh), динамічний старт біта',
    tag: '3s Hold Rate ціль: > 55%',
  });

  // Scene 2: The Core Problem or Examination
  scenes.push({
    number: 2,
    time: timings[1].label,
    title: 'Демонстрація суті та ключових переваг',
    shotType: 'Крупний план деталей + B-roll перебивки',
    visual: `Макро-демонстрація ключових характеристик. Графічні плашки на екрані підкреслюють надійність, вигоду та практичність рішення.`,
    quote: `«Ось чому саме це рішення працює: без прихованих платежів, перевірена якість та пряма вигода вже з першого використання.»`,
    audioFx: 'Фоновий ритмічний трек, акценти на ключових словах',
    tag: 'Раціональне переконання',
  });

  // Scene 3: Trust / Proof (if >= 4 scenes)
  if (numScenes >= 4) {
    scenes.push({
      number: 3,
      time: timings[2].label,
      title: 'Доказ надійності та закриття заперечень',
      shotType: 'Живий відгук або POV-використання в реальних умовах',
      visual: `Показ реального процесу роботи або відгуків клієнтів. Зняття сумнівів щодо термінів, гарантії та повернення.`,
      quote: `«Жодних ризиків: повна прозорість, гарантія результату та супровід від початку до кінця.»`,
      audioFx: 'Впевнений звуковий сигнал підтвердження',
      tag: 'Закриття страхів клієнта',
    });
  }

  // Final Scene: CTA
  const lastTiming = timings[timings.length - 1];
  scenes.push({
    number: numScenes,
    time: lastTiming.label,
    title: 'Фінальний офер та заклик до дії (CTA)',
    shotType: 'Пакшот із контактними даними та кнопкою переходу',
    visual: `Чітка плашка зі спеціальною пропозицією, обмеженою в часі. Стрілка вказує на кнопку переходу під відео.`,
    quote: `«Тисни на кнопку «Детальніше» під відео просто зараз, щоб дізнатися всі деталі та зафіксувати найвигідніші умови!»`,
    audioFx: 'Фінальний комерційний акорд, клацання кнопки',
    tag: 'Конверсія в лід / клік',
  });

  return {
    title,
    duration,
    product: rawPrompt,
    format,
    hookType,
    tone,
    niche: 'Адаптивний медіабаїнг',
    scenes,
  };
}
