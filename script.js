const url = 'http://localhost:3000'

$(document).ready(() => {
  console.log('Hello World');

  $('#buttonForRegister').click(function (event) {
    event.preventDefault()
    $('#login-page').hide();
  })
  if (localStorage.getItem('accessToken')) {
    dashboardPage();
  }
});

const dashboardPage = () => {
  $(document).attr('title', 'Dashboard | Fancy Todo');
  $('#auth').hide();
  $('#navbar').show();
  $('#dashboard-page').show();
};

const newsPage = () => {
  $(document).attr('title', 'Dashboard | Fancy Todo');
  $('#register-page').hide();
  $('#login-page').hide();
  $('#navbar').show();
  $('#dashboard-page').hide();
  $('#news-page').show();

  newsList()
}

const newsList = () => {
  $.ajax({
    url: url + '/news',
    method: 'GET',
    // headers: {
    //   authorization: `${localStorage.getItem('accessToken')}`,
    // },
  })
    .done((response) => {
      console.log()
      $('#newsList').empty();
      response.articles.map((data) => {
        $(`
        <div class="card w-75 mb-5">
          <img class="card-img-top" src="${data.urlToImage}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.description}</p>
            <a href="${data.url}" target="_blank" class="btn btn-primary float-right">Baca selengkapnya</a>
          </div>
        </div>
        `).appendTo('#newsList');
      });
    })
    .fail((err) => {
      err.responseJSON.map((e) => {
        const template = alertTemplate('error', e.message);
        $(template).appendTo('#alert');
      });
    })
    .always(() => {});
}

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
