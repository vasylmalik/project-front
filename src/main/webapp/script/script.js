$(document).ready(function () {
    const table = $("#my-table");
    const tableBody = $("#t-body");
    const dropDown = $("#my-dropdown");
    const pageNumber = $("#page-number");

    function renderTable(pageSize, pageNumber) {
        $.get(`/rest/players/?pageNumber=${pageNumber}&pageSize=${pageSize}`, function (data) {
            tableBody.empty();
            $.each(data, function (i, member) {
                const row = `<tr>
                    <td>${i + data[0].id}</td>
                    <td>${member.name}</td>
                    <td>${member.title}</td>
                    <td>${member.race}</td>
                    <td>${member.profession}</td>
                    <td>${member.level}</td>
                    <td>${new Date(member.birthday).toLocaleDateString()}</td>
                    <td>${member.banned}</td>
                    <td><button id="button-edit"><img src="img/edit.png" alt="Edit"></button></td>
                    <td><button id="button-delete-${member.id}"><img src="img/delete.png" alt="Delete"></button></td>
                    </tr>`;
                table.append(row);
            });
        });
    }

    function renderPaginationButtons() {
        $.get('/rest/players/count', function (data) {
            let pageSize = dropDown.val();
            let chunk = Math.ceil(data / pageSize);
            pageNumber.empty();
            for (let i = 1; i <= chunk; i++) {
                let button = $('<button><span>' + i + '</span></button>');
                pageNumber.append(button);
                button.attr('id', 'b-num');
                button.attr('value', i);

                if (i === pageNumber) {
                    button.find('span').addClass('active-page');
                }
                button.click(function () {
                    $('#page-number .active-page').removeClass('active-page');
                    $(this).find('span').addClass('active-page');
                });
            }
        });
    }

    renderTable(5, 0);
    renderPaginationButtons();

    dropDown.click(() => {
        let pageSize = dropDown.val();
        renderTable(pageSize, 0);
        renderPaginationButtons();
    });

    pageNumber.on('click', 'button', function () {
        let pageSize = dropDown.val();
        let pageNumber = $(this).val() - 1;
        renderTable(pageSize, pageNumber);
    });

});