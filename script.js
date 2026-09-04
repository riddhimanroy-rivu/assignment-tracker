const assignmentList = document.getElementById("assignmentList");
const emptyState = document.getElementById("emptyState");

const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

const assignmentForm = document.getElementById("assignmentForm");

const searchInput = document.getElementById("searchInput");
const subjectFilter = document.getElementById("subjectFilter");
const statusFilter = document.getElementById("statusFilter");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const overdueCount = document.getElementById("overdueCount");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const assignmentSummary = document.getElementById("assignmentSummary");

const toast = document.getElementById("toast");

// =========================
// LOAD ASSIGNMENTS
// =========================

let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

// Add sample assignments on first visit
if (assignments.length === 0) {

const now = new Date();

const sample1 = new Date(now);
sample1.setDate(now.getDate() + 2);

const sample2 = new Date(now);
sample2.setDate(now.getDate() + 6);

const sample3 = new Date(now);
sample3.setDate(now.getDate() - 2);

assignments = [
    {
        id: Date.now(),
        title: "Database Management System Project",
        subject: "DBMS",
        description: "Create an ER diagram and implement the database.",
        deadline: sample1.toISOString(),
        completed: false
    },
    {
        id: Date.now() + 1,
        title: "Shell Programming Assignment",
        subject: "Operating Systems",
        description: "Write and execute shell programs using Ubuntu.",
        deadline: sample2.toISOString(),
        completed: false
    },
    {
        id: Date.now() + 2,
        title: "Java OOP Mini Project",
        subject: "Java",
        description: "Build a small object-oriented Java application.",
        deadline: sample3.toISOString(),
        completed: false
    }
];

saveAssignments();


}

// =========================
// SAVE
// =========================

function saveAssignments() {
localStorage.setItem("assignments", JSON.stringify(assignments));
}

// =========================
// DATE / STATUS HELPERS
// =========================

function getStatus(assignment) {

if (assignment.completed) {
    return "completed";
}

const now = new Date();
const deadline = new Date(assignment.deadline);

const difference = deadline - now;
const hoursLeft = difference / (1000 * 60 * 60);

if (difference < 0) {
    return "overdue";
}

if (hoursLeft <= 48) {
    return "soon";
}

return "upcoming";


}

function getStatusLabel(status) {


if (status === "completed") return "Completed";
if (status === "overdue") return "Overdue";
if (status === "soon") return "Due Soon";

return "Upcoming";


}

function formatDate(dateString) {


const date = new Date(dateString);

return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
});


}

// =========================
// RENDER
// =========================

function renderAssignments() {


const search = searchInput.value.toLowerCase().trim();
const selectedSubject = subjectFilter.value;
const selectedStatus = statusFilter.value;

let filtered = assignments.filter(assignment => {

    const status = getStatus(assignment);

    const matchesSearch =
        assignment.title.toLowerCase().includes(search) ||
        assignment.subject.toLowerCase().includes(search) ||
        assignment.description.toLowerCase().includes(search);

    const matchesSubject =
        selectedSubject === "all" ||
        assignment.subject === selectedSubject;

    let matchesStatus = true;

    if (selectedStatus === "pending") {
        matchesStatus = !assignment.completed;
    }

    if (selectedStatus === "completed") {
        matchesStatus = assignment.completed;
    }

    if (selectedStatus === "overdue") {
        matchesStatus = status === "overdue";
    }

    return matchesSearch && matchesSubject && matchesStatus;
});


// Sort by deadline
filtered.sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
});


assignmentList.innerHTML = "";


filtered.forEach(assignment => {

    const status = getStatus(assignment);

    const card = document.createElement("div");

    card.className =
        `assignment-card ${assignment.completed ? "completed" : ""}`;


    card.innerHTML = `
        <button
            class="check-btn"
            onclick="toggleComplete(${assignment.id})"
            title="Mark as completed"
        >
            ${assignment.completed ? "✓" : ""}
        </button>

        <div class="assignment-info">

            <div class="assignment-title">
                ${escapeHTML(assignment.title)}
            </div>

            <div class="assignment-description">
                ${escapeHTML(
                    assignment.description || "No description provided."
                )}
            </div>

            <div class="assignment-meta">

                <span class="subject-badge">
                    ${escapeHTML(assignment.subject)}
                </span>

                <span class="deadline">
                    📅 ${formatDate(assignment.deadline)}
                </span>

            </div>

        </div>

        <span class="status-badge status-${status}">
            ${getStatusLabel(status)}
        </span>

        <button
            class="delete-btn"
            onclick="deleteAssignment(${assignment.id})"
            title="Delete assignment"
        >
            🗑️
        </button>
    `;

    assignmentList.appendChild(card);
});


if (filtered.length === 0) {
    emptyState.classList.add("show");
} else {
    emptyState.classList.remove("show");
}


assignmentSummary.textContent =
    `${filtered.length} assignment${filtered.length !== 1 ? "s" : ""}`;

updateStats();


}

// =========================
// UPDATE STATS
// =========================

function updateStats() {


const total = assignments.length;

const completed =
    assignments.filter(a => a.completed).length;

const pending =
    assignments.filter(a => !a.completed).length;

const overdue =
    assignments.filter(a => getStatus(a) === "overdue").length;


totalCount.textContent = total;
pendingCount.textContent = pending;
completedCount.textContent = completed;
overdueCount.textContent = overdue;


const progress =
    total === 0 ? 0 : Math.round((completed / total) * 100);

progressFill.style.width = `${progress}%`;
progressText.textContent = `${progress}%`;


}

// =========================
// SUBJECT FILTER
// =========================

function updateSubjectFilter() {


const currentValue = subjectFilter.value;

const subjects = [
    ...new Set(assignments.map(a => a.subject))
].sort();

subjectFilter.innerHTML =
    `<option value="all">All Subjects</option>`;

subjects.forEach(subject => {

    const option = document.createElement("option");

    option.value = subject;
    option.textContent = subject;

    subjectFilter.appendChild(option);
});

if (subjects.includes(currentValue)) {
    subjectFilter.value = currentValue;
}
```

}

// =========================
// ADD ASSIGNMENT
// =========================

assignmentForm.addEventListener("submit", function(event) {

```
event.preventDefault();


const title =
    document.getElementById("title").value.trim();

const subject =
    document.getElementById("subject").value.trim();

const deadline =
    document.getElementById("deadline").value;

const description =
    document.getElementById("description").value.trim();


if (!title || !subject || !deadline) {
    showToast("Please fill in all required fields.");
    return;
}


const newAssignment = {

    id: Date.now(),

    title,

    subject,

    description,

    deadline: new Date(deadline).toISOString(),

    completed: false
};


assignments.push(newAssignment);

saveAssignments();

updateSubjectFilter();

renderAssignments();

closeModal();

assignmentForm.reset();

showToast("Assignment added successfully! 🎉");


};

// =========================
// COMPLETE
// =========================

function toggleComplete(id) {


const assignment =
    assignments.find(a => a.id === id);

if (!assignment) return;

assignment.completed = !assignment.completed;

saveAssignments();

renderAssignments();

showToast(
    assignment.completed
        ? "Assignment completed! 🎉"
        : "Assignment marked as pending."
);


}

// =========================
// DELETE
// =========================

function deleteAssignment(id) {

const confirmed =
    confirm("Are you sure you want to delete this assignment?");

if (!confirmed) return;

assignments =
    assignments.filter(a => a.id !== id);

saveAssignments();

updateSubjectFilter();

renderAssignments();

showToast("Assignment deleted.");


}

// =========================
// MODAL
// =========================

function openModal() {
modal.classList.add("show");


setTimeout(() => {
    document.getElementById("title").focus();
}, 100);


}

function closeModal() {
modal.classList.remove("show");
}

openModalBtn.addEventListener("click", openModal);
emptyAddBtn.addEventListener("click", openModal);

closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

modal.addEventListener("click", function(event) {


if (event.target === modal) {
    closeModal();
}

});

document.addEventListener("keydown", function(event) {


if (event.key === "Escape") {
    closeModal();
}

});

// =========================
// SEARCH / FILTERS
// =========================

searchInput.addEventListener("input", renderAssignments);

subjectFilter.addEventListener("change", renderAssignments);

statusFilter.addEventListener("change", renderAssignments);

// =========================
// SIDEBAR FILTERS
// =========================

document.querySelectorAll(".nav-item").forEach(button => {


button.addEventListener("click", function() {

    document.querySelectorAll(".nav-item")
        .forEach(item => item.classList.remove("active"));

    this.classList.add("active");

    const filter = this.dataset.filter;

    statusFilter.value = filter === "all" ? "all" : filter;

    renderAssignments();
});


});

// =========================
// TOAST
// =========================

function showToast(message) {

toast.textContent = message;

toast.classList.add("show");

setTimeout(() => {
    toast.classList.remove("show");
}, 2500);

}

// =========================
// SECURITY HELPER
// =========================

function escapeHTML(text) {

const div = document.createElement("div");

div.textContent = text;

return div.innerHTML;


}

// =========================
// INITIALIZE
// =========================

updateSubjectFilter();

renderAssignments();

// Refresh status every minute
setInterval(() => {
renderAssignments();
}, 60000);
