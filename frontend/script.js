
const markbutton = document.getElementById("marka");
const studentList = document.getElementById("student-list");
const studentlistafter = document.getElementById("student-listafter");
const dashboard1=document.getElementById("dashboard");

function showForm() {
    document.getElementById("studentForm").style.display = "block";
}

function closeForm() {
    document.getElementById("studentForm").style.display = "none";

}

async function dashboard(){
studentList.innerHTML="";
studentlistafter.innerHTML="";
const dashboardData = await axios.get(`http://localhost:3002/dashboard`);
console.log(dashboardData);
studentList.style.display="block"
dashboardData.data.forEach((detail)=>{
    const studentItem = document.createElement("div");
    studentItem.classList.add("student-item");
    console.log(detail)
studentItem.innerHTML=`
 <span class="fw-bold">${detail.name}</span> 
<span class="fw-bold">${detail.attended_classes}/${detail.total_classes}</span> 
<span class="fw-bold">${detail.attendance_percentage}</span> 
`
studentList.appendChild(studentItem)
})

}
dashboard1.addEventListener('click', dashboard);
async function search(){
    studentList.innerHTML="";
    studentlistafter.innerHTML="";
    
    const date = document.getElementById("date").value;
    if (!date) {
        alert("Please select a date.");
        return;
    }
    const confirmation = await axios.get(`http://localhost:3002/exist/${date}`)
  console.log(confirmation.data)
    if(confirmation.data ==="yes"){
        const afterattendance = await axios.get(`http://localhost:3002/afterAttendance/${date}`);
    console.log(afterattendance.data)
     // ✅ Get the element
studentlistafter.style.display = "block"; // ✅ Set display

afterattendance.data.forEach((detail) => {
    const studentItem = document.createElement("div");
    studentItem.classList.add("student-item");

    // ✅ Add tick for 'Present' and cross for 'Absent'
    const statusIcon = detail.status === "Present" ? "✔️" : "❌";

    studentItem.innerHTML = `
        <span class="fw-bold">${detail.name}</span> 
        <span class="fw-bold">${statusIcon} ${detail.status}</span> 
    `;
    studentlistafter.appendChild(studentItem);
});
    }
    else{
        fetchStudents(); 
        markbutton.style.display="block";
    }
}





async function markAttendance(){
    const date = document.getElementById("date").value;
    if (!date) {
        alert("Please select a date.");
        return;
    }
    const studentItems = document.querySelectorAll(".student-item");
    const attendanceData = [];
    studentItems.forEach((item)=>{
        const studentId = item.querySelector(".student-id").value;
        const status = item.querySelector(`input[name="status_${studentId}"]:checked`).value;
        attendanceData.push({student_id:studentId, date, status});
    })
    await axios.post(`http://localhost:3002/mark-attendance`, attendanceData)
    .then((response)=>{
        alert("Attendance marked successfully!");
        console.log(response);
    })
    .catch((err)=>{
        console.log(err)
    })
    const student_list = document.getElementById("student-list").style.display="none";
    const afterattendance = await axios.get(`http://localhost:3002/afterAttendance/${date}`);
    console.log(afterattendance.data)
    const studentlistafter = document.getElementById("student-listafter"); // ✅ Get the element
studentlistafter.style.display = "block"; // ✅ Set display

afterattendance.data.forEach((detail) => {
    const studentItem = document.createElement("div");
    studentItem.classList.add("student-item");

    // ✅ Add tick for 'Present' and cross for 'Absent'
    const statusIcon = detail.status === "Present" ? "✔️" : "❌";

    studentItem.innerHTML = `
        <span class="fw-bold">${detail.name}</span> 
        <span class="fw-bold">${statusIcon} ${detail.status}</span> 
    `;
    studentlistafter.appendChild(studentItem);
});

}
const studentlist = document.getElementById("studentlist")
 function fetchStudents() {
    axios.get("http://localhost:3002/students") // Adjust this URL based on your backend API
        .then((response) => {
            const students = response.data; // Assuming backend returns an array of students
       
            studentList.innerHTML = ""; // Clear existing students

            students.forEach((student) => {
                const studentItem = document.createElement("div");
                studentItem.classList.add("student-item");

                studentItem.innerHTML = `
                  <span class="fw-bold">${student.name}</span>
                    <input type="hidden" value="${student.id}" class="student-id">
                    <div class="radio-group">
                        <input type="radio" name="status_${student.id}" value="Present" checked>
                        <label>Present</label>
                        <input type="radio" name="status_${student.id}" value="Absent">
                        <label>Absent</label>
                    </div>
                `;

                studentList.appendChild(studentItem);
            });
        })
        .catch((err) => {
            console.error("Error fetching students:", err);
        });
}
function addStudent() {
    const sname = document.getElementById("studentName").value.trim();
    
    if (sname === "") {
        alert("Please enter a student name.");
        return;
    }

    axios.post("http://localhost:3002/add-student", { name: sname })
        .then((response) => {
            console.log(response.data);
            document.getElementById("studentName").value = ""; // Clear input field
            document.getElementById("studentForm").style.display = "none";
          //  fetchStudents(); // Refresh student list

        })
        .catch((err) => {
            console.error("Error adding student:", err);
        });
}
//document.addEventListener('DOMContentLoaded', function() {
//    fetchStudents();
//});
