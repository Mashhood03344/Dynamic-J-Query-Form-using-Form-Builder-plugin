jQuery(function ($) {
    var fbEditor = document.getElementById('build-wrap');
    var formBuilder = $(fbEditor).formBuilder();

    // Make buttons draggable
    $(".addFieldBtn").on('dragstart', function (event) {
        event.originalEvent.dataTransfer.setData("text", $(this).data("type"));
    });

    // Make build-wrap droppable to accept dragged buttons
    $("#build-wrap").on('dragover', function (event) {
        event.preventDefault();
    });

    $("#build-wrap").on('drop', function (event) {
        event.preventDefault();
        var type = event.originalEvent.dataTransfer.getData("text");
        var field;

        if (type === 'email' || type === 'password') {
            field = {
                type: 'text',
                label: type.charAt(0).toUpperCase() + type.slice(1) + ' Input',
                subtype: type,
                required: true // Adding required attribute for validation
            };
        } else if (type === 'radio') {
            field = {
                type: 'radio-group',
                label: 'Radio Group',
                values: ['Option 1', 'Option 2']
            };
        }

        // Add the field to the form
        formBuilder.actions.addField(field);

        // Attach custom validation after the field is added
        var addedField = formBuilder.actions.getData('json').pop();
        attachCustomValidation(addedField);
    });

    // Display the form data when the page loads (if available)
    displayFormData();

    $('#submitBtn').on('click', function () {
        // Get the form data in JSON format
        var formData = formBuilder.actions.getData('json');

        // Save the form data to local storage
        localStorage.setItem('formData', JSON.stringify(formData));

        // Display the user-provided values in the HTML
        displayFormData();

        // Display the form data in the console
        console.log(formData);
    });

    function attachCustomValidation(field) {
        // Attach custom validation for email and text fields
        if (field.subtype === 'email' || field.subtype === 'text') {
            var inputSelector = 'input[name="' + field.name + '"]';

            // Attach custom validation to the newly added field
            $(document).on('form-data-validate', function (event, formData) {
                var inputValue = formData[field.name];
                validateField(field, inputValue);
            });
        }
    }


    function validateField(field, value) {
        // Custom validation for email and text
        if (field.subtype === 'email' && !isValidEmail(value)) {
            alert('Invalid email format in ' + field.label);
        }

        if (field.subtype === 'text' && containsNumber(value)) {
            alert('Text field cannot contain a number in ' + field.label);
        }
    }

    function isValidEmail(email) {
        // Simple email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function containsNumber(value) {
        return /\d/.test(value);
    }

    function displayFormData() {
        // Retrieve the form data from local storage
        var storedData = localStorage.getItem('formData');

        // Check if storedData is not null, undefined, or 'undefined' before parsing
        if (storedData !== null && storedData !== undefined && storedData !== 'undefined') {
            // Parse the JSON data
            var parsedData = JSON.parse(storedData);

            // Display submitted data in HTML
            var submittedDataHTML = `<p>Submitted Data:</p>`;

            for (var i = 0; i < parsedData.length; i++) {
                if (parsedData[i].value) {
                    submittedDataHTML += '<p>' + parsedData[i].label + ': ' + parsedData[i].value + '</p>';
                }
            }

            // Append the HTML content to the submittedData div
            $('#submittedData').html(submittedDataHTML);
        }
    }
});