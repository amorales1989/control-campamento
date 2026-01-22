<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '../supabase';

const name = ref('');
const hasMedication = ref('no');
const medication = ref('');
const hasSpecialCare = ref('no');
const specialCare = ref('');
const headacheMedication = ref('');
const feverMedication = ref('');
const emergencyContact = ref('');
const submitted = ref(false);
const loading = ref(false);

const handleSubmit = async () => {
  if (!name.value.trim()) return;
  
  loading.value = true;
  const { error } = await supabase
    .from('ficha_medica')
    .insert({
      student_name: name.value,
      medication: hasMedication.value === 'si' ? medication.value : 'No toma',
      special_care: hasSpecialCare.value === 'si' ? specialCare.value : 'Ninguno',
      headache_medication: headacheMedication.value,
      fever_medication: feverMedication.value,
      emergency_contact: emergencyContact.value
    });
    
  loading.value = false;
  
  if (error) {
    console.error('Error submitting health form:', error);
    alert('Error al enviar el formulario. Por favor, intenta de nuevo.');
    return;
  }
  
  submitted.value = true;
  // Reset form
  name.value = '';
  hasMedication.value = 'no';
  medication.value = '';
  hasSpecialCare.value = 'no';
  specialCare.value = '';
  headacheMedication.value = '';
  feverMedication.value = '';
  emergencyContact.value = '';
};
</script>

<template>
  <div class="health-form-container">
    <div v-if="!submitted" class="glass-card form-card">
      <header class="mb-8 text-center">
        <h1 class="text-3xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
          Ficha Médica de Campamento
        </h1>
        <p class="text-muted">Por favor, completa los datos del adolescente</p>
      </header>

      <form @submit.prevent="handleSubmit" class="grid gap-6">
        <div class="form-group">
          <label for="name">Nombre y apellido del Adolescente</label>
          <input 
            id="name"
            v-model="name" 
            type="text" 
            placeholder="Nombre completo" 
            required
            class="styled-input"
          />
        </div>

        <div class="form-group">
          <label>¿Toma alguna medicación?</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="hasMedication" value="si" />
              <span class="radio-custom"></span>
              Sí
            </label>
            <label class="radio-label">
              <input type="radio" v-model="hasMedication" value="no" />
              <span class="radio-custom"></span>
              No
            </label>
          </div>
          <Transition name="fade-slide">
            <div v-if="hasMedication === 'si'" class="conditional-input">
              <textarea 
                v-model="medication" 
                placeholder="Especificar medicación y horarios si corresponde"
                rows="2"
                class="styled-input"
                required
              ></textarea>
            </div>
          </Transition>
        </div>

        <div class="form-group">
          <label>¿Necesita algún cuidado especial?</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="hasSpecialCare" value="si" />
              <span class="radio-custom"></span>
              Sí
            </label>
            <label class="radio-label">
              <input type="radio" v-model="hasSpecialCare" value="no" />
              <span class="radio-custom"></span>
              No
            </label>
          </div>
          <Transition name="fade-slide">
            <div v-if="hasSpecialCare === 'si'" class="conditional-input">
              <textarea 
                v-model="specialCare" 
                placeholder="Alergias, condiciones físicas, etc."
                rows="2"
                class="styled-input"
                required
              ></textarea>
            </div>
          </Transition>
        </div>

        <div class="form-group">
          <label for="headache">En caso de dolor de cabeza, ¿qué suele tomar?</label>
          <input 
            id="headache"
            v-model="headacheMedication" 
            type="text" 
            placeholder="Ej: Paracetamol, Ibuprofeno..."
            class="styled-input"
          />
        </div>

        <div class="form-group">
          <label for="fever">En caso de fiebre, ¿qué suele tomar?</label>
          <input 
            id="fever"
            v-model="feverMedication" 
            type="text" 
            placeholder="Ej: Paracetamol, Ibuprofeno..."
            class="styled-input"
          />
        </div>

        <div class="form-group">
          <label for="contact">Número de contacto de emergencia (Adulto responsable)</label>
          <input 
            id="contact"
            v-model="emergencyContact" 
            type="tel" 
            placeholder="Ej: +54 9 11 ..."
            required
            class="styled-input"
          />
        </div>

        <button type="submit" class="btn-primary w-full mt-4" :disabled="loading">
          {{ loading ? 'Enviando...' : 'Enviar Ficha Médica' }}
        </button>
      </form>
    </div>

    <div v-else class="glass-card text-center py-12">
      <div class="text-6xl mb-4">✅</div>
      <h2 class="text-2xl font-bold mb-2">¡Formulario enviado con éxito!</h2>
      <p class="text-muted mb-6">La información ha sido registrada correctamente.</p>
      <button @click="submitted = false" class="btn-primary">Enviar otra ficha</button>
    </div>
  </div>
</template>

<style scoped>
.health-form-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.form-card {
  padding: 2.5rem;
}

@media (max-width: 640px) {
  .health-form-container {
    margin: 1rem auto;
  }
  
  .form-card {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .radio-group {
    gap: 1.5rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-color);
}

.styled-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
}

.styled-input:focus {
  outline: none;
  border-color: #c084fc;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.1);
}

/* Radio Group Styles */
.radio-group {
  display: flex;
  gap: 2rem;
  margin-bottom: 0.25rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  position: relative;
}

.radio-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-custom {
  height: 20px;
  width: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.radio-label:hover input ~ .radio-custom {
  border-color: #c084fc;
}

.radio-label input:checked ~ .radio-custom {
  background-color: #c084fc;
  border-color: #c084fc;
}

.radio-custom:after {
  content: "";
  position: absolute;
  display: none;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.radio-label input:checked ~ .radio-custom:after {
  display: block;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 200px;
}

.conditional-input {
  overflow: hidden;
}

.w-full {
  width: 100%;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.text-center {
  text-align: center;
}

.text-3xl {
  font-size: 2rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.text-transparent {
  color: transparent;
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, #c084fc, #db2777);
}

.gap-6 {
  gap: 1.5rem;
}
</style>
