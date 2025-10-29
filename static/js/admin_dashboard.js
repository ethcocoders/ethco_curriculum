// ===================================
// ADMIN DASHBOARD JAVASCRIPT
// ===================================

// Initialize Sortable.js for drag-and-drop
function initializeSortable() {
    // Initialize module sorting
    const modulesList = document.getElementById('modulesList');
    if (modulesList) {
        Sortable.create(modulesList, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            handle: '.module-drag-handle',
            onEnd: function(evt) {
                reorderModules();
            }
        });
    }

    // Initialize submodule sorting for each module
    document.querySelectorAll('.submodules-list').forEach(submodulesList => {
        Sortable.create(submodulesList, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            handle: '.submodule-drag-handle',
            onEnd: function(evt) {
                const moduleId = submodulesList.dataset.moduleId;
                reorderSubmodules(moduleId);
            }
        });
    });

    // Initialize content items sorting for each submodule
    document.querySelectorAll('.content-items-list').forEach(contentList => {
        Sortable.create(contentList, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            handle: '.content-drag-handle',
            onEnd: function(evt) {
                const submoduleId = contentList.dataset.submoduleId;
                reorderContentItems(submoduleId);
            }
        });
    });
}

// ===================================
// MODULE OPERATIONS
// ===================================

// Create Module
document.getElementById('createModuleBtn')?.addEventListener('click', function() {
    const modal = new bootstrap.Modal(document.getElementById('createModuleModal'));
    modal.show();
});

document.getElementById('createModuleForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('moduleTitle').value;

    try {
        const response = await fetch('/admin/module/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: title })
        });

        const data = await response.json();
        if (data.status === 'success') {
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the module.');
    }
});

// Rename Module
function renameModule(moduleId) {
    const newTitle = prompt('Enter new module title:');
    if (newTitle && newTitle.trim()) {
        const formData = new FormData();
        formData.append('new_module_title', newTitle);

        fetch(`/admin/module/${moduleId}/rename`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while renaming the module.');
        });
    }
}

// Delete Module
function deleteModule(moduleId) {
    if (confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
        fetch(`/admin/module/${moduleId}/delete`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the module.');
        });
    }
}

// Duplicate Module
function duplicateModule(moduleId) {
    if (confirm('Duplicate this module?')) {
        fetch(`/admin/module/${moduleId}/duplicate`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while duplicating the module.');
        });
    }
}

// Toggle Publish Module
document.querySelectorAll('.btn-toggle-publish').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const moduleCard = this.closest('.module-card');
        const moduleId = moduleCard.dataset.moduleId;

        fetch(`/admin/module/${moduleId}/toggle-publish`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while toggling publish status.');
        });
    });
});

// Reorder Modules
function reorderModules() {
    const modulesList = document.getElementById('modulesList');
    const newOrder = Array.from(modulesList.querySelectorAll('.module-card')).map(card => card.dataset.moduleId);

    fetch('/admin/modules/reorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_order: newOrder })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status !== 'success') {
            alert('Error: ' + data.message);
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while reordering modules.');
        location.reload();
    });
}

// ===================================
// SUBMODULE OPERATIONS
// ===================================

// Create Submodule
document.querySelectorAll('.btn-create-submodule').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const moduleId = this.dataset.moduleId;
        document.getElementById('submoduleModuleId').value = moduleId;
        const modal = new bootstrap.Modal(document.getElementById('createSubmoduleModal'));
        modal.show();
    });
});

document.getElementById('createSubmoduleForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const moduleId = document.getElementById('submoduleModuleId').value;
    const title = document.getElementById('submoduleTitle').value;

    try {
        const response = await fetch('/admin/submodule/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ module_id: moduleId, title: title })
        });

        const data = await response.json();
        if (data.status === 'success') {
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the submodule.');
    }
});

// Rename Submodule
function renameSubmodule(submoduleId) {
    const newTitle = prompt('Enter new submodule title:');
    if (newTitle && newTitle.trim()) {
        const formData = new FormData();
        formData.append('new_submodule_title', newTitle);

        fetch(`/admin/submodule/${submoduleId}/rename`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while renaming the submodule.');
        });
    }
}

// Delete Submodule
function deleteSubmodule(submoduleId) {
    if (confirm('Are you sure you want to delete this submodule? This action cannot be undone.')) {
        fetch(`/admin/submodule/${submoduleId}/delete`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the submodule.');
        });
    }
}

// Duplicate Submodule
function duplicateSubmodule(submoduleId) {
    if (confirm('Duplicate this submodule?')) {
        fetch(`/admin/submodule/${submoduleId}/duplicate`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while duplicating the submodule.');
        });
    }
}

// Reorder Submodules
function reorderSubmodules(moduleId) {
    const submodulesList = document.querySelector(`.submodules-list[data-module-id="${moduleId}"]`);
    const newOrder = Array.from(submodulesList.querySelectorAll('.submodule-card')).map(card => card.dataset.submoduleId);

    fetch('/admin/submodules/reorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_order: newOrder, module_id: moduleId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status !== 'success') {
            alert('Error: ' + data.message);
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while reordering submodules.');
        location.reload();
    });
}

// ===================================
// CONTENT ITEM OPERATIONS
// ===================================

// Create Content Item
document.querySelectorAll('.btn-create-content').forEach(btn => {
    btn.addEventListener('click', async function(e) {
        e.preventDefault();
        const submoduleId = this.dataset.submoduleId;
        document.getElementById('contentSubmoduleId').value = submoduleId;

        // Load content types
        const contentTypeSelect = document.getElementById('contentType');
        contentTypeSelect.value = '';

        const modal = new bootstrap.Modal(document.getElementById('createContentModal'));
        modal.show();
    });
});

// Load content based on type
document.getElementById('contentType')?.addEventListener('change', async function() {
    const contentType = this.value;
    const contentIdSelect = document.getElementById('contentId');
    contentIdSelect.innerHTML = '<option value="">Loading...</option>';

    if (!contentType) {
        contentIdSelect.innerHTML = '<option value="">Select content...</option>';
        return;
    }

    try {
        const response = await fetch(`/admin/content/list/${contentType}`);
        const data = await response.json();

        contentIdSelect.innerHTML = '<option value="">Select content...</option>';
        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.title;
                contentIdSelect.appendChild(option);
            });
        } else {
            contentIdSelect.innerHTML = '<option value="">No ' + contentType + 's available</option>';
        }
    } catch (error) {
        console.error('Error:', error);
        contentIdSelect.innerHTML = '<option value="">Error loading content</option>';
    }
});

document.getElementById('createContentForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submoduleId = document.getElementById('contentSubmoduleId').value;
    const contentType = document.getElementById('contentType').value;
    const contentId = document.getElementById('contentId').value;

    try {
        const response = await fetch('/admin/item/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                submodule_id: submoduleId,
                content_type: contentType,
                content_id: contentId
            })
        });

        const data = await response.json();
        if (data.status === 'success') {
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the content item.');
    }
});

// Delete Content Item
function deleteContentItem(itemId) {
    if (confirm('Are you sure you want to delete this content item?')) {
        fetch(`/admin/item/${itemId}/delete`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the content item.');
        });
    }
}

// Reorder Content Items
function reorderContentItems(submoduleId) {
    const contentList = document.querySelector(`.content-items-list[data-submodule-id="${submoduleId}"]`);
    const newOrder = Array.from(contentList.querySelectorAll('.content-item')).map(item => item.dataset.itemId);

    fetch('/admin/items/reorder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_order: newOrder, parent_id: submoduleId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status !== 'success') {
            alert('Error: ' + data.message);
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while reordering content items.');
        location.reload();
    });
}

// ===================================
// EVENT LISTENERS FOR DELETE BUTTONS
// ===================================

document.querySelectorAll('.btn-delete-content').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const itemId = this.dataset.itemId;
        deleteContentItem(itemId);
    });
});

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSortable();
});
