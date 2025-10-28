import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, Maximize, Minimize } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
  onDownload: () => void;
}

export default function PDFViewer({ pdfUrl, title, onClose, onDownload }: PDFViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Empêcher le scroll du body quand le PDF viewer est ouvert
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'w-screen h-screen max-w-none max-h-none rounded-none'
          : 'w-full h-full max-w-7xl max-h-[96vh] sm:max-h-[92vh]'
      }`}>
        {/* Header avec boutons */}
        <div className={`flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#6B4C4C] to-[#8A6A6A] text-white transition-all duration-300 ${
          isFullscreen ? 'rounded-none' : 'rounded-t-xl'
        }`}>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 rounded-lg transition-all duration-200 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Retour</span>
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-white truncate flex-1 text-center">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 rounded-lg transition-all duration-200 flex-shrink-0"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span className="text-sm font-medium">{isFullscreen ? 'Quitter' : 'Plein écran'}</span>
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white hover:bg-opacity-30 rounded-lg transition-all duration-200 flex-shrink-0"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Télécharger</span>
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-2 sm:p-4 min-h-0">
          <iframe
            ref={iframeRef}
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full border-0 rounded-lg shadow-inner"
            title={`PDF: ${title}`}
            style={{
              minHeight: '500px',
              backgroundColor: '#f8f9fa'
            }}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}