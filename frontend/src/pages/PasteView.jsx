import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getPaste,
  deletePaste,
} from "../services/api";

function PasteView() {
  const { pasteId } = useParams();
  const navigate = useNavigate();

  const [paste, setPaste] = useState(undefined);
  const [copied, setCopied] = useState(false);
  const [copiedURL, setCopiedURL] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPaste = async () => {
      try {
        setPaste(undefined);

        const result = await getPaste(pasteId);

        if (!cancelled) {
          setPaste(result);
        }
      } catch {
        if (!cancelled) {
          setPaste(null);
        }
      }
    };

    loadPaste();

    return () => {
      cancelled = true;
    };
  }, [pasteId]);

  const copyURL = async () => {
    try{
        await navigator.clipboard.writeText(window.location);
        
        setCopiedURL(true);
        
        window.setTimeout(() => {
            setCopiedURL(false);
        }, 2000)
    }catch{
        setCopiedURL(false);
    }
  }

  const copyPaste = async () => {
    if (!paste) {
      return;
    }

    try {
      await navigator.clipboard.writeText(paste.content);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleRaw = () => {
    if (!paste) {
      return;
    }

    const apiBase =
      import.meta.env.VITE_API_URL || "/api";

    const rawUrl =
      `${apiBase}/pastes/${paste.id}/raw`;

    window.open(
      rawUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleDelete = async () => {
    if (!paste || deleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this paste?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deletePaste(paste.id);

      navigate("/");
    } catch {
      setDeleting(false);

      window.alert(
        "Unable to delete paste. Please try again."
      );
    }
  };

  /*
   * Loading state
   */
  if (paste === undefined) {
    return (
      <div className="paste-state">
        Loading paste...
      </div>
    );
  }

  /*
   * Not found / expired state
   */
  if (paste === null) {
    return (
      <div className="home">

        <nav className="navbar">
          <div className="navbar-inner">

            <Link
              to="/"
              className="logo"
            >
              <span className="logo-mark">
                N
              </span>

              <span>
                Nexus Paste
              </span>
            </Link>

          </div>
        </nav>

        <main className="paste-state">

          <div className="state-icon">
            ?
          </div>

          <h1>
            Paste not found
          </h1>

          <p>
            This paste doesn't exist or may have expired.
          </p>

          <Link
            to="/"
            className="primary-button state-button"
          >
            Create a new paste
          </Link>

        </main>

      </div>
    );
  }

  const formattedDate = new Date(
    paste.createdAt
  ).toLocaleString();

  return (
    <div className="home">

      <nav className="navbar">

        <div className="navbar-inner">

          <Link
            to="/"
            className="logo"
          >
            <span className="logo-mark">
              N
            </span>

            <span>
              Nexus Paste
            </span>
          </Link>

          <div className="navbar-links">
            <Link to="/">
              New Paste
            </Link>
          </div>

        </div>

      </nav>

      <main className="paste-view-container">

        <div className="paste-view-header">

          <div className="paste-title-section">

            <span className="paste-language">
              {paste.language}
            </span>

            <h1>
              {paste.title}
            </h1>

            <p>
              Paste ID:{" "}
              <span>
                {paste.id || pasteId}
              </span>
            </p>

          </div>

          <div className="paste-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={copyURL}
            >
              {copiedURL ? "Copied!" : "Copy Link"}
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={handleRaw}
            >
              Raw
            </button>

          </div>

        </div>

        <div className="paste-meta">
          Created {formattedDate}
        </div>

        <div className="code-container">

          <div className="code-header">

            <span>
              {paste.language}
            </span>
            
            <span className="code-header-action">
              {paste.content.length} characters
              <button
              type="button"
              className="action-btn secondary-button"
              onClick={copyPaste}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            </span>

          </div>

          <pre>
            <code>
              {paste.content}
            </code>
          </pre>

        </div>

        <div className="paste-management">

          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete Paste"}
          </button>

        </div>

        <div className="paste-footer">

          <Link
            to="/"
            className="create-another"
          >
            + Create another paste
          </Link>

        </div>

      </main>

    </div>
  );
}

export default PasteView;