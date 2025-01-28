import React from 'react';
import { Layers, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

export const LayerPanel: React.FC = () => {
  const { canvas, layers, setLayers, updateLayer, removeLayer } = useEditorStore();
  
  const toggleVisibility = (id: string) => {
    if (!canvas) return;
    const layer = layers.find(l => l.id === id);
    if (layer) {
      const objects = canvas.getObjects().filter(obj => obj.data?.layerId === id);
      objects.forEach(obj => {
        obj.visible = !layer.visible;
      });
      updateLayer(id, { visible: !layer.visible });
      canvas.renderAll();
    }
  };

  const toggleLock = (id: string) => {
    if (!canvas) return;
    const layer = layers.find(l => l.id === id);
    if (layer) {
      const objects = canvas.getObjects().filter(obj => obj.data?.layerId === id);
      objects.forEach(obj => {
        obj.set({
          lockMovementX: !layer.locked,
          lockMovementY: !layer.locked,
          lockRotation: !layer.locked,
          lockScalingX: !layer.locked,
          lockScalingY: !layer.locked
        });
      });
      updateLayer(id, { locked: !layer.locked });
      canvas.renderAll();
    }
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    if (!canvas) return;
    const index = layers.findIndex(l => l.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < layers.length - 1)
    ) {
      const newLayers = [...layers];
      const temp = newLayers[index];
      newLayers[index] = newLayers[direction === 'up' ? index - 1 : index + 1];
      newLayers[direction === 'up' ? index - 1 : index + 1] = temp;
      setLayers(newLayers);

      // Update canvas object order
      const objects = canvas.getObjects();
      objects.sort((a, b) => {
        const aIndex = newLayers.findIndex(l => l.id === a.data?.layerId);
        const bIndex = newLayers.findIndex(l => l.id === b.data?.layerId);
        return aIndex - bIndex;
      });
      canvas.renderAll();
    }
  };

  const deleteLayer = (id: string) => {
    if (!canvas) return;
    const objects = canvas.getObjects().filter(obj => obj.data?.layerId === id);
    objects.forEach(obj => canvas.remove(obj));
    removeLayer(id);
    canvas.renderAll();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Layers ({layers.length})
        </h2>
      </div>
      <div className="space-y-2">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm border hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility(layer.id)}
                className="p-1 hover:bg-gray-100 rounded"
                title={layer.visible ? 'Hide Layer' : 'Show Layer'}
              >
                {layer.visible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => toggleLock(layer.id)}
                className="p-1 hover:bg-gray-100 rounded"
                title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
              >
                {layer.locked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <span className="text-sm font-medium">{layer.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveLayer(layer.id, 'up')}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={layers.indexOf(layer) === 0}
                title="Move Up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveLayer(layer.id, 'down')}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={layers.indexOf(layer) === layers.length - 1}
                title="Move Down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteLayer(layer.id)}
                className="p-1 hover:bg-gray-100 rounded text-red-500"
                title="Delete Layer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};