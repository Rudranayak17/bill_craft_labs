import React from 'react';
import { 
  Type, 
  Image, 
  Square,
  Undo2, 
  Redo2, 
  Save, 
  Download,
  ZoomIn,
  ZoomOut,
  FileDown
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { jsPDF } from 'jspdf';

export const Toolbar: React.FC = () => {
  const { undo, redo, zoom, setZoom, canvas } = useEditorStore();

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));

  const exportCanvas = (format: 'png' | 'jpeg' | 'pdf') => {
    if (!canvas) return;

    if (format === 'pdf') {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const data = canvas.toDataURL({
        format: 'jpeg',
        quality: 1.0
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(data, 'JPEG', 0, 0, width, height);
      pdf.save('invoice.pdf');
    } else {
      const data = canvas.toDataURL({
        format: format,
        quality: 1.0
      });
      
      const link = document.createElement('a');
      link.download = `invoice.${format}`;
      link.href = data;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-16 border-b bg-white px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Undo"
        >
          <Undo2 className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Redo"
        >
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportCanvas('png')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center space-x-1"
          >
            <FileDown className="w-4 h-4" />
            <span>PNG</span>
          </button>
          <button
            onClick={() => exportCanvas('jpeg')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center space-x-1"
          >
            <FileDown className="w-4 h-4" />
            <span>JPEG</span>
          </button>
          <button
            onClick={() => exportCanvas('pdf')}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center space-x-1"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};