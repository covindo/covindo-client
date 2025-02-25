const url = 'https://protected-crag-74313.herokuapp.com';

$(document).ready(() => {
  loginPage();
});

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: 'POST',
    url: `${url}/googleLogin`,
    data: { id_token },
  })
    .done((response) => {
      localStorage.setItem('access_token', response.access_token);
      dashboardPage();
    })
    .fail((xhr, status, error) => {
      const template = alertTemplate('error', status);
      $(template).appendTo('#alert');
    });
}

const loginPage = () => {
  if (localStorage.getItem('accessToken')) {
    dashboardPage();
  } else {
    $(document).attr('title', 'Login');
    $('#login-page').show();
    $('#register-page').hide();
    $('#dashboard-page').hide();
    $('#logout-btn').hide();
    $('#navbar').hide();
    $('#news-page').hide();
    $('#hoaxes-page').hide();
    $('#hospitals-page').hide();
  }
};

const goToRegister = () => {
  $(document).attr('title', 'Register');
  $('#register-page').show();
  $('#login-page').hide();
};

const goToLogin = () => {
  $(document).attr('title', 'Login');
  $('#register-page').hide();
  $('#login-page').show();
};

const login = (e) => {
  e.preventDefault();
  const email = $('#emailLogin').val();
  const password = $('#passwordLogin').val();

  $.ajax({
    method: 'POST',
    url: `${url}/login`,
    data: { email, password },
  })
    .done((response) => {
      localStorage.access_token = response.access_token;
      dashboardPage();
    })
    .fail((err) => {
      const template = alertTemplate('error', err.responseJSON.message);
      $(template).appendTo('#alert');
    })
    .always(() => {
      $('#emailLogin').val('');
      $('#passwordLogin').val('');
    });
};

const register = (e) => {
  e.preventDefault();
  const email = $('#emailRegister').val();
  const password = $('#passwordRegister').val();
  const passwordConfirm = $('#passwordConfirmRegister').val();

  if (password === passwordConfirm) {
    $.ajax({
      method: 'POST',
      url: `${url}/register`,
      data: { email, password },
    })
      .done((response) => {
        $('#login-page').show();
        $('#register-page').hide();
      })
      .fail((err) => {
        const template = alertTemplate('error', err.responseJSON.message);
        $(template).appendTo('#alert');
      })
      .always(() => {
        $('#emailRegister').val('');
        $('#passwordRegister').val('');
        $('#passwordConfirmRegister').val('');
      });
  } else {
    const template = alertTemplate('error', 'Your password not match');
    $(template).appendTo('#alert');
    $('#passwordRegister').val('');
    $('#passwordConfirmRegister').val('');
  }
};

const logout = () => {
  localStorage.clear();
  loginPage();
  $('#emailLogin').val('');
  $('#passwordLogin').val('');

  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {});
};

const dashboardPage = () => {
  $(document).attr('title', 'Dashboard | Statistik');
  $('#login-page').hide();
  $('#register-page').hide();
  $('#navbar').show();
  $('#dashboard-page').show();
  $('#news-page').hide();
  $('#hoaxes-page').hide();
  $('#hospitals-page').hide();
  caseIndonesiaList();
  caseProvinceList();
  $('#logout-btn').show();
};

const newsPage = () => {
  $(document).attr('title', 'Dashboard | Berita');
  $('#register-page').hide();
  $('#login-page').hide();
  $('#navbar').show();
  $('#dashboard-page').hide();
  $('#news-page').show();
  $('#hoaxes-page').hide();
  $('#hospitals-page').hide();

  newsList();
};

const hoaxesPage = () => {
  $(document).attr('title', 'Dashboard | Hoax');
  $('#register-page').hide();
  $('#login-page').hide();
  $('#navbar').show();
  $('#dashboard-page').hide();
  $('#news-page').hide();
  $('#hoaxes-page').show();
  $('#hospitals-page').hide();

  hoaxesList();
};

const hospitalsPage = () => {
  $(document).attr('title', 'Dashboard | Hospitals');
  $('#register-page').hide();
  $('#login-page').hide();
  $('#navbar').show();
  $('#dashboard-page').hide();
  $('#news-page').hide();
  $('#hoaxes-page').hide();
  $('#hospitals-page').show();

  hospitalsList();
};

const newsList = () => {
  $.ajax({
    url: url + '/news',
    method: 'GET',
    headers: {
      access_token: `${localStorage.getItem('access_token')}`,
    },
  })
    .done((response) => {
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
};

const hoaxesList = () => {
  $.ajax({
    url: url + '/hoaxes',
    method: 'GET',
    headers: {
      access_token: `${localStorage.getItem('access_token')}`,
    },
  })
    .done((response) => {
      $('#hoaxesList').empty();
      response.map((data) => {
        $(`
        <div class="card w-75 mb-5">
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text"><a href="${data.url}" target="_blank">${
          data.url
        }</a></p>
            <p>${moment(data.timestamp).format('DD MMMM YYYY')}</p>
            <a href="${
              data.url
            }" target="_blank" class="btn btn-primary float-right">Baca selengkapnya</a>
          </div>
        </div>
        `).appendTo('#hoaxesList');
      });
    })
    .fail((err) => {
      err.responseJSON.map((e) => {
        const template = alertTemplate('error', e.message);
        $(template).appendTo('#alert');
      });
    })
    .always(() => {});
};

const hospitalsList = () => {
  $.ajax({
    url: url + '/hospitals',
    method: 'GET',
    headers: {
      access_token: `${localStorage.getItem('access_token')}`,
    },
  })
    .done((response) => {
      $('#hospitalsList').empty();
      response.map((data) => {
        $(`
        <div class="card w-75 mb-5">
          <div class="card-body">
          <i class="fas fa-hospital"></i><h5 class="card-title">${
            data.name
          }</h5>
            ${
              data.phone === null
                ? ''
                : "<p><i class='fa fa-phone'></i> " + data.phone + '</p>'
            }
            <p class="card-text"><i class="fa fa-map-marker"></i> ${
              data.address
            }</p>
          </div>
        </div>
        `).appendTo('#hospitalsList');
      });
    })
    .fail((err) => {
      err.responseJSON.map((e) => {
        const template = alertTemplate('error', e.message);
        $(template).appendTo('#alert');
      });
    })
    .always(() => {});
};

const caseIndonesiaList = () => {
  $.ajax({
    url: url + '/stats',
    method: 'GET',
    headers: {
      access_token: `${localStorage.getItem('access_token')}`,
    },
  })
    .done((response) => {
      $('#caseIndonesia').empty();
      response.map((data, index) => {
        $(`
          <div class="col">
          <div class="card text-white bg-warning mb-3" style="max-width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">Positif</h5>
              <hr />
              <p class="card-text"><h3 style="display:inline">${data.positif}</h3> <span>orang</span></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card text-white bg-success mb-3" style="max-width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">Sembuh</h5>
              <hr />
              <p class="card-text"><h3 style="display:inline">${data.sembuh}</h3> <span>orang</span></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card text-white bg-danger mb-3" style="max-width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">Meninggal</h5>
              <hr />
              <p class="card-text"><h3 style="display:inline">${data.meninggal}</h3> <span>orang</span></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card text-white bg-info mb-3" style="max-width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">Dirawat</h5>
              <hr />
              <p class="card-text"><h3 style="display:inline">${data.dirawat}</h3> <span>orang</span></p>
            </div>
          </div>
        </div>
        `).appendTo('#caseIndonesia');
      });
    })
    .fail((err) => {
      err.responseJSON.map((e) => {
        const template = alertTemplate('error', e.message);
        $(template).appendTo('#alert');
      });
    })
    .always(() => {});
};

const caseProvinceList = () => {
  $.ajax({
    url: url + '/stats/provinces',
    method: 'GET',
    headers: {
      access_token: `${localStorage.getItem('access_token')}`,
    },
  })
    .done((response) => {
      $('#caseProvince').empty();
      response.map((data, index) => {
        $(`
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${data.attributes.Provinsi}</td>
              <td>${data.attributes.Kasus_Posi.toLocaleString()}</td>
              <td>${data.attributes.Kasus_Semb.toLocaleString()}</td>
              <td>${data.attributes.Kasus_Meni.toLocaleString()}</td>
            </tr>
        `).appendTo('#caseProvince');
      });
    })
    .fail((err) => {
      err.responseJSON.map((e) => {
        const template = alertTemplate('error', e.message);
        $(template).appendTo('#alert');
      });
    })
    .always(() => {});
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
