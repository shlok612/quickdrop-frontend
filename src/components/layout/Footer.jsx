import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <nav className="site-footer-links" aria-label="Legal links">
        <Link to="/about">About</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Link to="/" className="site-footer-copy">QuickDrop</Link>
    </footer>
  );
}

export default Footer;
