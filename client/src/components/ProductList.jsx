import ProductCard from "./ProductCard";

/**
 * Renderiza una grilla de productos con .map(), usando el id de cada
 * producto como key. Es un componente "tonto": recibe ya el listado
 * que tiene que mostrar (filtrado o no) vía props.
 */
function ProductList({ productos, onVerDetalle, onAgregar }) {
  return (
    <div className="product-grid">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onVerDetalle={onVerDetalle}
          onAgregar={onAgregar}
        />
      ))}
    </div>
  );
}

export default ProductList;
