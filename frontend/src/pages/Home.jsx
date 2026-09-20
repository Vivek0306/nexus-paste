import Navbar from "../components/Navbar";
import PasteEditor from "../components/PasteEditor";

function Home() {
  return (
    <div className="home">
      <Navbar />

      <main className="home-content">
        <section className="hero">
          <div className="hero-badge">
            Simple. Fast. Private.
          </div>

          <h1>
            Share your code
            <br />
            <span>with Nexus Paste.</span>
          </h1>

          <p>
            Create a paste, get a link, and share it anywhere.
          </p>
        </section>

        <PasteEditor />
      </main>
    </div>
  );
}

export default Home;