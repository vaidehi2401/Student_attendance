const sequelize = require('../util/database');
exports.markAttendance= async(req, res, next)=>{
    try{
        const attendanceRecords = req.body;
        if(!Array.isArray(attendanceRecords) || attendanceRecords.length===0){
            return res.status(400).json({error:"Invalid data"})
        }
        for(const record of attendanceRecords){
            const {student_id, date, status}=record;
            if (!student_id || !date || !status) {
                return res.status(400).json({ error: "All fields are required" });
            }
            await sequelize.query(
                "INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)",
                {replacements:[student_id, date, status]}
            )
        }
        res.status(200).json({ message: "Attendance marked successfully" });
    }
    catch(err){
        console.log(err);
    }
    }
    exports.existDate= async (req, res) => {
        const { date } = req.params;
        try {
            const [result] = await sequelize.query(
                `SELECT COUNT(*) AS count FROM attendance WHERE date = ?`,
                { replacements: [date] }
            );
            console.log(result[0].count)
            if (result[0].count === 0) {
                res.status(200).json("no"); 
            } else {
                res.status(200).json("yes"); 
            }
        } catch (error) {
            console.error("Error checking attendance:", error);
            res.status(500).json({ error: "Database error" });
        }
    }


exports.getDashboard=async(req, res)=>{
    try {
        const [results] = await sequelize.query("SELECT * FROM attendance_summary");
        res.status(200).json(results); 
    } catch (error) {
        console.error("Error fetching attendance summary:", error);
        res.status(500).json({ error: "Database error" });
    }
}

exports.getAfterAttendance=async (req, res) => {
    const { date } = req.params;

    try {
        const [data, metadata] = await sequelize.query(
            "SELECT s.name, a.status FROM students s JOIN attendance a ON s.id = a.student_id WHERE a.date = ?",
            { replacements: [date] }
        );

        console.log(data);
        res.status(200).json(data); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}

exports.addStudents=async (req, res) => {
    try {
        const name = req.body.name;

        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        await sequelize.query("INSERT INTO students (name) VALUES (?)", {
            replacements: [name], 
        });

        res.status(200).json({ message: "Student added successfully", name });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
    }
}
exports.getStudents=async(req, res, next)=>{
    try{
        const [students, metadata] = await sequelize.query("SELECT * FROM students"); 
        res.json(students); 
    }
    catch(err){
        console.log(err);
    }
    }