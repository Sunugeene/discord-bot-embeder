import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} from "discord.js";

// ========= НАСТРОЙКИ =========
const TOKEN = "токен_бота";
const CLIENT_ID = "айди_бота";
// ============================

// Создаём клиент
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Регистрируем команду /embed
const commands = [
  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Создать embed от имени бота")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) // Только админы
];

// Деплой команд
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("⏳ Регистрируем команды...");
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands.map(c => c.toJSON()),
    });
    console.log("✅ Команды зарегистрированы!");
  } catch (err) {
    console.error(err);
  }
})();

// Слушаем интеракции
client.on("interactionCreate", async interaction => {

  // === Slash команда /embed ===
  if (interaction.isChatInputCommand() && interaction.commandName === "embed") {
    return interaction.reply({
      content: "Вы хотите создать embed?",
      ephemeral: true, // = flags: 64
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("createEmbed")
            .setLabel("Создать embed")
            .setStyle(ButtonStyle.Primary)
        )
      ]
    });
  }

  // === Нажатие кнопки ===
  if (interaction.isButton() && interaction.customId === "createEmbed") {

    const modal = new ModalBuilder()
      .setCustomId("embedModal")
      .setTitle("Создание Embed");

    const titleInput = new TextInputBuilder()
      .setCustomId("embedTitle")
      .setLabel("Заголовок (необязательно)")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const descInput = new TextInputBuilder()
      .setCustomId("embedDescription")
      .setLabel("Описание (необязательно)")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    const colorInput = new TextInputBuilder()
      .setCustomId("embedColor")
      .setLabel("Цвет HEX (пример: #ff0000)")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(7) // Ограничение 7 символов (#000000)
      .setRequired(false);

    const row1 = new ActionRowBuilder().addComponents(titleInput);
    const row2 = new ActionRowBuilder().addComponents(descInput);
    const row3 = new ActionRowBuilder().addComponents(colorInput);

    modal.addComponents(row1, row2, row3);
    return interaction.showModal(modal);
  }

  // === Получение данных из модала ===
  if (interaction.isModalSubmit() && interaction.customId === "embedModal") {
    const title = interaction.fields.getTextInputValue("embedTitle") || null;
    const description = interaction.fields.getTextInputValue("embedDescription") || null;
    const color = interaction.fields.getTextInputValue("embedColor") || "#2b2d31"; // дефолт серый

    let hex = color.trim();
    if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) hex = "#2b2d31";

    const embed = new EmbedBuilder()
      .setColor(hex)
      .setTitle(title)
      .setDescription(description);

    // Отправляем embed в канал (от имени бота)
    await interaction.channel.send({ embeds: [embed] });

    return interaction.reply({
      content: "Успешная отправка.",
      ephemeral: true // flags: 64
    });
  }
});

// Запуск бота
client.login(TOKEN);
console.log("🚀 Бот запускается...");