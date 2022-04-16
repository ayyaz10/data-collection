// const form = document.querySelector('.form');
const form = document.forms[0];
let code;
function buildJsonFormData() {
  // const numberInput = document.querySelector('.form-input-number').value;
  const formData = new FormData(form);
  // formData.append('number', `${code}${numberInput}`)
  const jsonFormData = {};
  for(const pair of formData) {
      jsonFormData[pair[0]] = pair[1]
  }
  return jsonFormData;
}

function resetForm() {
  const formInput = document.querySelectorAll('.form-input');
  formInput.forEach(input => {
    input.value = "";
  })
  setDialCode();
}


const modalBg = document.querySelector('.modal-bg')
function openModal() {
  modalBg.classList.add('bg-active');
}

const modalClose = document.querySelectorAll('.custom-modal-close');
 function closeModal() {
  modalBg.classList.remove('bg-active')
}

const submitBtn = document.querySelector('.form-submit-btn');
function disableBtn() {
  submitBtn.classList.add('disable-btn');
  submitBtn.disabled = true;
}

function enableBtn() {
  submitBtn.classList.remove('disable-btn');
  submitBtn.disabled = false;
}

function addResponseToModal(isSuccess) {
  const modalText = document.querySelector('.custom-modal-body-text');
  if(isSuccess) {
    modalText.innerHTML = 'Thank you for filling out the form.';
    enableBtn();
  } else {
    modalText.innerHTML = 'Something went wrong. Please try again.';
    enableBtn();
  }
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  disableBtn();
  let regex = /^[\d,\s,\+,\-]{5,20}/;
  const numberInput = document.querySelector('.form-input-number');
  if(!numberInput.value.match(regex)) {
      alert("Please write valid Phone Number");
      enableBtn();
  } else {
    const jsonFormData = buildJsonFormData();
    // https://nodejs-server-api1.herokuapp.com
      fetch('https://datapackage-1.herokuapp.com/userdata', {
        method: "post",
        // mode: 'cors',
        // credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonFormData)
      })
      .then((res) => {
        return res.json();
      })
      .then(data => {
          resetForm();
          openModal();
          addResponseToModal(data.isSuccess);
      })
  } 
 
})



async function setDialCode() {
    const apiKey = '9e561ac44bb67e58b5382b1ca6a9eb7cc51652aaca39f430509c2549';
    const request = await fetch(`https://api.ipdata.co?api-key=${apiKey}`, {
      method: "get",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const response = await request.json();
    if(response) {
      const dialInput = document.querySelector('.form-input-number');
      dialInput.value = `+${response.calling_code}`;
    }

}
setDialCode()

modalClose.forEach(each => {
  each.addEventListener('click', closeModal);
})






