import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { useEditorStore } from '../../store/editorStore';

export const ElementProperties: React.FC = () => {
  const { canvas } = useEditorStore();
  const [activeObject, setActiveObject] = React.useState<fabric.Object | null>(null);
  const [color, setColor] = React.useState('#000000');
  const [opacity, setOpacity] = React.useState(100);
  const [fontSize, setFontSize] = React.useState(16);

  React.useEffect(() => {
    if (!canvas) return;

    const updateActiveObject = () => {
      const active = canvas.getActiveObject();
      setActiveObject(active);
      if (active) {
        setColor(active.get('fill') as string || '#000000');
        setOpacity(Math.round((active.get('opacity') || 1) * 100));
        if ('fontSize' in active) {
          setFontSize(active.get('fontSize') as number);
        }
      }
    };

    canvas.on('selection:created', updateActiveObject);
    canvas.on('selection:updated', updateActiveObject);
    canvas.on('selection:cleared', () => setActiveObject(null));

    return () => {
      canvas.off('selection:created', updateActiveObject);
      canvas.off('selection:updated', updateActiveObject);
      canvas.off('selection:cleared');
    };
  }, [canvas]);

  const updateColor = (newColor: string) => {
    if (activeObject && canvas) {
      activeObject.set('fill', newColor);
      canvas.renderAll();
      setColor(newColor);
    }
  };

  const updateOpacity = (newOpacity: number) => {
    if (activeObject && canvas) {
      activeObject.set('opacity', newOpacity / 100);
      canvas.renderAll();
      setOpacity(newOpacity);
    }
  };

  const updateFontSize = (newSize: number) => {
    if (activeObject && canvas && 'fontSize' in activeObject) {
      activeObject.set('fontSize', newSize);
      canvas.renderAll();
      setFontSize(newSize);
    }
  };

  if (!activeObject) {
    return (
      <div className="p-4 text-gray-500 text-center">
        Select an element to edit its properties
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <HexColorPicker color={color} onChange={updateColor} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opacity
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => updateOpacity(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-1">{opacity}%</div>
      </div>

      {activeObject && 'fontSize' in activeObject && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <input
            type="range"
            min="8"
            max="72"
            value={fontSize}
            onChange={(e) => updateFontSize(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">{fontSize}px</div>
        </div>
      )}
    </div>
  );
};