import { useEffect, useState } from "react";

export default function SplashLoader({ onFinish }) {
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSaliendo(true), 1800);
    const t2 = setTimeout(() => onFinish?.(), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className={`splash${saliendo ? " splash--saliendo" : ""}`} aria-hidden="true">
      <div className="splash__logo-wrap">
        <img className="splash__logo-base" src="/img/logo.svg" alt="" />
        <span className="splash__logo-fill" />
      </div>
    </div>
  );
}