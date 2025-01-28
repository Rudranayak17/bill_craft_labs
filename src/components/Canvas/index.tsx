import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '../../store/editorStore';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas, zoom, undo, redo } = useEditorStore();

  useEffect(() => {
    if (canvasRef.current) {
      // A4 size at 96 DPI
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 794, // A4 width at 96 DPI
        height: 1123, // A4 height at 96 DPI
        backgroundColor: '#ffffff',
      });

      // Enable object controls
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = '#00a0f5';
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.cornerSize = 10;
      fabric.Object.prototype.padding = 5;

      // Enable snap to grid
      canvas.on('object:moving', (e) => {
        if (!e.target) return;
        const gridSize = 10;
        const target = e.target;
        target.set({
          left: Math.round(target.left! / gridSize) * gridSize,
          top: Math.round(target.top! / gridSize) * gridSize
        });
      });

      // Handle keyboard shortcuts
      const handleKeyboard = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
          switch (e.key.toLowerCase()) {
            case 'z':
              e.preventDefault();
              undo();
              break;
            case 'y':
              e.preventDefault();
              redo();
              break;
            case '+':
            case '=':
              e.preventDefault();
              useEditorStore.getState().setZoom(Math.min(zoom + 0.1, 2));
              break;
            case '-':
              e.preventDefault();
              useEditorStore.getState().setZoom(Math.max(zoom - 0.1, 0.5));
              break;
            case 'l':
              e.preventDefault();
              const activeObject = canvas.getActiveObject();
              if (activeObject) {
                activeObject.set('lockMovementX', !activeObject.lockMovementX);
                activeObject.set('lockMovementY', !activeObject.lockMovementY);
                canvas.renderAll();
              }
              break;
          }
        }

        // Shape shortcuts (without Ctrl)
        switch (e.key.toLowerCase()) {
          case 't':
            e.preventDefault();
            useEditorStore.getState().addElement('text');
            break;
          case 'r':
            e.preventDefault();
            useEditorStore.getState().addElement('rect');
            break;
          case 'c':
            e.preventDefault();
            useEditorStore.getState().addElement('circle');
            break;
          case 'b':
            e.preventDefault();
            useEditorStore.getState().addElement('table');
            break;
        }
      };

      document.addEventListener('keydown', handleKeyboard);

      // Handle drag and drop
      canvas.on('drop', (e: DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files[0]) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imgElement = new Image();
            imgElement.src = event.target?.result as string;
            imgElement.onload = () => {
              const fabricImage = new fabric.Image(imgElement, {
                left: e.offsetX,
                top: e.offsetY,
                scaleX: 0.5,
                scaleY: 0.5
              });
              canvas.add(fabricImage);
              canvas.setActiveObject(fabricImage);
              canvas.renderAll();
            };
          };
          reader.readAsDataURL(files[0]);
        }
      });

      canvas.on('dragover', (e: DragEvent) => {
        e.preventDefault();
      });

      setCanvas(canvas);

      return () => {
        document.removeEventListener('keydown', handleKeyboard);
        canvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const canvas = useEditorStore.getState().canvas;
    if (canvas) {
      canvas.setZoom(zoom);
      canvas.renderAll();
    }
  }, [zoom]);

  return (
    <div className="relative flex-1 overflow-auto bg-gray-100 p-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white shadow-lg">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
};