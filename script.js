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
