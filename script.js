$(document).ready(() => {
  console.log('Hello World');

  $('#buttonForRegister').click(function (event) {
    event.preventDefault()
    $('#login-page').hide();
  })

});
