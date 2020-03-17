data_map = [
  'first_name', 'last_name', 'phone_number', 'email', 'screen_name',
  'license_number', 'brokerage_name', 'city', 'state', 'zipcode', 'buyer_rebate', 'listing_fee',
  'provide_cma', 'about_me', 'type_of_listing_service'
];


function get_profile(callback) {
  call_api(callback, 'agent-profile/');
}

function get_combo(callback, end_point) {
  call_api(callback, end_point + '/');
}


function display_profile(profile) {
  //console.log(profile);
  $('#first_name').val(profile.first_name);
  $('#last_name').val(profile.last_name);
  $('#phone_number').val(profile.phone_number);
  $('#email').val(profile.email);
  $('#screen_name').val(profile.screen_name);
  $('#profile_slug').text(profile.screen_name);
  $('#license_number').val(profile.license_number);
  $('#brokerage_name').val(profile.brokerage_name);
  $('#brokerage_address').val(profile.brokerage_address);
  $('#city').val(profile.city);
  $('#state').val(profile.state);
  $('#zipcode').val(profile.zipcode);

  $('#buyer_rebate').val(profile.buyer_rebate);
  $('#listing_fee').val(profile.listing_fee);
  $('#type_of_listing_service').val(profile.type_of_listing_service);

  $('#provide_cma').prop('checked', profile.provide_cma);
  $('#about_me').val(profile.about_me);

  if(profile.picture != '' && profile.picture !== null ) {
    console.log(profile.picture);
    // debugger;
    $('#profile-img').prop('src', profile.picture);
  }else{

    src="img/blank-profile-picture.png"
    $('#profile-img').prop('src', src);
    console.log("src" ,src)
  }

  if (profile.connector != '' && profile.connector !== null) {
    console.log(profile.connector);
    $('#agent-connector').html(`
      <a target='_blank' href='/page-three.html?agent_id=` + profile.connector.id + `'>` + profile.connector.agent_name + `</a> |
      <a id='connector-remove'
        data-id='` + profile.connector.id +`'  href=''
        onclick='return false;'>Remove</a>
    `);
  } else {
    $('#agent-connector').html(`
      <a href='/connect-profile.html' target='_blank'>Add new connection</a>
    `);
  }

  // console.log(profile.language_fluencies);
  get_languages();
  $.each(profile.language_fluencies, function(k, lang_id) {
    $('#lang-' + lang_id).prop('checked', true);
  });

  $.each(profile.specialty, function(k, specialty_id) {
    $('#specialty-'+specialty_id).prop('checked', true);
  });
}

function phonenumber_validate(inputtxt) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if(inputtxt.match(phoneno)) {
    return true;
  }
  else {
    return false;
  }
}

function update_profile() {
  var data = {};
  var valid = true;
  var validation_messages = 'Please check the following error(s)!<br><br>';

  $.each(data_map, function(k, val) {
    data[val] = $('#'+val).val();
  });

  if (phonenumber_validate($('#phone_number').val()) === false) {
    validation_messages += 'Invalid phone number. <br>';
    valid = false;
  }

  if (valid === false) {
    $('#validate-message').css('display', 'block');
    $('#validate-message').html(validation_messages);
    return false
  }



  // fluent languages
  data['language_fluencies'] = $('.lng-checkbox:checked').map(
    function() { return $(this).val() }
  ).get();

  data['specialties'] = $('.specialty-checkbox:checked').map(
    function() { return $(this).val() }
  ).get();

  var picture_data = $('#picture')[0].files[0]
  var reader = new FileReader();
  var picture_base64 = '';

  if (picture_data != null) {
    reader.readAsDataURL(picture_data);
    reader.onload = function () {
      console.log(reader.result);
      picture_base64 = reader.result;
      data['picture'] = picture_base64;
      settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))

      $.ajax(settings).done(function (response) {

          var msg = JSON.parse(response);
          $("#alert-message").css('display', 'block');
          setTimeout(function(){
            $('#alert-message').css('display', 'none');
          }, 3000);

      }).fail(function(err) {
          // alert('Got err');
          console.log(err);
          show_error(err);
      });

    };
    reader.onerror = function (error) {
     console.log('Error: ', error);
    };
  } else {
      settings = get_settings('agent-profile/', 'PUT', JSON.stringify(data))

      $.ajax(settings).done(function (response) {
          var msg = JSON.parse(response);
          $("#alert-message").css('display', 'block');
          setTimeout(function(){
            $('#alert-message').css('display', 'none');
          }, 3000);
      }).fail(function(err) {
          // alert('Got err');
          show_error(err);
      });
  }


}

function load_combo(data, combo) {
  // console.log(data, combo);
  $.each(data, function( key, val ) {
    combo = combo.split('-').join('_')
    $('#' + combo).append(new Option(val['val'], val['id']));
  });
}

function get_specilities() {
  settings = get_settings('specialty/', 'GET')
  $.ajax(settings).done(function (response) {
      var response = JSON.parse(response);
      $.each(response, function(k, v) {
        console.log(v.id, v.val);
        $('#specialties').append(`
        <div class='col-lg-6 col-6'>
          <div class='year-wrapper-check-one'>
          <input type='checkbox' value='`+ v.id +`' class='specialty-checkbox' id='specialty-` + v.id + `'>
          <label for='specialty-`+ v.id + `'>` + v.val + `</label>
        </div>
        </div>
        `);
      });
  }).fail(function(err) {
      // alert('Got err');
      console.log(err);
  });

}

function get_languages() {
  settings = get_settings('language-fluency', 'GET')
  $.ajax(settings).done(function (language_list) {

    console.log("LANGUAGE",language_list)

    var language_list = JSON.parse(language_list);
    console.log(language_list);
    var ix = 0;
    $.each(language_list, function(k, v) {
      // console.log(v.id, v.val);
      ix++;
      if (ix < 7) {
        $('#languages').append(`<div class='col-lg-6 col-6'>

          <div class='lar-left'>
          <input class='lng-checkbox' value='` + v.id + `' id='lang-` + v.id + `' type='checkbox' >
          <label for='lang-` + v.id + `'>` + v.val + `</label>
          </div>
        </div>

        `);
      } else {
        $('#morelanguages').append(`
        <div class='col-lg-6 col-6'>
          <div class='lar-left'>
          <input class='lng-checkbox' value='` + v.id + `' id='lang-` + v.id + `' type='checkbox' >
          <label for='lang-` + v.id + `'>` + v.val + `</label>
          </div>
      </div>
      `);
      }


    });
  }).fail(function(err) {
    // alert('Got err');
    console.log(err);
  });

  // $.ajax(settings).done(function (response) {

  //     var response = JSON.parse(response);
  //     console.log(response);
  //     $.each(response, function(k, v) {
  //       console.log(v.id, v.val);
  //       $('#languages').append(`<div class='col-lg-3 col-6'>
  //         <div class='lar-left'>
  //         <input class='lng-checkbox' value='` + v.id + `' id='lang-` + v.id + `' type='checkbox' >
  //         <label for='lang-` + v.id + `'>` + v.val + `</label>
  //         </div>
  //       </div>
  //       `);
  //     });
  //   }).fail(function(err) {
  //     // alert('Got err');
  //     console.log(err);
  //   });
}

combo_boxes = ['listing-fee', 'buyer-rebate', 'type-of-listing-service'];

$.each(combo_boxes, function(k, val){
  get_combo(function(resp) { load_combo(resp, val) }, val);
});

get_specilities();

get_profile(function(resp) { display_profile(resp) });


$(document).on('change click', '.submit_btn', function() {
  update_profile();
});

$(document).on('change click', '#connector-remove', function() {
  settings = get_settings('agent-connector', 'DELETE')

  $.ajax(settings).done(function (response) {
      var msg = JSON.parse(response);
      $('#agent-connector').html('Add new connection.');
  }).fail(function(err) {
      // alert('Got err');
      console.log(err);
      show_error(err);
  });
});
