function get_context(event){
        var add_context_link = $(event.target);
        var parent_file = add_context_link.closest('.file');

        var view_file_link = parent_file.find('a').first(); 
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

function find_hunks(){
    // this seems like something happening because of css minification? maybe I can't trust the class name?
    var hunks= $('.gc');
    return hunks;
}

$(document).ready(function(){
    var hunks = find_hunks();
    
    hunks.each( function(index) {
        var add_context_link = $('<a href="#">Dhruv is the best</a>');
        $(this).append(add_context_link);
        add_context_link.click(get_context);
    });
});

