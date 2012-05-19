function get_context(event){
        var add_context_link = $(event.target);

        var view_file_link = add_context_link.closest('li').next('li').find('a')
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

    // Go through each of the lines in the current table
    var parent_file = add_context_link.closest('.file');
    var current_rows = parent_file.find('.data tr');

    var prev_line_number = 0;
    var hunk_info_row = false;
    var current_line_numbers = []
    current_rows.each(function(index) {
        var line_number = _get_line_number_from_diff_row($(this));
        if (!line_number){
            return;
        }
        var current_row = $(this);
        var next_row = current_row.next('tr');
        if(line_number === '...'){
            var next_line_number = parseInt(_get_line_number_from_diff_row(next_row));
            if((next_line_number - prev_line_number) > 10){
                for(i=1; i<6; i++){
                    var line = _get_line_html(prev_line_number+i, lines.eq(prev_line_number + i - 1));
                    line.insertBefore(current_row);
                }
            // If the difference is more than 5, add 5 after the current row
            // and 5 before the current row
                for(i=1; i<6; i++){
                    var line = _get_line_html(next_line_number-i, lines.eq(next_line_number - i - 1));
                    line.insertAfter(current_row);
                }
            }
            else{
                for(i=prev_line_number+1; i<next_line_number; i++){
                    var line = _get_line_html(i, lines.eq(i - 1));
                    line.insertBefore(current_row);
                }
                current_row.hide();
            }
        }
        else{
            line_number = parseInt(line_number);
            if(index === current_rows.size()-1 && line_number < lines.size()){
                for(i=1; i<6 && line_number+i < lines.size(); i++){
                    var line = _get_line_html(line_number+i, lines.eq(line_number + i - 1));
                    line.insertAfter(current_row);
                    current_row = line;
                }
                
            }
            prev_line_number = parseInt(line_number);
        }
    });

    $('tr.context_row').effect('highlight', {}, 2000)
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
    var line = $('<tr class="context_row"> ' + linenumbers + '<td><span>&nbsp;</span>' + $(line_content).html() + '</td></tr>');
    return line;
}

function _get_line_number_from_diff_row(row){
    return $.trim(row.find('td').eq(1).text());
}

$(document).ready(function(){
    var files = $('.file');

    
    files.each( function(index) {
        var add_context_link = $('<li><a href="#">Add Context</a></li>');
        var view_file_link = $(this).find('.meta .actions a'); 
        $(add_context_link).insertBefore(view_file_link.closest('li'));
        add_context_link.click(get_context);
    });
});

