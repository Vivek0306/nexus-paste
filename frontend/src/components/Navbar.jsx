function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a
          href="/"
          className="logo"
        >
          <span className="logo-mark">N</span>
          <span>Nexus Paste</span>
        </a>

        <div className="navbar-links">
          <a href="/">New Paste</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;