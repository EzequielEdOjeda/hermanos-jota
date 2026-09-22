import React from 'react';

function NotFound({ onNavigate }) {
  return (
    <section className="section section--alt" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container text-center">
        <div className="section-intro" style={{ margin: '0 auto' }}>
          <p className="eyebrow">Error 404</p>
          <h1 className="section-title">Página no encontrada</h1>
          <p className="hero__lead" style={{ margin: '1.5rem auto' }}>
            Lo sentimos, la pieza de mobiliario o la sección que estás buscando no existe en nuestro catálogo actual.
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => onNavigate("inicio")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </section>
  );
}

export default NotFound;