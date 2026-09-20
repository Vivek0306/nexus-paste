import secrets
import string

from flask import Blueprint, jsonify, request

from . import db
from .models import Paste


api = Blueprint("api", __name__)


def generate_paste_id(length=8):
    characters = string.ascii_letters + string.digits

    while True:
        paste_id = "".join(
            secrets.choice(characters)
            for _ in range(length)
        )

        existing = db.session.get(Paste, paste_id)

        if existing is None:
            return paste_id


@api.get("/health")
def health():
    return jsonify({
        "status": "ok"
    })


@api.post("/pastes")
def create_paste():
    data = request.get_json(silent=True) or {}

    title = data.get("title", "").strip()
    content = data.get("content", "").strip()
    language = data.get("language", "text").strip()

    if not title:
        return jsonify({
            "error": "Title is required"
        }), 400

    if not content:
        return jsonify({
            "error": "Content is required"
        }), 400

    paste = Paste(
        id=generate_paste_id(),
        title=title,
        content=content,
        language=language
    )

    db.session.add(paste)
    db.session.commit()

    return jsonify(paste.to_dict()), 201


@api.get("/pastes/<paste_id>")
def get_paste(paste_id):
    paste = db.session.get(Paste, paste_id)

    if paste is None:
        return jsonify({
            "error": "Paste not found"
        }), 404

    return jsonify(paste.to_dict())


@api.get("/pastes/<paste_id>/raw")
def get_raw_paste(paste_id):
    paste = db.session.get(Paste, paste_id)

    if paste is None:
        return jsonify({
            "error": "Paste not found"
        }), 404

    return (
        paste.content,
        200,
        {
            "Content-Type": "text/plain; charset=utf-8"
        }
    )


@api.delete("/pastes/<paste_id>")
def delete_paste(paste_id):
    paste = db.session.get(Paste, paste_id)

    if paste is None:
        return jsonify({
            "error": "Paste not found"
        }), 404

    db.session.delete(paste)
    db.session.commit()

    return jsonify({
        "message": "Paste deleted"
    })