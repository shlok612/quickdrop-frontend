import { useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";
const IS_ADSENSE_READY = !AD_CLIENT.includes("XXXX");

function AdBanner({ slot = "0000000000", format = "auto", className = "" }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (!IS_ADSENSE_READY) return;
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.debug("AdSense placeholder not filled:", error);
    }
  }, []);

  return (
    <div className={`ad-banner ${className}`.trim()}>
      <div className="ad-banner-placeholder" aria-hidden="true">
        <span>Sponsored space</span>
      </div>
      {IS_ADSENSE_READY && (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", background: "transparent" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}

export default AdBanner;
