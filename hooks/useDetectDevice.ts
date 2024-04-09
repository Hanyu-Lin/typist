//Custom hook to detect the device type isMobile and isTablet or isDesktop using navigator.userAgent

import { useEffect, useState } from "react";

export default function useDetectDevice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      )
    );
  }, []);

  return { isMobile };
}
