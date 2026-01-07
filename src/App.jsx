import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import toast, { Toaster } from 'react-hot-toast'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold underline text-blue-500 mb-4">Hello World</h1>

        
        {data && (
          <div className="mt-4">
            <pre className="bg-gray-100 p-4 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        <Toaster position="top-right" />
      </div>
    </>
  )
}

export default App
