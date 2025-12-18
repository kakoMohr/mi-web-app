const studentForm = document.getElementById("studentForm");
const studentName = document.getElementById("studentName");
const studentList = document.getElementById("studentList");

const selectedBadge = document.getElementById("selectedBadge");
const emptyState = document.getElementById("emptyState");
const details = document.getElementById("details");

const matriculaStatus = document.getElementById("matriculaStatus");
const matriculaFecha = document.getElementById("matriculaFecha");

const materialesPagadoMonto = document.getElementById("materialesPagadoMonto");
const materialesPagadoFecha = document.getElementById("materialesPagadoFecha");

const materialesDebeMonto = document.getElementById("materialesDebeMonto");
const materialesDebeFecha = document.getElementById("materialesDebeFecha");

const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

const STORAGE_KEY = "pagos_estudiantes_v1";

let students = loadStudents();
let selectedId = null;

renderList();

studentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = studentName.value.trim();
  if (!name) return;

  const newStudent = {
    id: crypto.randomUUID(),
    name,
    matricula: { status: "no", fecha: "" },
    materiales: {
      pagado: { monto: 0, fecha: "" },
      debe: { monto: 0, fecha: "" }
    }
  };

  students.unshift(newStudent);
  saveStudents();
  studentName.value = "";
  renderList();
  selectStudent(newStudent.id);
});

saveBtn.addEventListener("click", () => {
  if (!selectedId) return;

  const s = students.find(x => x.id === selectedId);
  if (!s) return;

  s.matricula.status = matriculaStatus.value;
  s.matricula.fecha = matriculaFecha.value;

  s.materiales.pagado.monto = toNumber(materialesPagadoMonto.value);
  s.materiales.pagado.fecha = materialesPagadoFecha.value;

  s.materiales.debe.monto = toNumber(materialesDebeMonto.value);
  s.materiales.debe.fecha = materialesDebeFecha.value;

  saveStudents();
  renderList();
});

deleteBtn.addEventListener("click", () => {
  if (!selectedId) return;

  students = students.filter(s => s.id !== selectedId);
  saveStudents();

  selectedId = null;
  renderList();
  clearDetails();
});

function renderList(){
  studentList.innerHTML = "";

  if (students.length === 0) {
