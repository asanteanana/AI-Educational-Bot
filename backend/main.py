from fastapi import FastAPI, HTTPException
from models.text_model import generate_text
from models.tts_model import synthesize_speech
from fastapi.responses import FileResponse

app = FastAPI()

@app.post("/api/ask")
async def get_response(request: dict):
    query = request.get("query")
    if not query:
        raise HTTPException(status_code=400, detail="Invalid input")
    
    text_response = generate_text(query)
    audio_path = synthesize_speech(text_response)
    
    return {"answer": text_response, "audio": audio_path}

@app.get("/api/audio/{filename}")
async def get_audio(filename: str):
    return FileResponse(f"static/audio/{filename}")
