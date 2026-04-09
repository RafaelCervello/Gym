let exercises = [
  { nome: "Supino reto", feito: false, nota: "" },
  { nome: "Agachamento", feito: false, nota: "" },
  { nome: "Rosca direta", feito: false, nota: "" }
];

let currentIndex = null;

// Carregar dados salvos do localStorage
function loadExercises() {
  const saved = localStorage.getItem('exercises');
  if (saved) {
    exercises = JSON.parse(saved);
  }
  updateStats();
}

// Salvar dados no localStorage
function saveExercises() {
  localStorage.setItem('exercises', JSON.stringify(exercises));
  updateStats();
}

// Atualizar estatísticas
function updateStats() {
  const completed = exercises.filter(ex => ex.feito).length;
  const total = exercises.length;
  
  document.getElementById('completedCount').textContent = completed;
  document.getElementById('totalCount').textContent = total;
  
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  document.getElementById('progressBar').style.width = percentage + '%';
  document.getElementById('progressText').textContent = Math.round(percentage) + '% concluído';
}

function render() {
  const list = document.getElementById("exerciseList");
  list.innerHTML = "";

  if (exercises.length === 0) {
    list.innerHTML = '<div style="text-align: center; color: #999; padding: 40px 20px;"><p><i class="fas fa-inbox" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>Nenhum exercício adicionado. Adicione um novo!</p></div>';
    return;
  }

  exercises.forEach((ex, index) => {
    const notePreview = ex.nota ? ex.nota.substring(0, 30) + '...' : 'Adicionar anotação';
    list.innerHTML += `
      <div class="exercise-card ${ex.feito ? 'completed' : ''}">
        <div class="checkbox-wrapper">
          <input type="checkbox" class="exercise-checkbox" ${ex.feito ? "checked" : ""} 
            onchange="toggle(${index})">
        </div>
        <div class="exercise-info">
          <div class="exercise-name">${ex.nome}</div>
          <div class="exercise-note-preview">${notePreview}</div>
        </div>
        <div class="exercise-actions">
          <button class="btn btn-note btn-sm" onclick="openNote(${index})">
            <i class="fas fa-sticky-note"></i> Notas
          </button>
        </div>
      </div>
    `;
  });
}

function toggle(index) {
  exercises[index].feito = !exercises[index].feito;
  saveExercises();
  render();
}

function resetTreino() {
  if (confirm('Tem certeza que quer reiniciar o treino?')) {
    exercises.forEach(ex => ex.feito = false);
    saveExercises();
    render();
  }
}

function openNote(index) {
  currentIndex = index;
  document.getElementById("noteInput").value = exercises[index].nota;
  document.getElementById("noteModal").classList.add('active');
}

function closeNoteModal() {
  document.getElementById("noteModal").classList.remove('active');
}

function saveNote() {
  exercises[currentIndex].nota = document.getElementById("noteInput").value;
  saveExercises();
  closeNoteModal();
  render();
}

function openSettings() {
  const name = prompt('Nome do exercício:');
  if (name && name.trim()) {
    exercises.push({ nome: name.trim(), feito: false, nota: '' });
    saveExercises();
    render();
  }
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(event) {
  const modal = document.getElementById('noteModal');
  if (event.target === modal) {
    closeNoteModal();
  }
});

// Inicializar
loadExercises();
render();