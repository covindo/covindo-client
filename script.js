const url = 'http://localhost:3000'

$(document).ready(() => {
  console.log('Hello World');

  if (localStorage.getItem('accessToken')) {
    dashboardPage();
  }

  $('#login-page').show();
  $('#register-page').hide();
  $('#dashboard-page').hide();
  $('#logout-btn').hide();

  $('#buttonForLogin').click(function (event) {
    event.preventDefault();
    $('#register-page').hide();
    $('#login-page').show();
  })
  $('#buttonForRegister').click(function (event) {
    event.preventDefault();
    $('#login-page').hide();
    $('#register-page').show();
  })

  $('#buttonRegister').click(function (event) {
    event.preventDefault();
    const email = $('#emailRegister').val();
    const password = $('#passwordRegister').val();
    const passwordConfirm = $('#passwordConfirmRegister').val();

    if (password === passwordConfirm) {
      $.ajax({
        method: 'POST',
        url: `${url}/register`,
        data: { email, password }
      })
        .done(response => {
          console.log(response);
          $('#login-page').show();
          $('#register-page').hide();
        })
        .fail(err => {
          const template = alertTemplate('error', err.responseJSON.message);
          $(template).appendTo('#alert');
        })
        .always(() => {
          $('#emailRegister').val('');
          $('#passwordRegister').val('');
          $('#passwordConfirmRegister').val('');
        })
    } else {
      const template = alertTemplate('error', 'Your password not match');
      $(template).appendTo('#alert');
      $('#passwordRegister').val('');
      $('#passwordConfirmRegister').val('');
    }
  });

  $('#buttonLogin').click(function (event) {
    event.preventDefault();
    const email = $('#emailLogin').val();
    const password = $('#passwordLogin').val();

    $.ajax({
      method: 'POST',
      url: `${url}/login`,
      data: { email, password }
    })
      .done(response => {
        console.log(response, 'RESPONSE CLIENT!!!!');
        // save token to localStorage
        // localStorage.setItem('access_token', response.access_token)
        localStorage.access_token = response.access_token;
        dashboardPage();
      })
      .fail(err => {
        console.log(err, 'ERROR CLIENT');
        const template = alertTemplate('error', err.responseJSON.message);
        $(template).appendTo('#alert');
      })
      .always(() => {
        console.log('ALWAYS');
        $('#emailLogin').val('');
        $('#passwordLogin').val('');
      })

  })

  $('#logout-btn').click(function () {
    localStorage.clear();
    $('#login-page').show();
    $('#register-page').hide();
    $('#dashboard-page').hide();
    $('#emailLogin').val('');
    $('#passwordLogin').val('');
    // Google SSO
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  })
  
});

function onSignIn(googleUser) {

  const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    method: 'POST',
    url: `${url}/googleLogin`,
    data: { id_token }
  })
    .done(response => {
      console.log(response.access_token);
      localStorage.setItem('access_token', response.access_token)
      dashboardPage();
    })
    .fail((xhr, status, error) => {
      console.log(xhr);
      console.log(status);
      const template = alertTemplate('error', status);
      $(template).appendTo('#alert');
    })

  // var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

const dashboardPage = () => {
  $(document).attr('title', 'Dashboard | Fancy Todo');
  $('#register-page').hide();
  $('#login-page').hide();
  $('#navbar').show();
  $('#dashboard-page').show();
  $('#news-page').hide();
  caseIndonesiaList();
  caseProvinceList();
  $('#logout-btn').show();
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
    .always(() => { });
}

const caseIndonesiaList = () =>{
  $.ajax({
    url: url + '/stats',
    method: 'GET',
    // headers: {
    //   authorization: `${localStorage.getItem('accessToken')}`,
    // },
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
}

const caseProvinceList = () => {
  $.ajax({
    url: url + '/stats/provinces',
    method: 'GET',
    // headers: {
    //   authorization: `${localStorage.getItem('accessToken')}`,
    // },
  })
    .done((response) => {
      $('#caseProvince').empty();
      response.map((data, index) => {
        console.log(data)
        $(`
            <tr>
              <th scope="row">${index+1}</th>
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
