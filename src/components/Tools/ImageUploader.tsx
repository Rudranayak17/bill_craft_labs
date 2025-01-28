import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export const ImageUploader: React.FC = () => {
  const { canvas } = useEditorStore();
  const [recentImages, setRecentImages] = React.useState<string[]>([]);

  const addImageToCanvas = (imgSrc: string, centerImage: boolean = true) => {
    if (!canvas) return;

    const imgElement = new Image();
    imgElement.src = imgSrc;
    imgElement.onload = () => {
      const fabricImage = new fabric.Image(imgElement, {
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5
      });

      canvas.add(fabricImage);
      if (centerImage) {
        canvas.centerObject(fabricImage);
      }
      canvas.setActiveObject(fabricImage);
      canvas.renderAll();

      // Add to recent images if not already present
      if (!recentImages.includes(imgSrc)) {
        setRecentImages(prev => [imgSrc, ...prev].slice(0, 6));
      }
    };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgSrc = e.target?.result as string;
        addImageToCanvas(imgSrc);
      };
      reader.readAsDataURL(file);
    });
  }, [canvas]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
      >
        <input {...getInputProps()} />
        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop image here' : 'Drag & drop image or click to select'}
        </p>
      </div>

      {recentImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Images</h3>
          <div className="grid grid-cols-3 gap-2">
            {recentImages.map((imgSrc, index) => (
              <div
                key={index}
                className="aspect-square border rounded-lg overflow-hidden cursor-pointer hover:border-primary-500"
                onClick={() => addImageToCanvas(imgSrc, true)}
              >
                <img
                  src={imgSrc}
                  alt={`Recent ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};