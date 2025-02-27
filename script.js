
document.addEventListener('DOMContentLoaded', () => {
  
    let facultyData = [];
    let roomData = [];
    let workloadData = [];
    let consumablesData = [];

    const modalBtns = document.querySelectorAll('.modal-btn');
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    modalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
            modal.style.animation = 'slideIn3D 0.6s ease-out';
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => modal.style.display = 'none', 500);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => e.target.style.display = 'none', 500);
        }
    });

 
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        toast.style.animation = 'slideInToast 0.5s ease-out';
    }


    const facultyForm = document.getElementById('facultyForm');
    const workloadForm = document.getElementById('workloadForm');
    const roomAllocationForm = document.getElementById('roomAllocationForm');
    const consumablesRequestForm = document.getElementById('consumablesRequestForm');
    const dataTableBody = document.querySelector('#dataTable tbody');

  
    function validateForm(form) {
        const inputs = form.querySelectorAll('input, select');
        for (let input of inputs) {
            if (!input.value.trim() && input.required) {
                showToast(`Please fill out ${input.placeholder || input.id}`, 'error');
                return false;
            }
        }
        return true;
    }


    facultyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(facultyForm)) return;
        if (confirm('Confirm adding this faculty member?')) {
            const faculty = {
                name: document.getElementById('facultyName').value,
                email: document.getElementById('email').value,
                contact: document.getElementById('contact').value,
                designation: document.getElementById('designation').value,
                course: '',
                room: ''
            };
            facultyData.push(faculty);
            facultyForm.reset();
            facultyForm.closest('.modal').style.display = 'none';
            showToast('Faculty added successfully!', 'success');
        }
    });

    workloadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(workloadForm)) return;
        if (confirm('Confirm adding this workload?')) {
            if (facultyData.length > 0) {
                const workload = {
                    facultyName: facultyData[facultyData.length - 1].name,
                    courseName: document.getElementById('courseName').value,
                    creditHours: document.getElementById('creditHours').value,
                    contactHours: document.getElementById('contactHours').value
                };
                workloadData.push(workload);
                facultyData[facultyData.length - 1].course = workload.courseName;
            }
            workloadForm.reset();
            workloadForm.closest('.modal').style.display = 'none';
            showToast('Workload added successfully!', 'success');
        }
    });

    // Room Allocation Form Submission
    roomAllocationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(roomAllocationForm)) return;
        if (confirm('Confirm allocating this room?')) {
            const room = {
                facultyName: facultyData.length > 0 ? facultyData[facultyData.length - 1].name : 'N/A',
                roomName: document.getElementById('roomName').value,
                roomType: document.getElementById('roomType').value,
                capacity: document.getElementById('capacity').value,
                timeSlot: document.getElementById('timeSlot').value
            };
            roomData.push(room);
            updateTable();
            roomAllocationForm.reset();
            roomAllocationForm.closest('.modal').style.display = 'none';
            showToast('Room allocated successfully!', 'success');
        }
    });

    // Consumables Form Submission
    consumablesRequestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(consumablesRequestForm)) return;
        if (confirm('Confirm requesting these consumables?')) {
            const consumable = {
                itemName: document.getElementById('itemName').value,
                quantity: document.getElementById('quantity').value
            };
            consumablesData.push(consumable);
            consumablesRequestForm.reset();
            consumablesRequestForm.closest('.modal').style.display = 'none';
            showToast('Consumables requested successfully!', 'success');
        }
    });

    // Update Table Function
    function updateTable() {
        dataTableBody.innerHTML = '';
        roomData.forEach(room => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.facultyName}</td>
                <td>${room.roomName}</td>
                <td>${room.roomType}</td>
                <td>${room.capacity}</td>
                <td>${room.timeSlot}</td>
            `;
            dataTableBody.appendChild(row);
            row.style.animation = 'fadeInRow 0.5s ease-out';
        });
    }

    // CSS for animations and toast
    const styles = `
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 15px;
            color: white;
            font-size: 1.1em;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 2000;
            animation: slideInToast 0.5s ease-out, fadeOutToast 0.5s 2.5s ease-out forwards;
        }
        .toast.success { background: #6a5acd; }
        .toast.error { background: #ff6b6b; }
        @keyframes slideInToast { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeOutToast { from { opacity: 1; } to { opacity: 0; } }
        @keyframes fadeInRow { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
});