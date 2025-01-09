document.getElementById('numberForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const N = parseInt(document.getElementById('numberInput').value);
    const outputDiv = document.getElementById('output');
    const form = document.getElementById('numberForm');
    form.style.display = 'none';
    outputDiv.innerHTML = ''; 
    let count = 0;
     function makeRequest() {
        if (count < N) {
            fetch('https://api.prod.jcloudify.com/whoami')
                .then(response => {
                    if (response.status === 403) {
                        outputDiv.innerHTML += `${count + 1}. Forbidden<br>`;
                        count++;
                        setTimeout(makeRequest, 1000);
                    } else if (response.status === 405) {
                        outputDiv.innerHTML += `${count + 1}. Method Not Allowed - Captcha Required<br>`;
                        const captchaContainer = document.getElementById('captchaContainer');
                        captchaContainer.style.display = 'block';
                        showMyCaptcha();
                    } 
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
     makeRequest();
});

function showMyCaptcha() {
    var container = document.querySelector("#my-captcha-container");
    
    AwsWafCaptcha.renderCaptcha(container, {
        apiKey: window.AWS_WAF_API_KEY,
        onSuccess: captchaExampleSuccessFunction,
        onError: captchaExampleErrorFunction,
    });
}

function captchaExampleSuccessFunction(wafToken) {
    const captchaContainer = document.getElementById('captchaContainer');
    captchaContainer.style.display = 'none';
    setTimeout(makeRequest, 1000);
}

function captchaExampleErrorFunction(error) {
    console.error('Captcha Error:', error);
}