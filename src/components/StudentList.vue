<script setup lang="ts">
import { Student } from '../types';

defineProps<{
  students: Student[];
}>();

const emit = defineEmits<{
  (e: 'update-student', student: Student): void;
  (e: 'delete-student', id: string): void;
}>();

const updateField = (student: Student, field: keyof Student, value: any) => {
  const updatedStudent = { ...student, [field]: value };
  // If paid is unchecked, maybe we want to keep the amount or reset it? 
  // Let's keep it simple and just update.
  if (field === 'paid' && value === false) {
    // Optional: reset amount if not paid? 
    // The user requirement says "marcar si pagaron y cuanto pagaron".
    // Maybe they paid a partial amount? 
    // Let's assume "Paid" means "Has paid something" or "Fully paid"?
    // The prompt says "marcar si pagaron y cuanto pagaron". 
    // Let's keep amount independent but maybe highlight it.
  }
  emit('update-student', updatedStudent);
};
</script>

<template>
  <div class="glass-card">
    <div class="overflow-x-auto hidden-mobile">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr>
            <th class="p-4 border-b border-white/10">Nombre</th>
            <th class="p-4 border-b border-white/10">DNI</th>
            <th class="p-4 border-b border-white/10 text-center">Pagó</th>
            <th class="p-4 border-b border-white/10">Monto</th>
            <th class="p-4 border-b border-white/10 text-center">No puede pagar</th>
            <th class="p-4 border-b border-white/10 text-center">Autorización</th>
            <th class="p-4 border-b border-white/10 text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="students.length === 0">
            <td colspan="7" class="p-8 text-center text-muted">
              No hay adolescentes registrados aún.
            </td>
          </tr>
          <tr v-for="student in students" :key="student.id" class="hover:bg-white/5 transition-colors">
            <td class="p-4 border-b border-white/5 font-medium">{{ student.name }}</td>
            <td class="p-4 border-b border-white/5">{{ student.dni || '-' }}</td>
            
            <td class="p-4 border-b border-white/5 text-center">
              <label class="checkbox-wrapper justify-center" :class="{ 'opacity-50 cursor-not-allowed': student.cannotPay }">
                <input 
                  type="checkbox" 
                  :checked="student.paid" 
                  :disabled="student.cannotPay"
                  @change="(e) => updateField(student, 'paid', (e.target as HTMLInputElement).checked)"
                />
              </label>
            </td>
            
            <td class="p-4 border-b border-white/5">
              <input 
                type="number" 
                :value="student.amount" 
                :disabled="student.cannotPay"
                @input="(e) => updateField(student, 'amount', Number((e.target as HTMLInputElement).value))"
                class="w-24 disabled:opacity-50 disabled:cursor-not-allowed"
                min="0"
              />
            </td>
            
            <td class="p-4 border-b border-white/5 text-center">
              <label class="checkbox-wrapper justify-center" :class="{ 'opacity-50 cursor-not-allowed': student.paid }">
                <input 
                  type="checkbox" 
                  :checked="student.cannotPay" 
                  :disabled="student.paid"
                  @change="(e) => updateField(student, 'cannotPay', (e.target as HTMLInputElement).checked)"
                />
              </label>
            </td>
            
            <td class="p-4 border-b border-white/5 text-center">
              <label class="checkbox-wrapper justify-center">
                <input 
                  type="checkbox" 
                  :checked="student.authorization" 
                  @change="(e) => updateField(student, 'authorization', (e.target as HTMLInputElement).checked)"
                />
              </label>
            </td>
            
            <td class="p-4 border-b border-white/5 text-center">
              <button 
                @click="emit('delete-student', student.id)"
                class="btn-danger"
                title="Eliminar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="show-mobile">
      <div v-if="students.length === 0" class="p-8 text-center text-muted">
        No hay adolescentes registrados aún.
      </div>
      <div v-for="student in students" :key="student.id" class="student-card">
        <div class="card-header">
          <span class="card-name">{{ student.name }}</span>
          <button @click="emit('delete-student', student.id)" class="btn-danger btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        </div>
        <div class="card-body">
          <div class="card-row">
            <span>DNI:</span>
            <span>{{ student.dni || '-' }}</span>
          </div>
          <div class="card-row">
            <span>Pagó:</span>
            <label class="checkbox-wrapper" :class="{ 'opacity-50': student.cannotPay }">
              <input type="checkbox" :checked="student.paid" :disabled="student.cannotPay" @change="(e) => updateField(student, 'paid', (e.target as HTMLInputElement).checked)" />
            </label>
          </div>
          <div class="card-row">
            <span>Monto:</span>
            <input type="number" :value="student.amount" :disabled="student.cannotPay" @input="(e) => updateField(student, 'amount', Number((e.target as HTMLInputElement).value))" class="amount-input" />
          </div>
          <div class="card-row">
            <span>No puede pagar:</span>
            <label class="checkbox-wrapper" :class="{ 'opacity-50': student.paid }">
              <input type="checkbox" :checked="student.cannotPay" :disabled="student.paid" @change="(e) => updateField(student, 'cannotPay', (e.target as HTMLInputElement).checked)" />
            </label>
          </div>
          <div class="card-row">
            <span>Autorizacion:</span>
            <label class="checkbox-wrapper">
              <input type="checkbox" :checked="student.authorization" @change="(e) => updateField(student, 'authorization', (e.target as HTMLInputElement).checked)" />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overflow-x-auto {
  overflow-x: auto;
}
.w-full {
  width: 100%;
}
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.border-collapse {
  border-collapse: collapse;
}
.p-4 {
  padding: 1rem;
}
.p-8 {
  padding: 2rem;
}
.border-b {
  border-bottom-width: 1px;
}
.border-white\/10 {
  border-color: rgba(255, 255, 255, 0.1);
}
.border-white\/5 {
  border-color: rgba(255, 255, 255, 0.05);
}
.text-muted {
  color: var(--text-muted);
}
.hover\:bg-white\/5:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
.transition-colors {
  transition: background-color 0.2s;
}
.font-medium {
  font-weight: 500;
}
.justify-center {
  justify-content: center;
}
.w-24 {
  width: 6rem;
}

@media (max-width: 768px) {
  .hidden-mobile {
    display: none;
  }
  .show-mobile {
    display: block;
  }
  .student-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  .card-name {
    font-weight: 600;
    font-size: 1rem;
  }
  .card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
  }
  .amount-input {
    width: 5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
  }
  .btn-sm {
    padding: 0.4rem;
  }
}
</style>
