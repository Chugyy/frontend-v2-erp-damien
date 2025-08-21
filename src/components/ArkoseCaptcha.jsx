import { useEffect, useRef, useState } from "react";

export default function ArkoseCaptcha({ accountId, publicKey, data, onSolved, onError }) {
  const [error, setError] = useState(null);
  const scriptLoadedRef = useRef(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (scriptLoadedRef.current || !publicKey) return;
    scriptLoadedRef.current = true;

    // Setup global callback for Arkose
    const callbackName = `setupEnforcement_${accountId}`;
    
    // Wait for DOM to be ready
    const setupArkose = () => {
      console.log('Setting up Arkose with publicKey:', publicKey);
      console.log('Container ID:', `arkose-container-${accountId}`);
      console.log('Data present:', !!data);
      
      window[callbackName] = (enforcement) => {
        console.log('Arkose enforcement callback called');
        
        const containerId = `arkose-container-${accountId}`;
        const container = document.getElementById(containerId);
        
        if (!container) {
          const errorMsg = `Container ${containerId} not found`;
          console.error(errorMsg);
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        const cfg = {
          selector: `#${containerId}`,
          onReady: () => {
            console.log('Arkose widget ready');
            enforcement.run();
          },
          onCompleted: (resp) => {
            console.log('Arkose completed:', resp);
            if (resp?.token) {
              onSolved(resp.token);
            } else {
              setError('Token de captcha manquant');
              onError?.('Token de captcha manquant');
            }
          },
          onError: (e) => {
            const errorMsg = e?.message || 'Erreur lors du captcha';
            console.error('Arkose error:', e);
            setError(errorMsg);
            onError?.(errorMsg);
          },
          onFailed: () => {
            console.log('Captcha failed, rerunning');
            enforcement.run();
          },
        };

        if (data) {
          cfg.data = { blob: data };
          console.log('Added data blob to config');
        }

        console.log('Setting Arkose config:', cfg);
        enforcement.setConfig(cfg);
      };

      // Load Arkose script
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.src = `https://client-api.arkoselabs.com/v2/${publicKey}/api.js`;
      script.setAttribute("data-callback", callbackName);
      
      script.onload = () => {
        console.log('Arkose script loaded successfully');
      };
      
      script.onerror = () => {
        const errorMsg = 'Erreur de chargement du captcha';
        console.error(errorMsg);
        setError(errorMsg);
        onError?.(errorMsg);
      };

      document.head.appendChild(script);

      // Store cleanup function
      cleanupRef.current = () => {
        try {
          delete window[callbackName];
          if (script.parentNode) {
            document.head.removeChild(script);
          }
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
      };
    };

    // Small delay to ensure DOM is ready
    setTimeout(setupArkose, 100);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [publicKey, data, accountId, onSolved, onError]);

  if (!publicKey) {
    return (
      <div className="captcha-error">
        <p>Configuration captcha manquante</p>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Debug: publicKey={JSON.stringify(publicKey)}, data={data ? 'présent' : 'absent'}
        </p>
      </div>
    );
  }

  return (
    <div className="arkose-captcha-container">
      <div 
        id={`arkose-container-${accountId}`} 
        style={{ 
          minHeight: '350px',
          minWidth: '300px',
          width: '100%',
          position: 'relative',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: '#f8fafc',
          overflow: 'hidden'
        }} 
      >
        {/* Placeholder text while loading */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: '14px',
          zIndex: 1
        }}>
          Chargement du captcha...
        </div>
      </div>
      {error && (
        <div className="captcha-error" style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#fee',
          color: '#c53030',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      {/* Debug info */}
      <div style={{ 
        marginTop: '8px', 
        fontSize: '11px', 
        color: '#888',
        fontFamily: 'monospace'
      }}>
        Debug: Container ID = arkose-container-{accountId}, PublicKey = {publicKey?.substring(0, 8)}...
      </div>
    </div>
  );
}
