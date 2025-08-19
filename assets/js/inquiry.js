let currentStep = 1;
const totalSteps = 3;

        function updateStepIndicators() {
            for (let i = 1; i <= totalSteps; i++) {
                const indicator = document.getElementById(`step-${i}-indicator`);
                if (i < currentStep) {
                    indicator.className = 'step-indicator completed w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-semibold';
                    indicator.innerHTML = '✓';
                } else if (i === currentStep) {
                    indicator.className = 'step-indicator active w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center text-sm font-semibold';
                    indicator.innerHTML = i;
                } else {
                    indicator.className = 'step-indicator w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-semibold';
                    indicator.innerHTML = i;
                }
            }
        }

        function showStep(step) {
            // Hide all steps
            for (let i = 1; i <= totalSteps; i++) {
                document.getElementById(`step-${i}`).classList.remove('active');
            }
            // Show current step
            document.getElementById(`step-${step}`).classList.add('active');
            updateStepIndicators();
        }

        function nextStep() {
            if (validateCurrentStep()) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        }

        function prevStep() {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        }

        function validateCurrentStep() {
            if (currentStep === 1) {
                const requiredFields = ['business-name', 'industry', 'contact-name', 'phone', 'email', 'location'];
                for (let field of requiredFields) {
                    const element = document.getElementById(field);
                    if (!element.value.trim()) {
                        element.focus();
                        alert('Please fill in all required fields.');
                        return false;
                    }
                }
                
                // Validate email format
                const email = document.getElementById('email').value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    document.getElementById('email').focus();
                    alert('Please enter a valid email address.');
                    return false;
                }
                
                // Validate phone number (Nigerian format)
                const phone = document.getElementById('phone').value;
                const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
                if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                    document.getElementById('phone').focus();
                    alert('Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678).');
                    return false;
                }
                
            } else if (currentStep === 2) {
                const selectedServices = document.querySelectorAll('input[name="services"]:checked');
                const errorDiv = document.getElementById('service-error');
                
                if (selectedServices.length === 0) {
                    errorDiv.classList.remove('hidden');
                    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return false;
                } else {
                    errorDiv.classList.add('hidden');
                }
                
            } else if (currentStep === 3) {
                const requiredFields = ['project-description', 'timeline', 'budget', 'referral-source'];
                for (let field of requiredFields) {
                    const element = document.getElementById(field);
                    if (!element.value.trim()) {
                        element.focus();
                        alert('Please fill in all required fields.');
                        return false;
                    }
                }
            }
            return true;
        }

        function collectFormData() {
            const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
                .map(input => input.value);

            return {
                businessName: document.getElementById('business-name').value,
                industry: document.getElementById('industry').value,
                contactName: document.getElementById('contact-name').value,
                position: document.getElementById('position').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                location: document.getElementById('location').value,
                currentWebsite: document.getElementById('current-website').value,
                services: selectedServices,
                projectDescription: document.getElementById('project-description').value,
                timeline: document.getElementById('timeline').value,
                budget: document.getElementById('budget').value,
                additionalRequirements: document.getElementById('additional-requirements').value,
                referralSource: document.getElementById('referral-source').value,
                submittedAt: new Date().toISOString(),
                emailConfig: {
                    primaryEmail: 'info@lemmaiot.com.ng',
                    ccEmails: ['info.lemmaiot@gmail.com', 'lemmadm@gmail.com'],
                    subject: `New Service Request from ${document.getElementById('business-name').value}`
                }
            };
        }

        function showSuccessModal() {
            document.getElementById('success-modal').classList.remove('hidden');
            document.getElementById('success-modal').classList.add('flex');
        }

        function closeModal() {
            document.getElementById('success-modal').classList.add('hidden');
            document.getElementById('success-modal').classList.remove('flex');
        }

        // Form submission with debugging
        document.getElementById('service-request-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('🚀 Form submission started...');
            
            if (!validateCurrentStep()) {
                console.log('❌ Validation failed');
                return;
            }

            const formData = collectFormData();
            console.log('📋 Form data collected:', formData);
            
            const submitButton = document.querySelector('button[type="submit"]');
            
            // Show loading state
            submitButton.innerHTML = '⏳ Submitting...';
            submitButton.disabled = true;
            
            try {
                console.log('📡 Sending to webhook...');
                const response = await fetch('https://hook.eu2.make.com/nuimoexcsne7dr43p1xeorea4c1qf4oh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                console.log('📊 Response status:', response.status);
                console.log('📊 Response headers:', response.headers);
                
                const responseText = await response.text();
                console.log('📊 Response body:', responseText);
                
                if (response.ok) {
                    console.log('✅ Success! Showing modal...');
                    showSuccessModal();
                } else {
                    console.log('❌ Response not OK, status:', response.status);
                    throw new Error(`HTTP ${response.status}: ${responseText}`);
                }
            } catch (error) {
                console.error('💥 Error details:', error);
                alert(`There was an error submitting your request: ${error.message}\n\nPlease call us at +234 (0) 708 368 2007 or try again later.`);
            } finally {
                // Reset button
                submitButton.innerHTML = '🚀 Submit Request';
                submitButton.disabled = false;
            }
        });

        // Initialize the form
        updateStepIndicators();