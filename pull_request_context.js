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
    var first_hunk_row = add_context_link.closest('tr').next();
    var next_hunk_row = first_hunk_row.nextAll('tr.hunk-row').first();
    // TODO - this next hunk may not exist

    lines.each(function(index){
        var line_number = index + 1; // lines are 1 indexed

        var line = _get_line_html(line_number, this)
        if(line_number < hunk_info['to_file_start_line'] && line_number > hunk_info['to_file_start_line'] - 5){
            line.insertBefore(first_hunk_row);
        }

        var last_hunk_line = hunk_info['to_file_start_line'] + hunk_info['to_file_hunk_length'];
        if(line_number > last_hunk_line && line_number < last_hunk_line + 5){
            line.insertBefore(next_hunk_row);
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
        
    hunk_info['to_file_start_line'] = parseInt(match[3]);
    hunk_info['to_file_hunk_length'] = parseInt(match[4]);
    return hunk_info;
}

function _get_line_html(line_number, line_content){
    // would be better to do this with ejs... or some templating code
    var linenumbers = '<td class="line_numbers"></td><td class="line_numbers">' + line_number + '</td>';
    // we need an extra space after td to account for the +/-
    //  which are present in the commit diff, but not in the blob output
    var line = $('<tr> ' + linenumbers + '<td><span>&nbsp;</span>' + $(line_content).html() + '</td></tr>');
    return line;
}

$(document).ready(function(){
    var hunks = find_hunks();
    
    hunks.each( function(index) {
        var add_context_link = $('<a href="#">Add Context</a>');
        $(this).append(add_context_link);
        add_context_link.click(get_context);
        // Add a class to the row that contains this hunk for easy searching
        $(this).closest('tr').addClass('hunk-row');
    });
});

