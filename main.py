from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)
RESULTS_FILE = "quiz_results.json"

# Funkcja do zapisu wyników do pliku JSON
def save_results(data):
    if os.path.exists(RESULTS_FILE):
        with open(RESULTS_FILE, "r", encoding="utf-8") as file:
            try:
                results = json.load(file)
            except json.JSONDecodeError:
                results = []
    else:
        results = []

    results.append(data)

    with open(RESULTS_FILE, "w", encoding="utf-8") as file:
        json.dump(results, file, ensure_ascii=False, indent=4)

@app.route("/save_result", methods=["POST"])
def save_result():
    data = request.json
    save_results(data)
    return jsonify({"message": "Wynik zapisany pomyślnie"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
