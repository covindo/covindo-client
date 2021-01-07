$(document).ready(() => {
  console.log('Hello World');

  $('#buttonForRegister').click(function (event) {
    event.preventDefault()
    $('#login-page').hide();
  })
  if (localStorage.getItem('accessToken')) {
    dahsboardPage();
  }
});

const dashboardPage = () => {
  $(document).attr('title', 'Dashboard | Fancy Todo');
  $('#auth').hide();
  $('#navbar').show();
  $('#dashboard').show();
};

const alertTemplate = (type, message) => {
  if (type === 'error') {
    const template = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error!</strong> ${message}.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `;
    return template;
  } else if (type === 'success') {
    const template = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Success!</strong> ${message}.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `;
    return template;
  }
};
