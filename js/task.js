document.addEventListener('DOMContentLoaded', function() {
            // Initialize data
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // DOM elements
            const taskList = document.getElementById('taskList');
            const taskListMobile = document.getElementById('taskListMobile');
            const searchTask = document.getElementById('searchTask');
            const editModal = document.getElementById('editModal');
            const editModalContent = document.getElementById('editModalContent');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenu = document.getElementById('mobileMenu');
            const successToast = document.getElementById('successToast');
            const toastMessage = document.getElementById('toastMessage');
            
            // Mobile menu toggle
            mobileMenuBtn.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
            
            // Show toast notification
            function showToast(message) {
                toastMessage.textContent = message;
                successToast.classList.remove('hidden');
                setTimeout(() => {
                    successToast.classList.add('hidden');
                }, 3000);
            }
            
            // Modal functions
            function showEditModal() {
                editModal.classList.remove('hidden');
                editModal.classList.add('flex');
                setTimeout(() => {
                    editModalContent.classList.remove('scale-95', 'opacity-0');
                    editModalContent.classList.add('scale-100', 'opacity-100');
                }, 10);
            }
            
            function hideEditModal() {
                editModalContent.classList.remove('scale-100', 'opacity-100');
                editModalContent.classList.add('scale-95', 'opacity-0');
                setTimeout(() => {
                    editModal.classList.add('hidden');
                    editModal.classList.remove('flex');
                }, 300);
            }
            
            // Status badge function
            function getStatusBadge(status) {
                const statusClasses = {
                    'Belum': 'bg-red-100 text-red-800 border border-red-200',
                    'Proses': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                    'Selesai': 'bg-green-100 text-green-800 border border-green-200'
                };
                return `<span class="px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status]}">${status}</span>`;
            }
            
            // Status border function
            function getStatusBorder(status) {
                const borderClasses = {
                    'Belum': 'border-l-red-500',
                    'Proses': 'border-l-yellow-500',
                    'Selesai': 'border-l-green-500'
                };
                return borderClasses[status] || 'border-l-gray-500';
            }
            
            // Render tasks
            function renderTasks() {
                const searchTerm = searchTask.value.toLowerCase();
                const filteredTasks = tasks.filter(task => 
                    task.title.toLowerCase().includes(searchTerm) || 
                    task.mapel.toLowerCase().includes(searchTerm)
                );
                
                // Desktop table
                taskList.innerHTML = '';
                
                // Mobile cards
                taskListMobile.innerHTML = '';
                
                if (filteredTasks.length === 0) {
                    taskList.innerHTML = `
                        <tr>
                            <td colspan="5" class="text-center py-12">
                                <div class="text-gray-400">
                                    <i class="fas fa-inbox text-6xl mb-4 opacity-50"></i>
                                    <p class="text-lg">Tidak ada tugas ditemukan</p>
                                    <p class="text-sm">Coba ubah kata kunci pencarian</p>
                                </div>
                            </td>
                        </tr>
                    `;
                    taskListMobile.innerHTML = `
                        <div class="text-center py-12 text-gray-400">
                            <i class="fas fa-inbox text-6xl mb-4 opacity-50"></i>
                            <p class="text-lg">Tidak ada tugas ditemukan</p>
                            <p class="text-sm">Coba ubah kata kunci pencarian</p>
                        </div>
                    `;
                } else {
                    filteredTasks.forEach((task, index) => {
                        // Format date
                        const deadlineDate = new Date(task.deadline);
                        const formattedDate = deadlineDate.toLocaleDateString('id-ID', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });
                        
                        const shortDate = deadlineDate.toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        });
                        
                        // Desktop row
                        const row = document.createElement('tr');
                        row.className = `hover:bg-gray-50 transition-colors duration-200`;
                        
                        row.innerHTML = `
                            <td class="py-4 px-2">
                                <div class="flex items-center space-x-3">
                                    <div class="w-2 h-12 rounded-full ${getStatusBorder(task.status).replace('border-l-', 'bg-')}"></div>
                                    <span class="font-medium text-gray-900">${task.mapel}</span>
                                </div>
                            </td>
                            <td class="py-4 px-2">
                                <div class="font-semibold text-gray-900">${task.title}</div>
                                ${task.description ? `<div class="text-sm text-gray-500 mt-1">${task.description}</div>` : ''}
                            </td>
                            <td class="py-4 px-2">
                                <div class="flex items-center space-x-2">
                                    <i class="fas fa-calendar text-gray-400"></i>
                                    <span class="text-gray-700">${shortDate}</span>
                                </div>
                            </td>
                            <td class="py-4 px-2">${getStatusBadge(task.status)}</td>
                            <td class="py-4 px-2">
                                <div class="flex space-x-2">
                                    <button class="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-all duration-200 transform hover:scale-110 edit-task" data-id="${task.id}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-all duration-200 transform hover:scale-110 delete-task" data-id="${task.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        `;
                        
                        taskList.appendChild(row);
                        
                        // Mobile card
                        const card = document.createElement('div');
                        card.className = `bg-gray-50 rounded-xl p-4 border-l-4 ${getStatusBorder(task.status)} hover:shadow-md transition-all duration-200`;
                        
                        card.innerHTML = `
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 mb-1">${task.title}</h4>
                                    <p class="text-sm text-primary font-medium">${task.mapel}</p>
                                </div>
                                ${getStatusBadge(task.status)}
                            </div>
                            ${task.description ? `<p class="text-sm text-gray-600 mb-3">${task.description}</p>` : ''}
                            <div class="flex justify-between items-center">
                                <div class="flex items-center space-x-2 text-sm text-gray-500">
                                    <i class="fas fa-calendar"></i>
                                    <span>${formattedDate}</span>
                                </div>
                                <div class="flex space-x-2">
                                    <button class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-110 edit-task" data-id="${task.id}">
                                        <i class="fas fa-edit text-xs"></i>
                                    </button>
                                    <button class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-110 delete-task" data-id="${task.id}">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                        
                        taskListMobile.appendChild(card);
                    });
                }
                
                saveTasksToLocalStorage();
            }
            
            // Save tasks to localStorage
            function saveTasksToLocalStorage() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            // Edit and delete task handlers
            function handleTaskActions(e) {
                if (e.target.closest('.edit-task')) {
                    const taskId = parseInt(e.target.closest('.edit-task').dataset.id);
                    const task = tasks.find(t => t.id === taskId);
                    
                    if (task) {
                        document.getElementById('editId').value = task.id;
                        document.getElementById('editMapel').value = task.mapel;
                        document.getElementById('editTitle').value = task.title;
                        document.getElementById('editDescription').value = task.description;
                        document.getElementById('editDeadline').value = task.deadline;
                        document.getElementById('editStatus').value = task.status;
                        
                        showEditModal();
                    }
                }
                
                if (e.target.closest('.delete-task')) {
                    const taskId = parseInt(e.target.closest('.delete-task').dataset.id);
                    
                    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
                        tasks = tasks.filter(task => task.id !== taskId);
                        renderTasks();
                        showToast('Tugas berhasil dihapus!');
                    }
                }
            }
            
            taskList.addEventListener('click', handleTaskActions);
            taskListMobile.addEventListener('click', handleTaskActions);
            
            // Save edit task
            document.getElementById('saveEditTask').addEventListener('click', function() {
                const taskId = parseInt(document.getElementById('editId').value);
                const taskIndex = tasks.findIndex(t => t.id === taskId);
                
                if (taskIndex !== -1) {
                    tasks[taskIndex] = {
                        ...tasks[taskIndex],
                        mapel: document.getElementById('editMapel').value,
                        title: document.getElementById('editTitle').value,
                        description: document.getElementById('editDescription').value,
                        deadline: document.getElementById('editDeadline').value,
                        status: document.getElementById('editStatus').value
                    };
                    
                    renderTasks();
                    hideEditModal();
                    showToast('Tugas berhasil diperbarui!');
                }
            });
            
            // Modal close handlers
            document.getElementById('closeEditModal').addEventListener('click', hideEditModal);
            document.getElementById('cancelEdit').addEventListener('click', hideEditModal);
            
            // Close modal when clicking outside
            editModal.addEventListener('click', function(e) {
                if (e.target === editModal) {
                    hideEditModal();
                }
            });
            
            // Search functionality
            searchTask.addEventListener('input', function() {
                renderTasks();
            });
            
            // Export CSV
            document.getElementById('exportCSV').addEventListener('click', function() {
                if (tasks.length === 0) {
                    showToast('Tidak ada data untuk diekspor');
                    return;
                }
                
                const csv = Papa.unparse(tasks);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                
                link.setAttribute('href', url);
                link.setAttribute('download', `tasks_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showToast('Data berhasil diekspor ke CSV!');
            });
            
            // Export Excel
            document.getElementById('exportExcel').addEventListener('click', function() {
                if (tasks.length === 0) {
                    showToast('Tidak ada data untuk diekspor');
                    return;
                }
                
                const worksheet = XLSX.utils.json_to_sheet(tasks);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
                XLSX.writeFile(workbook, `tasks_${new Date().toISOString().split('T')[0]}.xlsx`);
                showToast('Data berhasil diekspor ke Excel!');
            });
            
            // Import data
            document.getElementById('importButton').addEventListener('click', function() {
                document.getElementById('importFile').click();
            });
            
            document.getElementById('importFile').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const extension = file.name.split('.').pop().toLowerCase();
                
                if (extension === 'csv') {
                    Papa.parse(file, {
                        header: true,
                        skipEmptyLines: true,
                        complete: function(results) {
                            try {
                                const importedTasks = results.data.map(task => ({
                                    ...task,
                                    id: parseInt(task.id) || Date.now() + Math.floor(Math.random() * 1000),
                                })).filter(task => task.title && task.mapel);
                                
                                // Check for duplicate IDs and regenerate if needed
                                importedTasks.forEach(task => {
                                    while (tasks.some(t => t.id === task.id)) {
                                        task.id = Date.now() + Math.floor(Math.random() * 1000);
                                    }
                                });
                                
                                tasks = [...tasks, ...importedTasks];
                                renderTasks();
                                showToast(`${importedTasks.length} tugas berhasil diimpor!`);
                            } catch (error) {
                                showToast('Error saat mengimpor data CSV');
                                console.error(error);
                            }
                        },
                        error: function(error) {
                            showToast('Error saat membaca file CSV');
                            console.error(error);
                        }
                    });
                } else if (extension === 'xlsx' || extension === 'xls') {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            const data = new Uint8Array(e.target.result);
                            const workbook = XLSX.read(data, { type: 'array' });
                            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                            const jsonData = XLSX.utils.sheet_to_json(worksheet);
                            
                            const importedTasks = jsonData.map(task => ({
                                ...task,
                                id: parseInt(task.id) || Date.now() + Math.floor(Math.random() * 1000),
                            })).filter(task => task.title && task.mapel);
                            
                            // Check for duplicate IDs and regenerate if needed
                            importedTasks.forEach(task => {
                                while (tasks.some(t => t.id === task.id)) {
                                    task.id = Date.now() + Math.floor(Math.random() * 1000);
                                }
                            });
                            
                            tasks = [...tasks, ...importedTasks];
                            renderTasks();
                            showToast(`${importedTasks.length} tugas berhasil diimpor!`);
                        } catch (error) {
                            showToast('Error saat mengimpor data Excel');
                            console.error(error);
                        }
                    };
                    reader.onerror = function() {
                        showToast('Error saat membaca file Excel');
                    };
                    reader.readAsArrayBuffer(file);
                }
                
                // Reset input file
                e.target.value = '';
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                // Ctrl/Cmd + S to focus on search
                if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                    e.preventDefault();
                    searchTask.focus();
                }
                
                // Escape to close modal
                if (e.key === 'Escape') {
                    hideEditModal();
                }
            });
            
            // Set minimum date to today for deadline inputs
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('editDeadline').setAttribute('min', today);
            
            // Initialize app
            renderTasks();
        });