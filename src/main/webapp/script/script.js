$(document).ready(function () {
    $.get("/rest/players/?pageNumber=0&pageSize=5", function (data) {
        var table = $("#t-body");
        $.each(data, function (i, members) {
            var row = $("<tr><td>" + (i + 1) + "</td><td>" + members.name + "</td><td>" + members.title + "</td><td>" + members.race + "</td><td>" + members.profession + "</td><td>" + members.level + "</td><td>" + members.birthday + "</td><td>" + members.banned + "</td></tr>");
            table.append(row);
        });
    });

    $.get('/rest/players/count', function (data) {
        let pageSize = $('#myDropdown').val();
        let chunk = Math.ceil(data / pageSize);
        const numberButton = document.getElementById('page-number');
        numberButton.innerHTML = '';
        for (let i = 1; i <= chunk; i++) {
            let button = $('<button>' + i + '</button>');
            $('#page-number').append(button);
            button.attr('id', 'b-num');
            button.attr('value', i);
        }
    });
    $('#myDropdown').click(() => {

        let pageSize = $('#myDropdown').val();

        $.get('/rest/players/?pageNumber=0&pageSize=' + pageSize + '', function (data) {
            var table = $('#my-table');
            const t = document.getElementById('t-body');
            t.innerHTML = '';
            $.each(data, function (i, members) {
                var row = $("<tr><td>" + (i + 1) + "</td><td>" + members.name + "</td><td>" + members.title + "</td><td>" + members.race + "</td><td>" + members.profession + "</td><td>" + members.level + "</td><td>" + members.birthday + "</td><td>" + members.banned + "</td></tr>");
                table.append(row);
            });
        });

        $.get('/rest/players/count', function (data) {
            let chunk = Math.ceil(data / pageSize);
            const numberButton = document.getElementById('page-number');
            numberButton.innerHTML = '';
            for (let i = 1; i <= chunk; i++) {
                let button = $('<button>' + i + '</button>');
                $('#page-number').append(button);
                button.attr('id', 'b-num');
                button.attr('value', i);
            }
        });
    });

    $('#page-number').on('click', 'button', function () {
        let pageSize = $('#myDropdown').val();
        let pageNumber = $(this).val() - 1;
        $.get('/rest/players/?pageNumber=' + pageNumber + '&pageSize=' + pageSize + '', function (data) {
            var table = $('#my-table');
            const t = document.getElementById('t-body');
            t.innerHTML = '';
            $.each(data, function (i, members) {
                console.log(data);
                var row = $("<tr><td>" + (i + data[0].id) + "</td><td>" + members.name + "</td><td>" + members.title + "</td><td>" + members.race + "</td><td>" + members.profession + "</td><td>" + members.level + "</td><td>" + members.birthday + "</td><td>" + members.banned + "</td></tr>");
                table.append(row);
            });
        });
    });
});
