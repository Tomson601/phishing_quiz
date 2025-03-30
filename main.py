from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)
DB_FILE = "quiz_results.json"

# Funkcja pomocnicza do wczytywania danych z pliku JSON
def load_results():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as file:
            return json.load(file)
    return []

# Funkcja pomocnicza do zapisywania danych do pliku JSON
def save_results(results):
    with open(DB_FILE, "w") as file:
        json.dump(results, file, indent=4)

# Endpoint zwracający TOP 5 graczy
@app.route("/get_top_players", methods=["GET"])
def get_top_players():
    results = load_results()
    # Sortowanie graczy po wyniku malejąco i pobranie najlepszych 5
    top_players = sorted(results, key=lambda x: x["score"], reverse=True)[:5]
    return jsonify(top_players)

# Endpoint zapisujący wynik gracza
@app.route("/save_result", methods=["POST"])
def save_result():
    new_result = request.json  # Odczyt danych z zapytania
    results = load_results()
    results.append(new_result)  # Dodaj nowy wynik do listy
    save_results(results)  # Zapisz do pliku
    return jsonify({"message": "Wynik zapisany pomyślnie!"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
