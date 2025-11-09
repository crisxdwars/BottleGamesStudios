const positionSelect = document.getElementById('position');
        const paymentGroup = document.getElementById('paymentGroup');
        const unpaidGroup = document.getElementById('unpaidGroup');
        const form = document.getElementById('applicationForm');

        positionSelect.addEventListener('change', function() {
            if (this.value === 'admin') {
                paymentGroup.classList.add('hidden');
                unpaidGroup.classList.remove('hidden');
                
                document.querySelectorAll('input[name="sharePayment"]').forEach(radio => {
                    radio.checked = false;
                    radio.removeAttribute('required');
                });
                
                document.querySelectorAll('input[name="unpaidWork"]').forEach(radio => {
                    radio.setAttribute('required', 'required');
                });
            } else if (this.value !== '') {
                paymentGroup.classList.remove('hidden');
                unpaidGroup.classList.add('hidden');
                
                document.querySelectorAll('input[name="unpaidWork"]').forEach(radio => {
                    radio.checked = false;
                    radio.removeAttribute('required');
                });
                
                document.querySelectorAll('input[name="sharePayment"]').forEach(radio => {
                    radio.setAttribute('required', 'required');
                });
            }
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('age').value);
            if (age < 13) {
                alert('You must be at least 13 years old to apply.');
                return;
            }
            
            const requiredFields = form.querySelectorAll('[required]');
            let allValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value && field.type !== 'radio') {
                    allValid = false;
                    field.style.borderColor = '#dc2626';
                } else {
                    field.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                }
            });
            
            const position = positionSelect.value;
            let radioValid = true;
            
            if (position === 'admin') {
                const unpaidWork = document.querySelector('input[name="unpaidWork"]:checked');
                if (!unpaidWork) radioValid = false;
            } else if (position !== '') {
                const sharePayment = document.querySelector('input[name="sharePayment"]:checked');
                if (!sharePayment) radioValid = false;
            }
            
            const teamWork = document.querySelector('input[name="teamWork"]:checked');
            if (!teamWork) radioValid = false;
            
            if (allValid && radioValid) {
                alert('Thank you for your application! We will review it carefully and get back to you within 3-5 business days via email or Discord.');
                form.reset();
                paymentGroup.classList.remove('hidden');
                unpaidGroup.classList.add('hidden');
            } else {
                alert('Please fill out all required fields correctly.');
            }
        });

        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.style.borderColor = 'rgba(220, 38, 38, 0.3)';
            });
        });