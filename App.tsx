import React, { useState } from 'react';
import { Uploader } from './components/Uploader';
import { generateRemixImage } from './services/geminiService';
import { ImageFile, AppState } from './types';

export default function App() {
  const [twinImage, setTwinImage] = useState<ImageFile | null>(null);
  const [productImage, setProductImage] = useState<ImageFile | null>(null);
  const [scenario, setScenario] = useState<string>("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!twinImage || !productImage) return;

    setAppState(AppState.GENERATING);
    setErrorMsg(null);

    try {
      const generatedBase64 = await generateRemixImage(twinImage, productImage, scenario);
      setResultImage(generatedBase64);
      setAppState(AppState.SUCCESS);
    } catch (e: any) {
      setAppState(AppState.ERROR);
      setErrorMsg(e.message || "An unexpected error occurred while generating the image.");
    }
  };

  const resetAll = () => {
    setTwinImage(null);
    setProductImage(null);
    setResultImage(null);
    setScenario("");
    setAppState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">TwinProduct <span className="text-indigo-400">Remix</span></span>
            </div>
            <div className="text-xs text-zinc-500 font-mono hidden sm:block">
              POWERED BY GEMINI FLASH
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Project Assets</h2>
              <p className="text-zinc-400 text-sm">Upload your model and product to start remixing.</p>
            </div>

            <div className="space-y-6">
              <Uploader 
                id="twin-upload"
                label="The Model"
                subLabel="AI Twin / Human subject"
                image={twinImage}
                onImageSelected={setTwinImage}
                onClear={() => setTwinImage(null)}
              />

              <div className="flex items-center justify-center">
                <div className="h-8 w-[1px] bg-zinc-700"></div>
              </div>

              <Uploader 
                id="product-upload"
                label="The Product"
                subLabel="Item to be held or applied"
                image={productImage}
                onImageSelected={setProductImage}
                onClear={() => setProductImage(null)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="scenario" className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Interaction Details (Optional)
              </label>
              <textarea
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Describe how the model interacts with the product (e.g., 'Applying the cream to her left cheek', 'Holding the bottle up to the camera with a smile')..."
                className="w-full h-24 bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!twinImage || !productImage || appState === AppState.GENERATING}
              className={`
                sticky bottom-6 w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300
                ${(!twinImage || !productImage) 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : appState === AppState.GENERATING
                    ? 'bg-indigo-900/50 text-indigo-300 cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02] shadow-indigo-500/25'
                }
              `}
            >
              {appState === AppState.GENERATING ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Remixing Assets...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Generate Ad
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                <strong>Error:</strong> {errorMsg}
              </div>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Studio Output</h2>
              {appState === AppState.SUCCESS && (
                 <button 
                 onClick={resetAll}
                 className="text-sm text-zinc-400 hover:text-white transition-colors underline"
               >
                 Start New Project
               </button>
              )}
            </div>
            
            <div className={`
              flex-1 relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl transition-all duration-500
              ${appState === AppState.SUCCESS ? 'ring-2 ring-indigo-500/50' : ''}
            `}>
              {appState === AppState.IDLE && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">Ready to Create</p>
                  <p className="text-sm max-w-xs mt-2">Upload your assets on the left and define the interaction to generate a professional ad.</p>
                </div>
              )}

              {appState === AppState.GENERATING && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-4 bg-zinc-900 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-xs font-bold text-indigo-400">AI</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Processing Assets</h3>
                  <div className="flex flex-col gap-1 text-center text-sm text-zinc-400">
                    <p>Analyzing facial features...</p>
                    <p>Scanning product geometry...</p>
                    <p>Compositing scene with depth of field...</p>
                  </div>
                </div>
              )}

              {resultImage && (
                <div className="relative w-full h-full bg-black flex items-center justify-center group">
                  <img 
                    src={resultImage} 
                    alt="Generated Ad" 
                    className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href={resultImage} 
                      download="remix-ad-studio.png"
                      className="p-3 bg-zinc-900/80 backdrop-blur-md text-white rounded-lg hover:bg-indigo-600 transition-colors border border-zinc-700 hover:border-indigo-500"
                      title="Download Image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {appState === AppState.SUCCESS && (
               <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                 <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wide mb-2">Production Notes</h4>
                 <div className="flex gap-4 text-xs text-zinc-500">
                   <div className="flex items-center gap-1">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     Standard Resolution
                   </div>
                   <div className="flex items-center gap-1">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     Depth Map Applied
                   </div>
                   <div className="flex items-center gap-1">
                     <span className="w-2 h-2 rounded-full bg-green-500"></span>
                     Identity Preserved
                   </div>
                 </div>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
