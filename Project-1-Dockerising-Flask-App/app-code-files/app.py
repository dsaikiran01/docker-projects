import os
from flask import Flask, jsonify

app = Flask(__name__)

MESSAGE = os.getenv("APP_MESSAGE", "Hello from Flask App!")

@app.route("/")
def home():
    return MESSAGE

@app.route("/health")
def health():
    return jsonify(status="ok")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
