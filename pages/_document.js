import Document_, { Html, Head, Main, NextScript } from 'next/document'
import { GA_ID } from '../lib/metrics'
import { useAmp } from 'next/amp'

function AmpWrap({ ampOnly, nonAmp }) {
  const isAmp = useAmp()
  if (ampOnly) return isAmp && ampOnly
  return !isAmp && nonAmp
}

export default class Document extends Document_ {
  render() {
    return (
      <Html lang="en">
        <Head>
          <AmpWrap
            ampOnly={
              <>
                <script
                  async
                  key="amp-analytics"
                  custom-element="amp-analytics"
                  src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
                />
                <script
                  async
                  key="amp-bind"
                  custom-element="amp-bind"
                  src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
                />
                <script
                  async
                  key="amp-form"
                  custom-element="amp-form"
                  src="https://cdn.ampproject.org/v0/amp-form-0.1.js"
                />
              </>
            }
          />
        </Head>
        <body>
          <Main />
          <AmpWrap
            ampOnly={
              <>
                <amp-analytics type="gtag" data-credentials="include">
                  <script
                    type="application/json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        vars: {
                          gtag_id: GA_ID,
                          config: {
                            [GA_ID]: { groups: 'default' }
                          }
                        }
                      })
                    }}
                  />
                </amp-analytics>
              </>
            }
          />
          <AmpWrap
            nonAmp={
              <>
                <script
                  async
                  dangerouslySetInnerHTML={{
                    __html: `
                      var _hmt = _hmt || [];
                      (function() {
                        var hm = document.createElement("script");
                        hm.src = "https://hm.baidu.com/hm.js?f085b92569277f39a10af08ce926df18";
                        var s = document.getElementsByTagName("script")[0]; 
                        s.parentNode.insertBefore(hm, s);
                      })();
                  `
                  }}
                />
                <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                />
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}');
                  `
                  }}
                />
                <script
                  async
                  dangerouslySetInnerHTML={{
                    __html: `
              if (window.location.hostname === 'zeit.co'){
                window['_fs_debug'] = false;
                window['_fs_host'] = 'fullstory.com';
                window['_fs_org'] = 'N63EP';
                window['_fs_namespace'] = 'FS';
                (function(m,n,e,t,l,o,g,y){
                      if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
                      g=m[e]=function(a,b,s){g.q?g.q.push([a,b,s]):g._api(a,b,s);};g.q=[];
                      o=n.createElement(t);o.async=1;o.crossOrigin='anonymous';o.src='https://'+_fs_host+'/s/fs.js';
                      y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
                      g.identify=function(i,v,s){g(l,{uid:i},s);if(v)g(l,v,s)};g.setUserVars=function(v,s){g(l,v,s)};g.event=function(i,v,s){g('event',{n:i,p:v},s)};
                      g.shutdown=function(){g("rec",!1)};g.restart=function(){g("rec",!0)};
                      g.log = function(a,b) { g("log", [a,b]) };
                      g.consent=function(a){g("consent",!arguments.length||a)};
                      g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
                      g.clearUserCookie=function(){};
                })(window,document,window['_fs_namespace'],'script','user');
              }`
                  }}
                />
              </>
            }
          />
          <NextScript />
        </body>
      </Html>
    )
  }
}
