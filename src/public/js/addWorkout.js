const setType = document.getElementById('setType');
const strengthRow = document.querySelector('.strength-row');
const enduranceRow = document.querySelector('.endurance-row');

setType.addEventListener('change', () => {
  const isStrength = setType.value === 'strength';
  strengthRow.classList.toggle('is-hidden', !isStrength);
  enduranceRow.classList.toggle('is-hidden', isStrength);
});

// Hantera formulär-submission
document.getElementById('addSetBtn').addEventListener('click', () => {
  const date = document.getElementById('workoutDate').value;
  const exerciseName = document.getElementById('exName').value;
  const kind = setType.value;
  const type = kind;

  if (!date || !exerciseName.trim()) {
    alert('Choose a day and enter an exercise.');
    return;
  }

  // Bygg formulär för server-redirect
  const form = document.createElement('form');
  form.method = 'post';
  form.action = '/workouts/create-with-set';

  form.innerHTML = `
    <input type="hidden" name="date" value="${date}" />
    <input type="hidden" name="type" value="${type}" />
    <input type="hidden" name="exerciseName" value="${exerciseName}" />
    <input type="hidden" name="kind" value="${kind}" />
  `;

  if (kind === 'strength') {
    const reps = document.getElementById('reps').value;
    const weightKg = document.getElementById('weightKg').value;
    form.innerHTML += `
      <input type="hidden" name="reps" value="${reps}" />
      <input type="hidden" name="weightKg" value="${weightKg}" />
    `;
  } else {
    const distanceKm = document.getElementById('distanceKm').value;
    const minutes = document.getElementById('minutes').value || 0;
    const seconds = document.getElementById('seconds').value || 0;
    form.innerHTML += `
      <input type="hidden" name="distanceKm" value="${distanceKm}" />
      <input type="hidden" name="minutes" value="${minutes}" />
      <input type="hidden" name="seconds" value="${seconds}" />
    `;
  }

  document.body.appendChild(form);
  form.submit();
});