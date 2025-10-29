document.addEventListener('DOMContentLoaded', function() {
    const moduleList = document.getElementById('module-list'); // Target the new div container
    const saveOrderBtn = document.getElementById('saveOrderBtn');
    let initialOrder = [];

    if (moduleList) {
        // Capture initial order
        Array.from(moduleList.children).forEach(col => {
            const card = col.querySelector('.module-card');
            if (card) {
                initialOrder.push(col.dataset.id);
            }
        });

        // Check if Sortable library is loaded before instantiation
        if (typeof Sortable !== 'undefined') {
            const sortable = new Sortable(moduleList, {
                handle: '.handle', // Drag handle within the card
                animation: 150,
                ghostClass: 'sortable-ghost', // Class for the ghost element (defined in modern.css)
                onEnd: function (evt) {
                    const newOrder = Array.from(moduleList.children).map(col => col.dataset.id);
                    // Only show save button if order has actually changed
                    if (JSON.stringify(initialOrder) !== JSON.stringify(newOrder)) {
                        saveOrderBtn.style.display = 'block';
                    } else {
                        saveOrderBtn.style.display = 'none';
                    }
                },
            });
        } else {
            console.error("Sortable library not found. Drag-and-drop functionality will not work.");
        }

        saveOrderBtn.addEventListener('click', function() {
            const newOrder = Array.from(moduleList.children).map(col => col.dataset.id);
            
            fetch('/admin/modules/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_order: newOrder }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Module order updated successfully!');
                    initialOrder = newOrder; // Update initial order after successful save
                    saveOrderBtn.style.display = 'none'; // Hide button after saving
                    window.location.reload(); 
                } else {
                    alert('Error updating module order: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving the order.');
            });
        });
    }
});
