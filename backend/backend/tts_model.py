import torchaudio
from tortoise.api import TextToSpeech
from tortoise.utils.audio import save_wav

tts = TextToSpeech()

def synthesize_speech(text):
    speech = tts.tts(text, voice="random")
    audio_path = f"static/audio/response.wav"
    save_wav(speech, audio_path)
    return f"/api/audio/response.wav"
