import { useState } from 'react'
import StudentForm from './components/StudentForm.jsx'
import StudentList from './components/StudentList.jsx'

function App() {
  const [refresh, setRefresh] = useState(false)
  const [selected, setSelected] = useState(null)

  const triggerRefresh = () => {
    setRefresh(prev => !prev)
  }

  const clearSelection = () => setSelected(null)

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Student Dashboard</h3>

      <StudentForm
        selected={selected}
        triggerRefresh={triggerRefresh}
        clearSelection={clearSelection}
      />

      <StudentList
        refresh={refresh}
        setSelected={setSelected}
      />
    </div>
  )
}

export default App