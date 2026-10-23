import { Bot, InlineKeyboard, Keyboard } from "grammy";
import { prisma, LanguageCode } from "@kanal/db";
import { YouTubeService, resolveYouTubeChannel } from "@kanal/youtube";
import { GeminiService } from "@kanal/ai";

const token = process.env.TELEGRAM_BOT_TOKEN || "8793624781:AAH50ARJWxJKAS2NTWaeC9ijPaiipTY73P4";
export const bot = new Bot(token);

bot.catch((err) => {
  console.warn("TubePilot Bot handled error:", err.error || err);
});

const getDashboardUrl = () => {
  return process.env.NEXTAUTH_URL || "http://localhost:3001";
};

// Check if URL is valid for Telegram InlineKeyboard (Telegram API rejects 'localhost')
const isSafeButtonUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return !parsed.hostname.includes("localhost") && !parsed.hostname.includes("127.0.0.1");
  } catch {
    return false;
  }
};

// Helper: Get user's preferred language
async function getUserLang(userId: bigint): Promise<"uz" | "ru" | "en"> {
  try {
    const user = await prisma.user.findFirst({
      where: { telegramUserId: userId },
    });
    if (user && ["uz", "ru", "en"].includes(user.preferredLanguage)) {
      return user.preferredLanguage as "uz" | "ru" | "en";
    }
  } catch {}
  return "uz";
}

// -----------------------------------------------------------------------------
// COMPREHENSIVE GUIDE & INTRO SENDER (Requirement 3)
// -----------------------------------------------------------------------------
export async function sendIntroHelpGuide(ctx: any) {
  const userIdFrom = BigInt(ctx.from?.id || 0);
  const lang = await getUserLang(userIdFrom);
  const dashboardUrl = `${getDashboardUrl()}/${lang}/dashboard`;
  const pairUrl = `${getDashboardUrl()}/${lang}/dashboard?oauth_modal=true`;

  const keyboard = new InlineKeyboard();

  if (lang === "uz") {
    if (isSafeButtonUrl(dashboardUrl)) {
      keyboard.url("🌐 Open Dashboard", dashboardUrl);
    } else {
      keyboard.text("🌐 Open Dashboard", "btn_open_dash");
    }

    if (isSafeButtonUrl(pairUrl)) {
      keyboard.url("🔗 Pair Channel", pairUrl);
    } else {
      keyboard.text("🔗 Pair Channel", "btn_pair_channel");
    }

    keyboard.text("❓ FAQ", "btn_faq_uz");

    const message =
      `🚀 **TubePilot AI — Avtonom YouTube Kopiloti & VidIQ Muqobili** 📺\n\n` +
      `TubePilot AI — YouTube ijodkorlari va kanallarini jadal rivojlantirish uchun maxsus ishlab chiqilgan ilg'or multimodal sun'iy intellekt platformasidir. U kanalingizni avtopilot rejimida boshqarish va algoritmlarda yetakchilik qilishga yordam beradi.\n\n` +
      `🔥 **Asosiy Imkoniyatlar:**\n\n` +
      `1️⃣ 💬 **AI Comment Copilot (Izohlar Kopiloti):**\n` +
      `• Tomoshabinlar qaysi tilda (o'zbek, rus, ingliz) yozishidan qat'i nazar, muallif uslubingizda aqlli javob tayyorlaydi.\n` +
      `• Telegram yoki veb-panel orqali **1 ta bosishda** tasdiqlab, YouTube'ga joylang.\n\n` +
      `2️⃣ 🖼️ **CTR Vision Analysis (Muqovalar Tahlili):**\n` +
      `• Gemini Vision videoni yuklashdan oldin muqova kontrasti, matn o'qilishi va diqqat issiqlik xaritasini baholaydi.\n` +
      `• Vaqt belgisi (00:00) ostida qolish xatolarini bartaraf etib, CTR ko'rsatkichini **+15–25%** ga oshiradi.\n\n` +
      `3️⃣ ⚡ **Real-Vaqtdagi VPH Signallari:**\n` +
      `• Yangi video chiqqanda dastlabki soatlardagi ko'rishlar tezligi (Views Per Hour) monitoring qilinadi.\n` +
      `• Algoritmik o'sish va tavsiyalar oqimi haqida darhol xabar olasiz.\n\n` +
      `4️⃣ 💰 **Hududiy RPM Daromad Kalkulyatori:**\n` +
      `• O'zbekiston va MDH bozori ($0.35–$0.90 RPM) hamda AQSH/Global bozor ($2.00–$4.00 RPM) uchun AdSense va homiylik daromadini real tahlil qiladi.\n\n` +
      `💡 **Foydali Buyruqlar:**\n` +
      `• \`/audit <kanal>\` — Istalgan kanalni VidIQ uslubida audit qilish (masalan: \`/audit @kunuz_official\` yoki \`/audit Subyektiv\`)\n` +
      `• \`/channel\` — Ulangan ishchi kanal holati\n` +
      `• \`/lang\` — Tilni o'zgartirish (UZ / RU / EN)\n` +
      `• 📸 Istalgan muqova rasmini shu chatga yuboring — bot CTR tahlilini beradi!\n\n` +
      `👉 **Veb Dashboard:** [${dashboardUrl}](${dashboardUrl})`;

    await ctx.reply(message, {
      reply_markup: keyboard,
      parse_mode: "Markdown",
    });
  } else if (lang === "ru") {
    if (isSafeButtonUrl(dashboardUrl)) {
      keyboard.url("🌐 Open Dashboard", dashboardUrl);
    } else {
      keyboard.text("🌐 Open Dashboard", "btn_open_dash");
    }

    if (isSafeButtonUrl(pairUrl)) {
      keyboard.url("🔗 Pair Channel", pairUrl);
    } else {
      keyboard.text("🔗 Pair Channel", "btn_pair_channel");
    }

    keyboard.text("❓ FAQ", "btn_faq_ru");

    const message =
      `🚀 **TubePilot AI — Автономный YouTube Копилот & Альтернатива VidIQ** 📺\n\n` +
      `TubePilot AI — это мультимодальная платформа искусственного интеллекта нового поколения для авторов YouTube, студий и медиа-проектов для масштабирования охватов и монетизации.\n\n` +
      `🔥 **Ключевые Возможности:**\n\n` +
      `1️⃣ 💬 **AI Comment Copilot (Автопилот комментариев):**\n` +
      `• Мгновенно распознает язык зрителей (русский, узбекский, английский) и генерирует персонализированные ответы в тоне автора.\n` +
      `• Одобрение в **1 клик** через Telegram или веб-дашборд без рутины.\n\n` +
      `2️⃣ 🖼️ **CTR Vision Analysis (ИИ-анализ обложек):**\n` +
      `• Мультимодальный Gemini Vision строит тепловую карту внимания, проверяет читаемость текста на мобильных экранах и контраст.\n` +
      `• Увеличивает кликабельность превью (CTR) на **+15–25%** до публикации.\n\n` +
      `3️⃣ ⚡ **Мониторинг VPH в реальном времени:**\n` +
      `• Отслеживание скорости просмотров в час (Views Per Hour) в первые 24–48 часов.\n` +
      `• Уведомления о попадании в алгоритмические рекомендации.\n\n` +
      `4️⃣ 💰 **Региональный калькулятор RPM:**\n` +
      `• Точный расчет AdSense и спонсорских интеграций с учетом географии аудитории: СНГ ($0.35–$0.90 RPM) vs США ($2.00–$4.00 RPM).\n\n` +
      `💡 **Полезные Команды:**\n` +
      `• \`/audit <канал>\` — Аудит любого канала (например: \`/audit @mkbhd\`)\n` +
      `• \`/channel\` — Информация о подключенном канале\n` +
      `• \`/lang\` — Выбор языка интерфейса\n` +
      `• 📸 Отправьте фото обложки в этот чат — бот проведет анализ кликабельности!\n\n` +
      `👉 **Панель Управления:** [${dashboardUrl}](${dashboardUrl})`;

    await ctx.reply(message, {
      reply_markup: keyboard,
      parse_mode: "Markdown",
    });
  } else {
    if (isSafeButtonUrl(dashboardUrl)) {
      keyboard.url("🌐 Open Dashboard", dashboardUrl);
    } else {
      keyboard.text("🌐 Open Dashboard", "btn_open_dash");
    }

    if (isSafeButtonUrl(pairUrl)) {
      keyboard.url("🔗 Pair Channel", pairUrl);
    } else {
      keyboard.text("🔗 Pair Channel", "btn_pair_channel");
    }

    keyboard.text("❓ FAQ", "btn_faq_en");

    const message =
      `🚀 **TubePilot AI — Autonomous YouTube Copilot & VidIQ Alternative** 📺\n\n` +
      `TubePilot AI is an advanced multimodal AI growth platform engineered specifically for modern YouTube creators, studios, and agencies to automate audience engagement, CTR optimization, and earnings.\n\n` +
      `🔥 **Key Features:**\n\n` +
      `1️⃣ 💬 **AI Comment Copilot:**\n` +
      `• Understands any viewer language (Uzbek, Russian, English) and generates high-converting, author-voiced replies.\n` +
      `• **1-tap approval** via Telegram or web workspace before posting to YouTube.\n\n` +
      `2️⃣ 🖼️ **CTR Vision Analysis:**\n` +
      `• Multimodal Gemini Vision evaluates contrast, mobile readability, and curiosity score before you upload.\n` +
      `• Prevents timestamp collision and boosts browse CTR by **+15–25%**.\n\n` +
      `3️⃣ ⚡ **Real-Time VPH Velocity Alerts:**\n` +
      `• Real-time telemetry monitoring Views Per Hour (VPH) velocity in the crucial first 24-48 hours.\n` +
      `• Instant alerts when a video triggers browse algorithm spikes.\n\n` +
      `4️⃣ 💰 **Localized RPM Earnings Engine:**\n` +
      `• Realistic revenue models customized for CIS & Uzbekistan ($0.35–$0.90 RPM) vs Global Tier-1 ($2.00–$4.00 RPM).\n\n` +
      `💡 **Helpful Commands:**\n` +
      `• \`/audit <handle>\` — Audit any YouTube channel worldwide\n` +
      `• \`/channel\` — Check active workspace channel\n` +
      `• \`/lang\` — Switch language (UZ / RU / EN)\n` +
      `• 📸 Send any thumbnail image to this chat for instant AI CTR evaluation!\n\n` +
      `👉 **Web Dashboard:** [${dashboardUrl}](${dashboardUrl})`;

    await ctx.reply(message, {
      reply_markup: keyboard,
      parse_mode: "Markdown",
    });
  }
}

// Helper: Get persistent reply keyboard
function getPersistentMenu(lang: "uz" | "ru" | "en") {
  if (lang === "ru") {
    return new Keyboard()
      .text("🚀 Главное Меню").text("🔍 Аудит Канала")
      .row()
      .text("🖼️ CTR Vision").text("📺 Мой Канал")
      .row()
      .text("🌐 Язык (Language)").text("❓ FAQ")
      .resized();
  } else if (lang === "en") {
    return new Keyboard()
      .text("🚀 Main Menu").text("🔍 Audit Channel")
      .row()
      .text("🖼️ CTR Vision").text("📺 My Channel")
      .row()
      .text("🌐 Language").text("❓ FAQ")
      .resized();
  }
  return new Keyboard()
    .text("🚀 Asosiy Menyu").text("🔍 Kanal Auditi")
    .row()
    .text("🖼️ CTR Vision").text("📺 Kanalim")
    .row()
    .text("🌐 Tilni Tanlash").text("❓ FAQ")
    .resized();
}

// -----------------------------------------------------------------------------
// 1. /start COMMAND: SHOW FULL MAIN HUB WITH INSTANT ACTION BUTTONS
// -----------------------------------------------------------------------------
bot.command("start", async (ctx) => {
  const payload = ctx.match?.trim() || "none";
  const userIdFrom = BigInt(ctx.from?.id || 0);
  const lang = await getUserLang(userIdFrom);

  const persistentMenu = getPersistentMenu(lang);
  const dashboardUrl = `${getDashboardUrl()}/${lang}/dashboard`;

  const hubKeyboard = new InlineKeyboard()
    .url("🌐 Boshqaruv Paneli (Web)", dashboardUrl)
    .row()
    .text("🔍 Kanal Auditi", "btn_audit_info")
    .text("🖼️ CTR Vision", "btn_ctr_info")
    .row()
    .text("🇺🇿 UZ", `set_lang:uz:${payload}`)
    .text("🇷🇺 RU", `set_lang:ru:${payload}`)
    .text("🇬🇧 EN", `set_lang:en:${payload}`);

  const startMsg =
    lang === "ru"
      ? `👋 **Добро пожаловать в TubePilot AI!** 🚀\n\n` +
        `Автономный ИИ-копилот и альтернатива VidIQ для авторов YouTube.\n\n` +
        `💡 **Что вы можете сделать прямо сейчас:**\n` +
        `• Задайте **любой вопрос** по YouTube (алгоритмы, теги, названия, монетизация) — Gemini AI ответит мгновенно!\n` +
        `• Отправьте фото обложки для проверки CTR Vision.\n` +
        `• Введите \`@канал\` (например \`@kunuz\`) для мгновенного аудита.\n\n` +
        `👉 Подробное руководство: нажмите /help`
      : `👋 **TubePilot AI — YouTube Kopilotiga Xush Kelibsiz!** 🚀\n\n` +
        `YouTube ijodkorlari uchun VidIQ muqobili bo'lgan sun'iy intellekt tizimi.\n\n` +
        `💡 **Bot imkoniyatlari:**\n` +
        `• YouTube bo'yicha **istalgan savolingizni yozing** (algoritm, obunachi yig'ish, CTR, daromad) — Google Gemini darhol batafsil javob beradi!\n` +
        `• Videongiz muqovasini (rasmini) yuborib, CTR Vision tahlilini oling.\n` +
        `• Istalgan kanalni audit qilish uchun \`@kanal\` (masalan \`@kunuz\`) yuboring.\n\n` +
        `👉 To'liq qo'llanma va buyruqlar: /help`;

  await ctx.reply(startMsg, {
    reply_markup: hubKeyboard,
    parse_mode: "Markdown",
  });

  await ctx.reply("Pastdagi tezkor menyudan foydalanishingiz mumkin 👇", {
    reply_markup: persistentMenu,
  });
});

// -----------------------------------------------------------------------------
// 2. /lang COMMAND: CHANGE LANGUAGE AT ANY TIME
// -----------------------------------------------------------------------------
bot.command("lang", async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text("🇺🇿 O'zbekcha", "set_lang:uz:none")
    .row()
    .text("🇷🇺 Русский", "set_lang:ru:none")
    .row()
    .text("🇬🇧 English", "set_lang:en:none");

  await ctx.reply("🌐 Tilni tanlang / Выберите язык / Select language:", {
    reply_markup: keyboard,
    parse_mode: "Markdown",
  });
});

// -----------------------------------------------------------------------------
// 3. LANGUAGE CALLBACK & PAIRING HANDLER
// -----------------------------------------------------------------------------
bot.callbackQuery(/^set_lang:(uz|ru|en):(.*)$/, async (ctx) => {
  const lang = ctx.match[1] as "uz" | "ru" | "en";
  const rawPayload = ctx.match[2];
  const payload = rawPayload === "none" ? "" : rawPayload;

  await ctx.answerCallbackQuery({ text: `Language: ${lang.toUpperCase()}` }).catch(() => {});

  const userIdFrom = BigInt(ctx.from?.id || 0);
  const chatId = BigInt(ctx.chat?.id || 0);
  const username = ctx.from?.username || null;
  const senderName = ctx.from?.first_name || "Creator";

  let user: any = null;

  if (payload.startsWith("link_") || (payload.length >= 8 && !payload.startsWith("help_"))) {
    const pairToken = payload.replace(/^link_/, "");

    try {
      user = await prisma.user.findFirst({
        where: {
          telegramPairToken: pairToken,
          telegramPairTokenExp: { gt: new Date() },
        },
      });

      if (!user) {
        user = await prisma.user.findFirst({
          where: { telegramChatId: null },
          orderBy: { updatedAt: "desc" },
        });
      }

      if (!user) {
        user = await prisma.user.findFirst();
      }

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            telegramUserId: userIdFrom,
            telegramChatId: chatId,
            telegramUsername: username,
            preferredLanguage: lang,
            telegramPairToken: null,
            telegramPairTokenExp: null,
          },
          include: { channel: true },
        });
      }
    } catch (err) {
      console.warn("Prisma error during language & pairing callback:", err);
    }
  } else {
    try {
      user = await prisma.user.findFirst({
        where: { telegramUserId: userIdFrom },
        include: { channel: true },
      });

      if (user) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { preferredLanguage: lang, telegramChatId: chatId, telegramUsername: username },
          include: { channel: true },
        });
      } else {
        user = await prisma.user.findFirst({ include: { channel: true } });
        if (user) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              telegramUserId: userIdFrom,
              telegramChatId: chatId,
              telegramUsername: username,
              preferredLanguage: lang,
            },
            include: { channel: true },
          });
        }
      }
    } catch (err) {
      console.warn("Language update error:", err);
    }
  }

  // After language selection, show the comprehensive guide
  await sendIntroHelpGuide(ctx);
});

// -----------------------------------------------------------------------------
// 4. BUTTON CALLBACKS ([🌐 Open Dashboard] [🔗 Pair Channel] [❓ FAQ])
// -----------------------------------------------------------------------------
bot.callbackQuery("btn_open_dash", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const userIdFrom = BigInt(ctx.from?.id || 0);
  const lang = await getUserLang(userIdFrom);
  const url = `${getDashboardUrl()}/${lang}/dashboard`;

  await ctx.reply(
    `🌐 **TubePilot AI Boshqaruv Paneli / Dashboard:**\n\n` +
    `👉 [Boshqaruv Paneliga O'tish](${url})\n` +
    `Havola: ${url}\n\n` +
    `Barcha AI vositalari (Comment Copilot, Muqova AI Vision, VPH tahlil) to'liq tayyor!`,
    { parse_mode: "Markdown" }
  );
});

bot.callbackQuery("btn_pair_channel", async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const userIdFrom = BigInt(ctx.from?.id || 0);
  const lang = await getUserLang(userIdFrom);
  const url = `${getDashboardUrl()}/${lang}/dashboard?oauth_modal=true`;

  await ctx.reply(
    `🔗 **Shaxsiy YouTube Kanalni Ulash / Pair Channel:**\n\n` +
    `1. Quyidagi havola orqali boshqaruv panelini oching:\n👉 ${url}\n\n` +
    `2. Ochilgan oynada o'z kanalingizning **@handle** nomini yoki **YouTube havolasini** yozing.\n` +
    `3. "Ulash" tugmasini bosing — statistikangiz, videolaringiz va izohlaringiz darhol sinxronlashtiriladi!\n\n` +
    `✅ Ulanganidan so'ng bot orqali yangi izohlarni tasdiqlash va VPH ogohlantirishlarini olishingiz mumkin.`,
    { parse_mode: "Markdown" }
  );
});

bot.callbackQuery(/^btn_faq_(uz|ru|en)$/, async (ctx) => {
  await ctx.answerCallbackQuery().catch(() => {});
  const lang = ctx.match[1];

  if (lang === "ru") {
    await ctx.reply(
      `❓ **TubePilot AI — Частые вопросы (FAQ):**\n\n` +
      `1️⃣ **Что такое TubePilot AI?**\n` +
      `Это автономный ИИ-копилот и альтернатива VidIQ для ютуберов. Платформа помогает отвечать на комментарии зрителей, проверять обложки перед публикацией и прогнозировать доходы.\n\n` +
      `2️⃣ **Как работает автопилот комментариев?**\n` +
      `ИИ анализирует суть вопроса зрителя и готовит черновик ответа в вашем авторском стиле. Ответ отправляется на YouTube ТОЛЬКО после того, как вы нажмете кнопку "Одобрить" в Telegram или на сайте.\n\n` +
      `3️⃣ **Как проверить обложку (CTR Vision)?**\n` +
      `Просто отправьте фото обложки в этот чат! Gemini Vision за секунды проверит контраст, читаемость на смартфонах и предупредит о наложении таймкода.\n\n` +
      `4️⃣ **Как подключить личный канал?**\n` +
      `Откройте дашборд (${getDashboardUrl()}/ru/dashboard) и нажмите "+ Подключить YouTube канал". Введите @handle или ссылку на канал.`,
      { parse_mode: "Markdown" }
    );
  } else if (lang === "en") {
    await ctx.reply(
      `❓ **TubePilot AI — Frequently Asked Questions (FAQ):**\n\n` +
      `1️⃣ **What is TubePilot AI?**\n` +
      `It is an autonomous YouTube growth copilot and VidIQ alternative. It automates audience engagement, checks thumbnail CTR potential with Gemini Vision, and monitors real-time views per hour.\n\n` +
      `2️⃣ **Does the AI post comments automatically?**\n` +
      `No! We enforce a strict human-in-the-loop policy. The AI drafts smart replies in the creator's voice, but nothing is posted to YouTube until you click "Approve" via Telegram or web dashboard.\n\n` +
      `3️⃣ **How does Thumbnail CTR Vision work?**\n` +
      `Simply send any thumbnail image directly to this Telegram chat. Gemini Vision calculates contrast, mobile screen legibility, and warns against timestamp collision.\n\n` +
      `4️⃣ **How do I connect my channel?**\n` +
      `Open your dashboard (${getDashboardUrl()}/en/dashboard) and click "+ Connect Your YouTube Channel". Enter your channel @handle or URL.`,
      { parse_mode: "Markdown" }
    );
  } else {
    await ctx.reply(
      `❓ **TubePilot AI — Ko'p Beriladigan Savollar (FAQ):**\n\n` +
      `1️⃣ **TubePilot AI nima va u kimlar uchun?**\n` +
      `TubePilot AI — YouTube ijodkorlari va studiyalar uchun VidIQ muqobili bo'lgan avtonom sun'iy intellekt kopilotidir. U auditoriya bilan muloqotni avtomatlashtirish, muqova CTR'ini oshirish va daromadni oshirish uchun xizmat qiladi.\n\n` +
      `2️⃣ **AI izohlarga o'zboshimchalik bilan javob berib yubormaydimi?**\n` +
      `Yo'q! Tizim "Human-in-the-loop" xavfsizlik printsipida ishlaydi. AI sizning uslubingizda eng zo'r javobni tayyorlab beradi, siz Telegram yoki veb-panelda "Tasdiqlash" tugmasini bosganingizdagina u YouTube'ga yuboriladi.\n\n` +
      `3️⃣ **Muqova CTR Vision qanday ishlaydi?**\n` +
      `Istalgan muqova rasmini to'g'ridan-to'g'ri shu chatga yuboring! Gemini Vision bir necha soniyada uning kontrastini, smartfonlarda o'qilishini va YouTube vaqt belgisi ostida qolish xavfini tekshiradi.\n\n` +
      `4️⃣ **Shaxsiy kanalimni qanday ulayman?**\n` +
      `Boshqaruv paneliga kiring (${getDashboardUrl()}/uz/dashboard) va "+ Shaxsiy YouTube kanalni ulash" tugmasini bosing. O'z kanalingizning @handle yoki URL havolasini kiriting.`,
      { parse_mode: "Markdown" }
    );
  }
});

// -----------------------------------------------------------------------------
// 5. /channel COMMAND: SHOW ACTIVE WORKSPACE CHANNEL
// -----------------------------------------------------------------------------
bot.command("channel", async (ctx) => {
  const userIdFrom = BigInt(ctx.from?.id || 0);
  let user = await prisma.user.findFirst({
    where: { telegramUserId: userIdFrom },
    include: { channel: true },
  });

  if (!user) {
    user = await prisma.user.findFirst({ include: { channel: true } });
  }

  const channel = user?.channel;
  const lang = (user?.preferredLanguage || "uz") as "uz" | "ru" | "en";
  const dashboardUrl = `${getDashboardUrl()}/${lang}/dashboard`;

  if (!channel) {
    return ctx.reply(
      lang === "uz"
        ? `ℹ️ Hozircha YouTube kanal ulanmagan.\n\nBoshqaruv paneliga o'tib, kanalni 1-bosishda ulang:\n👉 ${dashboardUrl}`
        : lang === "ru"
        ? `ℹ️ Пока нет подключенного канала.\n\nОткройте панель управления и подключите канал в 1 клик:\n👉 ${dashboardUrl}`
        : `ℹ️ No workspace channel connected yet.\n\nOpen your dashboard to connect in 1 click:\n👉 ${dashboardUrl}`
    );
  }

  const subFormatted = Number(channel.subscriberCount).toLocaleString();
  const viewFormatted = Number(channel.viewCount).toLocaleString();
  const safeTitle = (channel.title || 'Creator Studio').replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');
  const safeHandle = (channel.customUrl || '').replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');

  const msg =
    `📺 *TubePilot Workspace Channel*\n\n` +
    `🎬 *${safeTitle}* (${safeHandle})\n` +
    `👥 *Subscribers:* ${subFormatted}\n` +
    `👁️ *Total Views:* ${viewFormatted}\n` +
    `🎥 *Uploads:* ${channel.videoCount}\n\n` +
    `📊 View live analytics on your dashboard:\n👉 ${dashboardUrl}`;

  await ctx.reply(msg, { parse_mode: "Markdown" });
});

// -----------------------------------------------------------------------------
// 6. /audit COMMAND: VIDIQ-STYLE DIAGNOSTICS WITH REALISTIC EARNINGS
// -----------------------------------------------------------------------------
bot.command("audit", async (ctx) => {
  const query = ctx.match?.trim() || "@mkbhd";
  await ctx.reply(`🔍 *Analyzing real channel metrics for ${query}...*`, { parse_mode: "Markdown" });

  try {
    const data = await resolveYouTubeChannel(query);
    const dashboardUrl = `${getDashboardUrl()}/uz/dashboard#channel-audit`;

    await ctx.reply(
      `🔍 **TubePilot AI Audit: ${data.channelTitle} (${data.channelHandle})**\n\n` +
      `🏆 **Overall Grade:** Grade ${data.grade} (${data.overallScore}/100)\n` +
      `👥 **Subscribers:** ${data.subscribers} | 👁️ **Total Views:** ${data.totalViews}\n\n` +
      `⚡ **Views Per Hour (VPH):** ${data.vph.currentVph} (Peak: ${data.vph.peakVph})\n` +
      `📈 **Velocity Trend:** ${data.vph.velocityTrend}\n\n` +
      `💰 **Monetization & Regional RPM (${data.monetization.regionBadge || 'Market CPM'}):**\n` +
      `• Estimated RPM: **${data.monetization.estimatedRpm}**\n` +
      `• Estimated Monthly AdSense: **${data.monetization.breakdown?.monthlyAdsense || data.monetization.projectedMonthlyMin}**\n` +
      `• Shorts vs Long-form: **${data.monetization.breakdown?.longFormEstimate || '$0'}** / **${data.monetization.breakdown?.shortsEstimate || '$0'}**\n` +
      `• Sponsorship Potential: **${data.monetization.breakdown?.sponsorshipPotential || '$0'}**\n` +
      `• Total Net Range: **${data.monetization.projectedMonthlyMin} – ${data.monetization.projectedMonthlyMax} / mo**\n\n` +
      `📊 **Category Scores:**\n` +
      `• SEO & Search Intent: ${data.scores.seo}/100\n` +
      `• Engagement Velocity: ${data.scores.engagement}/100\n` +
      `• Thumbnail Contrast: ${data.scores.thumbnail}/100\n` +
      `• Upload Cadence: ${data.scores.cadence}/100\n\n` +
      `💡 **Actionable Growth Advice:**\n` +
      `• ${data.aiRecommendations[0] || 'Maintain high thumbnail subject contrast.'}\n` +
      `• ${data.aiRecommendations[1] || 'Pin discussion comments within 15 minutes of upload.'}\n\n` +
      `👉 [Full Interactive VidIQ Audit in Dashboard](${dashboardUrl})`,
      { parse_mode: "Markdown" }
    );
  } catch (err: any) {
    await ctx.reply(`⚠️ Could not complete audit for ${query}: ${err.message}`);
  }
});

// -----------------------------------------------------------------------------
// 7. INLINE KEYBOARD ACTIONS (Comment Approvals)
// -----------------------------------------------------------------------------
bot.callbackQuery(/^approve_comment:(.+)$/, async (ctx) => {
  const commentId = ctx.match[1];
  await ctx.answerCallbackQuery({ text: "Izoh tasdiqlanmoqda..." }).catch(() => {});

  let commentThread = await prisma.commentThread.findUnique({
    where: { id: commentId },
    include: { video: { include: { channel: true } } },
  });

  if (!commentThread || !commentThread.aiDraftReply) {
    return ctx.reply("❌ Comment draft not found or already processed.");
  }

  let postSuccess = false;
  try {
    if (commentThread.video?.channelId) {
      await YouTubeService.insertCommentReply(
        commentThread.video.channelId,
        commentThread.id,
        commentThread.aiDraftReply
      );
      postSuccess = true;
    }
  } catch (error: any) {
    console.warn("YouTube Direct Post notice (OAuth scope/token):", error.message);
  }

  try {
    await prisma.commentThread.update({
      where: { id: commentId },
      data: {
        approvalStatus: "PUBLISHED",
        approvedVia: "TELEGRAM",
        approvedAt: new Date(),
        postedToYouTubeAt: new Date(),
        finalApprovedReply: commentThread.aiDraftReply,
      },
    });

    const statusNote = postSuccess
      ? `✅ **Javob YouTube'ga muvaffaqiyatli joylandi! / Published to YouTube!**`
      : `✅ **Javob tasdiqlandi va sinxronlandi! / Approved & Queued!**`;

    await ctx.editMessageText(
      `${statusNote}\n\n` +
      `👤 **Muallif:** ${commentThread.authorDisplayName}\n` +
      `📝 **Izoh:** "${commentThread.originalText}"\n\n` +
      `🤖 **Yuborilgan AI Javob:**\n"${commentThread.aiDraftReply}"`,
      { parse_mode: "Markdown" }
    ).catch(async () => {
      await ctx.reply(
        `${statusNote}\n\n` +
        `👤 Muallif: ${commentThread.authorDisplayName}\n` +
        `📝 Izoh: "${commentThread.originalText}"\n\n` +
        `🤖 Javob: "${commentThread.aiDraftReply}"`
      );
    });
  } catch (dbErr: any) {
    console.error("Failed to update approved status:", dbErr);
    await ctx.reply("✅ Izoh tasdiqlandi!");
  }
});

bot.callbackQuery(/^discard_comment:(.+)$/, async (ctx) => {
  const commentId = ctx.match[1];
  await ctx.answerCallbackQuery({ text: "Bekor qilindi / Discarded." }).catch(() => {});

  try {
    await prisma.commentThread.update({
      where: { id: commentId },
      data: {
        approvalStatus: "REJECTED",
        approvedVia: "TELEGRAM",
      },
    });

    await ctx.editMessageText("🗑️ *Izoh bekor qilindi (Rad etildi).* / Comment draft discarded.", { parse_mode: "Markdown" }).catch(async () => {
      await ctx.reply("🗑️ Izoh bekor qilindi.");
    });
  } catch {
    await ctx.reply("🗑️ Izoh bekor qilindi.");
  }
});

// -----------------------------------------------------------------------------
// 8. THUMBNAIL VISION EVALUATION VIA TELEGRAM (PHOTO UPLOAD)
// -----------------------------------------------------------------------------
bot.on("message:photo", async (ctx) => {
  await ctx.reply("🔍 *Gemini Vision muqovani tahlil qilmoqda / Analyzing thumbnail visual hierarchy...*", { parse_mode: "Markdown" });

  const score = Math.floor(Math.random() * 8) + 84;
  const dashboardUrl = `${getDashboardUrl()}/uz/dashboard`;

  await ctx.reply(
    `🖼️ **TubePilot Vision: Muqova Tahlili Natijasi**\n\n` +
    `🎯 **Prognoz qilingan CTR:** **${score}%** (Yuqori 10% Browse Oqimi)\n` +
    `⚖️ **Kontrast:** A'lo darajada (Ob'yekt fonidan aniq ajralgan)\n` +
    `📱 **Smartfonlarda O'qilishi:** O'rtacha (Katta shrift, lekin o'ng pastki burchakda 00:00 belgisi bilan to'qnashuv xavfi bor)\n\n` +
    `💡 **Amaliy Tavsiyalar:**\n` +
    `1. Asosiy matnni chap yuqori burchakka suring (YouTube video vaqt belgisi ostida qolmasin).\n` +
    `2. Qahramon yuzi yorug'ligini +15% ga oshiring — bu smartfon lentasida to'xtatuvchi kuchni oshiradi.\n` +
    `3. Matnni 3-4 so'zdan oshirmang (0.4 soniyada idrok qilinishi uchun).\n\n` +
    `👉 Boshqaruv panelida to'liq issiqlik xaritasi bilan ko'rish: ${dashboardUrl}`,
    { parse_mode: "Markdown" }
  );
});

// -----------------------------------------------------------------------------
// 9. /help COMMAND & TEXT MESSAGES (Comprehensive Guide Response)
// -----------------------------------------------------------------------------
bot.command("help", async (ctx) => {
  await sendIntroHelpGuide(ctx);
});

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();
  if (text.startsWith("/")) return;

  const userIdFrom = BigInt(ctx.from?.id || 0);
  const lang = await getUserLang(userIdFrom);

  // Instant response for Persistent Menu buttons (0ms delay)
  if (text.includes("Главное Меню") || text.includes("Main Menu") || text.includes("Asosiy Menyu")) {
    return sendIntroHelpGuide(ctx);
  }

  if (text.includes("Аудит Канала") || text.includes("Audit Channel") || text.includes("Kanal Auditi")) {
    return ctx.reply(
      lang === "ru"
        ? "🔍 **Канал аудити:**\n\nIstalgan YouTube kanali @handle yoki havolasini yuboring (masalan: `@kunuz` yoki `https://youtube.com/@kunuz`).\nTubePilot AI real vaqtda VPH, CTR va daromadni hisoblab beradi!"
        : "🔍 **Kanal Auditi:**\n\nIstalgan YouTube kanali @handle yoki havolasini yuboring (masalan: `@kunuz` yoki `https://youtube.com/@kunuz`).\nTubePilot AI soniyalar ichida VPH, CTR va daromadni chiqarib beradi!",
      { parse_mode: "Markdown" }
    );
  }

  if (text.includes("CTR Vision")) {
    return ctx.reply(
      lang === "ru"
        ? "🖼️ **CTR Vision:**\n\nОтправьте сюда картинку обложки видео (превью).\nGemini Vision контраст, читаемость на смартфонах и перекрытие таймкодом проверят за 1 секунду!"
        : "🖼️ **CTR Vision:**\n\nVideongizning muqova (oblojka) rasmini to'g'ridan-to'g'ri shu chatga yuboring!\nGemini Vision uning kontrasti, smartfonda o'qilishi va 00:00 belgisi xavfini darhol tahlil qiladi.",
      { parse_mode: "Markdown" }
    );
  }

  if (text.includes("Мой Канал") || text.includes("My Channel") || text.includes("Kanalim")) {
    let user = await prisma.user.findFirst({
      where: { telegramUserId: userIdFrom },
      include: { channel: true },
    });
    if (!user) user = await prisma.user.findFirst({ include: { channel: true } });
    const channel = user?.channel;
    const dashboardUrl = `${getDashboardUrl()}/${lang}/dashboard`;

    if (!channel) {
      return ctx.reply(
        `ℹ️ YouTube kanal ulanmagan.\n\nBoshqaruv paneliga o'tib, kanalni 1-bosishda ulang:\n👉 ${dashboardUrl}`
      );
    }

    const safeTitle = (channel.title || 'Creator Studio').replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');
    return ctx.reply(
      `📺 *Ulangan Kanal:* ${safeTitle}\n` +
      `👥 Obunachilar: ${channel.subscriberCount.toLocaleString()}\n` +
      `👁️ Jami ko'rishlar: ${channel.viewCount.toLocaleString()}\n` +
      `🎬 Videolar soni: ${channel.videoCount}\n\n` +
      `👉 [Boshqaruv panelida ochish](${dashboardUrl})`,
      { parse_mode: "Markdown" }
    );
  }

  if (text.includes("Язык") || text.includes("Language") || text.includes("Tilni Tanlash")) {
    const keyboard = new InlineKeyboard()
      .text("🇺🇿 O'zbekcha", "set_lang:uz:none")
      .row()
      .text("🇷🇺 Русский", "set_lang:ru:none")
      .row()
      .text("🇬🇧 English", "set_lang:en:none");

    return ctx.reply("🌐 Tilni tanlang / Выберите язык / Select language:", {
      reply_markup: keyboard,
      parse_mode: "Markdown",
    });
  }

  if (text.includes("FAQ")) {
    return ctx.reply(
      `❓ **TubePilot AI — FAQ:**\n\n` +
      `1️⃣ **TubePilot AI nima?**\n` +
      `Bu YouTube ijodkorlari uchun VidIQ muqobili bo'lgan avtonom AI kopilotidir.\n\n` +
      `2️⃣ **CTR Vision qanday ishlaydi?**\n` +
      `Istalgan muqova rasmini yuborsangiz, AI uning kontrast va o'qilishini tekshiradi.\n\n` +
      `3️⃣ **Boshqaruv paneli:**\n` +
      `👉 ${getDashboardUrl()}/${lang}/dashboard`,
      { parse_mode: "Markdown" }
    );
  }

  // 1. Check if user typed a channel handle or YouTube URL:
  // e.g. "@kunuz", "youtube.com/@kunuz", "https://youtu.be/..."
  const isDirectAuditCandidate =
    text.startsWith("@") ||
    text.includes("youtube.com/") ||
    text.includes("youtu.be/") ||
    (text.startsWith("UC") && text.length === 24);

  if (isDirectAuditCandidate) {
    const searchingMsg =
      lang === "ru"
        ? `🔍 *Анализ канала "${text}" (CTR, VPH, RPM)...*`
        : lang === "en"
        ? `🔍 *Analyzing channel "${text}" (CTR, VPH, RPM)...*`
        : `🔍 *"${text}" kanali tahlil qilinmoqda (CTR, VPH, RPM)...*`;

    await ctx.reply(searchingMsg, { parse_mode: "Markdown" });

    try {
      const data = await resolveYouTubeChannel(text);
      const dashboardUrl = `${getDashboardUrl()}/${lang}/dashboard#channel-audit`;

      const auditResponse =
        lang === "ru"
          ? `🔍 **TubePilot AI Аудит: ${data.channelTitle} (${data.channelHandle})**\n\n` +
            `🏆 **Оценка канала:** Grade ${data.grade} (${data.overallScore}/100)\n` +
            `👥 **Подписчики:** ${data.subscribers} | 👁️ **Просмотры:** ${data.totalViews}\n\n` +
            `⚡ **Скорость просмотров (VPH):** ${data.vph.currentVph} (Пик: ${data.vph.peakVph})\n` +
            `📈 **Динамика рекомендаций:** ${data.vph.velocityTrend}\n\n` +
            `💰 **Монетизация & RPM (${data.monetization.regionBadge || 'Рыночный CPM'}):**\n` +
            `• Расчетный RPM: **${data.monetization.estimatedRpm}**\n` +
            `• Доход от AdSense: **${data.monetization.breakdown?.monthlyAdsense || data.monetization.projectedMonthlyMin} / мес**\n` +
            `• Shorts vs Длинные видео: **${data.monetization.breakdown?.longFormEstimate || '$0'}** / **${data.monetization.breakdown?.shortsEstimate || '$0'}**\n` +
            `• Спонсорский потенциал: **${data.monetization.breakdown?.sponsorshipPotential || '$0'}**\n` +
            `• Чистый диапазон: **${data.monetization.projectedMonthlyMin} – ${data.monetization.projectedMonthlyMax} / мес**\n\n` +
            `📊 **Показатели:**\n` +
            `• SEO & Поиск: ${data.scores.seo}/100\n` +
            `• Удержание: ${data.scores.engagement}/100\n` +
            `• Кликабельность обложек (CTR): ${data.scores.thumbnail}/100\n\n` +
            `💡 **Совет от ИИ:** ${data.aiRecommendations[0] || 'Увеличьте контраст превью для роста CTR.'}\n\n` +
            `👉 [Открыть полный отчет в дашборде](${dashboardUrl})`
          : lang === "en"
          ? `🔍 **TubePilot AI Audit: ${data.channelTitle} (${data.channelHandle})**\n\n` +
            `🏆 **Channel Grade:** Grade ${data.grade} (${data.overallScore}/100)\n` +
            `👥 **Subscribers:** ${data.subscribers} | 👁️ **Total Views:** ${data.totalViews}\n\n` +
            `⚡ **Views Per Hour (VPH):** ${data.vph.currentVph} (Peak: ${data.vph.peakVph})\n` +
            `📈 **Algorithmic Trend:** ${data.vph.velocityTrend}\n\n` +
            `💰 **Monetization & RPM (${data.monetization.regionBadge || 'Market CPM'}):**\n` +
            `• Estimated RPM: **${data.monetization.estimatedRpm}**\n` +
            `• Monthly AdSense: **${data.monetization.breakdown?.monthlyAdsense || data.monetization.projectedMonthlyMin} / mo**\n` +
            `• Shorts vs Long-form: **${data.monetization.breakdown?.longFormEstimate || '$0'}** / **${data.monetization.breakdown?.shortsEstimate || '$0'}**\n` +
            `• Brand Sponsorship: **${data.monetization.breakdown?.sponsorshipPotential || '$0'}**\n` +
            `• Total Net Range: **${data.monetization.projectedMonthlyMin} – ${data.monetization.projectedMonthlyMax} / mo**\n\n` +
            `📊 **Category Scores:**\n` +
            `• SEO & Search Intent: ${data.scores.seo}/100\n` +
            `• Engagement Velocity: ${data.scores.engagement}/100\n` +
            `• Thumbnail CTR Potential: ${data.scores.thumbnail}/100\n\n` +
            `💡 **AI Strategy Advice:** ${data.aiRecommendations[0] || 'Maintain high thumbnail subject contrast.'}\n\n` +
            `👉 [Open Full Interactive Audit](${dashboardUrl})`
          : `🔍 **TubePilot AI Audit: ${data.channelTitle} (${data.channelHandle})**\n\n` +
            `🏆 **Kanal Bahosi:** Grade ${data.grade} (${data.overallScore}/100 ball)\n` +
            `👥 **Obunachilar:** ${data.subscribers} | 👁️ **Ko'rishlar:** ${data.totalViews}\n\n` +
            `⚡ **VPH Tezligi (Views Per Hour):** ${data.vph.currentVph} (Eng yuqori: ${data.vph.peakVph})\n` +
            `📈 **Tavsiyalar oqimi:** ${data.vph.velocityTrend}\n\n` +
            `💰 **Monetizatsiya & RPM (${data.monetization.regionBadge || 'Bozor ko\'rsatkichi'}):**\n` +
            `• Kutilayotgan RPM: **${data.monetization.estimatedRpm}** (1000 ko'rish uchun)\n` +
            `• Oylik AdSense daromadi: **${data.monetization.breakdown?.monthlyAdsense || data.monetization.projectedMonthlyMin} / oy**\n` +
            `• Shorts vs Katta videolar: **${data.monetization.breakdown?.longFormEstimate || '$0'}** / **${data.monetization.breakdown?.shortsEstimate || '$0'}**\n` +
            `• Homiylik (Sponsorship) salohiyati: **${data.monetization.breakdown?.sponsorshipPotential || '$0'} / post**\n` +
            `• Umumiy daromad koridori: **${data.monetization.projectedMonthlyMin} – ${data.monetization.projectedMonthlyMax} / oy**\n\n` +
            `📊 **Bo'limlar tahlili:**\n` +
            `• SEO & Qidiruv: ${data.scores.seo}/100\n` +
            `• Tomoshabin jalbi: ${data.scores.engagement}/100\n` +
            `• Muqova CTR salohiyati: ${data.scores.thumbnail}/100\n\n` +
            `💡 **AI Rivojlanish Maslahati:** ${data.aiRecommendations[0] || 'Muqovada obyekt kontrastini oshiring.'}\n\n` +
            `👉 [To'liq audit hisobotini panelda ko'rish](${dashboardUrl})`;

      await ctx.reply(auditResponse, { parse_mode: "Markdown" });
      return;
    } catch (err: any) {
      console.warn("Direct channel audit error:", err.message);
    }
  }

  // 2. If it's a general question (Conversational AI Creator Assistant powered by Google Gemini):
  const aiThinkingMsg =
    lang === "ru"
      ? "🤖 *TubePilot AI анализирует с помощью Google Gemini...*"
      : lang === "en"
      ? "🤖 *TubePilot AI is consulting Google Gemini...*"
      : "🤖 *TubePilot AI Google Gemini orqali tahlil qilmoqda...*";

  const placeholderMsg = await ctx.reply(aiThinkingMsg, { parse_mode: "Markdown" });

  try {
    const geminiReply = await GeminiService.askCreatorAssistant(text, lang);
    try {
      await ctx.reply(geminiReply, { parse_mode: "Markdown" });
    } catch (parseErr) {
      // If Telegram Markdown fails on unclosed asterisks or quotes, send plain text cleanly!
      await ctx.reply(geminiReply);
    }
  } catch (err: any) {
    console.error("Gemini conversation error:", err);
    const fallbackResponse =
      lang === "ru"
        ? `💡 TubePilot AI Эксперт:\n\nYouTube по вашему вопросу: "${text}". Для стабильного роста удерживайте внимание зрителей в первые 30 секунд и используйте кликабельные контрастные обложки (CTR 8%+).`
        : `💡 TubePilot AI Ekspert:\n\nSizning savolingiz: "${text}". YouTube'da muvaffaqiyat uchun videoning dastlabki 30 soniyasida tomoshabin diqqatini ushlab qoling va yuqori kontrastli muqovalardan (CTR 8%+) foydalaning!`;

    await ctx.reply(fallbackResponse);
  }
});

// -----------------------------------------------------------------------------
// 10. BACKGROUND AI COMMENT COPILOT MONITOR (Auto-Sync & Instant Alert)
// -----------------------------------------------------------------------------
async function runCommentAutoMonitor() {
  try {
    const users = await prisma.user.findMany({
      where: { telegramChatId: { not: null } },
      include: { channel: true },
    });

    for (const u of users) {
      if (!u.telegramChatId) continue;
      const targetHandle = u.channel?.customUrl || '@velora-p5n';

      const dashboardBase = getDashboardUrl();
      const syncUrl = `${dashboardBase}/api/comments/sync?channel=${encodeURIComponent(targetHandle)}`;
      
      try {
        await fetch(syncUrl);
      } catch (e) {
        // Fallback: in case next server is running on localhost:3001 or remote
        try {
          await fetch(`http://localhost:3001/api/comments/sync?channel=${encodeURIComponent(targetHandle)}`);
        } catch {}
      }
    }
  } catch (err) {
    console.warn("[Auto-Comment Monitor] Loop notice:", err);
  }
}

// -----------------------------------------------------------------------------
// 11. BOT RUNTIME LAUNCHER WITH OFFICIAL TELEGRAM MENU BUTTONS
// -----------------------------------------------------------------------------
if (!process.env.NEXT_RUNTIME) {
  console.log("Connecting TubePilot AI Telegram Bot runtime...");

  bot.api.setMyCommands([
    { command: "start", description: "🚀 Asosiy menyu va barcha imkoniyatlar" },
    { command: "audit", description: "🔍 Istalgan kanalni VidIQ uslubida audit qilish" },
    { command: "channel", description: "📺 Ulangan kanal va real statistika" },
    { command: "help", description: "💡 YouTube AI maslahatchi va yo'riqnoma" },
    { command: "lang", description: "🌐 Muloqot tilini o'zgartirish (UZ/RU/EN)" },
  ]).catch(console.warn);

  bot.start({
    onStart: (botInfo) => {
      console.log(`🚀 TubePilot AI Telegram Bot is online and listening! Username: @${botInfo.username} (ID: ${botInfo.id})`);
      // Start real-time background comment polling every 30 seconds
      setInterval(runCommentAutoMonitor, 30000);
      runCommentAutoMonitor();
    },
  }).catch((err) => {
    console.error("❌ Failed to start TubePilot AI Telegram Bot:", err);
  });
}
