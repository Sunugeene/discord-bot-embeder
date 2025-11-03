# discord-bot-embeder
В этой repository будет код для создания discord bot'а, который может отправлять embed сообщения от своего имени.

Важное сообщения для вас
Если вы желаете избежать ошибки:
"(node:13892) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///C:/Users/-/Desktop/disc-embed/main.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to C:\Users\-\Desktop\disc-embed\package.json.
(Use `node --trace-warnings ...` to show where the warning was created)"

То нужно зайти в package.json там будет к примеру:
{
  "dependencies": {
    "discord.js": "^14.24.2"
  }
}

то, вам нужно исправить и сделать это:
{
  "type":"module",
  "dependencies": {
    "discord.js": "^14.24.2"
  }
}

Мы добавили модуль "type":"module"
Важно ставить это ДО dependencies!!!
