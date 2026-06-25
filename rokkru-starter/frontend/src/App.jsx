import { BrowserRouter, Routes, Route } from 'react-router-dom'

/**
 * Starter App — paste Bunhieng task to replace with full routes.
 * Run: ..\scripts\paste-task.ps1 -Member bunhieng
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-8">
              <div className="max-w-md text-center space-y-4">
                <h1 className="text-2xl font-semibold text-primary-500">RokKru Frontend</h1>
                <p className="text-sm text-slate-600">
                  Skeleton ready. Paste shared core from{' '}
                  <code className="bg-slate-200 px-1 rounded">tasks/bunhieng/</code>
                </p>
                <pre className="text-left text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                  {`cd rokkru-starter
.\\scripts\\paste-task.ps1 -Member bunhieng
cd frontend
npm install
npm run dev`}
                </pre>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
