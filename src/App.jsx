import { useState } from 'react'
import './App.css'
import { convertToUpdatedObj } from './helpers'
import JsonViewer from './JsonViewer'

function App() {
  
  const [inputText, setInputText] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [sqlOutput, setSqlOutput] = useState('')
  const [id, setId] = useState('')
  
  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleIdChange = (e) => {
    setId(e.target.value)
  }

  const handleButtonClick = () => {
    const equipmentFilter = convertToUpdatedObj(JSON.parse(inputText));
    const sqlSentence = `UPDATE tenant_symphony.network_groups SET equipment_filter = '${JSON.stringify(equipmentFilter)}', progress = 'PENDING', status = 1 WHERE id = ${id || 'XXXX'}`;
    setJsonOutput(JSON.stringify(equipmentFilter))
    setSqlOutput(sqlSentence)
  }

  return (
    <div className="app-container">
      <div className="left-column">
        <div className='input-id-group'>
          <input  
            placeholder='ID' 
            value={id} 
            onChange={handleIdChange}
          />
        </div>
        <div className="input-container">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Ingrese texto aquí"
          />
        </div>
        <button onClick={handleButtonClick}>Process</button>
      </div>
      <div className="right-column">
        <div className="output-box-json">
          <JsonViewer jsonString={jsonOutput} />
        </div>
        <div className="output-box">
          {sqlOutput}
        </div>
      </div>
    </div>
  )
}

export default App
