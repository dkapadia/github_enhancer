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

    // Find which lines we want to add
    var hunk_info = get_hunk_info(add_context_link);


    // Find where we want to insert the lines of code
    var parent_file = add_context_link.closest('.file');
    var data_table_body = parent_file.find('.data table tbody');
    var first_data_table_row = add_context_link.closest('tr')

    lines.each(function(index){
        var line_number = index + 1; // lines are 1 indexed
        
        if(line_number < hunk_info['to_file_start_line'] && line_number > hunk_info['to_file_start_line'] - 5){
            // would be better to do this with ejs... or some templating code
            var linenumbers = '<td class="line_numbers"></td><td class="line_numbers">' + line_number + '</td>';
            var line = $('<tr> ' + linenumbers + '<td>' + $(this).html() + '</td></tr>');
            line.insertBefore(first_data_table_row);
        }

    })
}

function find_hunks(){
    // this seems like something happening because of css minification? maybe I can't trust the class name?
    var hunks= $('.gc');
    return hunks;
}

function get_hunk_info(add_context_link){
    var hunk_info_text = add_context_link.siblings('pre').text();
    var hunk_info = {};
    var hunk_regex = /@@.[-+]([0-9]+),([0-9]+).[-+]([0-9]+),([0-9]+).@@/;

    var match = hunk_regex.exec(hunk_info_text);
        
    hunk_info['to_file_start_line'] = match[3];
    hunk_info['to_file_hunk_length'] = match[4];
    return hunk_info;
}

$(document).ready(function(){
    var hunks = find_hunks();
    
    hunks.each( function(index) {
        var add_context_link = $('<a href="#">Dhruv is the best</a>');
        $(this).append(add_context_link);
        add_context_link.click(get_context);
    });
});

