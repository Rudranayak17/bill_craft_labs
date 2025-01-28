import React from 'react';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { ElementTools } from './components/Tools/ElementTools';
import { ImageUploader } from './components/Tools/ImageUploader';
import { ElementProperties } from './components/Properties/ElementProperties';
import { LayerPanel } from './components/Layers/LayerPanel';

function App() {
  return (
    <div className="flex h-screen flex-col bg-white">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r bg-white p-4 overflow-y-auto">
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-4">Tools</h2>
              <ElementTools />
            </section>
            
            <section>
              <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
              <ImageUploader />
            </section>

            <section>
              <LayerPanel />
            </section>
          </div>
        </div>
        
        <Canvas />
        
        <div className="w-64 border-l bg-white p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Properties</h2>
          <ElementProperties />
        </div>
      </div>
    </div>
  );
}

export default App;