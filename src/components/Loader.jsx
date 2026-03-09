import { useEffect } from "react";
import "./Loader.css";

function Loader() {

  useEffect(() => {
    const services = [
      "https://api-gateway-0xes.onrender.com",
      "https://user-service-qxix.onrender.com",
      "https://book-service-w0pa.onrender.com"
    ];

    services.forEach((url) => {
      fetch(url).catch(() => {});
    });

  }, []);

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