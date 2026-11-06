/* ==========================================================================
   КХАМАЧ — БАЗА ДАННЫХ ПОРУЧЕНИЙ И ХРАНИЛИЩЕ КОНСТАНТ (v1.1.0-BETA)
   ========================================================================== */

const CITY_MISSIONS_POOL = [
    { id: "m_t1", allowedHero: "tank", heroName: "Защитник", heroIcon: "🛡️", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Кузнец просит придержать тяжелую наковальню и разгрузить слитки стали.", title: "Помощь в кузнице" },
    { id: "m_t2", allowedHero: "tank", heroName: "Защитник", heroIcon: "🛡️", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Стража ищет живой щит для блокирования прохода взбесившихся кабанов.", title: "Живой заслон ворот" },
    { id: "m_d1", allowedHero: "damage", heroName: "Воин", heroIcon: "🔥", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Дровосеки боятся идти на вырубку из-за расплодившихся диких волков.", title: "Очистка лесопилки" },
    { id: "m_d2", allowedHero: "damage", heroName: "Воин", heroIcon: "🔥", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Хозяин таверны ищет вышибалу, способного взглядом прекращать драки.", title: "Вышибала в таверне" },
    { id: "m_a1", allowedHero: "archer", heroName: "Стрелок", heroIcon: "⚡", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Старый мельник просит перестрелять стаю кровожадных летучих мышей.", title: "Отстрел вредителей" },
    { id: "m_a2", allowedHero: "archer", heroName: "Стрелок", heroIcon: "⚡", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Купеческая гильдия нанимает зоркого следопыта для разведки засад.", title: "Охрана каравана" },
    { id: "m_m1", allowedHero: "mage", heroName: "Маг", heroIcon: "💚", duration: "1 ч", durationMs: 3600000, reward: 133, text: "В лазарете вспыхнула хворь. Лекари просят подпитать людей магией жизни.", title: "Полевое исцеление" },
    { id: "m_m2", allowedHero: "mage", heroName: "Маг", heroIcon: "💚", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Алхимик разлил эссенцию. Требуется удерживать рунический контур.", title: "Стабилизация очага" }
];

const FATIGUE_RESOURCES_COSTS = [
    { key: "plasma", name: "Плазма дракона", icon: "🌋" },
    { key: "blood", name: "Кровь дракона", icon: "🩸" },
    { key: "scale", name: "Чешуя дракона", icon: "🪶" },
    { key: "tears", name: "Слезы дракона", icon: "💧" }
];

function getCurrentResetResourceCost() {
    const hoursThreePhase = Math.floor(Date.now() / (1000 * 60 * 60 * 3));
    const index = hoursThreePhase % FATIGUE_RESOURCES_COSTS.length;
    return FATIGUE_RESOURCES_COSTS[index];
}
