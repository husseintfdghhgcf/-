const form = document.getElementById('studentForm');
const tableBody = document.querySelector('#studentTable tbody');
const toggleFormBtn = document.getElementById('toggleFormBtn');

toggleFormBtn.onclick = () => {
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
};

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const grade = document.getElementById('grade').value;
  const image = document.getElementById('image').files[0];

  const reader = new FileReader();
  reader.onload = function() {
    const student = {
      id: Date.now(),
      name,
      grade,
      image: reader.result,
      status: 'غير محدد'
    };

    let students = JSON.parse(localStorage.getItem('students') || '[]');
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
    renderStudents();
    form.reset();
    form.style.display = 'none';
  };
  reader.readAsDataURL(image);
});

function renderStudents() {
  let students = JSON.parse(localStorage.getItem('students') || '[]');
  tableBody.innerHTML = '';
  students.forEach(student => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="\${student.image}" alt="صورة"></td>
      <td>\${student.name}</td>
      <td>\${student.grade}</td>
      <td>\${student.status}</td>
      <td>
        <button class="action-btn attend-btn" onclick="markAttendance(\${student.id}, 'حاضر')">حضور</button>
        <button class="action-btn absent-btn" onclick="markAttendance(\${student.id}, 'غائب')">غياب</button>
        <button class="action-btn edit-btn" onclick="editStudent(\${student.id})">تعديل</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function markAttendance(id, status) {
  let students = JSON.parse(localStorage.getItem('students') || '[]');
  students = students.map(st => st.id === id ? { ...st, status } : st);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

function editStudent(id) {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const student = students.find(st => st.id === id);
  if (!student) return;

  document.getElementById('name').value = student.name;
  document.getElementById('grade').value = student.grade;
  form.style.display = 'block';

  const index = students.findIndex(st => st.id === id);
  students.splice(index, 1);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents();
}

window.onload = renderStudents;
