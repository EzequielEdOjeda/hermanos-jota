import ProductList from "./ProductList";

function Home({ productos, cargando, error, onVerDetalle, onAgregar, onNavigate }) {
  const destacados = productos.filter((p) => p.destacado);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <svg
          className="hero__rings"
          viewBox="0 0 340 340"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="170" cy="170" r="160" fill="none" stroke="#A0522D" strokeWidth="1" />
          <circle cx="170" cy="170" r="128" fill="none" stroke="#A0522D" strokeWidth="1" />
          <circle cx="170" cy="170" r="96" fill="none" stroke="#D4A437" strokeWidth="1" />
          <circle cx="170" cy="170" r="64" fill="none" stroke="#A0522D" strokeWidth="1" />
          <circle cx="170" cy="170" r="32" fill="none" stroke="#87A96B" strokeWidth="1" />
        </svg>

        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">Redescubriendo el arte de vivir desde 2025</p>
            <h1 className="hero__title">
              Muebles que <em>alimentan el alma</em>
            </h1>
            <p className="hero__lead">
              Cada pieza cuenta la historia de manos expertas y materiales nobles. Maderas
              certificadas FSC®, acabados naturales y un diseño que honra el pasado mientras abraza
              el futuro.
            </p>
            <div className="hero__actions">
              <a
                href="#catalogo"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("catalogo");
                }}
              >
                Ver catálogo
              </a>
              <a href="#destacados" className="btn btn-outline">
                Piezas destacadas
              </a>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <strong>11</strong>
                <span>Piezas en catálogo</span>
              </div>
              <div className="hero__stat">
                <strong>FSC®</strong>
                <span>Madera certificada</span>
              </div>
              <div className="hero__stat">
                <strong>10 años</strong>
                <span>Garantía en estructura</span>
              </div>
            </div>
          </div>

          <div className="hero__media">
            <img src="/img/sofa-patagonia.png" alt="Sofá Patagonia en lino Warm Alabaster" />
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="section" id="destacados">
        <div className="container">
          <div className="section-header section-header--split">
            <div className="section-intro">
              <p className="eyebrow">Piezas destacadas</p>
              <h2 className="section-title">Lo más elegido</h2>
            </div>
            <a
              href="#catalogo"
              className="product-card__link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("catalogo");
              }}
            >
              Ver catálogo completo →
            </a>
          </div>

          {cargando && (
            <div className="skeleton-grid" aria-hidden="true">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          )}

          {!cargando && error && (
            <p className="state-message">
              No pudimos cargar los productos destacados. Intentá recargar la página.
            </p>
          )}

          {!cargando && !error && (
            <ProductList productos={destacados} onVerDetalle={onVerDetalle} onAgregar={onAgregar} />
          )}
        </div>
      </section>

      {/* VALORES DE MARCA */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Nuestro compromiso</p>
            <h2 className="section-title">Sustentabilidad y materiales</h2>
          </div>

          <div className="values-grid">
            <article className="value-card">
              <h3>Madera con origen</h3>
              <p>
                Certificada FSC® de bosques responsables argentinos, priorizando especies nativas
                como algarrobo y quebracho.
              </p>
            </article>
            <article className="value-card">
              <h3>Acabados naturales</h3>
              <p>
                Aceite de lino prensado en frío, cera de abejas de origen local y tintes vegetales a
                base de agua.
              </p>
            </article>
            <article className="value-card">
              <h3>Programa Herencia Viva</h3>
              <p>
                Garantía extendida, servicio de restauración y recompra de hasta el 40% del valor en
                piezas bien cuidadas.
              </p>
            </article>
            <article className="value-card">
              <h3>Cero plástico de un solo uso</h3>
              <p>
                Toda nuestra cadena de producción y despacho evita los plásticos descartables, de
                punta a punta.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <h2>Visitá nuestro showroom</h2>
          <p>
            Av. San Juan 2847, Barrio de San Cristóbal, CABA. Lunes a viernes de 10 a 19 h, sábados
            de 10 a 14 h.
          </p>
          <a
            href="#contacto"
            className="btn btn-outline"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("contacto");
            }}
          >
            Escribinos
          </a>
        </div>
      </section>
    </>
  );
}

export default Home;
