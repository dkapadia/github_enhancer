
$(document).ready(function(){
    var files = $('.file')
    
    files.each( function(index) {
        var view_file_link = $(this).find(".actions a");
        view_file_link.after('<a>Dhruv is the best</a>');

    });
    $('#diff-0').hide();
    alert("bluergh");
});
