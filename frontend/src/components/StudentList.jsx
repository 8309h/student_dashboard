import { useEffect, useState } from 'react'
import api from '../api'
import Swal from 'sweetalert2'
import Pagination from './Pagination'

export default function StudentList({ refresh, setSelected }) {
      const [students, setStudents] = useState([])
      const [page, setPage] = useState(1)
      const [totalPages, setTotalPages] = useState(1)
      const [expandedId, setExpandedId] = useState(null)
      const [marksData, setMarksData] = useState({})
      const [search, setSearch] = useState('')
      const [loading, setLoading] = useState(false)

      const fetchStudents = async () => {
            try {
                  setLoading(true)

                  const res = await api.get(`/students?page=${page}&limit=5`)
                  setStudents(res.data.data)
                  setTotalPages(res.data.pagination.totalPages)

            } catch (err) {
                  console.error(err)
                  Swal.fire('Error', 'Failed to fetch students', 'error')
            } finally {
                  setLoading(false)
            }
      }

      useEffect(() => {
            fetchStudents()
      }, [page, refresh])

      const handleDelete = async id => {
            const confirm = await Swal.fire({
                  title: 'Delete Student?',
                  text: 'This action cannot be undone',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, delete it',
                  cancelButtonText: 'Cancel'
            })

            if (confirm.isConfirmed) {
                  try {
                        Swal.fire({
                              title: 'Deleting...',
                              allowOutsideClick: false,
                              didOpen: () => Swal.showLoading()
                        })

                        await api.delete(`/students/${id}`)

                        Swal.fire({
                              icon: 'success',
                              title: 'Deleted',
                              text: 'Student removed successfully'
                        })

                        fetchStudents()

                  } catch (err) {
                        Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: err.response?.data?.message || 'Failed to delete'
                        })
                  }
            }
      }

      const handleViewMarks = async id => {
            if (expandedId === id) {
                  setExpandedId(null)
                  return
            }

            try {
                  const res = await api.get(`/students/${id}`)

                  setMarksData(prev => ({
                        ...prev,
                        [id]: res.data.marks
                  }))

                  setExpandedId(id)

            } catch (err) {
                  console.error(err)
                  Swal.fire('Error', 'Failed to fetch marks', 'error')
            }
      }

      const handleEdit = async id => {
            try {
                  const res = await api.get(`/students/${id}`)
                  console.log('Edit Data:', res.data)

                  setSelected(res.data) 

            } catch (err) {
                  console.error(err)
                  Swal.fire('Error', 'Failed to fetch student', 'error')
            }
      }

      const filteredStudents = students.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase())
      )

      return (
            <div className="card p-3">
                  <h5>Students</h5>

                  <input
                        className="form-control mb-3"
                        placeholder="Search by name or email"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                  />

                  {loading ? (
                        <div className="text-center">
                              <div className="spinner-border"></div>
                        </div>
                  ) : filteredStudents.length === 0 ? (
                        <p className="text-center">No students found</p>
                  ) : (
                        <table className="table table-bordered">
                              <thead>
                                    <tr>
                                          <th>Name</th>
                                          <th>Email</th>
                                          <th>Age</th>
                                          <th>Actions</th>
                                    </tr>
                              </thead>

                              <tbody>
                                    {filteredStudents.map(s => (
                                          <tr key={s.id}>
                                                <td>{s.name}</td>
                                                <td>{s.email}</td>
                                                <td>{s.age}</td>
                                                <td>
                                                      <button
                                                            className="btn btn-info btn-sm me-2"
                                                            onClick={() => handleViewMarks(s.id)}
                                                      >
                                                            {expandedId === s.id ? 'Hide Marks' : 'View Marks'}
                                                      </button>

                                                      <button
                                                            className="btn btn-warning btn-sm me-2"
                                                            onClick={() => handleEdit(s.id)}
                                                      >
                                                            Edit
                                                      </button>

                                                      <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDelete(s.id)}
                                                      >
                                                            Delete
                                                      </button>
                                                </td>
                                          </tr>
                                    ))}

                                    {/* Expanded Marks Row */}
                                    {filteredStudents.map(s =>
                                          expandedId === s.id ? (
                                                <tr key={`marks-${s.id}`}>
                                                      <td colSpan="4">
                                                            <div className="p-2">
                                                                  <h6>Marks</h6>

                                                                  {marksData[s.id]?.length ? (
                                                                        <table className="table table-sm">
                                                                              <thead>
                                                                                    <tr>
                                                                                          <th>Subject</th>
                                                                                          <th>Score</th>
                                                                                    </tr>
                                                                              </thead>
                                                                              <tbody>
                                                                                    {marksData[s.id].map((m, i) => (
                                                                                          <tr key={i}>
                                                                                                <td>{m.subject}</td>
                                                                                                <td>{m.score}</td>
                                                                                          </tr>
                                                                                    ))}
                                                                              </tbody>
                                                                        </table>
                                                                  ) : (
                                                                        <p>No marks available</p>
                                                                  )}
                                                            </div>
                                                      </td>
                                                </tr>
                                          ) : null
                                    )}
                              </tbody>
                        </table>
                  )}

                  <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </div>
      )
}