$(document).ready(() => {
  $("#image-search").submit(function(){
      console.log('something');
      var keyword = $("#keyword").val();
      $(this).attr("action", "/imagesearch/" + keyword);
    });
});

