/**
 * IPO 청약 공문 이미지 인식 텔레그램봇
 * - 텔레그램으로 공문 이미지를 보내면 Claude Vision API로 분석
 * - 종목명, 배정수량, 공모가, 주관사 등 청약 관련 정보 추출
 */
const TelegramBot = require('node-telegram-bot-api');
const Anthropic = require('@anthropic-ai/sdk');
const https = require('https');

// ── 설정 ──
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN || '8749062321:AAEyaXp9h8Mk9FDmP2DmWOzvGF73hAl1eww';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ALLOWED_CHAT_IDS = (process.env.ALLOWED_CHAT_IDS || '7281467858').split(',');

const bot = new TelegramBot(TG_BOT_TOKEN, { polling: true });
const claude = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

const SYSTEM_PROMPT = `당신은 IPO 공모주 청약 업무를 담당하는 전문 분석 AI입니다.
사용자가 보내는 이미지는 증권사 또는 운용사에서 발송한 공모주 청약 관련 공문(배정결과 통보, 청약 안내 등)입니다.

이미지에서 다음 정보를 최대한 정확하게 추출하세요:

1. 종목명 (회사명)
2. 공모단가 (공모가격)
3. 배정수량
4. 배정금액
5. 주관사 (증권사)
6. 상장일 (예정일)
7. 락업 기간 (확약 여부)
8. 청약 수수료
9. 주금납입일
10. 기타 중요 정보

추출한 정보를 아래 형식으로 정리하세요:

📋 공문 분석 결과
━━━━━━━━━━━━━━━━━━
종목명:
공모단가:
배정수량:
배정금액:
주관사:
상장일:
락업기간:
수수료:
주금납입일:
━━━━━━━━━━━━━━━━━━
📝 비고: (추가 참고사항)

이미지를 읽을 수 없거나 공문이 아닌 경우, 그 사실을 알려주세요.`;

function isAllowed(chatId) {
  return ALLOWED_CHAT_IDS.includes(String(chatId));
}

function downloadFile(fileUrl) {
  return new Promise((resolve, reject) => {
    https.get(fileUrl, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function analyzeImage(imageBuffer, mimeType, caption) {
  const imageB64 = imageBuffer.toString('base64');
  const userText = caption
    ? `이 공문 이미지를 분석해주세요. ${caption}`
    : '이 공문 이미지를 분석해주세요.';

  const response = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mimeType,
            data: imageB64,
          },
        },
        { type: 'text', text: userText },
      ],
    }],
  });

  return response.content[0].text;
}

// /start 명령어
bot.onText(/\/start/, (msg) => {
  if (!isAllowed(msg.chat.id)) {
    bot.sendMessage(msg.chat.id, '⛔ 허가되지 않은 채팅방입니다.');
    return;
  }
  bot.sendMessage(msg.chat.id,
    '🤖 IPO 청약 공문 인식봇이 활성화되었습니다.\n\n' +
    '📸 공문 이미지를 보내주시면 내용을 분석해드립니다.\n' +
    '지원: 배정결과 통보, 청약 안내, 상장 안내 등\n\n' +
    '명령어:\n' +
    '/start - 봇 소개\n' +
    '/status - 봇 상태 확인'
  );
});

// /status 명령어
bot.onText(/\/status/, (msg) => {
  if (!isAllowed(msg.chat.id)) return;
  const apiOk = claude ? '✅ 연결됨' : '❌ API 키 없음';
  bot.sendMessage(msg.chat.id,
    `📊 봇 상태\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `텔레그램봇: ✅ 실행 중\n` +
    `Claude API: ${apiOk}\n` +
    `모델: claude-sonnet-4-6`
  );
});

// 사진 수신 처리
bot.on('photo', async (msg) => {
  if (!isAllowed(msg.chat.id)) return;

  if (!claude) {
    bot.sendMessage(msg.chat.id,
      '❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.\n' +
      'ANTHROPIC_API_KEY=your-key node telegram_bot.js');
    return;
  }

  const processingMsg = await bot.sendMessage(msg.chat.id, '🔍 공문 이미지를 분석 중입니다...');

  try {
    const photo = msg.photo[msg.photo.length - 1];
    const file = await bot.getFile(photo.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${file.file_path}`;
    const imageBuffer = await downloadFile(fileUrl);
    const result = await analyzeImage(imageBuffer, 'image/jpeg', msg.caption || '');
    await bot.editMessageText(result, { chat_id: msg.chat.id, message_id: processingMsg.message_id });
    console.log(`[OK] 이미지 분석 완료 - chat_id: ${msg.chat.id}`);
  } catch (e) {
    console.error(`[ERR] 이미지 분석 실패:`, e.message);
    await bot.editMessageText(`❌ 분석 중 오류가 발생했습니다.\n${String(e.message).slice(0, 200)}`,
      { chat_id: msg.chat.id, message_id: processingMsg.message_id });
  }
});

// 문서(파일) 수신 처리
bot.on('document', async (msg) => {
  if (!isAllowed(msg.chat.id)) return;

  const doc = msg.document;
  if (!doc.mime_type || !doc.mime_type.startsWith('image/')) {
    bot.sendMessage(msg.chat.id, '📎 이미지 파일만 분석 가능합니다. (JPG, PNG 등)');
    return;
  }

  if (!claude) {
    bot.sendMessage(msg.chat.id, '❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.');
    return;
  }

  const processingMsg = await bot.sendMessage(msg.chat.id, '🔍 공문 이미지를 분석 중입니다...');

  try {
    const file = await bot.getFile(doc.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${TG_BOT_TOKEN}/${file.file_path}`;
    const imageBuffer = await downloadFile(fileUrl);
    const result = await analyzeImage(imageBuffer, doc.mime_type, msg.caption || '');
    await bot.editMessageText(result, { chat_id: msg.chat.id, message_id: processingMsg.message_id });
  } catch (e) {
    console.error(`[ERR] 문서 이미지 분석 실패:`, e.message);
    await bot.editMessageText(`❌ 분석 중 오류가 발생했습니다.\n${String(e.message).slice(0, 200)}`,
      { chat_id: msg.chat.id, message_id: processingMsg.message_id });
  }
});

// 일반 텍스트 메시지
bot.on('message', (msg) => {
  if (!isAllowed(msg.chat.id)) return;
  if (msg.photo || msg.document || (msg.text && msg.text.startsWith('/'))) return;
  bot.sendMessage(msg.chat.id,
    '📸 공문 이미지를 보내주시면 내용을 분석해드립니다.\n이미지를 첨부하여 전송해주세요.'
  );
});

console.log(`[BOOT] 텔레그램봇 시작! 허용 채팅: ${ALLOWED_CHAT_IDS.join(', ')}`);
console.log(`[BOOT] Claude API: ${claude ? '연결됨' : 'API 키 없음'}`);
