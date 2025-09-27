// let x = 4;
// x += 2;
// console.log(x);

// let temp = 40;
// if (temp >= 30) {
//   console.log("Hot")
// }
// else if (temp>=29 && temp <= 20) {
//   console.log("warm");
// }
// else {
//   console.log("cold");
// }

// let age = 25;
// let agegap;
 
// switch (age){
//   case 12:
//   agegap = "young";
//   break;
//   case 25:
//   agegap = "teen";
//   break;
//   default:
//   agegap = "old";
// }

// console.log(agegap);

// for (let i = 0; i <= 10; i++) {
//     if (i % 2 === 0 ) {
//         console.log(i + " " + "is an even number");
//     }
// }

// let i = 10;
// let sum = 0;
// while (i > 1) {
//      i--;
//   sum += i;
// }
//   console.log(sum);

// let n = 5;
// let mult = 1;
// for (let i = 1; i <= 12; i++){
//     mult =  n*i;
// console.log(mult )
// }

// for (let i = 1; i <= 20; i++){
//     if (i === 15) break;
//     console.log(i);
// }

// for (let i = 1; i<= 20; i++){
//     if (i % 3 === 0 ) continue;
//     console.log(i);
// }
// let i = 10;
// do {
//       i--;
//     console.log(i);
// }
// while(i > 1)
//  let a = 5;
// function test(){
//  var globalVar = "hello";
//   console.log(globalVar);
// }
// test();
// console.log(globalVar);


// function test(x,y){
// return x*y;
// test(4,5);
// }

// let x = 6;  
// let a = 0, b = 1;
// let found = false;

// while (a <= x) {
//   if (a === x) {
//     found = true;
//     break;
//   }
//   let temp = a + b;
//   a = b;
//   b = temp;
// }

// if (found) {
//   console.log("YES");
// } else {
//   console.log("NO");
// }
  

/**
 * TaskFlow - Professional Todo List Application
 * A modern, feature-rich todo application built with vanilla JavaScript
 */

class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = {
            status: 'all',
            category: 'all',
            priority: 'all',
            search: ''
        };
        this.editingTaskId = null;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.loadTasks();
        this.loadTheme();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add task form
        document.getElementById('add-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Search functionality
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value;
            this.renderTasks();
        });

        // Filter toggle
        document.getElementById('filter-toggle').addEventListener('click', () => {
            this.toggleFilters();
        });

        // Filter controls
        document.getElementById('filter-status').addEventListener('change', (e) => {
            this.currentFilter.status = e.target.value;
            this.renderTasks();
        });

        document.getElementById('filter-category').addEventListener('change', (e) => {
            this.currentFilter.category = e.target.value;
            this.renderTasks();
        });

        document.getElementById('filter-priority').addEventListener('change', (e) => {
            this.currentFilter.priority = e.target.value;
            this.renderTasks();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.editingTaskId) {
                this.cancelEdit();
            }
        });
    }

    /**
     * Add a new task
     */
    addTask() {
        const taskInput = document.getElementById('task-input');
        const categorySelect = document.getElementById('task-category');
        const prioritySelect = document.getElementById('task-priority');

        const text = taskInput.value.trim();
        if (!text) return;

        const task = {
            id: this.generateId(),
            text: text,
            completed: false,
            category: categorySelect.value,
            priority: prioritySelect.value,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // Reset form
        taskInput.value = '';
        taskInput.focus();

        // Show success feedback
        this.showNotification('Task added successfully!', 'success');
    }

    /**
     * Toggle task completion status
     */
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;

        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        const message = task.completed ? 'Task completed!' : 'Task marked as active';
        this.showNotification(message, task.completed ? 'success' : 'info');
    }

    /**
     * Delete a task
     */
    deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        this.showNotification('Task deleted successfully!', 'success');
    }

    /**
     * Start editing a task
     */
    startEdit(taskId) {
        this.editingTaskId = taskId;
        this.renderTasks();
        
        // Focus on the edit input
        setTimeout(() => {
            const editInput = document.querySelector(`[data-edit-id="${taskId}"]`);
            if (editInput) {
                editInput.focus();
                editInput.select();
            }
        }, 100);
    }

    /**
     * Save task edit
     */
    saveEdit(taskId, newText) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task || !newText.trim()) return;

        task.text = newText.trim();
        this.editingTaskId = null;

        this.saveTasks();
        this.renderTasks();

        this.showNotification('Task updated successfully!', 'success');
    }

    /**
     * Cancel task edit
     */
    cancelEdit() {
        this.editingTaskId = null;
        this.renderTasks();
    }

    /**
     * Filter tasks based on current filters
     */
    getFilteredTasks() {
        return this.tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(this.currentFilter.search.toLowerCase());
            const matchesStatus = this.currentFilter.status === 'all' || 
                (this.currentFilter.status === 'active' && !task.completed) ||
                (this.currentFilter.status === 'completed' && task.completed);
            const matchesCategory = this.currentFilter.category === 'all' || task.category === this.currentFilter.category;
            const matchesPriority = this.currentFilter.priority === 'all' || task.priority === this.currentFilter.priority;
            
            return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
        });
    }

    /**
     * Render all tasks
     */
    renderTasks() {
        const container = document.getElementById('tasks-container');
        const emptyState = document.getElementById('empty-state');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            
            // Update empty state message based on filters
            const hasFilters = this.currentFilter.search || 
                this.currentFilter.status !== 'all' || 
                this.currentFilter.category !== 'all' || 
                this.currentFilter.priority !== 'all';
            
            const titleEl = document.getElementById('empty-state-title');
            const descEl = document.getElementById('empty-state-description');
            
            if (hasFilters) {
                titleEl.textContent = 'No matching tasks found';
                descEl.textContent = 'Try adjusting your search or filter criteria';
            } else {
                titleEl.textContent = 'No tasks yet';
                descEl.textContent = 'Add your first task to get started';
            }
        } else {
            emptyState.classList.add('hidden');
            container.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');
        }
    }

    /**
     * Render a single task
     */
    renderTask(task) {
        const isEditing = this.editingTaskId === task.id;
        const categoryColor = this.getCategoryColor(task.category);
        const priorityClass = `priority-${task.priority}`;
        const completedClass = task.completed ? 'task-completed' : '';

        return `
            <div class="task-item group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border transition-all duration-300 hover:shadow-md ${completedClass} ${priorityClass} ${
                task.completed 
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } animate-fade-in">
                <div class="flex items-start gap-3">
                    <button
                        onclick="todoApp.toggleTask('${task.id}')"
                        class="mt-0.5 transition-colors duration-200 ${
                            task.completed 
                                ? 'text-green-600 hover:text-green-700' 
                                : 'text-gray-400 hover:text-blue-600'
                        }"
                        aria-label="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}"
                    >
                        ${task.completed ? `
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        ` : `
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                            </svg>
                        `}
                    </button>
                    
                    <div class="flex-1 min-w-0">
                        ${isEditing ? `
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    value="${this.escapeHtml(task.text)}"
                                    data-edit-id="${task.id}"
                                    class="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onkeydown="if(event.key==='Enter') todoApp.saveEdit('${task.id}', this.value); if(event.key==='Escape') todoApp.cancelEdit();"
                                />
                                <button
                                    onclick="todoApp.saveEdit('${task.id}', document.querySelector('[data-edit-id=\\'${task.id}\\']').value)"
                                    class="p-2 text-green-600 hover:text-green-700 transition-colors duration-200"
                                    aria-label="Save changes"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </button>
                                <button
                                    onclick="todoApp.cancelEdit()"
                                    class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    aria-label="Cancel editing"
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>
                        ` : `
                            <div>
                                <div class="task-text text-gray-900 dark:text-white font-medium transition-all duration-200">
                                    ${this.escapeHtml(task.text)}
                                </div>
                                
                                <div class="flex items-center gap-3 mt-2">
                                    <div class="flex items-center gap-1">
                                        <div class="w-2 h-2 rounded-full ${categoryColor}"></div>
                                        <span class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                            ${task.category}
                                        </span>
                                    </div>
                                    
                                    <div class="text-xs px-2 py-1 rounded-full border ${this.getPriorityColor(task.priority)} bg-opacity-10">
                                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </div>
                                    
                                    <span class="text-xs text-gray-400 dark:text-gray-500">
                                        ${new Date(task.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        `}
                    </div>
                    
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        ${!task.completed && !isEditing ? `
                            <button
                                onclick="todoApp.startEdit('${task.id}')"
                                class="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                                aria-label="Edit task"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                        ` : ''}
                        <button
                            onclick="todoApp.deleteTask('${task.id}')"
                            class="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            aria-label="Delete task"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Update task statistics
     */
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const active = total - completed;

        document.getElementById('total-tasks').textContent = total;
        document.getElementById('active-tasks').textContent = active;
        document.getElementById('completed-tasks').textContent = completed;
    }

    /**
     * Toggle filters visibility
     */
    toggleFilters() {
        const filtersSection = document.getElementById('filters-section');
        filtersSection.classList.toggle('hidden');
        filtersSection.classList.toggle('grid');
    }

    /**
     * Toggle dark/light theme
     */
    toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('taskflow-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('taskflow-theme', 'dark');
        }
    }

    /**
     * Load theme from localStorage
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('taskflow-theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }

    /**
     * Save tasks to localStorage
     */
    saveTasks() {
        localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks));
    }

    /**
     * Load tasks from localStorage
     */
    loadTasks() {
        const savedTasks = localStorage.getItem('taskflow-tasks');
        if (savedTasks) {
            try {
                this.tasks = JSON.parse(savedTasks);
            } catch (error) {
                console.error('Error loading tasks:', error);
                this.tasks = [];
            }
        }
    }

    /**
     * Get category color class
     */
    getCategoryColor(category) {
        const colors = {
            personal: 'category-personal',
            work: 'category-work',
            school: 'category-school',
            shopping: 'category-shopping',
            health: 'category-health'
        };
        return colors[category] || 'bg-gray-500';
    }

    /**
     * Get priority color class
     */
    getPriorityColor(priority) {
        const colors = {
            low: 'text-gray-500 border-gray-300',
            medium: 'text-orange-500 border-orange-300',
            high: 'text-red-500 border-red-300'
        };
        return colors[priority] || 'text-gray-500 border-gray-300';
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TodoApp;
}