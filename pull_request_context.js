function get_context(event){
        var add_context_link = $(event.target);
        var view_file_link = add_context_link.siblings('a').first(); 
        var view_file_url = view_file_link.attr('href');

        $.get(view_file_url, function(data){
            insert_context(data, add_context_link);
        
        });
        event.preventDefault();
}

function insert_context(context_file_data, add_context_link){
    // parse out the lines of code we're interested in.
    context_file_data = $(context_file_data);
    var lines = context_file_data.find('.line')

    // Find where we want to insert the lines of code
    var parent_file = add_context_link.closest('.file');
    var data_table_body = parent_file.find('.data table tbody');
    var first_data_table_row = data_table_body.find('tr').first()

    lines.each(function(index){
        // would be better to do this with ejs... or some templating code
        var linenumbers = '<td>' + index + '</td><td>' + index + '</td>';
        var line = $('<tr> ' + linenumbers + '<td>' + $(this).html() + '</td></tr>');
        line.insertBefore(first_data_table_row);

    })
}

$(document).ready(function(){
    var files = $('.file')
    
    files.each( function(index) {
        var view_file_link = $(this).find(".actions a");
        var add_context_link = $('<a href="#">Dhruv is the best</a>');
        view_file_link.before(add_context_link);
        add_context_link.click(get_context);
    });
});

