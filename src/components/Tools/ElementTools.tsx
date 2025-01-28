import React, { useState } from 'react';
import { Type, Square, Image as ImageIcon, Table, Plus, Lock, Unlock, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { TableModal } from '../Modal/TableModal';

export const ElementTools: React.FC = () => {
  const { canvas } = useEditorStore();
  const [showTableModal, setShowTableModal] = useState(false);

  const getCenterPosition = () => {
    if (!canvas) return { x: 100, y: 100 };
    return {
      x: (canvas.width ?? 0) / 2,
      y: (canvas.height ?? 0) / 2
    };
  };

  const addText = () => {
    if (canvas) {
      const { x, y } = getCenterPosition();
      const text = new fabric.IText('Edit text', {
        left: x - 50,
        top: y - 20,
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#000000',
        editable: true,
        originX: 'center',
        originY: 'center',
        data: {
          layerId: 'text-' + Date.now(),
          type: 'text'
        }
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
      canvas.centerObject(text);
      
      // Add to layers
      useEditorStore.getState().addLayer({
        id: text.data.layerId,
        name: 'Text Layer',
        visible: true,
        locked: false
      });
    }
  };

  const addShape = (type: 'rect' | 'circle') => {
    if (canvas) {
      const { x, y } = getCenterPosition();
      let shape;
      const layerId = `${type}-${Date.now()}`;
      const commonProps = {
        left: x,
        top: y,
        fill: '#e2e8f0',
        stroke: '#64748b',
        strokeWidth: 1,
        cornerStyle: 'circle',
        cornerColor: '#00a0f5',
        cornerSize: 10,
        transparentCorners: false,
        originX: 'center',
        originY: 'center',
        data: {
          layerId,
          type: type
        }
      };

      if (type === 'rect') {
        shape = new fabric.Rect({
          ...commonProps,
          width: 100,
          height: 100
        });
      } else {
        shape = new fabric.Circle({
          ...commonProps,
          radius: 50
        });
      }
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      canvas.centerObject(shape);
      
      // Add to layers
      useEditorStore.getState().addLayer({
        id: layerId,
        name: type === 'rect' ? 'Rectangle Layer' : 'Circle Layer',
        visible: true,
        locked: false
      });
    }
  };

  const createTable = (rows: number, columns: number) => {
    if (!canvas) return;
    
    const { x, y } = getCenterPosition();
    const cellWidth = 100;
    const cellHeight = 40;
    const tableWidth = columns * cellWidth;
    const tableHeight = rows * cellHeight;
    const layerId = `table-${Date.now()}`;
    
    // Create table group
    const tableGroup = new fabric.Group([], {
      left: x - tableWidth / 2,
      top: y - tableHeight / 2,
      selectable: true,
      data: {
        layerId,
        type: 'table'
      }
    });

    // Create cells
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        // Cell background
        const cellBg = new fabric.Rect({
          left: j * cellWidth,
          top: i * cellHeight,
          width: cellWidth,
          height: cellHeight,
          fill: i === 0 ? '#f1f5f9' : '#ffffff',
          stroke: '#64748b',
          strokeWidth: 1
        });
        
        // Cell text
        const cellText = new fabric.IText(i === 0 ? `Column ${j + 1}` : '', {
          left: j * cellWidth + 10,
          top: i * cellHeight + (cellHeight - 20) / 2,
          fontSize: i === 0 ? 16 : 14,
          fontFamily: 'Arial',
          fontWeight: i === 0 ? 'bold' : 'normal',
          fill: i === 0 ? '#1e293b' : '#475569',
          editable: true,
          width: cellWidth - 20
        });

        tableGroup.addWithUpdate(cellBg);
        tableGroup.addWithUpdate(cellText);
      }
    }

    canvas.add(tableGroup);
    canvas.setActiveObject(tableGroup);
    canvas.renderAll();
    
    // Add to layers
    useEditorStore.getState().addLayer({
      id: layerId,
      name: 'Table Layer',
      visible: true,
      locked: false
    });
  };

  const toggleLock = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const isLocked = activeObject.lockMovementX && activeObject.lockMovementY;
      activeObject.set({
        lockMovementX: !isLocked,
        lockMovementY: !isLocked,
        lockRotation: !isLocked,
        lockScalingX: !isLocked,
        lockScalingY: !isLocked
      });
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // Remove from layers if it has a layerId
      if (activeObject.data?.layerId) {
        useEditorStore.getState().removeLayer(activeObject.data.layerId);
      }
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">
        Shortcuts: T (Text), R (Rectangle), C (Circle), B (Table)
        <br />
        Ctrl+Z (Undo), Ctrl+Y (Redo)
        <br />
        Ctrl++ (Zoom In), Ctrl+- (Zoom Out)
        <br />
        Ctrl+L (Lock/Unlock)
      </div>
      <button
        onClick={addText}
        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Type className="w-5 h-5" />
        <span>Add Text (T)</span>
      </button>
      <button
        onClick={() => addShape('rect')}
        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Square className="w-5 h-5" />
        <span>Add Rectangle (R)</span>
      </button>
      <button
        onClick={() => addShape('circle')}
        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="w-5 h-5 rounded-full border-2" />
        <span>Add Circle (C)</span>
      </button>
      <button
        onClick={() => setShowTableModal(true)}
        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Table className="w-5 h-5" />
        <span>Add Table (B)</span>
      </button>
      <div className="border-t pt-4">
        <button
          onClick={toggleLock}
          className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Lock className="w-5 h-5" />
          <span>Toggle Lock (Ctrl+L)</span>
        </button>
        <button
          onClick={deleteSelected}
          className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete Selected</span>
        </button>
      </div>

      <TableModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        onConfirm={createTable}
      />
    </div>
  );
};