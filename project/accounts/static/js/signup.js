document.addEventListener('DOMContentLoaded', function() {
    const signup_form = document.getElementById('signup_form');
    const success_modal = document.getElementById('success_modal');
    const signup_form_url = signup_form.getAttribute('data-url');

    signup_form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(signup_form);
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

        fetch(signup_form_url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                signup_form.reset();
                success_modal.classList.remove('hidden')
            } else {
                alert(data.error);
            }
        });
    });
});