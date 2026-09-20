function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a
          href="/"
          className="logo"
        >
          <img className="logo-img" src="./favicon.png" alt="" width={60} height={60}/>
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