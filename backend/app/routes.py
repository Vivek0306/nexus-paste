import secrets
import string

from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request

from . import db
from .models import Paste


api = Blueprint("api", __name__)


# Supported expiration options.
#
# None means the paste never expires.
EXPIRATION_OPTIONS = {
    "never": None,
    "10m": timedelta(minutes=10),
    "1h": timedelta(hours=1),
    "1d": timedelta(days=1),
    "7d": timedelta(days=7),
    "30d": timedelta(days=30),
}


def generate_paste_id(length=8):
    """
    Generate a random unique paste ID.
    """

    characters = string.ascii_letters + string.digits

    while True:
        paste_id = "".join(
            secrets.choice(characters)
            for _ in range(length)
        )

        existing_paste = db.session.get(
            Paste,
            paste_id,
        )

        if existing_paste is None:
            return paste_id


def get_active_paste(paste_id):
    """
    Retrieve a paste and check whether it has expired.

    Expired pastes are deleted from the database
    when they are accessed.
    """

    paste = db.session.get(
        Paste,
        paste_id,
    )

    if paste is None:
        return None

    if paste.is_expired():
        db.session.delete(paste)
        db.session.commit()

        return None

    return paste


@api.get("/health")
def health():
    """
    API health check.
    """

    return jsonify({
        "status": "ok",
    })


@api.post("/pastes")
def create_paste():
    """
    Create a new paste.
    """

    data = request.get_json(silent=True) or {}

    title = str(
        data.get("title", "")
    ).strip()

    content = str(
        data.get("content", "")
    )

    language = str(
        data.get("language", "text")
    ).strip()

    expiration = str(
        data.get("expiration", "never")
    ).strip()

    # -----------------------------
    # Validation
    # -----------------------------

    if not title:
        return jsonify({
            "error": "Title is required",
        }), 400

    if len(title) > 200:
        return jsonify({
            "error": "Title cannot exceed 200 characters",
        }), 400

    if not content.strip():
        return jsonify({
            "error": "Content is required",
        }), 400

    if expiration not in EXPIRATION_OPTIONS:
        return jsonify({
            "error": "Invalid expiration option",
        }), 400

    # -----------------------------
    # Expiration
    # -----------------------------

    now = datetime.now(timezone.utc)

    expiration_delta = EXPIRATION_OPTIONS[
        expiration
    ]

    if expiration_delta is None:
        expires_at = None
    else:
        expires_at = now + expiration_delta

    # -----------------------------
    # Create paste
    # -----------------------------

    paste = Paste(
        id=generate_paste_id(),
        title=title,
        content=content,
        language=language,
        expiration=expiration,
        created_at=now,
        expires_at=expires_at,
    )

    db.session.add(paste)
    db.session.commit()

    return jsonify(
        paste.to_dict()
    ), 201


@api.get("/pastes/<paste_id>")
def get_paste(paste_id):
    """
    Get a paste by ID.
    """

    paste = get_active_paste(
        paste_id
    )

    if paste is None:
        return jsonify({
            "error": "Paste not found",
        }), 404

    return jsonify(
        paste.to_dict()
    )


@api.get("/pastes/<paste_id>/raw")
def get_raw_paste(paste_id):
    """
    Return the raw content of a paste.
    """

    paste = get_active_paste(
        paste_id
    )

    if paste is None:
        return jsonify({
            "error": "Paste not found",
        }), 404

    return (
        paste.content,
        200,
        {
            "Content-Type":
                "text/plain; charset=utf-8"
        },
    )


@api.delete("/pastes/<paste_id>")
def delete_paste(paste_id):
    """
    Delete a paste by ID.
    """

    paste = db.session.get(
        Paste,
        paste_id,
    )

    if paste is None:
        return jsonify({
            "error": "Paste not found",
        }), 404

    db.session.delete(paste)
    db.session.commit()

    return jsonify({
        "message": "Paste deleted",
    })