import { useState, useEffect } from "react";

const IP_SERVICES = [
  "https://api.ipify.org?format=json",
  "https://ipapi.co/json/",
];

export const useIpDetection = () => {
  const [ip, setIp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIp = async () => {
      for (const service of IP_SERVICES) {
        try {
          const response = await fetch(service, {
            signal: AbortSignal.timeout(3000),
          });
          if (!response.ok) continue;

          const data = await response.json();
          // specific handling for ipapi.co vs ipify
          const detectedIp = data.ip || data.ip_address;

          if (detectedIp) {
            setIp(detectedIp);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn(`Failed to fetch IP from ${service}`, err);
          // Continue to next service
        }
      }
      setLoading(false);
    };

    fetchIp();
  }, []);

  return { ip, loading };
};
