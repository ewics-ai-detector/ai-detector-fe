import { useState } from 'react'
import axios from 'axios'

const Card = () => {
  const [input, setText] = useState('')
  const [isSubmitting, setSubmit] = useState(false)
  const [response, setResponse] = useState('Please input a text!')

  const formResponse = response => {
    const score = response.data.score * 100
    const msg =
      response.data.label == 'LABEL_1'
        ? `text is likely AI with ${score}% confidence`
        : `text is likely not AI with ${score}% confidence`

    return msg
  }

  const calculateTokenCount = text => text.trim().split(/\s+/).length

  const handleSubmit = async () => {
    try {
      setSubmit(true)

      const response = await axios.post('http://127.0.0.1:8000/predict', { text: input })
      console.log(`${JSON.stringify(response.data.label)}`)
      setResponse(formResponse(response))
    } catch (error) {
      console.log(`error during prediction: ${error}`)
      if (error.response.status == 400) {
        setResponse(`Please ensure text is less than 512 tokens!`)
      }
    } finally {
      setSubmit(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row rounded-lg bg-white shadow-lg w-[900px] overflow-hidden">
        {/* Results Section */}
        <div className="flex flex-col justify-center items-center p-6 w-full md:w-1/2 bg-gray-50">
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 rounded-full animate-spin border-4 border-blue-500 border-t-transparent"></div>
              <span className="text-blue-500 font-medium">Calculating...</span>
            </div>
          ) : (
            <div className="text-gray-800">
              <h5 className="text-lg font-semibold">Results:</h5>
              <p className="text-base">{response}</p>
            </div>
          )}
        </div>

        {/* Input Form Section */}
        <div className="flex flex-col justify-start p-6 w-full md:w-1/2 space-y-6">
          <h5 className="text-3xl font-semibold text-neutral-800">AI Text Detection</h5>
          <textarea
            className="shadow appearance-none border rounded-md w-full h-64 p-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg"
            placeholder="Insert Input Text (max 512 tokens)"
            onChange={e => setText(e.target.value)}
          ></textarea>
          <p className="text-sm text-gray-500">Word count: {calculateTokenCount(input)} / 512</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition-transform transform hover:scale-105 focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            Detect AI
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
