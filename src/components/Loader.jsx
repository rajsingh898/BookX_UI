import "./Loader.css";

function Loader() {
  return (
    <div className="spine-loader">
      <div className="spine-stack">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <h1 className="spine-title">BookX</h1>
      <p className="spine-subtitle">A shared digital library</p>
    </div>
  );
}

export default Loader;
 