import { useState, useEffect } from 'react'
import api from '../api'
import Swal from 'sweetalert2'

export default function StudentForm({ selected, triggerRefresh, clearSelection }) {

      const [form, setForm] = useState({
            name: '',
            email: '',
            age: '',
            marks: [{ subject: '', score: '' }]
      })

      useEffect(() => {
            if (selected) {
                  setForm({
                        name: selected.name || '',
                        email: selected.email || '',
                        age: selected.age || '',
                        marks:
                              selected.marks && selected.marks.length > 0
                                    ? selected.marks
                                    : [{ subject: '', score: '' }]
                  })
            }
      }, [selected])

      const handleChange = e => {
            const { name, value } = e.target
            setForm(prev => ({ ...prev, [name]: value }))
      }

      const handleMarkChange = (index, field, value) => {
            const updated = [...form.marks]

            if (field === 'score') {
                  // convert to number
                  const num = Number(value)

                  if (value === '') {
                        updated[index][field] = ''
                  } else if (num >= 0 && num <= 100) {
                        updated[index][field] = num
                  } else {
                        return 
                  }
            } else {
                  updated[index][field] = value
            }

            setForm(prev => ({ ...prev, marks: updated }))
      }

      const addRow = () => {
            setForm(prev => ({
                  ...prev,
                  marks: [...prev.marks, { subject: '', score: '' }]
            }))
      }

      const removeRow = index => {
            const updated = form.marks.filter((_, i) => i !== index)
            setForm(prev => ({ ...prev, marks: updated }))
      }

      const handleSubmit = async e => {
            e.preventDefault()

            if (!form.name || !form.email) {
                  return Swal.fire({
                        icon: 'warning',
                        title: 'Validation Error',
                        text: 'Name and Email are required'
                  })
            }

            try {
                  Swal.fire({
                        title: 'Saving...',
                        allowOutsideClick: false,
                        didOpen: () => {
                              Swal.showLoading()
                        }
                  })

                  if (selected) {
                        await api.put(`/students/${selected.id}`, form)
                  } else {
                        await api.post('/students', form)
                  }

                  Swal.fire({
                        icon: 'success',
                        title: selected ? 'Updated' : 'Created',
                        text: 'Student saved successfully'
                  })

                  setForm({
                        name: '',
                        email: '',
                        age: '',
                        marks: [{ subject: '', score: '' }]
                  })

                  clearSelection()
                  triggerRefresh()

            } catch (err) {
                  Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: err.response?.data?.message || 'Something went wrong'
                  })
            }
      }

      return (
            <div className="card p-3 mb-4">
                  <h5>{selected ? 'Update Student' : 'Add Student'}</h5>

                  <form onSubmit={handleSubmit}>

                        <div className="row mb-3">
                              <div className="col-md-4">
                                    <input
                                          name="name"
                                          className="form-control"
                                          placeholder="Name"
                                          value={form.name}
                                          onChange={handleChange}
                                    />
                              </div>

                              <div className="col-md-4">
                                    <input
                                          name="email"
                                          className="form-control"
                                          placeholder="Email"
                                          value={form.email}
                                          onChange={handleChange}
                                    />
                              </div>

                              <div className="col-md-2">
                                    <input
                                          name="age"
                                          type="number"
                                          className="form-control"
                                          placeholder="Age"
                                          value={form.age}
                                          onChange={handleChange}
                                    />
                              </div>
                        </div>

                        <h6>Subject-wise Marks</h6>

                        {form.marks.map((m, i) => (
                              <div className="row mb-2" key={i}>
                                    <div className="col-md-5">
                                          <input
                                                className="form-control"
                                                placeholder="Subject"
                                                value={m.subject}
                                                onChange={e =>
                                                      handleMarkChange(i, 'subject', e.target.value)
                                                }
                                          />
                                    </div>

                                    <div className="col-md-3">
                                          <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Score (0-100)"
                                                value={m.score}
                                                min="0"
                                                max="100"
                                                onChange={e =>
                                                      handleMarkChange(i, 'score', e.target.value)
                                                }
                                          />
                                    </div>

                                    <div className="col-md-2">
                                          <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => removeRow(i)}
                                                disabled={form.marks.length === 1}
                                          >
                                                Remove
                                          </button>
                                    </div>
                              </div>
                        ))}

                        <button
                              type="button"
                              className="btn btn-secondary mb-3"
                              onClick={addRow}
                        >
                              Add Subject
                        </button>

                        <br />

                        <button className="btn btn-primary">
                              {selected ? 'Update Student' : 'Add Student'}
                        </button>

                  </form>
            </div>
      )
}