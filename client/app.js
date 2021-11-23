$(document).ready(function(){
  const port = 3000;

  // Text Field Entry Post
  $('.submit').click(function(e) {
    // Prevent default action
    e.preventDefault();

    var info = $('.text').val();
    var data = {text: info};

    $.ajax({
      url: `http://127.0.0.1:${port}/`,
      type: 'POST',
      data: data,
      datatype: 'application/JSON',
      success: function(data) {
          console.log('SUCCESSFUL POST');
          $('.text').val('');
          handleData(data);
        },
        error: function(err) {
          console.log('FAILED POST:', err);
        }
    })
  });

  // File Picker Post
  $('.filePickerSubmit').click(function(e) {
    e.preventDefault();
    var reader = new FileReader();
    var fileInput = document.getElementById('file').files;
    if (fileInput.length !== 0) {
      reader.onload = function () {
          var fileData = reader.result;
          $.ajax({
            type: 'POST',
            url: '/upload_json',
            data: {
                'name': fileInput[0].name,
                'data': fileData
            },
            datatype: 'application/JSON',
            success: function(data){
              console.log('SUCCESSFUL FILE PICKER POST');
              $('.text').val('');
              handleData(data);
            },
            error: function(err) {
              console.log('FAILED FILE PICKER POST:', err);
            }
          });
      }
      reader.readAsBinaryString(fileInput[0]);
    }
  });

  var handleData = function(data) {
    console.log('Data', data);
    var headings = ['firstName','lastName','county','city','role','sales']
    for (var i = 0; i < headings.length; i++) {
      for (var j = 0; j < data.firstName.length; j++) {
        $(`.${headings[i]}`).append(`<div>${data[headings[i]][j]}</div>`)
      }
    }
    $('.csv').val('firstName,lastName,county,city,role,sales\n' + data.csv)
  }

});