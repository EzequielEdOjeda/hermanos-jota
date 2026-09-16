function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <img src="/img/logo.svg" alt="" />
            Hermanos Jota
          </div>
          <p className="footer-tagline">Redescubriendo el arte de vivir desde 2025.</p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>Navegación</h4>
            <ul>
              <li>
                <a
                  href="#inicio"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("inicio");
                  }}
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#catalogo"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("catalogo");
                  }}
                >
                  Catálogo
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("contacto");
                  }}
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a>
              </li>
              <li>
                <a href="https://wa.me/541145678900" target="_blank" rel="noopener noreferrer">
                  +54 11 4567-8900
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/hermanosjota_ba"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @hermanosjota_ba
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Showroom</h4>
            <ul>
              <li>Av. San Juan 2847</li>
              <li>CABA, Argentina</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 Hermanos Jota. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}

export default Footer;
