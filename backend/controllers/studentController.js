const db = require('../config/db')

exports.createStudent = async (req, res) => {
      const client = await db.connect()
      try {
            const { name, email, age, marks } = req.body

            await client.query('BEGIN')

            const studentRes = await client.query(
                  'INSERT INTO students(name, email, age) VALUES($1,$2,$3) RETURNING *',
                  [name, email, age]
            )

            const studentId = studentRes.rows[0].id

            if (marks && marks.length > 0) {
                  for (let m of marks) {
                        await client.query(
                              'INSERT INTO marks(student_id, subject, score) VALUES($1,$2,$3)',
                              [studentId, m.subject, m.score]
                        )
                  }
            }

            await client.query('COMMIT')

            res.status(201).json(studentRes.rows[0])
      } catch (err) {
            await client.query('ROLLBACK')
            res.status(500).json({ error: err.message })
      } finally {
            client.release()
      }
}

exports.getStudents = async (req, res) => {
      try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 5
            const offset = (page - 1) * limit

            const totalRes = await db.query('SELECT COUNT(*) FROM students')

            const dataRes = await db.query(
                  'SELECT * FROM students ORDER BY id DESC LIMIT $1 OFFSET $2',
                  [limit, offset]
            )

            res.json({
                  data: dataRes.rows,
                  pagination: {
                        total: parseInt(totalRes.rows[0].count),
                        page,
                        limit,
                        totalPages: Math.ceil(totalRes.rows[0].count / limit)
                  }
            })
      } catch (err) {
            res.status(500).json({ error: err.message })
      }
}

exports.getStudentById = async (req, res) => {
      try {
            const { id } = req.params

            const student = await db.query(
                  'SELECT * FROM students WHERE id=$1',
                  [id]
            )

            if (student.rows.length === 0) {
                  return res.status(404).json({ message: 'Student not found' })
            }

            const marks = await db.query(
                  'SELECT subject, score FROM marks WHERE student_id=$1',
                  [id]
            )

            res.json({
                  ...student.rows[0],
                  marks: marks.rows
            })
      } catch (err) {
            res.status(500).json({ error: err.message })
      }
}

exports.updateStudent = async (req, res) => {
      try {
            const { id } = req.params
            const { name, email, age } = req.body

            const result = await db.query(
                  'UPDATE students SET name=$1, email=$2, age=$3 WHERE id=$4 RETURNING *',
                  [name, email, age, id]
            )

            if (result.rows.length === 0) {
                  return res.status(404).json({ message: 'Student not found' })
            }

            res.json(result.rows[0])
      } catch (err) {
            res.status(500).json({ error: err.message })
      }
}

exports.deleteStudent = async (req, res) => {
      try {
            const { id } = req.params

            const result = await db.query(
                  'DELETE FROM students WHERE id=$1 RETURNING *',
                  [id]
            )

            if (result.rows.length === 0) {
                  return res.status(404).json({ message: 'Student not found' })
            }

            res.json({ message: 'Student deleted successfully' })
      } catch (err) {
            res.status(500).json({ error: err.message })
      }
}