import { useEffect } from "react";

const AdNative = () => {
  useEffect(() => {
    // prevent duplicate script load
    if (document.getElementById("adsterra-script")) return;

    const script = document.createElement("script");
    script.id = "adsterra-script";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "https://pl28398702.effectivegatecpm.com/aa8a072ecad9995ff55eb0f42117d85c/invoke.js";

    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="container-aa8a072ecad9995ff55eb0f42117d85c"
      style={{ margin: "20px 0", textAlign: "center" }}
    />
  );
};

export default AdNative;
