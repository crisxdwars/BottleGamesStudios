document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('applicationForm');

    const DISCORD_WEBHOOK_URL = 'DC_WEBHOOK';

    const getRadioValue = (name) => {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : null;
    };

    const showStatus = (message, isError = false) => {
        let statusDiv = document.getElementById('formStatus');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'formStatus';
            statusDiv.style.marginTop = '20px';
            statusDiv.style.padding = '15px';
            statusDiv.style.textAlign = 'center';
            statusDiv.style.borderRadius = '5px';
            form.parentNode.insertBefore(statusDiv, form.nextSibling);
        }
        
        statusDiv.textContent = message;
        if (isError) {
            statusDiv.style.backgroundColor = '#6e0000';
            statusDiv.style.color = '#ffcccc';
        } else {
            statusDiv.style.backgroundColor = '#004d00';
            statusDiv.style.color = '#ccffcc';
        }
    };

    const createDiscordEmbed = (formData) => {
        const positionNames = {
            'developer': 'UI/UX Designer',
            'builder': 'Builder',
            'designer': 'Scripter',
            'admin': 'Moderator'
        };

        const experienceNames = {
            'beginner': 'Beginner (Less than 1 year)',
            'intermediate': 'Intermediate (1-2 years)',
            'advanced': 'Advanced (3-4 years)',
            'expert': 'Expert (5+ years)'
        };

        let paymentInfo = '';
        if (formData.position === 'admin') {
            paymentInfo = formData.unpaidWork === 'yes' ? '✅ Accepts unpaid (volunteer)' : '❌ Does not accept unpaid';
        } else {
            paymentInfo = formData.sharePayment === 'yes' ? '✅ Accepts 2% revenue share' : '❌ Does not accept 2% share';
        }

        const embed = {
            title: '📋 New Application Received',
            color: 14423100, 
            timestamp: new Date().toISOString(),
            fields: [
                {
                    name: '👤 Personal Information',
                    value: `**Nickname:** ${formData.nickname}\n**Roblox:** ${formData.robloxUsername}\n**Discord:** ${formData.discord}\n**Age:** ${formData.age}\n**Country:** ${formData.country}`,
                    inline: false
                },
                {
                    name: '💼 Position Details',
                    value: `**Position:** ${positionNames[formData.position] || formData.position}\n**Experience:** ${experienceNames[formData.experience] || formData.experience}`,
                    inline: false
                },
                {
                    name: '💰 Payment Preference',
                    value: paymentInfo,
                    inline: false
                },
                {
                    name: '📚 Previous Experience',
                    value: formData.historyWork === 'yes' ? '✅ Has been Dev/Mod before' : '❌ No previous Dev/Mod experience',
                    inline: false
                },
                {
                    name: '🔗 Portfolio',
                    value: formData.portfolio,
                    inline: false
                },
                {
                    name: '💭 Motivation',
                    value: formData.motivation.length > 1024 ? formData.motivation.substring(0, 1021) + '...' : formData.motivation,
                    inline: false
                },
                {
                    name: '🛠️ Skills',
                    value: formData.skills.length > 1024 ? formData.skills.substring(0, 1021) + '...' : formData.skills,
                    inline: false
                }
            ],
            footer: {
                text: 'BGS Application System'
            }
        };

        return {
            username: 'BGS Applications',
            embeds: [embed]
        };
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            nickname: document.getElementById('nickname').value,
            robloxUsername: document.getElementById('robloxUsername').value,
            discord: document.getElementById('discord').value,
            age: document.getElementById('age').value,
            country: document.getElementById('country').value,
            position: document.getElementById('position').value,
            experience: document.getElementById('experience').value,
            portfolio: document.getElementById('portfolio').value,
            motivation: document.getElementById('motivation').value,
            skills: document.getElementById('skills').value,
            historyWork: getRadioValue('historyWork'),
            sharePayment: getRadioValue('sharePayment'),
            unpaidWork: getRadioValue('unpaidWork')
        };

        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        showStatus('Submitting application...');

        try {
            const discordPayload = createDiscordEmbed(formData);

            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(discordPayload)
            });

            if (response.ok || response.status === 204) {
                showStatus('Application submitted successfully! Thank you for applying.', false);
                form.reset(); 
            } else {
                const errorText = await response.text();
                console.error('Discord webhook error:', errorText);
                showStatus('Submission failed. Please try again or contact support.', true);
            }
        } catch (error) {
            console.error('Network Error:', error);
            showStatus('A network error occurred. Please check your connection and try again.', true);
        } finally {
            submitBtn.disabled = false;
        }
    });

    const positionSelect = document.getElementById('position');
    const paymentGroup = document.getElementById('paymentGroup');
    const unpaidGroup = document.getElementById('unpaidGroup');

    const togglePaymentFields = () => {
        if (positionSelect.value === 'admin') {
            paymentGroup.classList.add('hidden');
            unpaidGroup.classList.remove('hidden');
            document.getElementById('shareYes').checked = false;
            document.getElementById('shareNo').checked = false;
            document.getElementById('unpaidYes').required = true;
            document.getElementById('unpaidNo').required = true;
            document.getElementById('shareYes').required = false;
            document.getElementById('shareNo').required = false;
        } else if (positionSelect.value) {
            paymentGroup.classList.remove('hidden');
            unpaidGroup.classList.add('hidden');
            document.getElementById('unpaidYes').checked = false;
            document.getElementById('unpaidNo').checked = false;
            document.getElementById('shareYes').required = true;
            document.getElementById('shareNo').required = true;
            document.getElementById('unpaidYes').required = false;
            document.getElementById('unpaidNo').required = false;
        } else {
            paymentGroup.classList.remove('hidden');
            unpaidGroup.classList.add('hidden');
        }
    };

    togglePaymentFields();
    positionSelect.addEventListener('change', togglePaymentFields);
});

