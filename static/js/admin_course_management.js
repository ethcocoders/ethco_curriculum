document.addEventListener('DOMContentLoaded', function() {
    // Function to handle module renaming
    window.renameModule = function(moduleId) {
        const newTitle = prompt('Enter the new title for the module:');
        if (newTitle === null || newTitle.trim() === '') {
            alert('Module title cannot be empty.');
            return;
        }
        fetch(`/admin/module/${moduleId}/rename`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Module renamed successfully!');
                window.location.reload();
            } else {
                alert('Error renaming module: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while renaming the module.');
        });
    };

    // Function to handle module duplication
    window.duplicateModule = function(moduleId) {
        if (!confirm('Are you sure you want to duplicate this module?')) {
            return;
        }
        fetch(`/admin/module/${moduleId}/duplicate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Module duplicated successfully!');
                window.location.reload();
            } else {
                alert('Error duplicating module: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while duplicating the module.');
        });
    };

    // Function to handle module deletion
    window.deleteModule = function(moduleId) {
        if (!confirm('Are you sure you want to delete this module and all its contents? This action cannot be undone.')) {
            return;
        }
        fetch(`/admin/module/${moduleId}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Module deleted successfully!');
                window.location.reload();
            } else {
                alert('Error deleting module: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the module.');
        });
    };

    // Function to handle submodule renaming
    window.renameSubmodule = function(submoduleId) {
        const newTitle = prompt('Enter the new title for the submodule:');
        if (newTitle === null || newTitle.trim() === '') {
            alert('Submodule title cannot be empty.');
            return;
        }
        fetch(`/admin/submodule/${submoduleId}/rename`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Submodule renamed successfully!');
                window.location.reload();
            } else {
                alert('Error renaming submodule: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while renaming the submodule.');
        });
    };

    // Function to handle submodule duplication
    window.duplicateSubmodule = function(submoduleId) {
        if (!confirm('Are you sure you want to duplicate this submodule?')) {
            return;
        }
        fetch(`/admin/submodule/${submoduleId}/duplicate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Submodule duplicated successfully!');
                window.location.reload();
            } else {
                alert('Error duplicating submodule: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while duplicating the submodule.');
        });
    };

    // Function to handle submodule deletion
    window.deleteSubmodule = function(submoduleId) {
        if (!confirm('Are you sure you want to delete this submodule and all its contents? This action cannot be undone.')) {
            return;
        }
        fetch(`/admin/submodule/${submoduleId}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Submodule deleted successfully!');
                window.location.reload();
            } else {
                alert('Error deleting submodule: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the submodule.');
        });
    };

    // Function to handle content item deletion
    window.deleteContentItem = function(itemId) {
        if (!confirm('Are you sure you want to delete this content item? This action cannot be undone.')) {
            return;
        }
        fetch(`/admin/module_item/${itemId}/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Content item deleted successfully!');
                window.location.reload();
            } else {
                alert('Error deleting content item: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the content item.');
        });
    };

    // Toggle Publish/Unpublish functionality
    window.togglePublish = function(button) {
        const entityType = button.dataset.entityType;
        const entityId = button.dataset.entityId;
        const isPublished = button.dataset.isPublished === 'true';
        const action = isPublished ? 'unpublish' : 'publish';

        if (!confirm(`Are you sure you want to ${action} this ${entityType}?`)) {
            return;
        }

        fetch(`/api/toggle_publish/${entityType}/${entityId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${action}ed successfully!`);
                window.location.reload();
            } else {
                alert(`Error ${action}ing ${entityType}: ` + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`An error occurred while ${action}ing the ${entityType}.`);
        });
    };

    // Handle collapse icon rotation for modules
    document.querySelectorAll('.module-collapse-btn').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const targetId = this.getAttribute('data-bs-target');
            const targetCollapse = document.querySelector(targetId);

            // Toggle the icon class based on the collapse state
            // Bootstrap 5 uses 'show' class for expanded state
            if (targetCollapse.classList.contains('show')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });

    // Handle collapse icon rotation for submodules
    document.querySelectorAll('.submodule-collapse-btn').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const targetId = this.getAttribute('data-bs-target');
            const targetCollapse = document.querySelector(targetId);

            if (targetCollapse.classList.contains('show')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });
});
