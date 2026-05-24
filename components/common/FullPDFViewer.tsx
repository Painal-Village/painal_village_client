import React from 'react';
import { WebView } from 'react-native-webview';
import type { StyleProp, ViewStyle } from 'react-native';

export interface FullPDFViewerProps {
  /** PDF source — base64 data URI or remote URL */
  uri: string;
  /** Optional style for the WebView container */
  style?: StyleProp<ViewStyle>;
}

/**
 * A full multi-page PDF viewer using PDF.js.
 * Renders ALL pages in a scrollable container.
 */
export const FullPDFViewer: React.FC<FullPDFViewerProps> = ({ uri, style }) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3, user-scalable=yes" />
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            width: 100%;
            min-height: 100%;
            background: #e8e8e8;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          #container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 8px 0;
          }
          canvas {
            display: block;
            margin: 6px auto;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          #loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            color: #666;
            font-size: 16px;
          }
          .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #ddd;
            border-top-color: #e8a838;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 12px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          #page-info {
            text-align: center;
            padding: 12px;
            color: #888;
            font-size: 13px;
          }
          #error {
            padding: 20px;
            color: #c00;
            text-align: center;
            display: none;
          }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      </head>
      <body>
        <div id="loading">
          <div class="spinner"></div>
          <span>Loading PDF...</span>
        </div>
        <div id="container" style="display:none"></div>
        <div id="page-info" style="display:none"></div>
        <div id="error"></div>

        <script>
          var pdfUrl = '${uri}';
          var pdfjsLib = window['pdfjs-dist/build/pdf'];
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

          function showError(err) {
            document.getElementById('loading').style.display = 'none';
            var el = document.getElementById('error');
            el.style.display = 'block';
            el.textContent = 'Failed to load PDF: ' + (err && err.message ? err.message : String(err));
          }

          async function renderAllPages() {
            try {
              var pdf = await pdfjsLib.getDocument({ url: pdfUrl, withCredentials: false }).promise;
              var totalPages = pdf.numPages;

              document.getElementById('loading').style.display = 'none';
              var container = document.getElementById('container');
              container.style.display = 'flex';
              var pageInfo = document.getElementById('page-info');
              pageInfo.style.display = 'block';
              pageInfo.textContent = 'Total Pages: ' + totalPages;

              // Determine scale based on device width
              var firstPage = await pdf.getPage(1);
              var unscaledViewport = firstPage.getViewport({ scale: 1 });
              var deviceWidth = window.innerWidth - 16; // 8px padding on each side
              var scale = deviceWidth / unscaledViewport.width;

              for (var i = 1; i <= totalPages; i++) {
                var page = await pdf.getPage(i);
                var viewport = page.getViewport({ scale: scale });

                var canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                container.appendChild(canvas);

                var context = canvas.getContext('2d');
                await page.render({ canvasContext: context, viewport: viewport }).promise;
              }
            } catch (err) {
              showError(err);
            }
          }

          renderAllPages();
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={[{ flex: 1, backgroundColor: '#e8e8e8' }, style]}
      javaScriptEnabled
      scalesPageToFit={false}
      showsVerticalScrollIndicator
      bounces
      startInLoadingState={false}
    />
  );
};
