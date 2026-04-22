const db = require('../config/db')

exports.createStudent = async (req, res) => {
      const client = await db.connect()

      try {
            const { name, email, age, marks } = req.body

            if (!name || !email) {
                  return res.status(400).json({ message: 'Name and email are required' })
            }

            await client.query('BEGIN')

            // insert student
            const studentRes = await client.query(
                  'INSERT INTO students(name, email, age) VALUES($1,$2,$3) RETURNING *',
                  [name, email, age]
            )

            const studentId = studentRes.rows[0].id

            // insert marks
            if (marks && marks.length > 0) {
                  for (let m of marks) {
                        if (!m.subject || m.score === undefined) continue

                        await client.query(
                              'INSERT INTO marks(student_id, subject, score) VALUES($1,$2,$3)',
                              [studentId, m.subject, m.score]
                        )
                  }
            }

            await client.query('COMMIT')

            res.status(201).json({
                  message: 'Student created successfully',
                  data: studentRes.rows[0]
            })

      } catch (err) {
            await client.query('ROLLBACK')

            // handle duplicate email
            if (err.code === '23505') {
                  return res.status(400).json({
                        message: 'Email already exists'
                  })
            }

            res.status(500).json({
                  message: 'Failed to create student',
                  error: err.message
            })
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
      const { id } = req.params

      const student = await db.query(
            'SELECT * FROM students WHERE id=$1',
            [id]
      )

      const marks = await db.query(
            'SELECT subject, score FROM marks WHERE student_id=$1',
            [id]
      )

      res.json({
            ...student.rows[0],
            marks: marks.rows
      })
}

exports.updateStudent = async (req, res) => {
      const client = await db.connect()

      try {
            const { id } = req.params
            const { name, email, age, marks } = req.body

            await client.query('BEGIN')

            const student = await client.query(
                  'UPDATE students SET name=$1, email=$2, age=$3 WHERE id=$4 RETURNING *',
                  [name, email, age, id]
            )

            if (student.rows.length === 0) {
                  await client.query('ROLLBACK')
                  return res.status(404).json({ message: 'Student not found' })
            }

            // delete old marks
            await client.query('DELETE FROM marks WHERE student_id=$1', [id])

            // insert new marks
            if (marks && marks.length) {
                  for (let m of marks) {
                        await client.query(
                              'INSERT INTO marks(student_id, subject, score) VALUES($1,$2,$3)',
                              [id, m.subject, m.score]
                        )
                  }
            }

            await client.query('COMMIT')

            res.json(student.rows[0])
      } catch (err) {
            await client.query('ROLLBACK')
            res.status(500).json({ error: err.message })
      } finally {
            client.release()
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