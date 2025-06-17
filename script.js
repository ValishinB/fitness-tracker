
Parse.initialize(
  "gn5aGjE30RWWPXOhePHNCyIlahQ1xIPaZBt8GbPP",  
  "TYK9ZOBtxk97zHI0rYQJygHGaxb9mElc5gi0m28f"  
);
Parse.serverURL = "https://parseapi.back4app.com/"; 

const workoutsList = document.getElementById('workoutsList');
const workoutsTableBody = document.getElementById('workoutsTableBody');

function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}
async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const user = await Parse.Cloud.run('signup', { email, password });
    showAlert(`Successful registration! Your ID: ${user.id}`, 'success');
    document.getElementById('userId').value = user.id;
  } catch (error) {
    showAlert(`error: ${error.message}`, 'danger');
  }
}

async function addWorkout() {
  const userId = document.getElementById('userId').value;
  const type = document.getElementById('workoutType').value;
  const duration = parseInt(document.getElementById('duration').value);

  try {
    await Parse.Cloud.run('addWorkout', { 
      type, 
      duration: Number(duration), 
      userId 
    });
    showAlert('Training has been added!', 'success');
  } catch (error) {
    showAlert(`error: ${error.message}`, 'danger');
  }
}

async function fetchWorkouts() {
  const userId = document.getElementById('userId').value;

  try {
    const workouts = await Parse.Cloud.run('getWorkouts', { userId });
    renderWorkouts(workouts);
    workoutsList.style.display = 'block';
  } catch (error) {
    showAlert(`error: ${error.message}`, 'danger');
  }
}

function renderWorkouts(workouts) {
  workoutsTableBody.innerHTML = workouts.map(workout => `
    <tr>
      <td>${getWorkoutIcon(workout.get('type'))} ${workout.get('type')}</td>
      <td>${workout.get('duration')} min</td>
      <td>${new Date(workout.createdAt).toLocaleString()}</td>
    </tr>
  `).join('');
}

function getWorkoutIcon(type) {
  const icons = {
    'Running': '🏃',
    'Cycling': '🚴',
    'Swimming': '🏊',
    'Gym': '💪'
  };
  return icons[type] || '🏅';
}