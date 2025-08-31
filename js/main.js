document.addEventListener("DOMContentLoaded", function () {
  // Initialize data
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // DOM elements
  const taskForm = document.getElementById("taskForm");
  const successToast = document.getElementById("successToast");
  const toastMessage = document.getElementById("toastMessage");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  // Statistics elements
  const totalTasksEl = document.getElementById("totalTasks");
  const belumTasksEl = document.getElementById("belumTasks");
  const prosesTasksEl = document.getElementById("prosesTasks");
  const selesaiTasksEl = document.getElementById("selesaiTasks");

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });

  // Show toast notification
  function showToast(message) {
    toastMessage.textContent = message;
    successToast.classList.remove("hidden");
    setTimeout(() => {
      successToast.classList.add("hidden");
    }, 3000);
  }

  // Update statistics
  function updateStats() {
    const stats = {
      total: tasks.length,
      belum: tasks.filter((task) => task.status === "Belum").length,
      proses: tasks.filter((task) => task.status === "Proses").length,
      selesai: tasks.filter((task) => task.status === "Selesai").length,
    };

    totalTasksEl.textContent = stats.total;
    belumTasksEl.textContent = stats.belum;
    prosesTasksEl.textContent = stats.proses;
    selesaiTasksEl.textContent = stats.selesai;
  }

  // Update upcoming deadlines
  function updateUpcomingDeadlines() {
    const upcomingDiv = document.getElementById("upcomingDeadlines");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingTasks = tasks
      .filter((task) => {
        const taskDate = new Date(task.deadline);
        taskDate.setHours(0, 0, 0, 0);
        return (
          taskDate >= today && taskDate <= nextWeek && task.status !== "Selesai"
        );
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    if (upcomingTasks.length === 0) {
      upcomingDiv.innerHTML = `
                        <div class="text-center text-gray-500 py-8">
                            <i class="fas fa-calendar-check text-4xl mb-3 opacity-50"></i>
                            <p>Tidak ada deadline mendatang</p>
                        </div>
                    `;
    } else {
      upcomingDiv.innerHTML = "";
      upcomingTasks.forEach((task, index) => {
        const taskDate = new Date(task.deadline);
        const isToday = taskDate.toDateString() === today.toDateString();
        const isTomorrow =
          taskDate.toDateString() ===
          new Date(today.getTime() + 86400000).toDateString();

        let dateText;
        if (isToday) {
          dateText = "Hari ini";
        } else if (isTomorrow) {
          dateText = "Besok";
        } else {
          dateText = taskDate.toLocaleDateString("id-ID", {
            weekday: "long",
            month: "short",
            day: "numeric",
          });
        }

        const taskEl = document.createElement("div");
        taskEl.className = `bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all duration-200`;

        taskEl.innerHTML = `
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900 mb-1">${
                                      task.title
                                    }</h4>
                                    <p class="text-sm text-gray-600 mb-2">${
                                      task.mapel
                                    }</p>
                                    <div class="flex items-center space-x-2">
                                        <i class="fas fa-clock text-orange-500 text-xs"></i>
                                        <span class="text-xs font-medium ${
                                          isToday
                                            ? "text-red-600"
                                            : "text-orange-600"
                                        }">${dateText}</span>
                                    </div>
                                </div>
                                ${
                                  isToday
                                    ? '<div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>'
                                    : ""
                                }
                            </div>
                        `;

        upcomingDiv.appendChild(taskEl);
      });
    }
  }

  // Save tasks to localStorage
  function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Add new task
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      mapel: document.getElementById("mapel").value,
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      deadline: document.getElementById("deadline").value,
      status: document.getElementById("status").value,
      created_at: new Date().toISOString(),
    };

    tasks.push(newTask);
    updateStats();
    updateUpcomingDeadlines();
    showToast("Tugas berhasil ditambahkan!");

    // Reset form
    taskForm.reset();
    document.getElementById("mapel").value = "";

    saveTasksToLocalStorage();
  });

  // Auto-save form data on input
  const formInputs = ["mapel", "title", "description", "deadline", "status"];
  formInputs.forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener("input", function () {
        const formData = {};
        formInputs.forEach((id) => {
          const el = document.getElementById(id);
          if (el) formData[id] = el.value;
        });
        localStorage.setItem("draft_task", JSON.stringify(formData));
      });
    }
  });

  // Restore draft on page load
  const draftTask = JSON.parse(localStorage.getItem("draft_task") || "{}");
  Object.keys(draftTask).forEach((key) => {
    const input = document.getElementById(key);
    if (input && draftTask[key]) {
      input.value = draftTask[key];
    }
  });

  // Clear draft when form is submitted
  taskForm.addEventListener("submit", function () {
    localStorage.removeItem("draft_task");
  });

  // Set minimum date to today for deadline inputs
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("deadline").setAttribute("min", today);

  // Initialize app
  updateStats();
  updateUpcomingDeadlines();
});
