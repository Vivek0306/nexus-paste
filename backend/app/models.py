from datetime import datetime, timezone

from . import db


class Paste(db.Model):
    __tablename__ = "pastes"

    id = db.Column(
        db.String(12),
        primary_key=True,
    )

    title = db.Column(
        db.String(200),
        nullable=False,
    )

    content = db.Column(
        db.Text,
        nullable=False,
    )

    language = db.Column(
        db.String(50),
        nullable=False,
        default="text",
    )

    expiration = db.Column(
        db.String(10),
        nullable=False,
        default="never",
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    expires_at = db.Column(
        db.DateTime(timezone=True),
        nullable=True,
    )

    def is_expired(self):
        """
        Return True if the paste has an expiration
        time and that time has passed.
        """

        if self.expires_at is None:
            return False

        return self.expires_at <= datetime.now(timezone.utc)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "language": self.language,
            "expiration": self.expiration,
            "createdAt": self.created_at.isoformat(),
            "expiresAt": (
                self.expires_at.isoformat()
                if self.expires_at
                else None
            ),
        }