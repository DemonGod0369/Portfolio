/**
 * Accurate client platform, operating system, and browser detection utility.
 * Parses user agent strings and modern client hints without external dependencies.
 */

export interface ClientPlatformInfo {
  browser: string;
  browserVersion?: string;
  os: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  screenResolution: string;
  displaySummary: string;
}

export function detectBrowserClientPlatform(): ClientPlatformInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      browser: 'Web Browser',
      os: 'Unknown OS',
      deviceType: 'Desktop',
      screenResolution: 'Standard',
      displaySummary: 'Web Browser on Unknown OS (Desktop)',
    };
  }

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // 1. Detect Operating System
  let os = 'Unknown OS';
  if (/Windows NT 10.0/i.test(ua)) {
    os = 'Windows 10/11';
  } else if (/Windows NT 6.3/i.test(ua)) {
    os = 'Windows 8.1';
  } else if (/Windows NT 6.2/i.test(ua)) {
    os = 'Windows 8';
  } else if (/Windows NT 6.1/i.test(ua)) {
    os = 'Windows 7';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows';
  } else if (/Android/i.test(ua)) {
    const androidMatch = ua.match(/Android\s([0-9\.]+)/i);
    os = androidMatch ? `Android ${androidMatch[1]}` : 'Android';
  } else if (/iPhone/i.test(ua)) {
    const iosMatch = ua.match(/OS\s([0-9_]+)/i);
    os = iosMatch ? `iOS ${iosMatch[1].replace(/_/g, '.')}` : 'iOS (iPhone)';
  } else if (/iPad/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1)) {
    os = 'iPadOS';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    const macMatch = ua.match(/Mac OS X\s?([0-9_\.]+)?/i);
    if (macMatch && macMatch[1]) {
      const version = macMatch[1].replace(/_/g, '.');
      os = `macOS (${version})`;
    } else {
      os = 'macOS';
    }
  } else if (/CrOS/i.test(ua)) {
    os = 'ChromeOS';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }

  // 2. Detect Browser & Version
  let browser = 'Unknown Browser';
  let browserVersion = '';

  if (/Edg\/([0-9\.]+)/i.test(ua)) {
    const match = ua.match(/Edg\/([0-9\.]+)/i);
    browser = 'Microsoft Edge';
    browserVersion = match ? match[1].split('.')[0] : '';
  } else if (/OPR\/([0-9\.]+)/i.test(ua) || /Opera\/([0-9\.]+)/i.test(ua)) {
    const match = ua.match(/(?:OPR|Opera)\/([0-9\.]+)/i);
    browser = 'Opera';
    browserVersion = match ? match[1].split('.')[0] : '';
  } else if (/Vivaldi\/([0-9\.]+)/i.test(ua)) {
    const match = ua.match(/Vivaldi\/([0-9\.]+)/i);
    browser = 'Vivaldi';
    browserVersion = match ? match[1].split('.')[0] : '';
  } else if (/SamsungBrowser\/([0-9\.]+)/i.test(ua)) {
    const match = ua.match(/SamsungBrowser\/([0-9\.]+)/i);
    browser = 'Samsung Internet';
    browserVersion = match ? match[1].split('.')[0] : '';
  } else if (/Chrome\/([0-9\.]+)/i.test(ua)) {
    const match = ua.match(/Chrome\/([0-9\.]+)/i);
    browser = 'Google Chrome';
    browserVersion = match ? match[1].split('.')[0] : '';
  } else if (/Firefox\/([0-9\.]+)/i.test(ua)) {
    const match = ua.match(/Firefox\/([0-9\.]+)/i);
    browser = 'Mozilla Firefox';
    browserVersion = match ? match[1].split('.')[0] : '';
  } else if (/Safari\/([0-9\.]+)/i.test(ua) && !/Chrome/i.test(ua)) {
    const versionMatch = ua.match(/Version\/([0-9\.]+)/i);
    browser = 'Apple Safari';
    browserVersion = versionMatch ? versionMatch[1].split('.')[0] : '';
  }

  // 3. Detect Device Type
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // 4. Resolution
  let screenResolution = 'Standard';
  if (typeof window !== 'undefined' && window.screen) {
    screenResolution = `${window.screen.width} × ${window.screen.height}`;
  }

  const browserDisplay = browserVersion ? `${browser} v${browserVersion}` : browser;
  const displaySummary = `${browserDisplay} on ${os} (${deviceType})`;

  return {
    browser: browserDisplay,
    browserVersion,
    os,
    deviceType,
    screenResolution,
    displaySummary,
  };
}
