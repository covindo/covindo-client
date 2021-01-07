$(document).ready(() => {
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
