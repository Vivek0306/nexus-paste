import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPaste } from "../services/api";

function PasteEditor() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [language, setLanguage] = useState("text");
    const [expiration, setExpiration] = useState("never");

    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

    const handleCreate = async (event) => {
        event.preventDefault();

        if (creating) {
            return;
        }

        setError("");

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setError("Please enter a title.");
            return;
        }

        if (!content.trim()) {
            setError("Please enter some content.");
            return;
        }

        try {
            setCreating(true);

            const paste = await createPaste({
                title: trimmedTitle,
                content,
                language,
                expiration,
            });

            navigate(`/${paste.id}`);
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Unable to create paste. Please try again."
            );
        } finally {
            setCreating(false);
        }
    };

    return (
        <section className="editor-card">

            <div className="editor-header">
                <div>
                    <h2>Create a paste</h2>

                    <p>
                        Share text or code with a simple link.
                    </p>
                </div>
            </div>

            <form onSubmit={handleCreate}>

                <div className="form-group">
                    <label htmlFor="title">
                        Title
                    </label>

                    <input
                        id="title"
                        type="text"
                        placeholder="Give your paste a title"
                        value={title}
                        maxLength={200}
                        disabled={creating}
                        onChange={(event) => {
                            setTitle(event.target.value);
                            if (error) setError("");
                        }}
                    />
                </div>

                <div className="form-row">

                    <div className="form-group language-group">
                        <label htmlFor="language">
                            Language
                        </label>

                        <select
                            id="language"
                            value={language}
                            disabled={creating}
                            onChange={(event) => {
                                setLanguage(event.target.value);
                                if (error) setError("");
                            }}
                        >
                            <option value="text">
                                Plain Text
                            </option>

                            <option value="javascript">
                                JavaScript
                            </option>

                            <option value="typescript">
                                TypeScript
                            </option>

                            <option value="python">
                                Python
                            </option>

                            <option value="java">
                                Java
                            </option>

                            <option value="c">
                                C
                            </option>

                            <option value="cpp">
                                C++
                            </option>

                            <option value="csharp">
                                C#
                            </option>

                            <option value="go">
                                Go
                            </option>

                            <option value="rust">
                                Rust
                            </option>

                            <option value="sql">
                                SQL
                            </option>

                            <option value="bash">
                                Bash
                            </option>

                            <option value="json">
                                JSON
                            </option>

                            <option value="yaml">
                                YAML
                            </option>

                            <option value="html">
                                HTML
                            </option>

                            <option value="css">
                                CSS
                            </option>
                        </select>
                    </div>

                    <div className="form-group expiration-group">
                        <label htmlFor="expiration">
                            Expiration
                        </label>

                        <select
                            id="expiration"
                            value={expiration}
                            disabled={creating}
                            onChange={(event) => {
                                setExpiration(event.target.value);
                                if (error) setError("");
                            }}
                        >
                            <option value="never">
                                Never
                            </option>

                            <option value="10m">
                                10 minutes
                            </option>

                            <option value="1h">
                                1 hour
                            </option>

                            <option value="1d">
                                1 day
                            </option>

                            <option value="7d">
                                7 days
                            </option>

                            <option value="30d">
                                30 days
                            </option>
                        </select>
                    </div>

                </div>

                <div className="form-group">

                    <div className="content-label">
                        <label htmlFor="content">
                            Content
                        </label>

                        <span>
                            {content.length} characters
                        </span>
                    </div>

                    <textarea
                        id="content"
                        placeholder="Paste your code or text here..."
                        value={content}
                        disabled={creating}
                        onChange={(event) => {
                            setContent(event.target.value);
                            if (error) setError("");
                        }}
                        spellCheck="false"
                    />

                </div>

                {error && (
                    <div
                        className="form-error"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <div className="editor-footer">

                    <span className="privacy-note">
                        Your paste will be accessible through a unique link.
                    </span>

                    <button
                        type="submit"
                        className="create-button"
                        disabled={creating}
                    >
                        {creating
                            ? "Creating..."
                            : "Create Paste"}
                    </button>

                </div>

            </form>

        </section>
    );
}

export default PasteEditor;