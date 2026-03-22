"""
IPO 청약 공문 이미지 인식 텔레그램봇
- 텔레그램으로 공문 이미지를 보내면 Claude Vision API로 분석
- 종목명, 배정수량, 공모가, 주관사 등 청약 관련 정보 추출
"""
import os
import logging
import base64
import anthropic
from telegram import Update
from telegram.ext import (
    ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes
)

# ── 설정 ──
TG_BOT_TOKEN = os.environ.get("TG_BOT_TOKEN", "8749062321:AAEyaXp9h8Mk9FDmP2DmWOzvGF73hAl1eww")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ALLOWED_CHAT_IDS = os.environ.get("ALLOWED_CHAT_IDS", "7281467858").split(",")

logging.basicConfig(format="%(asctime)s [%(levelname)s] %(message)s", level=logging.INFO)
logger = logging.getLogger(__name__)

claude = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY) if ANTHROPIC_API_KEY else None

SYSTEM_PROMPT = """당신은 IPO 공모주 청약 업무를 담당하는 전문 분석 AI입니다.
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

이미지를 읽을 수 없거나 공문이 아닌 경우, 그 사실을 알려주세요."""


def is_allowed(chat_id: int) -> bool:
    return str(chat_id) in ALLOWED_CHAT_IDS


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_chat.id):
        await update.message.reply_text("⛔ 허가되지 않은 채팅방입니다.")
        return
    await update.message.reply_text(
        "🤖 IPO 청약 공문 인식봇이 활성화되었습니다.\n\n"
        "📸 공문 이미지를 보내주시면 내용을 분석해드립니다.\n"
        "지원: 배정결과 통보, 청약 안내, 상장 안내 등\n\n"
        "명령어:\n"
        "/start - 봇 소개\n"
        "/status - 봇 상태 확인"
    )


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_chat.id):
        return
    api_ok = "✅ 연결됨" if claude else "❌ API 키 없음"
    await update.message.reply_text(
        f"📊 봇 상태\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"텔레그램봇: ✅ 실행 중\n"
        f"Claude API: {api_ok}\n"
        f"모델: claude-sonnet-4-6\n"
    )


async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_chat.id):
        return

    if not claude:
        await update.message.reply_text(
            "❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.\n"
            "export ANTHROPIC_API_KEY='your-key' 후 재시작하세요."
        )
        return

    processing_msg = await update.message.reply_text("🔍 공문 이미지를 분석 중입니다...")

    try:
        photo = update.message.photo[-1]
        file = await context.bot.get_file(photo.file_id)
        image_bytes = await file.download_as_bytearray()
        image_b64 = base64.b64encode(bytes(image_bytes)).decode("utf-8")

        caption = update.message.caption or ""
        user_text = f"이 공문 이미지를 분석해주세요. {caption}" if caption else "이 공문 이미지를 분석해주세요."

        response = claude.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_b64,
                        },
                    },
                    {"type": "text", "text": user_text},
                ],
            }],
        )

        result = response.content[0].text
        await processing_msg.edit_text(result)
        logger.info(f"이미지 분석 완료 - chat_id: {update.effective_chat.id}")

    except Exception as e:
        logger.error(f"이미지 분석 실패: {e}")
        await processing_msg.edit_text(f"❌ 분석 중 오류가 발생했습니다.\n{str(e)[:200]}")


async def handle_document(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_chat.id):
        return

    doc = update.message.document
    if not doc.mime_type or not doc.mime_type.startswith("image/"):
        await update.message.reply_text("📎 이미지 파일만 분석 가능합니다. (JPG, PNG 등)")
        return

    if not claude:
        await update.message.reply_text("❌ ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.")
        return

    processing_msg = await update.message.reply_text("🔍 공문 이미지를 분석 중입니다...")

    try:
        file = await context.bot.get_file(doc.file_id)
        image_bytes = await file.download_as_bytearray()
        image_b64 = base64.b64encode(bytes(image_bytes)).decode("utf-8")

        mime = doc.mime_type or "image/jpeg"
        caption = update.message.caption or ""
        user_text = f"이 공문 이미지를 분석해주세요. {caption}" if caption else "이 공문 이미지를 분석해주세요."

        response = claude.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2000,
            system=SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": mime,
                            "data": image_b64,
                        },
                    },
                    {"type": "text", "text": user_text},
                ],
            }],
        )

        result = response.content[0].text
        await processing_msg.edit_text(result)

    except Exception as e:
        logger.error(f"문서 이미지 분석 실패: {e}")
        await processing_msg.edit_text(f"❌ 분석 중 오류가 발생했습니다.\n{str(e)[:200]}")


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_chat.id):
        return
    await update.message.reply_text(
        "📸 공문 이미지를 보내주시면 내용을 분석해드립니다.\n"
        "이미지를 첨부하여 전송해주세요."
    )


def main():
    if not TG_BOT_TOKEN:
        logger.error("TG_BOT_TOKEN 환경변수가 설정되지 않았습니다.")
        return

    logger.info("텔레그램봇 시작 중...")
    app = ApplicationBuilder().token(TG_BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("status", status))
    app.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    app.add_handler(MessageHandler(filters.Document.ALL, handle_document))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    logger.info(f"봇 활성화 완료! 허용 채팅: {ALLOWED_CHAT_IDS}")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
