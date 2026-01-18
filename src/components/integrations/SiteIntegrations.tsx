import Script from "next/script";
import { integrationsEnv } from "@/lib/integrations/env";
import { CHAT_CONFIG } from "@/config/chat";
import { OpenAIChatWidget } from "@/components/OpenAIChatWidget";

export function SiteIntegrations() {
  const { gaMeasurementId, metaPixelId, pinterestTagId, hubspotPortalId } = integrationsEnv;

  return (
    <>
      {gaMeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
 n.callMethod.apply(n,arguments):n.queue.push(arguments)};
 if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
 n.queue=[];t=b.createElement(e);t.async=!0;
 t.src=v;s=b.getElementsByTagName(e)[0];
 s.parentNode.insertBefore(t,s)}(window, document,'script',
 'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');
          `}
        </Script>
      ) : null}

      {pinterestTagId ? (
        <Script id="pinterest-tag" strategy="afterInteractive">
          {`
!function(e){if(!window.pintrk){window.pintrk = function (){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};
var n=window.pintrk;n.queue=[],n.version="3.0";
var t=document.createElement("script");t.async=!0,t.src=e;
var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '${pinterestTagId}', {em: ''});
pintrk('page');
          `}
        </Script>
      ) : null}

      {CHAT_CONFIG.hubspot.enabled ? (
        hubspotPortalId ? (
          <>
            <Script
              id="hs-script-loader"
              src={`https://js.hs-scripts.com/${encodeURIComponent(hubspotPortalId)}.js`}
              async
              defer
              type="text/javascript"
              strategy="afterInteractive"
            />
          </>
        ) : (
          <Script id="hubspot-chat-missing" strategy="afterInteractive">
            {`console.warn('[chat] HubSpot chat is enabled but NEXT_PUBLIC_HUBSPOT_PORTAL_ID is not set. HubSpot chat will not load.');`}
          </Script>
        )
      ) : null}

      {CHAT_CONFIG.openai.enabled ? <OpenAIChatWidget /> : null}
    </>
  );
}
