<script setup lang="ts">
import { ref } from 'vue';
import { Student } from '../types';

const emit = defineEmits<{
  (e: 'add-student', student: Omit<Student, 'id'>): void;
}>();

const name = ref('');
const dni = ref('');

const handleSubmit = () => {
  if (!name.value.trim()) return;
  
  emit('add-student', {
    name: name.value,
    dni: dni.value,
    paid: false,
    amount: 0,
    cannotPay: false,
    authorization: false
  });
  
  name.value = '';
  dni.value = '';
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="glass-card mb-8">
    <h2 class="text-xl mb-4 font-bold">Agregar Adolescente</h2>
    <div class="flex gap-4">
      <input 
        v-model="name" 
        type="text" 
        placeholder="Nombre del adolescente" 
        class="flex-1"
        required
      />
      <input 
        v-model="dni" 
        type="text" 
        placeholder="DNI" 
        class="w-32"
      />
      <button type="submit" class="btn-primary">
        Agregar
      </button>
    </div>
  </form>
</template>

<style scoped>
.mb-8 {
  margin-bottom: 2rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.flex {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
}

.w-32 {
  width: 8rem;
}

@media (max-width: 640px) {
  .flex {
    flex-direction: column;
  }
  
  .w-32 {
    width: 100%;
  }
  
  .btn-primary {
    width: 100%;
  }
}

.text-xl {
  font-size: 1.25rem;
}
.font-bold {
  font-weight: 700;
}
</style>
