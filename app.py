from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
import requests

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/notes"
mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/notes", methods=["GET"])
def get_notes():
    notes = list(mongo.db.notes_collection.find({}))
    for note in notes:
        note["_id"] = str(note["_id"])
    return jsonify(notes)

@app.route("/notes", methods=["POST"])
def add_note():
    data = request.json
    note = data["note"]
    mongo.db.notes_collection.insert_one({"note": note})
    return jsonify({"status": "Note added"})

@app.route("/notes/<note_id>", methods=["DELETE"])
def delete_note(note_id):
    mongo.db.notes_collection.delete_one({"_id": ObjectId(note_id)})
    return jsonify({"status": "Note deleted"})

@app.route("/random_fact")
def random_fact():
    response = requests.get('https://uselessfacts.jsph.pl/random.json?language=en')
    fact = response.json()['text']
    return jsonify({"fact": fact})

if __name__ == "__main__":
    app.run(debug=True)
