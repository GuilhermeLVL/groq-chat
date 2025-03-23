from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permitir que o frontend acesse a API

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    user_api_key = data.get("api_key", "")

    if not user_api_key:
        return jsonify({"error": "API Key é obrigatória!"}), 400

    try:
        client = Groq(api_key=user_api_key)
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": user_message}],
            model="llama-3.3-70b-versatile",
        )
        reply = chat_completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
