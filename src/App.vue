<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student } from './types';
import { supabase } from './supabase';
import StudentForm from './components/StudentForm.vue';
import StudentList from './components/StudentList.vue';

const students = ref<Student[]>([]);

const fetchStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching students:', error);
    return;
  }
  
  if (data) {
    students.value = data.map(s => ({
      id: s.id,
      name: s.name,
      dni: s.dni || '',
      paid: s.paid,
      amount: s.amount,
      cannotPay: s.cannot_pay,
      authorization: s.has_authorization
    }));
  }
};

onMounted(() => {
  fetchStudents();
});

const addStudent = async (studentData: Omit<Student, 'id'>) => {
  const { data, error } = await supabase
    .from('students')
    .insert({
      name: studentData.name,
      dni: studentData.dni,
      paid: studentData.paid,
      amount: studentData.amount,
      cannot_pay: studentData.cannotPay,
      has_authorization: studentData.authorization
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error adding student:', error);
    alert('Error al agregar adolescente');
    return;
  }
  
  if (data) {
    students.value.unshift({
      id: data.id,
      name: data.name,
      dni: data.dni || '',
      paid: data.paid,
      amount: data.amount,
      cannotPay: data.cannot_pay,
      authorization: data.has_authorization
    });
  }
};

const updateStudent = async (updatedStudent: Student) => {
  const { error } = await supabase
    .from('students')
    .update({
      paid: updatedStudent.paid,
      amount: updatedStudent.amount,
      cannot_pay: updatedStudent.cannotPay,
      has_authorization: updatedStudent.authorization
    })
    .eq('id', updatedStudent.id);
    
  if (error) {
    console.error('Error updating student:', error);
    alert('Error al actualizar');
    return;
  }

  const index = students.value.findIndex(s => s.id === updatedStudent.id);
  if (index !== -1) {
    students.value[index] = updatedStudent;
  }
};

const deleteStudent = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar este adolescente?')) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting student:', error);
      alert('Error al eliminar');
      return;
    }
    
    students.value = students.value.filter(s => s.id !== id);
  }
};

// Stats
const totalStudents = computed(() => students.value.length);
const totalPaidAmount = computed(() => students.value.reduce((sum, s) => sum + (s.amount || 0), 0));
const paidCount = computed(() => students.value.filter(s => s.paid).length);
const missingAuthCount = computed(() => students.value.filter(s => !s.authorization).length);
const cannotPayCount = computed(() => students.value.filter(s => s.cannotPay).length);

const downloadPDF = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Lista de Adolescentes - Autorizaciones', 14, 22);
  
  const tableData = students.value.map(s => [
    s.name,
    s.dni || '-',
    s.authorization ? 'Sí' : 'No'
  ]);

  autoTable(doc, {
    head: [['Nombre', 'DNI', 'Autorización']],
    body: tableData,
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [139, 92, 246] }, // Primary color
  });

  const finalY = (doc as any).lastAutoTable.finalY || 30;
  doc.setFontSize(12);
  doc.text(`Total Adolescentes: ${students.value.length}`, 14, finalY + 10);

  doc.save('lista-adolescentes-autorizaciones.pdf');
};

</script>

<template>
  <div class="container">
    <header class="mb-8 text-center">
      <h1 class="text-4xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Control de Campamento
      </h1>
      <p class="text-muted">Gestiona tus adolescentes, pagos y autorizaciones</p>
      <button @click="downloadPDF" class="btn-primary mt-4">
        Descargar PDF (Solo Autorizaciones)
      </button>
    </header>

    <div class="grid gap-6 mb-8">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="glass-card stat-card">
          <div class="stat-label">Total Adolescentes</div>
          <div class="stat-value">{{ totalStudents }}</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-label">Recaudado</div>
          <div class="stat-value text-success">${{ totalPaidAmount.toLocaleString() }}</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-label">Pagados</div>
          <div class="stat-value">{{ paidCount }} / {{ totalStudents }}</div>
        </div>
        <div class="glass-card stat-card">
          <div class="stat-label">Faltan Autorización</div>
          <div class="stat-value text-warning">{{ missingAuthCount }}</div>
        </div>
      </div>
    </div>

    <StudentForm @add-student="addStudent" />
    
    <StudentList 
      :students="students" 
      @update-student="updateStudent"
      @delete-student="deleteStudent"
    />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
}
.mb-8 {
  margin-bottom: 2rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.text-center {
  text-align: center;
}
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
.text-transparent {
  color: transparent;
}
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
.from-purple-400 {
  --tw-gradient-from: #c084fc;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(192, 132, 252, 0));
}
.to-pink-600 {
  --tw-gradient-to: #db2777;
}
.grid {
  display: grid;
}
.gap-6 {
  gap: 1.5rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.stat-label {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}
.text-success {
  color: var(--success);
}
.text-warning {
  color: #f59e0b;
}
</style>
